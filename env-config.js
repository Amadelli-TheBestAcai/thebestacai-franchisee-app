import dotenv from 'dotenv'

const path = 'resources/.env'

const { parsed } = dotenv.config({ path })

const envs = {}
for (const key in parsed) envs[key] = parsed[key]

export default envs
