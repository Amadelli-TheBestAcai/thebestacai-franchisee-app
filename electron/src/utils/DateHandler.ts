import moment from 'moment-timezone'

export const getNow = (): string =>
  moment(new Date()).tz('America/Sao_Paulo').format('DD/MM/YYYYTHH:mm:ss')

export const DateWithTimezone = (): Date =>
  moment(new Date()).tz('America/Sao_Paulo').toDate()
