const mysql = require('mysql');
const dbPoolCreator = require('../db/dbPoolCreator')

class Dao {
    sqlHandler = (sql, q, fn) => {
        if (q) sql = mysql.format(sql, q);
        return new Promise(async (resolve, reject) => {
            try {
                const dbPool = await db.getPool();
                
                dbPool.getConnection((err, conn) => {
                    if (err) {
                        if (conn) conn.release();
                        return reject(err);
                    }
                    conn.query(sql, (err, rows, fields) => {
                        conn.release();
                        if (err) return reject(err) || fn(err);
                        resolve(rows) || fn(rows);
                    })
                })
            } catch (err) {
                return reject(err) || fn(err);
            }
        })
    }
}

module.exports = new Dao();