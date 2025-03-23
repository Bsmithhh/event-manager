const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'apikey']
}));

app.use(express.static('.'));

const port = 3000;

// For development, we'll use HTTP
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 