const express = require('express')
const app = express()
const cheerio = require('cheerio')
const path = require('path')
const https = require('https')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./public'))
require('dotenv').config()
app.set('view engine','ejs')

const port = process.env.PORT || 3000

app.get('/', async (req, res) => { 
  res.render('index', {message : 'vimal'})
})

app.get('/retry', async (req, res) => {
  res.redirect('/')
})
 

app.post('/result', async (req, res) => {
  var { cityName, degree } = req.body
  var unit = 'imperial'
  if (degree == 'C') {
    unit = 'metric'
  }
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${process.env.APIKEY}`
  https.get(url, (response) => {
    response.on("data", (data) => {
      var weatherData = JSON.parse(data)
      if (weatherData.cod == 200) {
        var city = weatherData.name
        var temperature = weatherData.main.temp
        var pressure = weatherData.main.pressure
        var humidity = weatherData.main.humidity
        var icon = weatherData.weather[0].icon
        res.render('result', {
          message: {
            error:false,
            ejsCity: city,
            ejsTemperature: temperature,
            ejsPressure: pressure,
            ejsDegree: degree,
            ejsHumidity: humidity,
            ejsIcon: icon
          }
        })
      }
      else {
        res.render('result', {
          message: {
            error: true
          }
        })
      }
    })
  })
})

app.get('*', function(req, res){
  res.status(404).sendFile(path.join(__dirname+'/error.html'))
});

app.listen(port,()=>{
  console.log(`port running at http://localhost:${port}`)
})


//F8J9Nb-LfntMc-header-HiaYvf-LfntMc Yr7JMd-pane-JjiIAe F8J9Nb-LfntMc-header-HiaYvf-LfntMc-d6wfac widget-pane-fade-in"