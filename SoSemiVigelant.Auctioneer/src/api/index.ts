import * as express from 'express';
import AuctionRepository from '../entities/AuctionRepository';

export const setup = (app: express.Application) => {
    app.get('/version', (req, resp) => {
        resp.send({ version: require('../../package.json').version });
    });

    app.get('/auctions', async (req, resp) => {
        try {
            const rep = new AuctionRepository();
            resp.send({
                result: await rep.list(req.query),
                count: await rep.count(req.query)
            });
        } catch (e) {
            resp.status(500).send(e.message);
        }
    });

    app.get('/auctions/:id', async (req, resp) => {
        try {
            resp.send(await new AuctionRepository().get(req.params.id));
        } catch (e) {
            resp.status(500).send(e.message);
        }
    });

    app.get('/admin/auctions', async (req, resp) => {
        try {
            resp.send(await new AuctionRepository().list(req.query));
        } catch (e) {
            resp.status(500).send(e.message);
        }
    });

    app.get('/admin/auctions/:id', async (req, resp) => {
        try {
            resp.send(await new AuctionRepository().get(req.params.id));
        } catch (e) {
            resp.status(500).send(e.message);
        }
    });

    app.put('/admin/auctions', async (req, resp) => {
        try {
            resp.send(await new AuctionRepository().put(req.body));
        } catch (e) {
            resp.status(500).send(e.message);
        }
    });

    app.delete('/admin/auctions/:id', async (req, resp) => {
        try {
            resp.send(await new AuctionRepository().delete(req.params.id));
        } catch (e) {
            resp.status(500).send(e.message);
        }
    });
};
