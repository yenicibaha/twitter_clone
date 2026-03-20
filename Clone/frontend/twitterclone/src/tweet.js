import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tweet = ({ id, text, onDelete, initialLikes, initialLiked, initialComments }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(initialComments || []);
  const [liked, setLiked] = useState(initialLiked || false);
  const [likes, setLikes] = useState(Number(initialLikes) || 0);

  useEffect(() => {
    const fetchTweetData = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/tweets/${id}`);
        console.log('Fetched tweet data:', response.data);
        if (response.data && response.data.likes !== undefined && response.data.comments !== undefined) {
          setLikes(Number(response.data.likes.length));
          setComments(response.data.comments.map(comment => comment.text));
          setLiked(response.data.likes.includes(localStorage.getItem('userId')));
        } else {
          console.error('Error: Invalid response data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching tweet data:', error);
      }
    };
    fetchTweetData();
  }, [id]);

  const handleAddComment = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to add a comment!');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:9000/api/tweets/comment/${id}`, {
        userId: userId,
        text: comment
      });
      console.log('Added comment response:', response.data);
      if (response.data && response.data.comments !== undefined) {
        setComments(response.data.comments.map(comment => comment.text));
        setComment('');
      } else {
        console.error('Error: Invalid comment data in response:', response.data);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  const handleLike = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to like a tweet!');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:9000/api/tweets/${id}/like`, {
        id: userId
      });
      console.log('Like response:', response.data);
      if (response.data) {
        const likeStatus = response.data;
        if (likeStatus === 'Tweet has been liked!') {
          setLikes(prevLikes => Number(prevLikes) + 1);
          setLiked(true);
        } else if (likeStatus === 'Tweet has been disliked!') {
          setLikes(prevLikes => Number(prevLikes) - 1);
          setLiked(false);
        }
      } else {
        console.error('Error: Likes data not found or invalid in response:', response.data);
      }
    } catch (error) {
      console.error('Error liking/disliking tweet:', error);
    }
  };

  return (
    <div className="tweet">
    <p className='tweet_header'>🤴🏻 {text}</p>
    
    <div className='bottom_border'>
    <button className='delete_button'onClick={onDelete}>✘</button>
    
    <button className='like_button' onClick={handleLike}>{liked ? '❤' : '❥'}</button>
    <div className='likes'><i>{likes} Likes</i></div>
    
    </div>
    <br></br>
    <div className="comments">
    <div >
      <input 
        type="text"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
     
      <button onClick={handleAddComment}>Add Comment</button>
      
      </div >
      
      <ul >
      
       {comments.map(( comment, index) => (
        
          <li  key={index}>👱 {comment} </li> 
          
        ))}  
      </ul>
     
      </div>
    </div>

);
};

export default Tweet;
