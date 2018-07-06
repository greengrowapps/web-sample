import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { FirebaseToken } from './firebase-token.model';
import { FirebaseTokenService } from './firebase-token.service';

@Component({
    selector: 'jhi-firebase-token-detail',
    templateUrl: './firebase-token-detail.component.html'
})
export class FirebaseTokenDetailComponent implements OnInit, OnDestroy {

    firebaseToken: FirebaseToken;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private firebaseTokenService: FirebaseTokenService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInFirebaseTokens();
    }

    load(id) {
        this.firebaseTokenService.find(id)
            .subscribe((firebaseTokenResponse: HttpResponse<FirebaseToken>) => {
                this.firebaseToken = firebaseTokenResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInFirebaseTokens() {
        this.eventSubscriber = this.eventManager.subscribe(
            'firebaseTokenListModification',
            (response) => this.load(this.firebaseToken.id)
        );
    }
}
