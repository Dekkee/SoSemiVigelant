import { ObjectID } from 'mongodb';

import { Model, Document } from 'mongoose';
import * as colors from 'colors';
import * as _ from 'lodash';

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

    async get (id: Key): Promise<T | null> {
        try {
            return await this.model.findOne({ id: id });
        } catch (e) {
            console.error(colors.red(e.message));
            throw e;
        }
    }

    async list (query: any = {}): Promise<T[]> {
        try {
            let docQuery = this.model.find();
            if (query.take) {
                docQuery = docQuery.limit(parseInt(query.take));
            }
            if (query.skip) {
                docQuery = docQuery.skip(parseInt(query.skip));
            }
            if (query.order) {
                docQuery = docQuery.sort([[query.order, query.asc === 'asc' ? 'ascending' : 'descending']]);
            }
            return await docQuery.exec();
        } catch (e) {
            console.error(colors.red(e.message));
            throw e;
        }
    }

    async count (query: any = {}): Promise<number> {
        try {
            return await this.model.count(_.omit(query, ['take', 'skip', 'order', 'asc']));
        } catch (e) {
            console.error(colors.red(e.message));
            throw e;
        }
    }
}

export interface ICrudRepository<T, K extends Key> {
    list(query: any): Promise<T[]>;

    get(id: K): Promise<T | null>;

    put(item: T): void;

    delete(id: K): void;

    update(item: T): void;
}