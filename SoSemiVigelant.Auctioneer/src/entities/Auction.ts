import { Schema, Document, Model, model } from 'mongoose';

export interface AuctionModel extends Document {
    id: number;
    lot: string;
    date_estimated: Date;
    image: string;
    start_bid: number;
    current_bid: number;
    bid_amount: number;
    shipping_info_quick: string;
    shipping_info: string;
    bin_value: number;
    date_published: Date;
    thumb_is_generic: boolean;
    with_post: boolean;
    city: string;
    seller_ip: string;
    seller: string;
}

export var AuctionSchema: Schema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    lot: String,
    date_estimated: Date,
    image: String,
    start_bid: Number,
    current_bid: Number,
    bid_amount: Number,
    shipping_info_quick: String,
    shipping_info: String,
    bin_value: Number,
    date_published: Date,
    thumb_is_generic: Boolean,
    with_post: Boolean,
    city: String,
    seller_ip: String,
    seller: String
}, {
    toObject: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const Auction: Model<AuctionModel> = model<AuctionModel>('auctions', AuctionSchema);