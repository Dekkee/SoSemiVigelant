const requirejs = require('requirejs'),
    jsdom = { ...require('jsdom') },
    jquery = require('jquery');

import { request } from 'https';
import * as cheerio from 'cheerio';

const localStorage = {
    setItem: () => {
    },
    getItem: () => true
};

(global as any).localStorage = localStorage;

const url = 'https://topdeck.ru/apps/toptrade/auctions';

export const parse = (): Promise<{}> => {
    return new Promise((resolve, reject) => {
        jsdom.env('', (err: any, window: any) => {
            if (err) {
                reject(err);
                return;
            }
            requirejs.define('jquery', [], () => jquery(window));
            requirejs.undef('knockout');
            requirejs.define('knockout', [], () => ({
                applyBindings: (AucVM: any) => resolve(AucVM.aucs),
                observable: (a: any) => {
                    const b = () => true;
                    (b as any).subscribe = () => {
                    };
                    return b;
                },
                computed: (f: any) => {
                }
            }));

            (global as any).topdeck = {
                requirejs: requirejs,
                require: requirejs,
                define: requirejs.define
            };

            const req = request({
                    hostname: 'topdeck.ru',
                    path: '/apps/toptrade/auctions',
                    method: 'GET',
                    ecdhCurve: 'secp384r1'
                },
                (res: any) => {
                    const data: any[] = [];
                    res.on('data', (chunk: any) => data.push(chunk));
                    res.on('end', () => {
                        const page = Buffer.concat(data);;
                        const cheer = cheerio.load(page.toString());
                        const scripts = cheer('script');
                        for (let index in scripts) {
                            if (scripts[index].children &&
                                scripts[index].children.length &&
                                scripts[index].children[0] &&
                                scripts[index].children[0].data &&
                                // todo: чёт хардкод
                                scripts[index].children[0].data!.indexOf('topdeck.require([\'jquery\', \'knockout\'],') !== -1) {
                                try {
                                    eval(scripts[index].children[0].data!);
                                } catch (e) {
                                }
                            }
                        }
                    });
                }
            );
            req.on('error', e => console.error(e));
            req.end();
        });
    });
};
