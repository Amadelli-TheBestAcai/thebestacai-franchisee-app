import axios from 'axios'
import UserService from '../services/UserService'
import StoreService from '../services/StoreService'

const API_URL = 'https://hml-api-logs.herokuapp.com'

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

export async function sendLog(message: {
  title: string
  payload: any
}): Promise<void> {
  const user = await UserService.getTokenInfo()
  const store = await StoreService.getOne()

  const from = `Store: ${store.id}-${store.company_name}. User: ${user.id}-${user.name}`
  console.log({
    title: message.title,
    from,
    payload: JSON.stringify(message.payload),
  })
  await api.post('/sales-manager-logs', {
    title: message.title,
    from,
    payload: JSON.stringify(message.payload),
  })
}

export default api
