import { URL } from 'url';

export const mongoUrl = new URL('mongodb://localhost:27017/sosemimongo');

mongoUrl.host = process.env.MONGO_HOST || 'localhost';
mongoUrl.port = process.env.MONGO_PORT || '27017';
mongoUrl.pathname = process.env.MONGO_DB || 'sosemimongo';
mongoUrl.username = process.env.MONGO_USER || '';
mongoUrl.password = process.env.MONGO_PASS || '';
console.log(mongoUrl.toString());

export const rabbitUrl = new URL('amqp://localhost:5672');
rabbitUrl.host = process.env.RABBIT_HOST || 'localhost';
rabbitUrl.port = process.env.RABBIT_PORT || '5672';
rabbitUrl.username = process.env.RABBIT_USER || '';
rabbitUrl.password = process.env.RABBIT_PASS || '';
console.log(rabbitUrl.toString());
