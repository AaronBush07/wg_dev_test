const express = require("express");
const { errors } = require("pg-promise");
const router = express.Router();
const db = require("../db");
const whereParser = require("../db/whereParser");
const validate = require("../validation/schema");

/**Validaton middleware  */
router.use("/products", async function (req, res, next) {
  const result = await validate(req.query);
  if (result.error) {
    res.status(400).send(result.error);
  } else {
    next();
  }
});

/**Get all products. 
 * /products?pricemin=9&pricemax=10&fantastic=true&ratingmin=2.0&ratingmax=5
*/
router.get("/products", function (req, res) {
  try {
    const where = whereParser(req.query);
    let query = `SELECT * FROM PRODUCTS ${where ? "WHERE " + where : ""} ORDER BY ID ASC `;
    if (req.query.offset) {
      query += `OFFSET ${req.query.offset} ROWS `
    }
    if (req.query.limit) {
      query += `FETCH NEXT ${req.query.limit} ROWS`
    }
    res.status(200).send(db.public.many(query));
  } catch (e) {
    console.log(e);
    throw Error(e);
  }
});

module.exports = router;
