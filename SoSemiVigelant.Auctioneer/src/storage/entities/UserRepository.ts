import CrudRepository from './CrudRepository';
import { User, UserModel } from './User';
import { Document } from 'mongoose';

export default class UserRepository extends CrudRepository<UserModel & Document> {
    constructor () {
        super(User);
    }
}