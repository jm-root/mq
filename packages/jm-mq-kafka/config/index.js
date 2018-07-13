require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
var config = {
  development: {
    debug: true,
    lng: 'zh_CN',
    port: 3000,
    kafka: 'zk://test.jamma.cn',
    modules: {
      mq: {
        module: process.cwd() + '/lib'
      }
    }
  },
  production: {
    port: 80,
    modules: {
      mq: {
        module: process.cwd() + '/lib'
      }
    }
  }
}

var env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env

module.exports = config
