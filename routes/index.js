const express = require("express");
const { errors } = require("pg-promise");
const router = express.Router();
const db = require("../db");
const whereParser = require("../db/whereParser");
const validate = require("../validation/schema");
/**Get all products */

router.use("/products", async function (req, res, next) {
  const result = await validate(req.query);
  if (result.error) {
    res.status(400).send(result.error);
  } else {
    next();
  }
});

router.get("/products", function (req, res) {
  try {
    const where = whereParser(req.query);
    let query = `SELECT * FROM PRODUCTS ${where? 'WHERE '+ where: ''}`
    console.log(query)
    res.status(200).send(db.public.many(query));
  } catch (e) {
    console.log(e);
    throw Error(e);
  }
});

router.get("/test", function (req, res, next) {
  res.send(
    db.public.many(
      `SELECT * FROM PRODUCTS p WHERE p.attribute -> 'rating' -> 'value'::float >= 4.0`
    )
  );
});

/**Paginated results */
router.get("/products/:page", function (req, res, next) {
  let offset = (req.params.page - 1) * 10;
  try {
    res.send(
      db.public.many(
        `SELECT * FROM PRODUCTS ORDER BY ID ASC OFFSET ${offset} ROWS FETCH NEXT 10 ROWS `
      )
    );
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
