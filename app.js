const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('./public'))
require('dotenv').config()
app.set('view engine', 'ejs')
const Service = require('./service/service')
var newService = new Service()

const port = process.env.PORT || 3000
var error = {'error':false}

app.get('/', async (req, res) => {
  res.render('index', error)
  error.error = false
})

app.post('/retry', async (req, res) => {
  res.redirect('/')
})

app.post('/result', async (req, res) => {
  result = await newService.getWeatherData(req.body)
  if (result['error']) {
    error.error = true
    error['data'] = result;
    res.redirect('/')
  }
  else {
    res.render('result', result)
  }
  

})

app.get('*', function(req, res){
  res.status(404).sendFile(path.join(__dirname+'/error.html'))
});

app.listen(port,()=>{
  console.log(`port running at http://localhost:${port}`)
})

