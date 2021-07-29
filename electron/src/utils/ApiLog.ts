import axios from 'axios'
import GetSessionUserService from '../services/User/GetSessionUserService'
import GetDecodedTokenService from '../services/User/GetDecodedTokenService'
import GetCurrentStoreService from '../services/Store/GetCurrentStoreService'
import { checkInternet } from '../utils/InternetConnection'
require('../../../bootstrap')

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://hml-api-logs.herokuapp.com'
    : 'https://thebestacai-api-logs.herokuapp.com'

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

export async function sendLog(message: {
  title: string
  payload: any
}): Promise<void> {
  const hasInternet = await checkInternet()
  if (hasInternet) {
    const user = await GetDecodedTokenService.execute()
    const store = await GetCurrentStoreService.execute()

    const from = `Store: ${store.store_id}-${store.company_name}. User: ${user.id}-${user.name}`

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
