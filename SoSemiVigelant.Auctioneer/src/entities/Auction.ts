import { Schema, Document, Model, model } from 'mongoose';

export interface IAuctionModel extends Document {
    name: string;
}

export var AuctionSchema: Schema = new Schema({
    name: String,
});

export const Auction: Model<IAuctionModel> = model<IAuctionModel>("auctions", AuctionSchema);