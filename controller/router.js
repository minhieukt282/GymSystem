const ADMIN = require('./handle/admin')
const LOGIN = require('./handle/login')
let handle = {
    'login': LOGIN.login,
    'register': LOGIN.register,

    'admin': ADMIN.showHome
}

module.exports = handle