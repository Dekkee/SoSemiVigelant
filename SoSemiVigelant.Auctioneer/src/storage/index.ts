import { AuctionEntity } from '../service/entities/Auction';
import { UserEntity } from '../service/entities/User';
import { Auction, AuctionMap, AuctionModel } from './entities/Auction';
import { ICrudRepository, Key } from './entities/CrudRepository';
import * as colors from 'colors';
import AuctionRepository from './entities/AuctionRepository';
import { UserModel, UserMap, User } from './entities/User';
import UserRepository from './entities/UserRepository';
import { Model, Document } from 'mongoose';

export abstract class DataStorage<D extends {[index: string]: any}, E extends {[index: string]: any}> {
    constructor(
        protected readonly repository: ICrudRepository<D, Key>,
        private readonly map: {[index: string]: any},
        private readonly model: Model<D & Document>
    ) {    }

    async syncData(data: (any & {id: Key})[]) {
        console.log(colors.cyan(`Syncing entities: `) + data.length)
        for (const entry of data) {
            await this.repository.get(entry.id) === null
                ? this.repository.put(entry)
                : this.repository.update(entry)
        }
    };

    public async bulkAdd(entrys: E[]) {
        await this.syncData(this.parse(entrys));
    }

    private parse(entrys: E[]): D[]{
        return entrys.map((entry)=> {
            const model: D = {} as D;
            const keys = Object.keys(this.map);
            for (const key of keys) {
                if (this.model.schema.obj[key] === Date) {
                    model[key] = new Date(entry[this.map[key]] * 1000);
                } else {
                    model[key] = entry[this.map[key]];
                }
            }
            return model;
        })
    }
}

export class AuctionsStorage extends DataStorage<AuctionModel, AuctionEntity> {
    constructor() {
        super(new AuctionRepository(), AuctionMap, Auction);
    }


    public async updateDescription(id: Key, description: string) {
        const entity = await this.repository.get(id);
        if (!entity) {
            throw new Error(`Entity ${id} not found`)
        }
        entity.description = description;
        await this.repository.update(entity);
    }
}

export class UsersStorage extends DataStorage<UserModel, UserEntity> {
    constructor() {
        super(new UserRepository(), UserMap, User);
    }
}

