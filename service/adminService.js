const CONNECTION = require('../model/connection')
CONNECTION.connecting()
let connection = CONNECTION.getConnection()

class AdminService {
    getMember() {
        return new Promise((resolve, reject) => {
            let sql = `select ud.real_name                                    as name,
                              round(datediff(curdate(), ud.birthday) / 365.0) as age,
                              account.phone                                   as phone,
                              c.sign_day                                    as startDay,
                              c.expire                                        as expire,
                              s.status_name                                   as status
                       from account
                                join userDetails uD
                                     on account.id = uD.id
                                join status s on s.status_id = account.status_id
                                join contract c on c.client_name_id = account.id
                       where account.role_id = 2
                       group by account.id`
            connection.query(sql, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    }

    revenueOfTheDay() {
        return new Promise((resolve, reject) => {
            let sql = `select count(c.contract_id) as Contract, SUM(p.price) as Total_Pirce, curdate() as Day
                       from contract as c
                           join product p
                       on p.product_id = c.product_id
                       where DAY (sign_day) = DAY (curdate())
                         and MONTH (sign_day) = MONTH (curdate())
                         and YEAR (sign_day) = YEAR (curdate())
                       group by Day`
            connection.query(sql, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    }

    revenueOfTheMonth() {
        return new Promise((resolve, reject) => {
            let sql = `select count(c.contract_id) as Contract,
                              SUM(p.price)         as Total_Pirce,
                           MONTH (curdate()) as Month,
                           YEAR (curdate()) as Year
                       from contract as c
                           join product p
                       on p.product_id = c.product_id
                       where MONTH (sign_day) = MONTH (curdate())
                         and YEAR (sign_day) = YEAR (curdate())`
            connection.query(sql, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    }

     getMonthAdd() {
        return new Promise((resolve, reject) => {
            let sql = `SELECT DATE_ADD(c.sign_day, INTERVAL p.name_by_number month) as expire
                       from contract as c
                                join product p on c.product_id = p.product_id
                       where contract_id = 2`
            connection.query(sql, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    }

   async updateContact() {
        let addMonth = await this.getMonthAdd()

       console.log(addMonth[0].expire)
       // let addMonth = '2023-09-09'
       //  return new Promise((resolve, reject) => {
       //      let sql = `update contract
       //                 set expire = '${addMonth[0].expire}'
       //                 where contract.contract_id = 2`
       //      connection.query(sql, (err, data) => {
       //          if (err) reject(err)
       //          else resolve(data)
       //      })
       //  })
    }

}


module.exports = new AdminService()