require("dotenv-safe").config();

const express = require("express");

const app = express();

const port = process.env.PORT || 9000;

app.get("/health", (req, res) => {
    res.json({
        message: "App running successfully"
    })
})
app.listen(9000, () => {
    console.log("Server Running on port" + " " + port);
});
