import axios from 'axios'

const api = axios.create({
  baseURL: 'https://thebestnotas.zumer.app/api',
  responseType: 'json',
})

export default api
