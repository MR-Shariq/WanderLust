if(process.env.NODE_ENV !== "production"){
require("dotenv").config();
// console.log(process.env.CLOUD_API_SECRET);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 60 * 60,
})

store.on("error", ()=>{
  console.log("session store error");
})

const sessionOptions = {
  store,
  secret :  process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    httpOnly : true,
    expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge : 1000 * 60 * 60 * 24 * 7
  }
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // how to store a user in the session
passport.deserializeUser(User.deserializeUser()); // how to get a user out of the session

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({
     email: "student@gmail.com",
     username: "shariq"
  })
   let registeredUser = await User.register(user,"helloworld"); // this will hash the password and store it in the DB
   res.send(registeredUser);
});


  


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);













// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err,req,res,next)=>{
  let {statusCode = 500, message = "Something went wrong"} = err;
  res.render("error.ejs", {err});
  // res.status(statusCode).send(message);
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});