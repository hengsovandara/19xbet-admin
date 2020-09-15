export function formatDate(timestamp) {
  if (!timestamp) return

  if (!!~timestamp.indexOf('/'))
    timestamp = timestamp
      .split('/')
      .reverse()
      .join('/')

  const date = new Date(timestamp)
  const yyyy = date.getFullYear()
  let mm = '' + (date.getMonth() + 1) //  getMonth() - get the month as a number (0-11)
  let dd = '' + date.getDate()

  if (mm.length < 2) mm = '0' + mm
  if (dd.length < 2) dd = '0' + dd

  return [dd, mm, yyyy].join('/')
}

export function setDate(timestamp) {
  if (!timestamp) return 'N/A'

  const date = new Date(timestamp)
  date.setHours(date.getHours() + 14)
  return date
    .toISOString()
    .split('.')
    .shift()
    .split('T')
    .join(' ')
}

export function formatGender(gender) {
  switch (gender) {
    case 'M':
      return 'Male'
    case 'F':
      return 'Female'
    default:
      return gender
  }
}

export function setGender(gender) {
  switch (gender) {
    case 'Male':
      return 'M'
    case 'Female':
      return 'F'
    default:
      break
  }
}

export function setAddress(str) {
  if (!str) return
  let address = {}

  str &&
    str.split('\n').map(item => {
      const obj = item
        .replace(/[,]|\r|\n|\s{2,}/gim, '')
        .trim()
        .split(': ')
      if (!obj[0]) return

      address[toCamel(obj[0])] = obj[1] === 'null' ? 'N/A' : obj[1]
    })

  return address
}

export const toCapitalize = text => {
  return text && text.charAt(0).toUpperCase() + text.slice(1)
}

export const toCamel = text => {
  return text && text.charAt(0).toLowerCase() + text.slice(1).replace(/\s/, '')
}
