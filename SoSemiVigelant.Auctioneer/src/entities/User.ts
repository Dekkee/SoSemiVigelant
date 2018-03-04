import { Schema, Document, Model, model } from 'mongoose';

export interface UserModel extends Document {
    id: number;
    name: string;
    city: string;
    refs: number;
}

export var UserSchema: Schema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: String,
    city: String,
    refs: Number
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

export const User: Model<UserModel> = model<UserModel>('users', UserSchema);