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
  if (!timestamp) return ''

  // date.setHours(date.getHours() + 14)
  let [date, time] = new Date(timestamp).toLocaleString('en-GB').split(', ')
  // console.log({date, time})
  date = date.split('/')
  return [[date[2], date[1], date[0]].join('-'), time].join(' ')
}

export function formatGender(gender) {
  switch (gender) {
    case 'M':
    case 'm':
      return 'Male'
    case 'F':
    case 'f':
      return 'Female'
    default:
      return gender
  }
}

export function setGender(gender) {
  switch (gender) {
    case 'Male':
    case 'male':
      return 'M'
    case 'Female':
    case 'female':
      return 'F'
    default:
      break
  }
}

export function setAddress({ city, district, commune }) {
  return (city && [city, district, commune].filter(v => v && v.length).join(', ')) || ''
}

export function setName({ givenName, surname, index, phoneNumber, countryCode }) {
  const name = [surname, givenName].filter(item => Boolean(item))
  return name.length ? name.join(' ') : (countryCode + ' ' + phoneNumber) || ''
}

// export function setAddress(str) {
//   if (!str) return
//   let address = {}
//
//   str &&
//     str.split('\n').map(item => {
//       const obj = item
//         .replace(/[,]|\r|\n|\s{2,}/gim, '')
//         .trim()
//         .split(': ')
//       if (!obj[0]) return
//
//       address[toCamel(obj[0])] = obj[1] === 'null' ? '' : obj[1]
//     })
//
//   return address
// }

export const toCapitalize = text => {
  return text && text.charAt(0).toUpperCase() + text.slice(1)
}

export const toCamel = text => {
  return text && text.charAt(0).toLowerCase() + text.slice(1).replace(/\s/, '')
}

export const timeSince = date => {
  if (typeof date !== 'object') {
    date = new Date(date)
  }

  const seconds = Math.floor((new Date() - date) / 1000);
  let intervalType

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "second";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return interval + ' ' + intervalType + ' ago'
};
