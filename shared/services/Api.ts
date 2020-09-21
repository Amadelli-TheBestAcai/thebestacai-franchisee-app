import axios from 'axios'
import { getToken } from './Auth'

const API_URL = 'http://hml-thebestacai-api.herokuapp.com'
const api = axios.create({
  baseURL: API_URL,
  responseType: 'json',
})

// api.interceptors.request.use((config) => {
//   const token = getToken()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

export default api
