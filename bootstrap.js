import dotenv from 'dotenv'

const path = '.env'

const { parsed } = dotenv.config({ path })
for (const key in parsed) process.env[key] = parsed[key]
