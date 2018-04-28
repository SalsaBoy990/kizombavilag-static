const postdata = require('./src/data/postdata.json')

let dateFormatted = []
let dateParts = []

for (let i = 0; i < postdata.length; i++) {
  // split date string by the '-' delimiter into an array
  dateParts = postdata[i].date.split('-')
  // console.log(dateParts)

  // replace month number with month name
  let month = dateParts[1]
  switch (month) {
    case '01':
      dateFormatted.push(dateParts[0] + '. január ' + dateParts[2] + '.')
      break

    case '02':
      dateFormatted.push(dateParts[0] + '. február ' + dateParts[2] + '.')
      break

    case '03':
      dateFormatted.push(dateParts[0] + '. március ' + dateParts[2] + '.')
      break

    case '04':
      dateFormatted.push(dateParts[0] + '. április ' + dateParts[2] + '.')
      break

    case '05':
      dateFormatted.push(dateParts[0] + '. május ' + dateParts[2] + '.')
      break

    case '06':
      dateFormatted.push(dateParts[0] + '. június ' + dateParts[2] + '.')
      break

    case '07':
      dateFormatted.push(dateParts[0] + '. július ' + dateParts[2] + '.')
      break

    case '08':
      dateFormatted.push(dateParts[0] + '. augusztus ' + dateParts[2] + '.')
      break

    case '09':
      dateFormatted.push(dateParts[0] + '. szeptember ' + dateParts[2] + '.')
      break

    case '10':
      dateFormatted.push(dateParts[0] + '. október ' + dateParts[2] + '.')
      break

    case '11':
      dateFormatted.push(dateParts[0] + '. november ' + dateParts[2] + '.')
      break

    case '12':
      dateFormatted.push(dateParts[0] + '. december ' + dateParts[2] + '.')
      break

    default: break
  }
}

// console.log(dateFormatted)

module.exports = {
  site: {
    url: 'https://www.kizombavilag.com',
    title: 'Kizombavilág Információs Portál',
    author: 'Gulácsi András',
    description: 'A Kizombavilág információs portál összegyűjti és rendszerezi a kizombával kapcsolatos ismereteket, amelyek az interneten nagyon szétszórtan lelhetők fel.',
    email: 'guland@protonmail.com',
    facebook: 'kizombavilag',
    mailchimp: 'http://eepurl.com/dgDU-9',
    year: new Date().getFullYear(),
    ogImage: 'https://d33wubrfki0l68.cloudfront.net/1ca3910179ace8d8741c302757f445b29dd9a834/74398/assets/images/dancers.jpg',
    postdata,
    dateFormatted: dateFormatted
  }
}
