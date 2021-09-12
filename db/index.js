const { newDb } = require("pg-mem");
const dummy = require("./dummyData.json");
const pgp = require("pg-promise")();

const db = newDb();

try {
  const dbSchema = `
    CREATE TABLE PRODUCTS (id SERIAL PRIMARY KEY, sku varchar, name varchar, price numeric, attribute json)
`;
  //Create table in pg-mem
  db.public.none(dbSchema);
} catch (e) {
  console.log(e);
}

/**Populate fake database 
 * pg-promise is being used to format the values being used. If this task were to require
 * further inserts to the table, I would most likely continue using pg-promise to format the data
 * due to pg-mem wrappers not being reliable. 
*/
dummy.forEach(async (val) => {
  const queryText = pgp.as.format(
    `INSERT INTO PRODUCTS(id, sku, name, price, attribute) VALUES ($1, $2, $3, $4, $5)`,
    [val.id, val.sku, val.name, val.price, val.attribute]
  );
  db.public.one(queryText);
});

module.exports = db;
