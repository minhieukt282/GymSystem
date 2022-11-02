const fs = require('fs');
const LOGIN_SERVICE = require('../../service/loginService');
const qs = require('qs')
const cookie = require('cookie');

class Login {
    login(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/login/login.html', "utf-8", async (err, loginHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    // LoginPage.logout(req, res);
                    res.writeHead(200, 'text/html');
                    res.write(loginHtml);
                    res.end()
                }
            })
        } else {
            let chunkAccount = '';
            req.on('data', chunk => {
                chunkAccount += chunk
            });
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let account = qs.parse(chunkAccount)
                    let status = await LOGIN_SERVICE.isCheckGate(account)
                    // console.log("status", status)
                    if (status.flag) {
                        // res.setHeader('Set-Cookie', cookie.serialize('id', `${dataUser[0].id}`, {
                        //     httpOnly: true,
                        //     secure: true,
                        //     maxAge: 60*60
                        // }));
                        // let cookies = cookie.parse(req.headers.cookie || '');
                        // console.log('cookie login', cookies)
                        if (status.role === 1) {
                            res.writeHead(301, {'location': 'admin'});
                            res.end()
                        } else {
                            res.writeHead(301, {'location': 'home'});
                            res.end()
                        }
                    } else {
                        res.writeHead(301, {'location': 'login'});
                        res.end()
                    }
                }
            })
        }
    }

    register(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/login/register.html', "utf-8", async (err, registerHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(registerHtml);
                    res.end()
                }
            })
        } else {
            let chunkAccount = '';
            req.on('data', chunk => {
                chunkAccount += chunk
            });
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let neuAccount = qs.parse(chunkAccount);
                    let isCheckUsername = await LOGIN_SERVICE.isCheckUsername(neuAccount)
                    if (isCheckUsername) {
                        res.writeHead(301, {'location': 'register'});
                        res.end();
                    } else {
                        if (neuAccount.password === neuAccount.confirmPassword) {
                            await LOGIN_SERVICE.createNewAccount(neuAccount, neuAccount.username, neuAccount.realName)
                            res.writeHead(301, {'location': 'login'});
                            res.end();
                        } else {
                            res.writeHead(301, {'location': 'register'});
                            res.end();
                        }
                    }
                }
            })
        }
    }

    // static logout(req, res) {
    //     let cookies = cookie.parse(req.headers.cookie || '');
    //     res.setHeader('Set-Cookie', cookie.serialize('id', `${cookies.id}`, {
    //         httpOnly: true,
    //         secure: true,
    //         maxAge: 0
    //     }));
    //     console.log('cookie logout', cookies)
    // }
}

module.exports = new Login()
