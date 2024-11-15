const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://localhost/the_acme_reservation_planner"
);

const uuid = require("uuid");

const createTables = async () => {
  const SQL = /* sql */ `
          DROP TABLE IF EXISTS reservations;
          DROP TABLE IF EXISTS customers;
          DROP TABLE IF EXISTS restaurants;
          CREATE TABLE customers(
              id UUID PRIMARY KEY,
              name VARCHAR(50) NOT NULL UNIQUE
          );
          CREATE TABLE restaurants(
              id UUID PRIMARY KEY,
              name VARCHAR(50) NOT NULL UNIQUE
          );
          CREATE TABLE reservations(
              id UUID PRIMARY KEY,
              departure_date DATE NOT NULL,
              user_id UUID REFERENCES customers(id) NOT NULL,
              place_id UUID REFERENCES restaurants(id) NOT NULL
          );
      `;

  await client.query(SQL);
};

const createCustomer = async (name) => {
  const SQL = /*sql*/ `
      INSERT INTO customers(id, name) 
      VALUES($1, $2) RETURNING *
    `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createRestaurant = async (name) => {
  const SQL = /*sql*/ `
        INSERT INTO restaurants(id, name) 
        VALUES($1, $2) 
        RETURNING *
      `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const fetchCustomers = async () => {
  const SQL = `
      SELECT * FROM customers
      `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchRestaurants = async () => {
  const SQL = `
    SELECT *
    FROM restaurants
      `;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  //   createReservation,
  //   destroyReservation,
};
