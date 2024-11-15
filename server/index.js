const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  //   destroyReservation,
} = require("./db");
const express = require("express");
const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  //   create tables
  await createTables();
  console.log("created tables!");

  //   create customers and restaurants with promise.all method
  const [andrew, kathy, mike, grace, carbone, marea, chipotle] =
    await Promise.all([
      createCustomer({ name: "andrew" }),
      createCustomer({ name: "kathy" }),
      createCustomer({ name: "mike" }),
      createCustomer({ name: "grace" }),
      createRestaurant({ name: "carbone" }),
      createRestaurant({ name: "marea" }),
      createRestaurant({ name: "chipotle" }),
    ]);
  // fetchCustomers and fetchRestaurants
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());

  //   create a reservation
  const [reservation, reservation2] = await Promise.all([
    createReservation({
      customer_id: andrew.id,
      restaurant_id: marea.id,
      reservation_date: "11/28/2024",
    }),
    createReservation({
      customer_id: mike.id,
      restaurant_id: carbone.id,
      reservation_date: "11/29/2024",
    }),
    createReservation({
      customer_id: grace.id,
      restaurant_id: chipotle.id,
      reservation_date: "11/30/2024",
    }),
  ]);
  console.log(await fetchReservations());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

init();
