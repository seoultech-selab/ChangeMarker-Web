const mysql = require('mysql');
const db = require('../db/dbPoolCreator')

class Dao {
    sqlHandler = (sql, q, fn) => {
        if (q) sql = mysql.format(sql, q)
        // console.log(sql)
        return new Promise(async (resolve, reject) => {
            try {
            	// pool을 가져오는 과정
                const dbPool = await db.getPool()
                
                // pool에서 연결객체를 가져오는 과정
                dbPool.getConnection((err, conn) => {
                    if (err) {
                        console.log('getConnection: err');
                        if (conn) conn.release();
                        return reject(err)
                    }
                    // 내부 콜백에서 쿼리를 수행
                    conn.query(sql, (err, rows, fields) => {
                        conn.release();
                        // if (err) return reject(err) || fn(err);
                        // resolve(rows) || fn(rows);
                        if (err) return reject(err);
                        resolve(rows);
                    })
                })
            } catch (err) {
                // return reject(err) || fn(err);
                return reject(err);
            }
        })
    }
}

module.exports = new Dao();