import { EntityRepository } from '@mikro-orm/sqlite';
import { User } from '../entities/User.js';

export class UserRepository extends EntityRepository<User> {

}
