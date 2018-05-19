import { AuctionEntity } from '../service/entities/Auction';
import { UserEntity } from '../service/entities/User';
import { Auction, AuctionMap, AuctionModel } from './entities/Auction';
import { ICrudRepository, Key } from './entities/CrudRepository';
import * as colors from 'colors';
import AuctionRepository from './entities/AuctionRepository';
import { UserModel, UserMap, User } from './entities/User';
import UserRepository from './entities/UserRepository';
import { Model, Document } from 'mongoose';

export abstract class DataStorage<D extends { [index: string]: any }, E extends { [index: string]: any }> {
    protected constructor (
        protected readonly repository: ICrudRepository<D, Key>,
        private readonly map: { [index: string]: any },
        protected readonly model: Model<D & Document>
    ) { }

    async syncData (data: (any & { id: Key })[]) {
        console.log(colors.cyan(`Syncing entities: `) + data.length);
        for (const entry of data) {
            await this.repository.get(entry.id) === null
                ? this.repository.put(entry)
                : this.repository.update(entry)
        }
    };

    public async bulkAdd (entrys: E[]) {
        await this.syncData(await this.parse(entrys));
    }

    private async parse (entrys: E[]): Promise<D[]> {
        return Promise.all(entrys.map(async (entry) => {
            const model: D = {} as D;
            const keys = Object.keys(this.map);
            for (const key of keys) {
                if (this.model.schema.obj[key] === Date) {
                    model[key] = new Date(entry[this.map[key]] * 1000);
                } else if (typeof this.map[key] === 'object') {
                    const rule = this.map[key];
                    const query = { [rule.path]: entry[rule.key] };
                    const object = await rule.model.findOne(query).exec();
                    model[key] = object._id;
                } else {
                    model[key] = entry[this.map[key]];
                }
            }
            return model;
        }));
    }
}

export class AuctionsStorage extends DataStorage<AuctionModel, AuctionEntity> {
    constructor () {
        super(new AuctionRepository(), AuctionMap, Auction);
    }


    public async updateDescription (id: Key, description: string) {
        const entity = await this.repository.get(id);
        if (!entity) {
            throw new Error(`Entity ${id} not found`)
        }
        entity.description = description;
        await this.repository.update(entity);
    }

    public async updateStatuses () {
        try {
            const now = new Date();
            console.log(colors.cyan(`updating statuses at ${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`));
            await this.model.update(
                { estimated: { $lt: now} },
                { isActive: false },
                { multi: true });
        } catch (e) {
            console.error(`updateStatuses failed: ${e}`);
        }
    }
}

export class UsersStorage extends DataStorage<UserModel, UserEntity> {
    constructor () {
        super(new UserRepository(), UserMap, User);
    }
}
