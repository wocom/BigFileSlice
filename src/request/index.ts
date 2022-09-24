import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  // withCredentials: true
})

instance.interceptors.request.use((config) =>{
  return config
}, (err) =>{
  return Promise.reject(err)
})

instance.interceptors.response.use((response) =>{
  return response
}, (err) =>{
  return Promise.reject(err)
})

export default instance