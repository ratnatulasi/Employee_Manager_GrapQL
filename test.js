const {db} = require('./db/pgAdmin');
const { pool } = require('./connection');

db.any(`select * from tbl_manager`).then(res => console.log(res))