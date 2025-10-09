const express = require("express");
const moragan = require("morgan");

const hostname = "localhost";
const port = 3000;

const app = express();
app.use(moragan("dev"));

app.use(express.static(__dirname + "/public"));

app.use((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(`<html><body><h1>This is an Express server</h1></body></html>`);
});
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
