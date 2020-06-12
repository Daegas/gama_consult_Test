const mysql = require('mysql');

const { database } = require('./keysA'); //All the secret stuffs
const {promisify} = require('util');

const pool = mysql.createPool(database); //Creat connection, threads

pool.getConnection((err, conn) => {
    if (err) {
        //MOST COMMON ERRORS
        if(err.code == 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION CLOSED');
        }
        if(err.code == "ER_CON_COUNT_ERROR") {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === "ECONNREFUSED") { //MAINLY DUE TO WRONG CREDENTIAL DATA
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if (conn) {
        conn.release(); 
        console.log('DB CONNECTED: ', database.database);
    }

    return;
});



//Promiseify Queries
pool.query = promisify(pool.query); //Enable 'async-await' and 'promisses' - for no async behaivour

module.exports = pool; //Export pool connection