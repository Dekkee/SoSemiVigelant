import CrudRepository from './CrudRepository';
import { Auction, AuctionModel } from './Auction';
import { Document } from 'mongoose';

export default class AuctionRepository extends CrudRepository<AuctionModel & Document> {
    constructor () {
        super(Auction);
    }
}