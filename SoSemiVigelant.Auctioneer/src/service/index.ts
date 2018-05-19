import * as amqp from 'amqplib';
import { normalize, schema } from 'normalizr';
import * as colors from 'colors';

import { AuctionsStorage, UsersStorage } from '../storage';
import { Message } from 'amqplib/properties';
import { rabbitUrl } from '../config';

const auctionsStorage = new AuctionsStorage();
const usersStorage = new UsersStorage();

const userSchema = new schema.Entity('users');
const auctionSchema = new schema.Entity('auctions', {
    seller: userSchema
});

const normalizeData = (data: any[]) => {
    return normalize(data, [auctionSchema]);
};

const exchange = 'topdeck';

export const connectToRabbit = async () => {
    const connection = await amqp.connect(rabbitUrl.toString());
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'topic', { durable: false });
    const listQueue = await channel.assertQueue('', { exclusive: true });
    await channel.prefetch(1);
    await channel.bindQueue(listQueue.queue, exchange, '*.list');
    const descQueue = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(descQueue.queue, exchange, '*.description.response');
    console.log(colors.cyan('Awaiting for data'));
    await channel.consume(listQueue.queue, async (msg) => {
        if (msg) {
            await onListRequest(msg);
            channel.ack(msg);
        }
    });
    await channel.consume(descQueue.queue, async (msg) => {
        if (msg) {
            await onDescriptionRequest(msg);
            channel.ack(msg);
        }
    });
};

const onListRequest = async (msg: Message) => {
    const content = msg.content.toString();
    try {
        const parsed = normalizeData(JSON.parse(content));
        console.log(colors.cyan('List received. Count: ') + parsed.result.length);
        await usersStorage.bulkAdd(Object.values(parsed.entities.users));
        await auctionsStorage.bulkAdd(Object.values(parsed.entities.auctions));
        await auctionsStorage.updateStatuses();
        console.log(colors.cyan('Done!'));
    } catch (e) {
        console.log(colors.red(e.message));
    }
};

const onDescriptionRequest = async (msg: Message) => {
    const content = msg.content.toString();
    try {
        const parsed = (JSON.parse(content));
        console.log(colors.cyan('Description received. Id: ') + parsed.id);
        await auctionsStorage.updateDescription(parsed.id, parsed.description);
        console.log(colors.cyan('Done!'));
    } catch (e) {
        console.log(colors.red(e.message));
    }
};

export const requestDescription = (id: number): Promise<{}> => new Promise((async (resolve, reject) => {
    try {
        const connection = await amqp.connect(rabbitUrl.toString());
        const channel = await connection.createChannel();

        const q = await channel.assertQueue('', { exclusive: true });
        const corr = generateUuid();

        await channel.consume(q.queue, async (msg) => {
            if (msg && msg.properties.correlationId === corr) {
                console.log(colors.cyan('Requesting description for ') + id + colors.cyan(' received'));
                const content = JSON.parse(msg.content.toString());
                await auctionsStorage.updateDescription(id, content.description);
                resolve();
            }
        }, { noAck: true });

        console.log(colors.cyan('Requesting description for: ') + id);
        channel.sendToQueue('description', new Buffer(JSON.stringify({ id })), {
            correlationId: corr,
            replyTo: q.queue
        });
    } catch (e) {
        reject(e);
    }
}));

const generateUuid = () => {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
};