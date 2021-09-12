const app = require("../app");
const http = require("http");
const supertest = require("supertest");
const request = supertest(app);
const db = require("../db");
const validate = require("../validation/schema");
const backup = db.backup();
const dummyData = require('../db/dummyData.json')
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
      ratingmin: 3,
      ratingmax: 5,
    };
    const result = await validate(data);
    expect(result.error).toBe(undefined);
  });

  it("Pricemin must be less than pricemax", async () => {
    const data = {
      pricemin: 400,
      pricemax: 200,
      fantastic: true,
      ratingmin: 3,
    };
    const result = await validate(data);
    expect(result.error).toBeTruthy();
  });

  it("Equal prices are allowed", async () => {
    const data = {
      pricemin: 200,
      pricemax: 200,
      fantastic: true,
      ratingmin: 3,
    };
    const result = await validate(data);
    expect(result.error).toBe(undefined);
  });

  it("Equal ratings are allowed", async () => {
    const data = {
      pricemin: 200,
      pricemax: 400,
      fantastic: true,
      ratingmin: 3,
      ratingmax: 3,
    };
    const result = await validate(data);
    expect(result.error).toBe(undefined);
  });

  it("Not all fields compulsory. Price max should still work without price min", async () => {
    const data = {
      pricemax: 200,
      ratingmin: 3,
    };
    const result = await validate(data);
    console.log(result);
    expect(result.error).toBe(undefined);
  });

  it("Bad schema should return error", async () => {
    const data = {
      pricemin: "aaaa",
      pricemax: "bbb",
      fantastic: true,
      ratingmax: 3,
    };
    const result = await validate(data);
    expect(result.error).toBeTruthy();
  });

  it("Bad schema should return error #2", async () => {
    const data = {
      pricemin: "200",
      pricemax: "400",
      fantastic: 1,
      ratingmax: "3",
    };
    const result = await validate(data);
    console.log(result)
    expect(result.error).toBeTruthy();
  });

  it("Bad schema should return error #3", async () => {
    const data = {
      pricemin: 200,
      pricemax: 400,
      fantastic: true,
      ratingmax: 3,
      ratingmin: 5,
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
    const result = response.body.every(
      (element) => element.attribute.fantastic.value === fantastic
    );
    expect(result).toBeTruthy();
  });

  it("Product is not fantastic", async () => {
    const fantastic = false;
    const data = { fantastic };
    const response = await request.get(`/products?${qs.stringify(data)}`);
    const result = response.body.every(
      (element) => element.attribute.fantastic.value === fantastic
    );
    expect(result).toBeTruthy();
  });

  it("Rating is equal or greater than 4", async () => {
    const ratingmin = 4;
    const data = { ratingmin };
    const response = await request.get(`/products?${qs.stringify(data)}`);
    const result = response.body.every(
      (element) => element.attribute.rating.value >= ratingmin
    );
    expect(result).toBeTruthy();
  });

  it("Rating is equal or less than 4", async () => {
    const ratingmax = 4;
    const data = { ratingmax };
    const response = await request.get(`/products?${qs.stringify(data)}`);
    const result = response.body.every(
      (element) => element.attribute.rating.value <= ratingmax
    );
    expect(result).toBeTruthy();
  });

  it("Price is between 500 and 900. Rating is between 2 and 4. Is fantastic", async () => {
    const ratingmin = 2.0,
      ratingmax = 4,
      pricemin = 500,
      pricemax = 900,
      fantastic = true;

    const data = {
      ratingmin,
      ratingmax,
      pricemin,
      pricemax,
      fantastic,
    };

    const response = await request.get(`/products?${qs.stringify(data)}`);
    const result = response.body.every((element) => {
      return (
        element.price >= pricemin &&
        element.price <= pricemax &&
        element.attribute.rating.value <= ratingmax &&
        element.attribute.rating.value >= ratingmin &&
        element.attribute.fantastic.value === fantastic
      );
    });
    expect(result).toBeTruthy();
  });


  it("Price is between 200 and 450. Rating is between 2 and 4. Is not fantastic. Matches original mock data", async () => {
    expect.assertions(3);
    const ratingmin = 2.0,
      ratingmax = 4,
      pricemin = 200,
      pricemax = 450,
      fantastic = false;

    const data = {
      ratingmin,
      ratingmax,
      pricemin,
      pricemax,
      fantastic,
    };

    const response = await request.get(`/products?${qs.stringify(data)}`);
    const result = response.body.every((element) => {
      return (
        element.price >= pricemin &&
        element.price <= pricemax &&
        element.attribute.rating.value <= ratingmax &&
        element.attribute.rating.value >= ratingmin &&
        element.attribute.fantastic.value === fantastic
      );
    });
    expect(result).toBeTruthy();

    const dummy = dummyData.filter(element=> {
      return (
        element.price >= pricemin &&
        element.price <= pricemax &&
        element.attribute.rating.value <= ratingmax &&
        element.attribute.rating.value >= ratingmin &&
        element.attribute.fantastic.value === fantastic
      );
    })

    expect(response.body.length).toBe(dummy.length);
    expect(response.status).toBe(200)
  });
});
