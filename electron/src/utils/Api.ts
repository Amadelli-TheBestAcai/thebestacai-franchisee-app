import axios from 'axios'
import GetSessionUserService from '../services/User/GetSessionUserService'
require('../../../bootstrap')

const API_URL = process.env.API_DASH

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
