'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
   BASE_API: '"http://192.168.0.127:8080"'
 // BASE_API: '"http://192.168.0.119:8080"'
  // BASE_API: '"https://api.auauz.net"'
})
