require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookiParser = require("cookie-parser");
const cors = require("cors");

//my routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");


const app = express()

//port
const port = process.env.PORT || 5000

//db connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
        .then(() => console.log("db connected"))
        .catch((error) => console.log(error))

//middlewares
app.use(bodyParser.json());
app.use(cookiParser());
app.use(cors());

//routes
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", productRoutes)



app.listen(port, () => {
    console.log("port is running on port 5000")
})