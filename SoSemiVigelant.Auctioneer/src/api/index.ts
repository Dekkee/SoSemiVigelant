import * as express from 'express';
import AuctionRepository from '../AuctionRepository';

export const setup = (app: express.Application) => {
    app.use('/version', (req, resp) => {
        resp.send({ version: require('../../package.json').version });
    });

    app.get('/mongo', async (req, resp) => {
        try {
            resp.send(await new AuctionRepository().list());
        } catch (e) {
            resp.status(500).send(e.message);
        }
    });

    app.get('/mongo/:id', async (req, resp) => {
        try {
            resp.send(await new AuctionRepository().get(req.params.id));
        } catch (e) {
            resp.status(500).send(e.message);
        }
    });

    app.put('/mongo', async (req, resp) => {
        try {
            resp.send(await new AuctionRepository().put(req.body));
        } catch (e) {
            resp.status(500).send(e.message);
        }
    });

    app.delete('/mongo/:id', async (req, resp) => {
        try {
            resp.send(await new AuctionRepository().delete(req.params.id));
        } catch (e) {
            resp.status(500).send(e.message);
        }
    });
};
