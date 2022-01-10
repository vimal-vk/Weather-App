const { rejects } = require('assert')
const https = require('https')
const { resolve } = require('path')

class httpRequest{
  constructor(){

  }
  async executeApi(url){
    return new Promise(async (resolve,reject) => {
      try {
        https.get(url, (response) => {
          response.on("data", (data) => {
            resolve(JSON.parse(data))
          })
        })
      }
      catch (e) {
        console.log('Error at template ',e)
        reject(e)
      }
    })
  }
}

module.exports = httpRequest