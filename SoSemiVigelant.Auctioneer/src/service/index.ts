import * as amqp from 'amqplib';
import AuctionRepository from '../AuctionRepository';
import * as colors from 'colors';

export const connectToRabbit = async (url: string) => {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    const q = 'auctions';

    await channel.assertQueue(q, { durable: false });
    await channel.prefetch(1);
    console.log(colors.cyan(' [x] Awaiting RPC requests'));
    await channel.consume(q, async (msg) => {
        if (msg) {
            const content = msg.content.toString();
            console.log(colors.cyan(' [x] Message received: ') + content);
            try {
                const auctions = JSON.parse(content);
                const rep = new AuctionRepository();
                for (const auction of auctions) {
                    await rep.get(auction.id) === null
                        ? rep.put(auction as any)
                        : rep.update(auction as any)
                }
            } catch (e) {
                console.log(colors.red(e.message));
            }
            channel.ack(msg);
        }
    });
};
