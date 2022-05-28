const { App } = require("./mocks/app")
const { Component } = require("./mocks/component")

module.exports = function(){
  globalThis.App = App
  globalThis.Component = Component
}

