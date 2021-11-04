import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../..//package.json')

class CheckAppIsUpdatedService {
  async execute(): Promise<boolean> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return true
    }

    const {
      data: {
        data: { version },
      },
    } = await api.get('/version')
    console.log({
      gestor_version: pkg.version,
      current_version: version,
    })
    if (pkg.version === version) {
      return true
    }

    return false
  }
}

export default new CheckAppIsUpdatedService()
