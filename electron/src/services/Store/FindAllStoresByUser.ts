import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

type Response = {
  id: number
  name: string
}

class FindAllStoresByUser {
  async execute(userId: number): Promise<Response[]> {
    const isOnline = await checkInternet()
    if (isOnline) {
      const {
        data: { data },
      } = await api.get(`/user_store/${userId}`)
      const formatedStores = data?.map((store) => ({
        id: store.store_id,
        name: store.store,
      }))
      return formatedStores
    } else {
      return []
    }
  }
}

export default new FindAllStoresByUser()
