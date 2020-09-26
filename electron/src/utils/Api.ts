import axios from 'axios'
import UserService from '../services/UserService'

const API_URL = 'https://hml-thebestacai-api.herokuapp.com'
const api = axios.create({
  baseURL: API_URL,
  responseType: 'json',
})

api.interceptors.request.use(async (config) => {
  const token = await UserService.getCurrentSession()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
