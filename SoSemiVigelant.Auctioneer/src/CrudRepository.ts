import { ObjectID } from 'mongodb';

import { Model, Document } from 'mongoose';

export type Key = string | number;

export default abstract class CrudRepository<T extends Document> implements ICrudRepository<T, Key> {
    constructor (private model: Model<T>) {
    }

    async update (id: any, item: T) {
        await this.model.updateOne({ '_id': new ObjectID(id) }, item);
    }

    async delete (id: Key) {
        await this.model.deleteOne({ '_id': new ObjectID(id) });
    }

    async put (item: T) {
        await this.model.create(item);
    }

    async get (id: Key): Promise<T | null> {
        return await this.model.findById(id);
    }

    async list (query: any = {}): Promise<T[]> {
        return await this.model.find(query);
    }
}

export interface ICrudRepository<T, K extends Key> {
    list(query: any): Promise<T[]>;

    get(id: K): Promise<T | null>;

    put(item: T): void;

    delete(id: K): void;

    update(id: K, item: T): void;
}