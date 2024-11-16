const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation,
} = require("./db");
const express = require("express");
const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));

// READ customers route
app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (error) {
    next(error);
  }
});

// READ restaurants route
app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (error) {
    next(error);
  }
});

// READ reservations ROUTE
app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (error) {
    next(error);
  }
});

// CREATE reservations route
app.post("/api/customers/:customer_id/reservations", async (req, res, next) => {
  try {
    res.status(201).send(
      await createReservation({
        customer_id: req.params.customer_id,
        restaurant_id: req.body.restaurant_id,
        reservation_date: req.body.reservation_date,
        party_count: req.body.party_count,
      })
    );
  } catch (error) {
    next(error);
  }
});

// DELETE reservations route
app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      await destroyReservation({
        customer_id: req.params.customer_id,
        id: req.params.id,
      });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || err });
});

// init function to run the app
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
  const [reservation, reservation2, reservation3] = await Promise.all([
    createReservation({
      customer_id: andrew.id,
      restaurant_id: marea.id,
      reservation_date: "11/28/2024",
      party_count: 3,
    }),
    createReservation({
      customer_id: mike.id,
      restaurant_id: carbone.id,
      reservation_date: "11/29/2024",
      party_count: 2,
    }),
    createReservation({
      customer_id: grace.id,
      restaurant_id: chipotle.id,
      reservation_date: "11/30/2024",
      party_count: 4,
    }),
  ]);
  console.log(await fetchReservations());

  // delete reservation function
  await destroyReservation({
    id: reservation.id,
    customer_id: reservation.customer_id,
  });
  console.log(await fetchReservations());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log(
      `curl -X DELETE localhost:${port}/api/customers/${mike.id}/reservations/${reservation2.id}`
    );
    console.log(
      `curl -X POST localhost:${port}/api/customers/${andrew.id}/reservations/ -d '{"restaurant_id":"${carbone.id}", "reservation_date": "02/15/2025", "party_count": 2}' -H "Content-Type:application/json"`
    );
  });
};

init();
