var express = require('express');
var router = express.Router();
const db = require('../db')

/**Get all products */


router.get('/products', function(req, res, next) {

  


  res.send(db.public.many(`SELECT * FROM PRODUCTS`))
});


/**Paginated results */
router.get('/products/:page', function (req, res, next) {
  let offset = (req.params.page - 1) * 10;
  try {
  res.send(db.public.many(`SELECT * FROM PRODUCTS ORDER BY ID ASC OFFSET ${offset} ROWS FETCH NEXT 10 ROWS `))
} catch(e) {
  console.log(e)
}
});

module.exports = router;
