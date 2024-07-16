const whatsapp = require('./whatsapp');
//const connection = require('./db');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const express=require('express');

const app=express();
const port=process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());


let conn=mysql.createPool({
    connectionLimit : 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "campaign_db",
    multipleStatements: true
});

app.get('/text/:id', (req, res) => {
    conn.getConnection((err, connection) => {
        if(err) throw err
        //console.log('params: '+req.params.id);
        let sql = 'SELECT message FROM campaign_details WHERE is_deleted=0 AND cid=?';
        let csql = 'SELECT id, phone FROM campaign_details_master WHERE is_deleted=0 AND status=0 AND cid=?';
        
        connection.query(sql+';'+csql, [req.params.id, req.params.id], (err, rows) => {
            //connection.release();
            if(!err){
                //let message = rows[0].message;
                //console.log(rows);
                let message = rows[0][0].message;
                let contacts = rows[1];
                let phoneNos=[];
                let ids=[];
                contacts.forEach(element => {
                    phoneNos.push(element.phone);
                });
                contacts.forEach(element => {
                    ids.push(element.id);
                });

                console.log(message, phoneNos);
                const data = {
                    'message': message,
                    'phoneNos': phoneNos
                };
                
                sendToWhatsapp(res, data, 5000, connection, ids);
            } else {
                console.log(err);
            }
            
            //console.log('The data from db are: \n', rows);
        });

    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

async function sendToWhatsapp(res, data, time, connection, ids){
    var updsql = 'UPDATE campaign_details_master SET status=1 WHERE is_deleted=0 and id=?';
    const sent = await whatsapp.sendText(data, time);
    if(sent!=''){
        ids.forEach(element => {
            connection.query(updsql, [element], (err, rows) => {
                connection.release();
                if(!err){
                    res.send(sent);
                }
                else{
                    console.log(err);
                }
            });
        });
    }
    //console.log(sent);
    //res.send(sent);
}

