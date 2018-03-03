import { ObjectID } from 'mongodb';

import { db } from './db';
import { Model, Document } from 'mongoose';

export type Key = string | number;

export type Collection = {
    name: string;
}

export default abstract class CrudRepository<T extends Document> implements ICrudRepository<T, Key> {
    constructor (private model: Model<T>) {
    }

    async update (id: any, item: T) {
        const client = await db();
        try {
            await this.model.updateOne({ '_id': new ObjectID(id) }, item);
        } finally {
            client.close();
        }
    }

    async delete (id: Key) {
        const client = await db();
        try {
            await this.model.deleteOne({ '_id': new ObjectID(id) });
        }
        finally {
            client.close();
        }
    }

    async put (item: T) {
        const client = await db();
        try {
            await this.model.create(item);
        }
        finally {
            client.close();
        }
    }

    async get (id: Key): Promise<T | null> {
        const client = await db();
        try {
            return await this.model.findById(id);
        }
        finally {
            client.close();
        }
    }

    async list (query: any = {}): Promise<T[]> {
        const client = await db();
        try {
            return await this.model.find(query);
        }
        finally {
            client.close();
        }
    }
}

export interface ICrudRepository<T, K extends Key> {
    list(query: any): Promise<T[]>;

    get(id: K): Promise<T | null>;

    put(item: T): void;

    delete(id: K): void;

    update(id: K, item: T): void;
}