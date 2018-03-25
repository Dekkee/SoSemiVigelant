const express = require('express');
const compression = require('compression');

'use strict';

// Constants
const PORT = 8080;

// App
const app = express();
app.use(compression({ threshold: 0 }));
app.use(express.static('public'));

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
