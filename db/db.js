const { newDb } = require('pg-mem');
const dummy = require('./dummyData.json')
const pgp = require('pg-promise')();

const db = newDb();


module.exports = db
