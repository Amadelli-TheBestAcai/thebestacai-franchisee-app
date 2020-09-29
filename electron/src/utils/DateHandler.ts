import moment from 'moment-timezone'

export const getNow = (): string =>
  moment(new Date()).tz('America/Sao_Paulo').format('DD/MM/YYYYTHH:mm:ss')
