import api from '../../utils/ApiAuth'
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
        data: { content },
      } = await api.get(`/companyUser/${userId}/user`)

      const formatedStores = content?.map((company) => ({
        id: company.company_id,
        name: company.company.company_name,
      }))
      return formatedStores
    } else {
      return []
    }
  }
}

export default new FindAllStoresByUser()
