module.exports = function (params) {
  const { pricemin, pricemax, fantastic, rating } = params;
  let where = ``;
  let and = 0;
  if (pricemin) {
    where += `price >= ${pricemin} `;
    and++;
  }
  if (pricemax) {
    if (pricemin) {
      where += " AND ";
    }
    where += ` price <= ${pricemax} `;
    and++;
  }
  if (fantastic) {
    if (and > 0) {
      where += " AND ";
    }
    where += ` attribute->'fantastic'->'value'='${fantastic}' `;
    and++;
  }
  if (rating) {
    if (and > 0) {
      where += " AND ";
    }
    where += `attribute->'rating'->'value'=${rating} `;
  }
  return where
};
