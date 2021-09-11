const app = require("../app");
const http = require("http");
const supertest = require("supertest");
const request = supertest(app);
const db = require("../db");
const validate = require("../validation/schema");
const backup = db.backup();
const qs = require("qs");

it("1 should equal 1", () => {
  expect(1).toBe(1);
});

describe("Endpoint responses", () => {
  it("Return 404", async () => {
    const response = await request.get("/nonexistantapi");
    expect(response.status).toBe(404);
  });

  it("Return 400", async () => {
    const str = qs.stringify({
      pricemin: 400,
      pricemax: 200,
    });
    const response = await request.get(`/products?${str}`);
    expect(response.status).toBe(400);
  });

  it("Return 200", async () => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
  });
});

describe("Schema validation", () => {
  it("Validate schema", async () => {
    const data = {
      pricemin: 100,
      pricemax: 200,
      fantastic: true,
      rating: 3,
    };
    const result = await validate(data);
    expect(result.error).toBe(undefined);
  });

  it("Pricemin must be less than pricemax", async () => {
    const data = {
      pricemin: 400,
      pricemax: 200,
      fantastic: true,
      rating: 3,
    };
    const result = await validate(data);
    expect(result.error).toBeTruthy();
  });

  it("Not all fields compulsory. Price max should still work without price min", async () => {
    const data = {
      pricemax: 200,
      rating: 3,
    };
    const result = await validate(data);
    console.log(result);
    expect(result.error).toBe(undefined);
  });

  it("Bad schema", async () => {
    const data = {
      pricemin: "aaaa",
      pricemax: "bbb",
      fantastic: true,
      rating: 3,
    };
    const result = await validate(data);
    expect(result.error).toBeTruthy();
  });
});

describe("Ensure data is valid", () => {
  it("Min price is valid", async () => {
    const pricemin = 200;
    const data = { pricemin };
    const response = await request.get(`/products?${qs.stringify(data)}`);
    const result = response.body.every((element) => element.price >= pricemin);
    expect(result).toBeTruthy();
  });

  it("Max price is valid", async () => {
    const pricemax = 500;
    const data = { pricemax };
    const response = await request.get(`/products?${qs.stringify(data)}`);
    const result = response.body.every((element) => element.price <= pricemax);
    expect(result).toBeTruthy();
  });

  it("Product is fantastic", async () => {
    const fantastic = true;
    const data = { fantastic };
    const response = await request.get(`/products?${qs.stringify(data)}`);
    const result = response.body.every((element) => element.attribute.fantastic.value === true);
    expect(result).toBeTruthy();
  });


});
