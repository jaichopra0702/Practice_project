const express = require('express');
const connectDb = require("./config/dbConnection.js");
const errorHandler = require("./middlewares/errorHandler.js");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

connectDb();
const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')); // Ensure this points to the right directory

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Working');
});

app.get('/home', (req, res) => {
    res.render("home", {
        username: "Jai",
        posts: "flana dimkana"
    });
});

app.get('/allusers', (req, res) => {
    console.log("All users route hit"); // Check if this message appears in your console
    const users = [
        { name: "Jai", age: 19 },
        { name: "Ananthu", age: 22 }
    ];
    console.log(users); // Log the users array
    res.render("home", { users });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
