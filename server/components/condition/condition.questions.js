'use strict';

var Promise = require('bluebird');
var PokitDok = require('pokitdok-nodejs');
var pokitdok = new PokitDok(process.env.POKITDOK_CLIENT_ID, process.env.POKITDOK_CLIENT_SECRET);

function handleError(err, msg){
  return {
    valid: false,
    error: err,
    message: msg
  }
}

var questions = {
  firstName: {
    prompt: {
      text: 'What\'s your first name?',
    },
    store: function(query){
      return new Promise(function(resolve, reject){
        var res = {
          success: true,
          value: query.parsed._text,
          stored: query.stored
        }
        res.stored.firstName = query.parsed._text;
        resolve(res);

      }) // do you need a promise here?
    },
  },
  lastName: {
    prompt: {
      text: 'What\'s your last name?',
    },
    store: function(query){
      return new Promise(function(resolve, reject){
        var res = {
          success: true,
          value: query.parsed._text,
          stored: query.stored
        }
        res.stored.lastName = query.parsed._text;
        resolve(res);
      })
    },
  },
  birthdate: {
    prompt: {
      text: 'What\'s your birthdate?',
    },
    store: function(query){
      return new Promise(function(resolve, reject){
        var res = {};
        if(query.parsed && query.parsed.entities && query.parsed.entities['datetime'] && query.parsed.entities['datetime'][0].value){
          res = {
            valid: true,
            value: query.parsed.entities['datetime'][0].value,
            storage: query.storage
          }
          res.storage.birthdate = query.parsed.entities['datetime'][0].value;
        } else {
          res = handleError('Entity birthdate not found in parsed data.')
        }
        resolve(res);
      })
    },
  },
  policyNumber: {
    prompt: {
      text: 'What\'s policy number? (This is the long number on your health insurance card.)',
    },
    store: function(query){
      return new Promise(function(resolve, reject){
        // need to have custom policy validation -- number of digits etc
        var res = {
          success: true,
          stored: query.stored,
          value: query.parsed._text
        }
        res.stored.policyNumber = query.parsed._text;
        resolve(res);
      })
    },
  },
  insuranceCarrier: {
    prompt: {
      text: 'Who is your health insurance carrier? (Examples: Aetna, Blue Cross Blue Shield, or Medicare. This should be the company on your health insurance card.)',
    },
    store: function(query){
      return new Promise(function(resolve, reject){
        var res = {
          success: true,
          value: null,
          stored: query.stored
        }
        if(query.confirmation){
          handleConfirmation()
          .then(res => resolve(res))
          .catch(err => reject(err))
        } else {
          findInsuranceCarrier(query)
          .then(res => resolve(res))
          .catch(err => reject(err))
        }

        function handleConfirmation(){
          if(query.confirmation.type == 'choice'){
            res.stored.insuranceCarrier = {
              name: query.choice.text,
              tradingPartnerId: query.choice.value
            }
            resolve(res);
          } else if(query.confirmation.type == 'yesNo'){
            if(query.confirmation.yesNo == 'yes'){
              res.storage.insuranceCarrier = query.state.params.insuranceCarrierConfirming;
            } else if (query.confirmation.yesNo == 'no'){
              res.state = query.state;
              res.state.asked = {};
            }
            resolve(res);
          }
        }

      })
    }
  },
  stateInsurance: {
    prompt: {
      text: 'In which state did you buy your health insurance?',
    },
    store: function(query){
      return new Promise(function(resolve, reject){
        // need to have custom policy validation -- number of digits etc
        var res = {
          success: true,
          stored: query.stored,
          value: query.parsed._text
        }
        res.stored.stateInsurance = query.parsed._text;
        resolve(res);
      })
    },
  }
};

export function get(param){
  return new Promise(function(resolve, reject){
    if(param && typeof questions[param] === 'object'){
      resolve(questions[param]);
    } else {
      resolve(false);
    }
  })
}

function getPokitdokTradingPartner(){
  return new Promise(function(resolve, reject){
    pokitdok.tradingPartners(function (err, res) {
      if (err) {
        return console.log(err, res.statusCode);
      }
      // print the name and trading_partner_id of each trading partner
      for (var i = 0, ilen = res.data.length; i < ilen; i++) {
          var tradingPartner = res.data[i];
          console.log(tradingPartner.name + ':' + tradingPartner.id);
      }
    });
  })
}

function findInsuranceCarrier(query){
  return new Promise(function(resolve, reject){
    var res = {
      query: query,
      success: null,
      error: null,
      stored: null,
      state: null,
      value: null
    }
    var results = [];
    handleSpecialTerm()
    .then(() => handleMatching())
    .then(() => resolve(res))
    .catch(err => reject(err))

    // 2. If no special matches, see parsed[0] has a unique match
    // 3. If multiple matches, display best 5 to user
    // 4. If no matches, return error with message
  })

  function handleSpecialTerm(){
    return new Promise(function(resolve, reject){
      if(!res.success && query.parsed._text.toLowerCase() == 'aetna'){
        res.success = false
        // should probably ask something like state instead of listing
        resolve()
      }
    })
  }
  function handleMatching(){
    var results = []
    if(!res.success){
      getMatches()
      .then(() => runSearch())
      .then(() => handleSingleMatch())
      .then(() => handleMultipleMatches())
      .then(() => handleNoMatches())
      .then(() => resolve())
      .catch(err => reject(err))
    }

    function getMatches(){
      return new Promise(function(resolve, reject){
        // from the list of trading partners, do a fuzzy search
        // push to results
        resolve()
      })
    }

    function runSearch(){
      return new Promise(function(resolve, reject){
        // from the list of trading partners, do a fuzzy search
        // push to results
        resolve()
      })
    }

    function handleSingleMatch(){
      return new Promise(function(resolve, reject){
        if(results.length == 1){
          res.success = true;
        }
      })
    }
    function handleMultipleMatches(){
      return new Promise(function(resolve, reject){
        if(results.length > 1){
          res.success = true;
        }
        resolve();
        // if < 5, confirm as choices

        // check as special term, which will either give a unique prompt or ask for state

      })
    }
    function handleNoMatches(){
      return new Promise(function(resolve, reject){
        if(results.length == 0){
          res.success = false;
          res.error = 'No insurance carriers found.'
          res.message = 'It doesn\'t look like we aren\'t partnered with any insurance carriers with that name, unfortunately. You can double check your spelling or ask us about a general health insurance question.'
        }
        resolve()
      })
    }

  }
}


/*
if(query.parsed && query.parsed.results && query.parsed.results['insuranceCarrier'] && query.parsed.results['insuranceCarrier'][0].value){
  res.success = true;
  res.value = {
    name: query.parsed.results['insuranceCarrier'][0].value,
    pokitdokId: null
  }
} else {
  res.success = false;
  res.error = 'Entity insuranceCarrier not found in parsed data.';
  res.message = 'I can\'t seem to find that insurance carrier in our list.';
}
*/
