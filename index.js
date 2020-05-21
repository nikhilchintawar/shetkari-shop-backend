require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookiParser = require("cookie-parser");
const cors = require("cors");


const app = express()

//db connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
        .then(() => console.log("db connected"))
        .catch((error) => console.log(error))

//middlewares
app.use(bodyParser.json());
app.use(cookiParser());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        "user": "nikhil"
    })
})

app.listen(3000, () => {
    console.log("port is running on port 3000")
})