const fs = require('fs')
const data = require('./data.json')

const dataFormatted = data.map(
  ({ latitude, longitude, locationName, description }) => {
    return {
      locationName,
      description,
      latitude,
      longitude
    }
  }
)
console.log(JSON.stringify(dataFormatted))

fs.writeFileSync('./data1.json', JSON.stringify(dataFormatted, null, 2))
