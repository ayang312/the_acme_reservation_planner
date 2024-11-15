const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://localhost/the_acme_reservation_planner"
);

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

module.exports = {
  client,
  createTables,
//   createCustomer,
//   createRestaurant,
//   fetchCustomers,
//   fetchRestaurants,
//   createReservation,
//   destroyReservation,
};
