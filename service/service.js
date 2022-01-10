const httpRequest = require('./httpRequest')
const DataModification = require('./dataModification')

class Service {
  constructor() {
    this.httpReq = new httpRequest()
    this.dataModification = new DataModification()
  }

  async getWeatherData(req) {
    return new Promise(async (resolve,reject)=>{
      try {
        let response = {}
        var { cityName, degree } = req
        var unit = 'imperial'
        if (degree == 'C') {
          unit = 'metric'
        }
        response["degree"] = degree
        var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${process.env.APIKEY}`
        var data = await this.httpReq.executeApi(url)
        if (data.cod != 200) {
          response['error'] = data.message
          resolve(response)
        }
        else {
          var getPastDates = await this.dataModification.pastUnixDates()
          var futureUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=current,hourly,minutely&appid=${process.env.APIKEY}&units=${unit}`
          //console.log(futureUrl)
          var futureData = await this.httpReq.executeApi(futureUrl)
          response['past'] = []
          
          for (var i = 0; i < getPastDates.length-1; i++){
            var pastUrl = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${data.coord.lat}&lon=${data.coord.lon}&dt=${getPastDates[i]}&appid=${process.env.APIKEY}&units=${unit}`
            //console.log(pastUrl)
            var pastData = await this.httpReq.executeApi(pastUrl)
            response['past'].push(await this.dataModification.currentDataModify(pastData.current,true))
          }
          response['past'].reverse()
          response['current'] = data
          let date = new Date()
          response['current']['date'] = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
          response['future'] = []
          for (var i = 1; i < futureData.daily.length; i++){
            response['future'].push(await this.dataModification.currentDataModify(futureData.daily[i],false))
          }
          resolve(response)
        }
      }
      catch (e) {
        console.log('Error at current Data',e)
        reject(e);
      }
    })
  }
}

module.exports = Service
