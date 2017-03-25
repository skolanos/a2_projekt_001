# angular2_simple_ordering_app

Angular simple browse inventory and ordering application. Server side in Node.js
(Java Script) uses Expess and store data in PostgreSQL database.

You can login into application or register a new account. Once you are logged in
you can browse inventory and put selected items into your cart. You can review
what you have selected, make modifications (delete items from cart) and place
orders.

## Using components

<a href="http://www.angular.io/" target="_blank">Angular</a><br>
<a href="https://v4-alpha.getbootstrap.com/" target="_blank">Bootstrap 4</a><br>
<a href="https://nodejs.org/" target="_blank">Node.js</a><br>
<a href="http://expressjs.com/" target="_blank">Express</a><br>
<a href="https://www.npmjs.com/package/bcryptjs" target="_blank">bcryptjs</a><br>
<a href="https://www.npmjs.com/package/jsonwebtoken" target="_blank">jsonwebtoken</a><br>
<a href="https://www.npmjs.com/package/morgan" target="_blank">morgan</a><br>
<a href="https://www.npmjs.com/package/bigdecimal" target="_blank">bigdecimal</a><br>

## Configure database and create tables

Create new database in PostgreSQL. Run SQL commands from `/database/database.sql`
file to create tables and indexes. You can run commands from `/database/sample_data.sql`
file to load sample data.

Configure databse connection string in `/server/server-config.js` (attribute
`connectionString`).

## Install npm packages

Before first run you need to install necessary node packages, run the
following commands in your terminal:

```shell
npm install
cd client
npm install
```

## Running application

Run the following commands in you terminal:

```shell
npm start
```

In another terminal window run the following commands:

```shell
cd client
npm start
```

In web browser enter `http://localhost:3000/` address.
