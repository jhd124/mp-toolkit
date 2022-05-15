const { App } = require("./mocks/app")

module.exports = function(){
  globalThis.App = App
  console.log('[[[[[[[[setup]]]]]]]]')
}

