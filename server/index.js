const {
  client,
  createTables,
  //   createCustomer,
  //   createRestaurant,
  //   fetchCustomers,
  //   fetchRestaurants,
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

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

init();
