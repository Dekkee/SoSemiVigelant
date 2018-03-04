import * as yargs from 'yargs';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as colors from 'colors';
import * as mongoose from 'mongoose';

import { setup } from './api';
import { connectToRabbit } from './service';
import { Url } from './utils/url';

const app = express()
    .use(morgan(':method :url -> :status'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

const mongoUrl = new Url({
    protocol: 'mongodb',
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || '27017',
    path: process.env.MONGO_DB || 'sosemimongo',
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
});

mongoose.connect(mongoUrl.toString());

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

const rabbitUrl = new Url({
    protocol: 'amqp',
    host: process.env.RABBIT_HOST || 'localhost',
    port: process.env.RABBIT_PORT || '5672',
    user: process.env.RABBIT_USER,
    password: process.env.RABBIT_PASS
});

connectToRabbit(rabbitUrl.toString());

const args = yargs.option(
    'port', { alias: 'p', default: 8000, type: 'number' }
).argv;
const { port } = args;

console.log(colors.cyan('Starting web server...'));
app.listen(port, function () {
    console.log(colors.cyan(`Auctioneer server is running at http://localhost:${port}`));
});
