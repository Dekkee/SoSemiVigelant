import CrudRepository from './CrudRepository';
import { User, UserModel } from './User';

export default class UserRepository extends CrudRepository<UserModel> {
    constructor () {
        super(User);
    }
}