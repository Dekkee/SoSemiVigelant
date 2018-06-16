import * as yargs from 'yargs';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as colors from 'colors';
import * as mongoose from 'mongoose';
import * as cors from 'cors';

import { setup } from './api';
import { connectToRabbit } from './service';
import { mongoUrl } from './config';

const app = express()
    .use(morgan(':method :url -> :status'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

const nodeEnv = process.env.NODE_ENV;

if (nodeEnv !== 'produnction') {
    app.use(cors());
}

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

const tryConnectToRabbit = () => connectToRabbit()
    .catch((error) => {
        console.error(`RabbitMQ: Failed to connect: ${error}`)
        setTimeout(() => {
            console.info('reconnecting to rabbit...');
            tryConnectToRabbit();
        }, 1000);
    });

tryConnectToRabbit();

const args = yargs.option(
    'port', { alias: 'p', default: 8000, type: 'number' }
).argv;
const { port } = args;

console.log(colors.cyan('Starting web server...'));
app.listen(port, function () {
    console.log(colors.cyan(`Auctioneer server is running at http://localhost:${port}`));
});
