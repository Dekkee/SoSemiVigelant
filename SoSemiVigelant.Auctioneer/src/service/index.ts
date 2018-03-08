import * as amqp from 'amqplib';
import { normalize, schema } from 'normalizr';
import * as colors from 'colors';

import {AuctionsStorage, UsersStorage} from '../storage';

const auctionsStorage = new AuctionsStorage();
const usersStorage = new UsersStorage();

const userSchema = new schema.Entity('users');
const auctionSchema = new schema.Entity('auctions', {
    seller: userSchema
});

const normalizeData = (data: any[]) => {
    return normalize(data, [auctionSchema]);
};

export const connectToRabbit = async (url: string) => {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    const q = 'auctions';

    await channel.assertQueue(q, { durable: false });
    await channel.prefetch(1);
    console.log(colors.cyan('Awaiting for data'));
    await channel.consume(q, async (msg) => {
        if (msg) {
            const content = msg.content.toString();
            try {
                const parsed = normalizeData(JSON.parse(content));
                console.log(colors.cyan('Data received. Count: ') + parsed.result.length);
                await usersStorage.bulkAdd(Object.values(parsed.entities.users));
                await auctionsStorage.bulkAdd(Object.values(parsed.entities.auctions));
                console.log(colors.cyan('Done!'));
            } catch (e) {
                console.log(colors.red(e.message));
            }
            channel.ack(msg);
        }
    });
};