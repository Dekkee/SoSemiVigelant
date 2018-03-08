import { AuctionEntity } from '../service/entities/Auction';
import { UserEntity } from '../service/entities/User';
import { Auction, AuctionMap, AuctionModel } from './entities/Auction';
import { ICrudRepository, Key } from './entities/CrudRepository';
import * as colors from 'colors';
import AuctionRepository from './entities/AuctionRepository';
import { UserModel, UserMap } from './entities/User';
import UserRepository from './entities/UserRepository';

export abstract class DataStorage<D extends {[index: string]: any}, E extends {[index: string]: any}> {
    constructor(private readonly repository: ICrudRepository<D, Key>, private readonly map: {[index: string]: any}) {
    }

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
        return [...entrys].map((entry)=> {
            const model: D = {} as D;
            const keys = Object.keys(entry);
            for (const key of keys) {
                model[this.map[key]] = entry[key];
            }
            return model;
        })
    }
}

export class AuctionsStorage extends DataStorage<AuctionModel, AuctionEntity> {
    constructor() {
        super(new AuctionRepository(), AuctionMap);
    }
}

export class UsersStorage extends DataStorage<UserModel, UserEntity> {
    constructor() {
        super(new UserRepository(), UserMap);
    }
}

