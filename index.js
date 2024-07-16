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
    database: "db_connect",
    multipleStatements: true
});

//sendText
app.get('/text/:id', (req, res) => {
    conn.getConnection((err, connection) => {
        if(err) throw err
        //console.log('params: '+req.params.id);
        var sql = 'SELECT message FROM campaign_details WHERE is_deleted=0 AND cid=?';
        var csql = 'SELECT id, phone FROM campaign_details_master WHERE is_deleted=0 AND status=0 AND cid=?';
        
        connection.query(sql+';'+csql, [req.params.id, req.params.id], async (err, rows) => {
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
                    ids.push(element.id);
                });
                
                //console.log(message, phoneNos);
                const data = {
                    'message': message,
                    'phoneNos': phoneNos
                };
                //console.log(data);
                await sendToWhatsapp(res, data, 5000, connection, ids);
            } else {
                console.log(err);
            }
            //console.log('The data from db are: \n', rows);
        });
    });
});

//sendImage
app.get('/image/:id', (req, res) => {
    conn.getConnection((err, connection) => {
        if(err) throw err
        var sql = 'SELECT media, caption FROM campaign_details WHERE is_deleted=0 AND cid=?';
        var csql = 'SELECT id, phone FROM campaign_details_master WHERE is_deleted=0 AND status=0 AND cid=?';
        connection.query(sql+';'+csql, [req.params.id, req.params.id], async (err, rows) => {
            if(!err){
                let media = rows[0][0].media;
                let caption = rows[0][0].caption;
                let contacts = rows[1];
                let phoneNos = [];
                let ids = [];
                contacts.forEach(element => {
                    phoneNos.push(element.phone);
                });
                contacts.forEach(element => {
                    ids.push(element.id);
                });
                const data = {
                    'media': media,
                    'caption': caption,
                    'phoneNos': phoneNos
                };
                console.log(data);
                await sendImageToWhatsapp(res, data, 5000, connection, ids);
            }
            else{
                console.log(err);
            }
        });
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));


//FUNCTIONS
//async function (text)
async function sendToWhatsapp(res, data, time, connection, ids){
    var updsql = 'UPDATE campaign_details_master SET status=1 WHERE is_deleted=0 and id=?';
    const sent = await whatsapp.send('text',data, time);
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
}
//async function (image)
async function sendImageToWhatsapp(res, data, time, connection, ids){
    var updsql = 'UPDATE campaign_details_master SET status=1 WHERE is_deleted=0 and id=?';
    const sent = await whatsapp.send('image',data, time);
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
}



