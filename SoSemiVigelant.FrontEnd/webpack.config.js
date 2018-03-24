const select = (env) => {
    switch (env) {
        case 'prod': return require('./config/prod');
        case 'analyze': return require('./config/analyze');
        default: return require('./config/dev');
    }
};

const load = (env) => select(env || 'dev')(__dirname);

module.exports = load;
