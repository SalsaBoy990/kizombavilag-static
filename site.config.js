const domesticEventsData = require('./src/data/domestic_events.json')
const eventsAbroadData = require('./src/data/events_abroad.json')

let domesticEventsDateFormatted = []
let eventsAbroadDateFormatted = []
let dateParts = []

dateFormatter(domesticEventsData, domesticEventsDateFormatted)
dateFormatter(eventsAbroadData, eventsAbroadDateFormatted)

function dateFormatter (data, dateFormatted) {
  for (let i = 0; i < data.length; i++) {
    // split date string by the '-' delimiter into an array
    dateParts = data[i].datum.split('-')
    // console.log(dateParts)

    // replace month number with month name
    let month = dateParts[1]
    switch (month) {
      case '01':
        dateFormatted.push('jan.')
        break

      case '02':
        dateFormatted.push('feb.')
        break

      case '03':
        dateFormatted.push('márc.')
        break

      case '04':
        dateFormatted.push('ápr.')
        break

      case '05':
        dateFormatted.push('máj.')
        break

      case '06':
        dateFormatted.push('jún.')
        break

      case '07':
        dateFormatted.push('júl.')
        break

      case '08':
        dateFormatted.push('aug.')
        break

      case '09':
        dateFormatted.push('szept.')
        break

      case '10':
        dateFormatted.push('okt.')
        break

      case '11':
        dateFormatted.push('nov.')
        break

      case '12':
        dateFormatted.push('dec.')
        break

      default: break
    }
  }
}

// I inserted some dummy text
module.exports = {
  site: {
    url: 'https://www.kizombavilag.com' /* 'https://www.kizombavilag.com' */,
    shortTitle: `Kizombavilág`,
    title: 'Kizombavilág Információs Portál',
    image: 'https://d33wubrfki0l68.cloudfront.net/assets/images/0f63a4219f54d8f702b65de27ac7f0a48a94494a/dancers_sepia.jpg',
    author: 'Gulácsi András',
    quote: 'A kizomba sokkal több egy táncnál!',
    description: 'A hazai információs portál a kizomba/semba iránt érdeklődők számára, hiteles, angolai forrásokból.',
    email: 'guland@protonmail.com',
    mobile: '+36/20/442-7225',
    facebook: 'kizombavilag',
    mailchimp: 'http://eepurl.com/dgDU-9',
    currentYear: new Date().getFullYear(),
    domesticEventsData,
    domesticEventsDateFormatted: domesticEventsDateFormatted,
    eventsAbroadData,
    eventsAbroadDateFormatted: eventsAbroadDateFormatted
  }
}
