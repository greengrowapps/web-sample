import { BaseEntity } from './../../shared';

export class Item implements BaseEntity {
    constructor(
        public id?: number,
        public quantity?: number,
        public productName?: string,
        public productId?: number,
    ) {
    }
}
