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

    async syncData(data: Record<string, (any & {id: Key})>) {
        const keys = Object.keys(data);
        console.log(colors.cyan(`Syncing entities: `) + keys.length)
        for (const key of keys) {
            await this.repository.get(data[key].id) === null
                ? this.repository.put(data[key])
                : this.repository.update(data[key])
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

