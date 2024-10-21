const express = require('express');
const connectDb=require("mongodb://localhost:27017/");
const errorHandler=require();
const cors=require("cors");

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
