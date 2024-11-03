const express = require('express');
const app = express();
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