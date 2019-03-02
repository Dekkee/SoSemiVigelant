import { request } from 'https';
import * as cheerio from 'cheerio';

export const description = (id: number): Promise<{}> => {
    return new Promise((resolve, reject) => {
        const req = request({
                hostname: 'topdeck.ru',
                path: `/apps/toptrade/auctions/${id}`,
                method: 'GET',
                ecdhCurve: 'secp384r1'
            },
            (res: any) => {
                const data: any[] = [];
                res.on('data', (chunk: any) => data.push(chunk));
                res.on('end', () => {
                    const page = Buffer.concat(data);
                    const cheer = cheerio.load(page.toString(), { decodeEntities: false });

                    const html = cheer('.row .col-xs-12').html();
                    if (!html) {
                        reject(`Failed to load description for ${html}: element wasn't found on page`);
                        return;
                    }
                    resolve(html.trim());
                });
            }
        );
        req.on('error', e => console.error(e));
        req.end();
    });
};

