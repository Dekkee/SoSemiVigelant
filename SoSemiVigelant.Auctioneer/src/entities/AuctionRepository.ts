import CrudRepository from './CrudRepository';
import { Auction, AuctionModel } from './Auction';

export default class AuctionRepository extends CrudRepository<AuctionModel> {
    constructor () {
        super(Auction);
    }
}