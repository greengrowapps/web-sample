import { BaseEntity } from './../../shared';

export class FirebaseToken implements BaseEntity {
    constructor(
        public id?: number,
        public token?: string,
        public lastUpdate?: any,
        public userLogin?: string,
        public userId?: number,
    ) {
    }
}
