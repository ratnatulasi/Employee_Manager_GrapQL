const { Pool } = require('pg');
const pool = new Pool({
    connectionString : 'postgres://postgres:12345@localhost:5433/tulasidb'
})

module.exports = { pool }