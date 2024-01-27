const express = require("express")
const path = require("path")

const app = express.Router();

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "../", "html", "auth", "login.html"))
})

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "../", "html", "auth", "register.html"))
})

module.exports = app;