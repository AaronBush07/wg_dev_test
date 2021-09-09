const app = require("../app");
var http = require("http");
const supertest = require("supertest");
const request = supertest(app);
const db = require("../db");
const backup = db.backup();


it('1 should equal 1', () => {
    expect(1).toBe(1);
});
