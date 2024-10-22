const express = require('express');
const connectDb = require("./config/dbConnection.js");
const errorHandler = require("./middlewares/errorHandler.js");
const cors=require("cors");

const dotenv=require("dotenv");
dotenv.config();

connectDb();
const app = express();
const PORT =process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Working');
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
