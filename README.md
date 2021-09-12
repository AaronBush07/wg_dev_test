# wg_dev_test

1. With the mock data provided, create a SQL schema to store the data. 
2. Using the language / framework of your choice to write a simple rest service that returns the same JSON formatted results as the mock data with the following capabilities: 
- Connects to the database to retrieve results. 
- Can filter the product set based on price, min / max 
- Can filter the product set based on the fantastic attribute 
- Can filter the product set based on the rating attribute min / max 3. 


# Instructions
You may set up a .env file with a PORT for a custom port. Default is 3000

Run the following in terminal: 
- npm install 
- npm start

To test: 
- jest 
or 
- npm test

# Notes
Instead of a real database, a mock database using pg-mem has been used. It behaves almost the same as a real postgres database just in memory. 

Server side validation has been done via the Joi library. It should be self-explanatory as to how it works based on the schema.js file found in the validation folder. 
