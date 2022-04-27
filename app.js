const express = require("express");
// const stripe = require("stripe")("API KEY in here");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();

// handlebars middleware
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set static folder
app.use(express.static(`${__dirname}/public`));

// Index route
app.get("/", (req, res) => {
  res.render("index");
});

// Charge route
app.post("/charge", (req, res) => {
  const amount = 2500;

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: "Web-Development Ebook",
        currency: "usd",
        customer: customer.id,
      })
    )
    .then((charge) => res.render("success"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port:${port}`);
});
