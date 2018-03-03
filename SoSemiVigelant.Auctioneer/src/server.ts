import * as yargs from 'yargs';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as colors from 'colors';
import * as mongoose from 'mongoose';

import { setup } from './api';
import { connectToRabbit } from './service';

const app = express()
    .use(morgan(':method :url -> :status'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDb = process.env.MONGO_DB || 'sosemimongo';

mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${mongoDb}`);

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

const rabbitHost = process.env.RABBIT_HOST || 'localhost';
const rabbitPort = process.env.RABBIT_PORT || '5672';

connectToRabbit(`amqp://${rabbitHost}:${rabbitPort}`);

const args = yargs.option(
    'port', { alias: 'p', default: 8000, type: 'number' }
).argv;
const { port } = args;

console.log(colors.cyan('Starting web server...'));
app.listen(port, function () {
    console.log(colors.cyan(`Auctioneer server is running at http://localhost:${port}`));
});
