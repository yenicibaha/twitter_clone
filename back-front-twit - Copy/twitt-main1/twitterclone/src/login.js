import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const { username, password } = formData;

  useEffect(() => {
    // Sayfa yenilendiğinde localStorage'da kullanıcı bilgilerini kontrol et
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      // Kullanıcı bilgileri localStorage'da varsa, oturum hala geçerli kabul edilir
      onLogin(storedUserId);
    }
  }, [onLogin]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9000/api/auth/signin', formData);

      console.log(response.data);

      // Başarılı giriş durumunda onLogin prop'unu çağırarak App bileşeninin state'ini güncelle
      onLogin(response.data._id); // userId'yi gönder

      // Başarılı giriş durumunda kullanıcıya sunucudan dönen JWT'yi al
      const { access_token } = response.data;

      // JWT'yi tarayıcının yerel depolamasına kaydet (localStorage kullanılabilir)
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('userId', response.data._id); // Kullanıcı kimliğini kaydet

      // Başarılı giriş durumunda ana sayfaya yönlendir
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.status === 401) {
        alert('Incorrect username or password.'); // 401 durumunda hata mesajı göster
      } else {
        alert('Incorrect username or password.');; // Diğer hata durumları için genel bir hata mesajı göster
      }
    }
  };

  return (
    <div className="container"> 
      <div className="login-container">
        <h1>LOGIN</h1>
        
        <form onSubmit={onSubmit}>
          <h3>Username</h3>
          <input type="text" id="username" name="username" value={username} onChange={onChange} required />
          <h3>Password</h3>
          <input type="password" id="password" name="password" value={password} onChange={onChange} required />
          <br />
          <br />
          
          <button type="submit">Login</button>
        </form>
    
        <br />
        
      </div>
    </div>
  );
}

export default Login;
