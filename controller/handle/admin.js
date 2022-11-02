const fs = require('fs');
const ADMIN_SERVICE = require('../../service/adminService');
const qs = require('qs')

class Admin {
    static getHtmlShowHome(listMember, indexHtml) {
        let tbody = '';
        listMember.forEach((item, index) => {
            tbody += `<tr>
            <th scope="row">${index + 1}</th>
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td>${item.phone}</td>
            <td>${item.startDay}</td>
            <td>${item.expire}</td>
            <td>${item.status}</td>
            <td style="text-align: center"><a href="" class="btn btn-danger">Lock Status</a></td>
            <td style="text-align: center"><a href="" class="btn btn-danger">Del</a></td>
        </tr>`
        })
        indexHtml = indexHtml.replace('{listMember}', tbody);
        return indexHtml;
    }

   async showHome(req, res) {
        fs.readFile('./views/admin/adminHome.html', 'utf-8', async (err, indexHtml) => {
            if (err) {
                console.log(err);
            } else {
                let listMember = await ADMIN_SERVICE.getMember()
                indexHtml = Admin.getHtmlShowHome(listMember, indexHtml)
                res.writeHead(200, 'text/html');
                res.write(indexHtml);
                res.end();
            }
        })

       // console.log(await ADMIN_SERVICE.updateContact())
       //  let a = await ADMIN_SERVICE.getMonthAdd()
       //
       // console.log(a[0].expire.toString())

    }

}

module.exports = new Admin()