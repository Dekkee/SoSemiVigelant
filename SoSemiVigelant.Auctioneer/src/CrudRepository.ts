import { ObjectID } from 'mongodb';

import { Model, Document } from 'mongoose';
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
            return await this.model.find(query);
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