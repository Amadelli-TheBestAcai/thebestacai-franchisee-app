import axios from 'axios'
import UserService from '../services/UserService'
import StoreService from '../services/StoreService'
import { checkInternet } from '../utils/InternetConnection'
import { Tray } from 'electron'

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://hml-api-logs.herokuapp.com'
    : 'https://thebestacai-api-logs.herokuapp.com'

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
  const hasInternet = await checkInternet()
  if (hasInternet) {
    const user = await UserService.getTokenInfo()
    const store = await StoreService.getOne()

    const from = `Store: ${store.id}-${store.company_name}. User: ${user.id}-${user.name}`

    try {
      await api.post('/sales-manager-logs', {
        title: message.title,
        from,
        payload: JSON.stringify(message.payload),
      })
    } catch (err) {
      console.log(err)
    }
  }
}

export default api
