import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ShoppinglistProductModule } from './product/product.module';
import { ShoppinglistItemModule } from './item/item.module';
import { ShoppinglistFirebaseTokenModule } from './firebase-token/firebase-token.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        ShoppinglistProductModule,
        ShoppinglistItemModule,
        ShoppinglistFirebaseTokenModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShoppinglistEntityModule {}
