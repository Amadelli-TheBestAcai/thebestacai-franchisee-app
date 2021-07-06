import axios from 'axios'
import GetSessionUserService from '../services/User/GetSessionUserService'

// const API_URL = 'http://localhost:5050'
const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://hml-thebestacai-api.herokuapp.com'
    : 'https://thebestacai-api.herokuapp.com'

console.log(API_URL)
const api = axios.create({
  baseURL: API_URL,
  responseType: 'json',
})

api.interceptors.request.use(async (config) => {
  const sessionUser = await GetSessionUserService.execute()
  if (sessionUser) {
    config.headers.Authorization = `Bearer ${sessionUser.access_token}`
  }
  return config
})

export default api
