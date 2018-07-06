import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { FirebaseToken } from './firebase-token.model';
import { FirebaseTokenService } from './firebase-token.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-firebase-token',
    templateUrl: './firebase-token.component.html'
})
export class FirebaseTokenComponent implements OnInit, OnDestroy {
firebaseTokens: FirebaseToken[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private firebaseTokenService: FirebaseTokenService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.firebaseTokenService.query().subscribe(
            (res: HttpResponse<FirebaseToken[]>) => {
                this.firebaseTokens = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInFirebaseTokens();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: FirebaseToken) {
        return item.id;
    }
    registerChangeInFirebaseTokens() {
        this.eventSubscriber = this.eventManager.subscribe('firebaseTokenListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
