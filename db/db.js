const { newDb } = require('pg-mem');
const dummy = require('./dummyData.json')
const pgp = require('pg-promise')();

const db = newDb();

try {
const dbSchema = `
    CREATE TABLE PRODUCTS (id numeric PRIMARY KEY, sku varchar, name varchar, price numeric, attribute json)
`
//Create table in pg-mem
db.public.none(dbSchema);
}
catch (e) {
    console.log(e)
}

dummy.forEach(val=> {
    const queryText = pgp.as.format(`INSERT INTO PRODUCTS(id, sku, name, price, attribute) VALUES ($1, $2, $3, $4, $5)`, [val.id, val.sku, val.name, val.price, val.attribute])
    db.public.one(queryText)
})

console.log(db.public.one(`SELECT * FROM products WHERE id = 1 LIMIT 10`))

module.exports = db
