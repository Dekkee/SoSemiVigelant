import * as amqp from 'amqplib';
import * as colors from 'colors';

import { list } from './list';
import { url } from './config';
import { description } from './description';

const exchange = 'topdeck';

const load = async() => {
    try {
        console.log(colors.cyan(`Performing topdeck request`));
        const aucs: any = await list();
        console.log(colors.cyan('Auctions received. Count: ') + aucs.length);

        console.log(colors.cyan(`Putting into rabbit`));
        const connection = await amqp.connect(url.toString());
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'topic', { durable: false });
        channel.publish(exchange, 'auctions.list', new Buffer(JSON.stringify(aucs)), { persistent: true });
        console.log(colors.cyan(`Done`));
    }
    catch (e) {
        console.log(colors.red(`Error!: ${e.message}`));
    }
};

load();

setInterval(load, 60 * 1000);

const listen = async() => {
    try {
        console.log(colors.cyan(`Listening for descriptions`));
        const connection = await amqp.connect(url.toString());
        const channel = await connection.createChannel();

        const q = await channel.assertQueue('description', {durable: false});
        await channel.prefetch(1);
        await channel.consume(q.queue, async (msg) => {
            if (msg) {
                const { id } = JSON.parse(msg.content.toString());
                console.log(colors.cyan(`Request description for ${id}`));
                const data = {
                    id,
                    description: await description(id)
                };
                console.log(colors.cyan(`Description received: `) + data.description);
                channel.sendToQueue(
                    msg.properties.replyTo,
                    new Buffer(JSON.stringify(data)),
                    {correlationId: msg.properties.correlationId});
                console.log(colors.cyan(`Done`));
                channel.ack(msg);
            }
        });
    }
    catch (e) {
        console.log(colors.red(`Error!: ${e.message}`));
    }
};

listen();