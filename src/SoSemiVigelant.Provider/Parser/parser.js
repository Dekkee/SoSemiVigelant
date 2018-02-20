const request = require('request'),
    cheerio = require('cheerio'),
    requirejs = require('./libs/require.min'),
    localStorage = require("localstorage-ponyfill").createLocalStorage({ mode: "node" });

localStorage.setItem("toptrade:auctions:compact", {});

global.localStorage = localStorage;

const url = 'https://topdeck.ru/apps/toptrade/auctions';

module.exports = function (callback) {
    require("jsdom").env('', function (err, window) {
        if (err) {
            console.error(err);
            return;
        }
        requirejs.define('jquery', [], () => require("jquery")(window))
        requirejs.define('knockout', [], () => ({
            applyBindings: (AucVM) => callback(null, AucVM.aucs),
            observable: (a) => {
                const b = () => true;
                b.subscribe = () => {
                };
                return b;
            },
            computed: (f) => { }
        }));

        global.topdeck = {
            requirejs: requirejs,
            require: requirejs,
            define: requirejs.define
        };

        request({ uri: url, method: 'GET', encoding: 'binary' },
            function (err, res, page) {
                var cheer = cheerio.load(page);
                const scripts = cheer('script');
                for (let index in scripts) {
                    if (scripts[index].children &&
                        scripts[index].children.length &&
                        scripts[index].children[0] &&
                        scripts[index].children[0].data.indexOf('topdeck.require([\'jquery\', \'knockout\'],') !== -1) {
                        try {
                            eval(scripts[index].children[0].data);
                        } catch (e) {

                        }
                    }
                }
            }
        );
    });
};
