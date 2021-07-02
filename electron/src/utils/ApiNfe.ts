import axios from 'axios'
import GetCurrentStoreService from '../services/Store/GetCurrentStoreService'

const api = axios.create({
  baseURL: 'https://thebestnotas.zumer.app/api',
  responseType: 'json',
})

api.interceptors.request.use(async (config) => {
  const store = await GetCurrentStoreService.execute()
  if (store && store.token_nfce) {
    config.headers.Authorization = `Bearer ${store.token_nfce}`
  }
  return config
})

export default api
