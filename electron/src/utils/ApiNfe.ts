import axios from 'axios'
import envConfig from '../../../env-config.js'

const api = axios.create({
  baseURL: 'http://15.228.10.51/api',
  responseType: 'json',
})

api.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${envConfig.NFCe_Token}`
  return config
})

export default api
