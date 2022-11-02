const CONNECTION = require('../model/connection')
CONNECTION.connecting()
let connection = CONNECTION.getConnection()

class LoginService {
    getAccount() {
        return new Promise((resolve, reject) => {
            let sql = `select *
                       from account`
            connection.query(sql, (err, account) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(account)
                }
            })
        })
    }

    async isCheckGate(account) {
        let status = {
            flag: false,
            role: 2
        }
        let listAccount = await this.getAccount();
        for (let i = 0; i < listAccount.length; i++) {
            if (account.username === listAccount[i].username && account.password === listAccount[i].password) {
                status.flag = true
                status.role = listAccount[i].role_id
            }
        }
        return status
    }

    async isCheckUsername(account) {
        let listAccount = await this.getAccount();
        for (let i = 0; i < listAccount.length; i++) {
            if (account.username === listAccount[i].username) {
                return true;
            }
        }
        return false
    }

    async createNewAccount(account, username, realName) {
        await this.insertAccount(account)
        await this.insertName(username, realName)
    }

    insertAccount(account) {
        return new Promise((resolve, reject) => {
            let sql = `insert into account(username, password)
                       values ('${account.username}', '${account.password}')`
            connection.query(sql, (err, account) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(account)
                }
            })
        })
    }

    async insertName(username, realName) {
        let id = await this.findIdByName(username)
        return new Promise((resolve, reject) => {
            let sql = `insert into userDetails(id, real_name)
                       values (${id[0].id}, '${realName}')`
            connection.query(sql, (err, account) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(account)
                }
            })
        })
    }

    findIdByName(username) {
        return new Promise((resolve, reject) => {
            let sql = `select account.id as id
                       from account
                       where account.username = '${username}'`
            connection.query(sql, (err, account) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(account)
                }
            })
        })
    }


}

module.exports = new LoginService()