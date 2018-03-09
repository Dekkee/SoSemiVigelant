import { URL } from 'url';

export const url = new URL('amqp://localhost:5672');
url.host = process.env.RABBIT_HOST || 'localhost';
url.port = process.env.RABBIT_PORT || '5672';
url.username = process.env.RABBIT_USER || '';
url.password = process.env.RABBIT_PASS || '';
console.log(url.toString());