require('dotenv').config();
const express = require('express');
const connectDB = require('./dbConfig');
const getRouter = require('./routes');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/', getRouter);

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.get('/', (req, res) => {
    res.send('Hi, this is my first page...');
});

app.use((req, res) => {
    res.status(404).send('404 Not Found...');
});

const starter = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log(error.message);
    }
};

starter();
