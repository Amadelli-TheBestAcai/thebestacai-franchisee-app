export const onlyNumbers = (value: any): number => {
  if (!value) {
    return
  }
  return +value.replace(/[^0-9]/g, '')
}
