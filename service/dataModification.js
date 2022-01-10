class DataModification{
  constructor() {
    
  }
  async currentDataModify(currentData,past) {
    return new Promise((resolve, reject) => {
      try {
        let response = {}
        var date = new Date(currentData.dt * 1000)
        response['Date'] = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        if (past == false) {
          response['temp'] = currentData.temp.day 
        }
        else {
          response['temp'] = currentData.temp
        }
        response['pressure'] = currentData.pressure
        response['humidity'] = currentData.humidity
        response['icon'] = currentData.weather[0]['icon']
        response['windSpeed'] = currentData.wind_speed
        response['description'] = currentData.weather[0]['description']
        resolve(response)
      }

      catch (e) {
        console.log('Error at unix current data',e)
        reject(e)
      }
    })
  }

  async pastUnixDates() {
    return new Promise((resolve, reject) => {
      try {
        let response = []
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var monthdata = [0,31,28,31,30,31,30,31,31,30,31,30,31]
        for (var i = 1; i < 6; i++){
          day -= 1
          if (day < 1) {
            month -= 1
            if (month < 1) {
              month = 12
              year -= 1;
            }
            day = monthdata[month]
          }
          response.push(Math.round(new Date(year+'.'+month+'.'+day)/1000))
        }
        resolve(response)
      }
      catch (e) {
        console.log('Error at date conversion', e)
        reject(e)
      }
    })
  }
}

module.exports = DataModification