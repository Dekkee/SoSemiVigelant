import { Schema, Document, Model, model, Types } from 'mongoose';
import { User } from './User';

export interface AuctionModel {
    [index: string]: any;

    id: number;
    name: string;
    estimated: Date;
    image: string;
    startBid: number;
    currentBid: number;
    bidAmount: number;
    shippingInfoShort: string;
    shippingInfo: string;
    binValue: number;
    published: Date;
    thumbIsGeneric: boolean;
    withPost: boolean;
    city: string;
    sellerIp: string;
    seller: number;
    description: string;
    isActive: boolean;
}

export const AuctionSchema: Schema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: String,
    estimated: Date,
    image: String,
    startBid: Number,
    currentBid: Number,
    bidAmount: Number,
    shippingInfoShort: String,
    shippingInfo: String,
    binValue: Number,
    published: Date,
    thumbIsGeneric: Boolean,
    withPost: Boolean,
    city: String,
    sellerIp: String,
    seller: { type: Schema.Types.ObjectId, ref: 'users' },
    description: String,
    isActive: { type: Boolean, default: true }
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

export const Auction: Model<AuctionModel & Document> = model<AuctionModel & Document>('auctions', AuctionSchema);

export const AuctionMap: Record<keyof AuctionModel, string | { model: Model<Document>, path: string, key: string }> = {
    id: 'id',
    name: 'lot',
    estimated: 'date_estimated',
    image: 'image',
    startBid: 'start_bid',
    currentBid: 'current_bid',
    bidAmount: 'bid_amount',
    shippingInfoShort: 'shipping_info_quick',
    shippingInfo: 'shipping_info',
    binValue: 'bin_value',
    published: 'date_published',
    thumbIsGeneric: 'thumb_is_generic',
    withPost: 'with_post',
    city: 'city',
    sellerIp: 'seller_ip',
    seller: { model: User, path: 'id', key: 'seller' }
};
