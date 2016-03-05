'use strict';

var gpio = require('pi-gpio');

gpio.open(11, "input", (error) => {
  console.log('Opened pin 11/17');

  gpio.read(11, (error, value) => {
    if (error) {
      throw error;
    }
    console.log('pin value: ' + value);
    gpio.close(11, (error) => {
      if (error) {
        throw error;
      }
    });
  });
});

function relays() {
  return {
  }
}

exports = module.exports = relays;
