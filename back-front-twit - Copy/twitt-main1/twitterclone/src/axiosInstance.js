import axios from 'axios';

const instance = axios.create({
  
  
});

// Axios interceptor kullanarak her istek öncesinde tokeni gönderme
instance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('access_token'); // localStorage'dan tokeni al
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Her istek için Authorization başlığını ayarla
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
