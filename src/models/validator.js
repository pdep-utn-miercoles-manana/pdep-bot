const _ = require('lodash');

module.exports = class Validator {
  
  static exists(something, message = 'El argumento debe existir') {
    if (_.isEmpty(something)) throw new Error(message);
  }
  
  static email(email, message = 'El email no es válido') {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) throw new Error(message);
  }

  static conditionFails(boolean, message = 'La condición no debería cumplirse') {
    if (boolean) throw new Error(message);
  }
  
  static conditionPasses(boolean, message = 'La condición debería se cumple') {
    if (!boolean) throw new Error(message);
  }
  
}