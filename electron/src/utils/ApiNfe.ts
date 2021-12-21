import axios from 'axios'
import envConfig from '../../../env-config.js'

const api = axios.create({
  baseURL: 'http://amazum.com.br/api',
  responseType: 'json',
})

api.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${envConfig.NFCe_Token}`
  return config
})

export default api
