module.exports = function (params) {
  const { pricemin, pricemax, fantastic, ratingmin, ratingmax } = params;
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
  if (ratingmin) {
    if (and > 0) {
      where += " AND ";
    }
    where += `attribute->'rating'->'value'::float>=${ratingmin} `;
    and++
  }
  if (ratingmax) {
    if (and > 0) {
      where += " AND ";
    }
    where += `attribute->'rating'->'value'::float<=${ratingmax} `;
    and++
  }
  return where
};
