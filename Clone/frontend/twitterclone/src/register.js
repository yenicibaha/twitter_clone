import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const { username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Form verilerini axios kullanarak API'ye post et
      const response = await axios.post('http://localhost:9000/api/auth/signup', formData);
      console.log(response.data); // Başarılı olursa API'den dönen yanıtı yazdır

      // Veri işlendikten sonra, üst bileşende (parent) bir fonksiyon çağırarak devam edebilirsiniz
      onRegister(response.data);

      // Oturum açma işlemi
      const loginResponse = await axios.post('http://localhost:9000/api/auth/signin', {
        username: formData.username,
        password: formData.password
      });

      // Başarılı giriş durumunda kullanıcıya sunucudan dönen JWT'yi al
      const { access_token, _id } = loginResponse.data;

      // JWT'yi tarayıcının yerel depolamasına kaydet (localStorage kullanılabilir)
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('userId', _id);
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.message === "Username is already taken") {
        alert("Username is already taken."); // Kullanıcı adı zaten alındıysa hata mesajı göster
      } else {
        alert("Username is already taken.");; // Diğer hata durumları için genel bir hata mesajı göster
      }
    }
  };

  return (
    <div className="container"> 
      <div className="login-container">
        <h1>REGISTER</h1>
        
        <form onSubmit={onSubmit}>
          <h3>Username</h3>
          <input type="text" id="username" name="username" value={username} onChange={onChange} required />
          <h3>Email</h3>
          <input type="text" id="email" name="email" value={email} onChange={onChange} required />
          <h3>Password</h3>
          <input type="password" id="password" name="password" value={password} onChange={onChange} required />
          
          <button type="submit">Register</button>
        </form>

        <br />
        
      </div>
    </div>
  );
}

export default Register;
