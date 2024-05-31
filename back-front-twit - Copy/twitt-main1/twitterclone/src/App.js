import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from './register';
import Login from './login';
import Tweet from './tweet';
import axios from 'axios';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Sayfa yenilendiğinde localStorage'da kullanıcı bilgilerini kontrol et
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      // Kullanıcı bilgileri localStorage'da varsa, oturum hala geçerli kabul edilir
      setLoggedIn(true);
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/tweets/feed');
        console.log('Fetched tweets:', response.data);
        setTweets(response.data);
      } catch (error) {
        console.error('Failed to fetch tweets:', error);
        setError('Failed to fetch tweets. Please try again later.');
      }
    };
    fetchData();
  }, []);

  const handleLogin = (userId) => {
    setLoggedIn(true);
    setShowLogin(false);
    localStorage.setItem('userId', userId);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const toggleLogin = () => {
    if (loggedIn) {
      handleLogout();
    } else {
      setShowLogin(!showLogin);
      setShowRegister(false);
    }
  };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
  };

  const handlePost = async () => {
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('access_token'); // Access token'i localStorage'dan al
    if (!userId || !accessToken) { // Hem userId hem de accessToken kontrol ediliyor
      alert('You must be logged in to post a tweet!');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:9000/api/tweets/', { description: tweet, userId }, {
        headers: {
          Authorization: `Bearer ${accessToken}` // Access token'i Authorization header'ına ekle
        }
      });
      setTweets([...tweets, response.data]);
      setTweet('');
      setError('');
      
    } catch (error) {
      console.error('Failed to post tweet:', error);
      setError('Failed to post tweet. Please try again later.');
    }
  };

  const handleDeleteTweet = async (index) => {
    const tweetId = tweets[index]._id;
    try {
      const userId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('access_token');
      if (!userId || !accessToken) {
        // Kullanıcı bilgileri veya access token yoksa hata fırlat
        throw new Error('User information or access token is missing!');
      }
      // Silme işlemi için API'ye istek yap
      await axios.delete(`http://localhost:9000/api/tweets/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Yetkilendirme token'ını header'a ekle
        },
        data: { id: userId }, // Kullanıcı kimliğini data olarak gönder
      });
      // Silme işlemi başarılıysa, yerel durumu güncelle
      const updatedTweets = [...tweets];
      updatedTweets.splice(index, 1);
      setTweets(updatedTweets);
    } catch (error) {
      console.error('Failed to delete tweet:', error);
      alert('Failed to delete tweet!');
    }
  };
  const handleRegister = () => {
    setLoggedIn(true);
    setShowRegister(false);
  };

  return (
    <Router>
      <div className="container">
        <div className="content">
          <div className={`menu ${menuOpen ? 'open' : ''}`}>
            <h2>Menu</h2>
            <a href="http://localhost:3000" className="">Home</a>
            <a href="http://localhost:3000/feed" className="">Explore</a>
            
          </div>

          <div className="center-content">
            <h2>Think!</h2>
            <textarea
              className="message-input"
              placeholder="Write your message here..."
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
            ></textarea>
            <button className="post-button" onClick={handlePost}>Post</button>
            {error && <p className="error-message">{error}</p>}
            <button onClick={toggleRegister} className={`register-button ${showLogin ? 'register-mode' : ''}`}>
              {showLogin ? 'Register' : 'Register'}
            </button>
            <button onClick={toggleLogin} className="login-button">
              {loggedIn ? 'Logout' : 'Login'}
            </button>
            <br/>
            <br/>

            <div className="tweets-container">
              {tweets.map((tweet, index) => (
                <Tweet
                  key={tweet._id}
                  id={tweet._id}
                  text={tweet.description}
                  initialLikes={tweet.likes.length}
                  initialLiked={tweet.likes.includes(localStorage.getItem('userId'))}
                  initialComments={tweet.comments.map(comment => comment.text)}
                  onDelete={() => handleDeleteTweet(index)}
                />
              ))}
            </div>
          </div>

          <div className="topics">
            <h2>Topics</h2>
            <a href="#">#ai</a>
            <a href="#">#html6</a>
            <a href="#">#myfirstapp</a>
            <a href="#">#react</a>
          </div>
        </div>

        {showLogin && (
          <div className="login-overlay">
            <Login onLogin={handleLogin} />
          </div>
        )}

        {showRegister && (
          <div className="register-overlay">
            <Register onRegister={handleRegister} />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
