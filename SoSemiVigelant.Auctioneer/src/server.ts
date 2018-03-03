import * as yargs from 'yargs';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as colors from 'colors';
import * as mongoose from 'mongoose';

import { setup } from './api';

const app = express()
    .use(morgan(':method :url -> :status'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/sosemimongo');

setup(app);

app.get('/', function (req, resp) {
    resp.status(404).send({ message: 'OK' });
});
app.get('*', function (req, resp) {
    resp.status(404).send({
        message: 'NOT_FOUND',
        method: req.method,
        url: req.url
    });
});

const args = yargs.option(
    'port', { alias: 'p', default: 8000, type: 'number' }
).argv;
const { port } = args;

console.log(colors.cyan('Starting web server...'));
app.listen(port, function () {
    console.log(colors.cyan(`Auctioneer server is running at http://localhost:${port}`));
});
