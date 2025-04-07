const express = require("express");

const app = express();

app.get("/health", (req, res) => {
    res.json({
        message: "App running successfully"
    })
})
app.listen(9000, () => {
    console.log("Server Running");
});
