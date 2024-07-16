const mysql  = require('mysql');

const conn = mysql.createConnection({
    host: '192.168.29.201',
    database: 'campaign_db',
    user: 'root',
    password: ''
});

conn.connect((err) => {
    if(err){
        console.log(err);
    }else{
        console.log("connected");
    }
});

module.exports = {
    conn: conn
}