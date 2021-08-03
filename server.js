const express = require("express");
const logger = require("morgan");
const process_message = require("./utils").process_message;

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

//Server to handle updates received from telegram's webhook
app.post("/update", (req, res, next) => {
    const data = req.body;
    console.log(data)
    process_message(data);
    res.status(200).json({
        success: true
    });
});

app.listen(80, () => {
    console.log("Server running");
})