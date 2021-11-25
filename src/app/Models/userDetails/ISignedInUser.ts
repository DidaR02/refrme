import { User,UserAccess } from './IUser';

export interface SignedInUser {
    Uid: string;
    User: User;
    UserAccess: UserAccess;
 }
