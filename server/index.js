const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  //   createReservation,
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
  await createTables();
  console.log("created tables!");
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

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

init();
