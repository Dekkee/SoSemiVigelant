import * as amqp from 'amqplib';
import * as colors from 'colors';

import { Url } from './utils/url';
import { parse } from './parser';

const rabbitUrl = new Url({
    protocol: 'amqp',
    host: process.env.RABBIT_HOST || 'localhost',
    port: process.env.RABBIT_PORT || '5672',
    user: process.env.RABBIT_USER,
    password: process.env.RABBIT_PASS
});

const load = async() => {
    try {
        console.log(colors.cyan(`Performing topdeck request`));
        const aucs: any = await parse();
        console.log(colors.cyan('Auctions received. Count: ' + aucs.length));

        console.log(colors.cyan(`Putting into rabbit`));
        const connection = await amqp.connect(rabbitUrl.toString());
        const channel = await connection.createChannel();

        const q = 'auctions';

        await channel.assertQueue(q, { durable: false });
        await channel.sendToQueue(q, new Buffer(JSON.stringify(aucs)), { persistent: true });
        console.log(colors.cyan(`Done`));
    }
    catch (e) {
        console.log(colors.red(`Error!: ${e.message}`));
    }
};

load();

setInterval(load, 60 * 1000);