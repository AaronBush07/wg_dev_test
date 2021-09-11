const app = require("../app");
const http = require("http");
const supertest = require("supertest");
const request = supertest(app);
const db = require("../db");
const validate = require('../validation/schema');
const backup = db.backup();
const qs = require('qs')

it("1 should equal 1", () => {
  expect(1).toBe(1);
});

describe("Endpoint responses", () => {
  it("Return 404", async () => {
    const response = await request.get("/nonexistantapi");
    expect(response.status).toBe(404);
  });

  it('Return 400', async() => {
    const str = qs.stringify({
      pricemin: 400, 
      pricemax: 200
    });
    const response = await (request.get(`/products?${str}`))
    expect(response.status).toBe(400)
  })

});


describe("Schema validation", ()=> {
  it("Validate schema", async ()=> {
    const data = {
      pricemin: 100,
      pricemax: 200,
      fantastic: true,
      rating: 3
    }
    const result = await validate(data)
    expect(result.error).toBe(undefined)
  })

  it("Pricemin must be less than pricemax", async ()=> {
    const data = {
      pricemin: 400,
      pricemax: 200,
      fantastic: true,
      rating: 3
    }
    const result = await validate(data)
    expect(result.error).toBeTruthy();
  })

  it("Not all fields compulsory", async ()=> {
    const data = {
      pricemax: 200,
      rating: 3
    }
    const result = await validate(data);
    console.log(result)
    expect(result.error).toBe(undefined);
  })

  it("Bad schema", async ()=> {
    const data = {
      pricemin: 'aaaa',
      pricemax: 'bbb',
      fantastic: true,
      rating: 3
    }
    const result = await validate(data)
    expect(result.error).toBeTruthy()
  })
})