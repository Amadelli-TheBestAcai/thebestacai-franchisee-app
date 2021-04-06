import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { Audit as AuditModel } from '../../../../shared/models/audit'

type Response = {
  audits: AuditModel[]
  totalElements: number
}

class GetProductAuditsService {
  async execute(id: number, page: number, size: number): Promise<Response> {
    const hasInternet = await checkInternet()
    if (!hasInternet) {
      return { audits: [], totalElements: 0 }
    }

    const {
      data: { content, totalElements },
    } = await api.get(`/products_store_history/${id}?page=${page}&size=${size}`)

    return { audits: content, totalElements: totalElements }
  }
}

export default new GetProductAuditsService()
