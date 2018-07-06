import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { FirebaseTokenComponent } from './firebase-token.component';
import { FirebaseTokenDetailComponent } from './firebase-token-detail.component';
import { FirebaseTokenPopupComponent } from './firebase-token-dialog.component';
import { FirebaseTokenDeletePopupComponent } from './firebase-token-delete-dialog.component';

export const firebaseTokenRoute: Routes = [
    {
        path: 'firebase-token',
        component: FirebaseTokenComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'shoppinglistApp.firebaseToken.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'firebase-token/:id',
        component: FirebaseTokenDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'shoppinglistApp.firebaseToken.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const firebaseTokenPopupRoute: Routes = [
    {
        path: 'firebase-token-new',
        component: FirebaseTokenPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'shoppinglistApp.firebaseToken.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'firebase-token/:id/edit',
        component: FirebaseTokenPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'shoppinglistApp.firebaseToken.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'firebase-token/:id/delete',
        component: FirebaseTokenDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'shoppinglistApp.firebaseToken.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
