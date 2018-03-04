const requirejs = require('requirejs');

import * as request from 'request';
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
        require('jsdom').env('', (err: any, window: any) => {
            if (err) {
                reject(err);
                return;
            }
            requirejs.define('jquery', [], () => require('jquery')(window))
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

            request({ uri: url, method: 'GET', encoding: 'binary' },
                function (err, res, page) {
                    const cheer = cheerio.load(page);
                    const scripts = cheer('script');
                    for (let index in scripts) {
                        if (scripts[index].children &&
                            scripts[index].children.length &&
                            scripts[index].children[0] &&
                            // todo: чёт хардкод
                            scripts[index].children[0].data!.indexOf('topdeck.require([\'jquery\', \'knockout\'],') !== -1) {
                            try {
                                eval(scripts[index].children[0].data!);
                            } catch (e) {

                            }
                        }
                    }
                }
            );
        });
    });
};
