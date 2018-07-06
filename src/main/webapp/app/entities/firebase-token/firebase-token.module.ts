import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ShoppinglistSharedModule } from '../../shared';
import { ShoppinglistAdminModule } from '../../admin/admin.module';
import {
    FirebaseTokenService,
    FirebaseTokenPopupService,
    FirebaseTokenComponent,
    FirebaseTokenDetailComponent,
    FirebaseTokenDialogComponent,
    FirebaseTokenPopupComponent,
    FirebaseTokenDeletePopupComponent,
    FirebaseTokenDeleteDialogComponent,
    firebaseTokenRoute,
    firebaseTokenPopupRoute,
} from './';

const ENTITY_STATES = [
    ...firebaseTokenRoute,
    ...firebaseTokenPopupRoute,
];

@NgModule({
    imports: [
        ShoppinglistSharedModule,
        ShoppinglistAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        FirebaseTokenComponent,
        FirebaseTokenDetailComponent,
        FirebaseTokenDialogComponent,
        FirebaseTokenDeleteDialogComponent,
        FirebaseTokenPopupComponent,
        FirebaseTokenDeletePopupComponent,
    ],
    entryComponents: [
        FirebaseTokenComponent,
        FirebaseTokenDialogComponent,
        FirebaseTokenPopupComponent,
        FirebaseTokenDeleteDialogComponent,
        FirebaseTokenDeletePopupComponent,
    ],
    providers: [
        FirebaseTokenService,
        FirebaseTokenPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShoppinglistFirebaseTokenModule {}
