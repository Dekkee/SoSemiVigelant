import CrudRepository from './CrudRepository';
import { Auction, IAuctionModel } from './entities/Auction';

export default class AuctionRepository extends CrudRepository<IAuctionModel> {
    constructor () {
        super(Auction);
    }
}