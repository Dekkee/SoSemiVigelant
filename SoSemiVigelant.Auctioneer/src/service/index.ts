import * as amqp from 'amqplib';
import { normalize, schema } from 'normalizr';
import * as colors from 'colors';

import AuctionRepository from '../entities/AuctionRepository';
import { ICrudRepository, Key } from '../entities/CrudRepository';
import UserRepository from '../entities/UserRepository';

const userSchema = new schema.Entity('users');
const auctionSchema = new schema.Entity('auctions', {
    seller: userSchema
});

const normalizeData = (data: any[]) => {
    return normalize(data, [auctionSchema]);
};

const syncData = async <T>(repository: ICrudRepository<T, Key>, data: Record<string, (any & {id: Key})>) => {
    const keys = Object.keys(data);
    console.log(colors.cyan(`Syncing entities: `) + keys.length)
    for (const key of keys) {
        await repository.get(data[key].id) === null
            ? repository.put(data[key])
            : repository.update(data[key])
    }
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
                await syncData(new UserRepository(), parsed.entities.users);
                await syncData(new AuctionRepository(), parsed.entities.auctions);
                console.log(colors.cyan('Done!'));
            } catch (e) {
                console.log(colors.red(e.message));
            }
            channel.ack(msg);
        }
    });
};