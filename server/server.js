const express = require('express');
const app = express();
const bodyParser = require('body-parser')
require("dotenv").config();
const path = require('path')

const PORT = process.env.PORT_APP
const SECRET = process.env.SECRET

//Middlewares chain
app.use('/static', express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.json());

const gameGenreRoute = require('./routes/gameGenreRoute');
app.use("/gameGenres", gameGenreRoute);

app.use(({res}) => {
    const message = 'Resource not found'
    res.status(404).json({message})
})


const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.get('/api', (req, res) => {
    res.send({"fruits": ["apple", "banana", "cherry"]});
});


app.listen(8080, () => {
    console.log('Server running on port 8080');
});