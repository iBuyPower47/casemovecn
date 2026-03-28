// const CC = require('currency-converter-lt');
const axios = require('axios');
async function setBackUp(currencyClass) {
  let rates = require('./backup/currency.json')
  currencyClass.setRates(rates.rates)
}

async function getLiveRates(currencyClass) {
  try {
    // 使用 axios 替代 fetch
    const response = await axios.get('https://open.er-api.com/v6/latest/USD');
    const data = response.data;
    if (data && data.rates) {
      currencyClass.setRates(data.rates);
      console.log('getLiveRates success');
    }
  } catch (error) {
    console.log('getLiveRates error:', error);
  }
}

class currency {
  rates = {};
  currencyConverter
  seenRates = {}

  constructor() {
    setBackUp(this)
    getLiveRates(this)
  }

  // Setup backup
  setRates(rates) {
    this.rates = rates
  }

  // Setup for live rates
  setCurrencyClass(converter) {
    this.currencyConverter = converter
  }


  getRate(exchangeTo) {
    return new Promise((resolve) => {
      if (this.seenRates[exchangeTo] != undefined) {
        resolve(this.seenRates[exchangeTo])
      }
      if (this.currencyConverter == undefined) {
        resolve(this.rates[exchangeTo])
      }
      this.currencyConverter.from('USD').to(exchangeTo).amount(100).convert().then((response) => {
        let rate = response / 100
        if (typeof rate === 'number' && !Number.isNaN(rate)) {
          this.seenRates[exchangeTo] = rate
          resolve(rate)
        } else {
          resolve(this.rates[exchangeTo])
        }
      }).catch(error => {
        console.log('error occurred', error)
        resolve(this.rates[exchangeTo])
      })
    });
  }
}

// const currencyClass = new currency()

// sleep time expects milliseconds
//function sleep (time) {
//  return new Promise((resolve) => setTimeout(resolve, time));
//}

// Usage!
//sleep(5000).then(() => {
//    currencyClass.getRate('EUR').then((returnValue) => {
//      console.log(returnValue)
//    })
//});


module.exports = {
  currency
};
export { currency };

