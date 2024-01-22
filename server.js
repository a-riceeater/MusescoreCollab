require("dotenv").config()
const express = require("express");
const path = require("path")

const app = express();

app.use(express.static(path.join(__dirname, "static")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "index.html"))
})

app.listen(3005, () => {
    console.log("Listening at http://localhost:3005")
})

// Add file uploads
// Encrypt & decrypt files
// Socket.io or refresh to see new changes to files
// Optional commit messages to updated files
// In app with electron it can watch the file selected and then upload to db
// Other users can manually download the file and edit, then when that file is saved upload etc
// Location of file is where redonwloaded will be updated - origial user would just replace cloud scores file
// create backup of original file in case of corrpution/accidental changes