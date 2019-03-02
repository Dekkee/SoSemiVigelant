import { ObjectID } from 'mongodb';

import { Document, Model } from 'mongoose';
import * as colors from 'colors';

export type Key = string | number;

export default abstract class CrudRepository<T extends Document> implements ICrudRepository<T, Key> {
    constructor (private model: Model<T>) {
    }

    async update (item: T) {
        try {
            await this.model.update({ id: item.id }, item);
        } catch (e) {
            console.error(colors.red(e.message));
        }
    }

    async delete (id: Key) {
        try {
            await this.model.deleteOne({ '_id': new ObjectID(id) });
        } catch (e) {
            console.error(colors.red(e.message));
        }
    }

    async put (item: T) {
        try {
            await this.model.create(item);
        } catch (e) {
            console.error(colors.red(e.message));
        }
    }

    async get (id: Key, populate?: string): Promise<T | null> {
        try {
            let query = this.model.findOne({ id: id });
            if (populate) {
                query = query.populate(populate);
            }
            return await query.exec();
        } catch (e) {
            console.error(colors.red(e.message));
            throw e;
        }
    }

    async list (query: any = {}, populate?: string): Promise<T[]> {
        try {
            let docQuery = this.model.find();
            if (populate) {
                docQuery = docQuery.populate(populate);
            }
            if (query.take) {
                docQuery = docQuery.limit(parseInt(query.take));
            }
            if (query.skip) {
                docQuery = docQuery.skip(parseInt(query.skip));
            }
            if (query.order) {
                docQuery = docQuery.sort([[query.order, Boolean(query.asc) ? 'ascending' : 'descending']]);
            }
            if (query.name) {
                docQuery = docQuery.find({ 'name': { '$regex': query.name, '$options': 'i' } });
            }
            if (query.isActive) {
                docQuery = docQuery.find({ 'isActive': query.isActive });
            }
            return await docQuery.exec();
        } catch (e) {
            console.error(colors.red(e.message));
            throw e;
        }
    }

    async count (query: any = {}): Promise<number> {
        try {
            let docQuery = this.model.find();
            if (query.name) {
                docQuery = docQuery.find({ 'name': { '$regex': query.name, '$options': 'i' } });
            }
            if ('isActive' in query) {
                docQuery = docQuery.find({ 'isActive': query.isActive });
            }
            return await docQuery.count();
        } catch (e) {
            console.error(colors.red(e.message));
            throw e;
        }
    }
}

export interface ICrudRepository<T, K extends Key> {
    list (query: any): Promise<T[]>;

    get (id: K): Promise<T | null>;

    put (item: T): void;

    delete (id: K): void;

    update (item: T): void;
}
