import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { FirebaseToken } from './firebase-token.model';
import { FirebaseTokenPopupService } from './firebase-token-popup.service';
import { FirebaseTokenService } from './firebase-token.service';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-firebase-token-dialog',
    templateUrl: './firebase-token-dialog.component.html'
})
export class FirebaseTokenDialogComponent implements OnInit {

    firebaseToken: FirebaseToken;
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private firebaseTokenService: FirebaseTokenService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.firebaseToken.id !== undefined) {
            this.subscribeToSaveResponse(
                this.firebaseTokenService.update(this.firebaseToken));
        } else {
            this.subscribeToSaveResponse(
                this.firebaseTokenService.create(this.firebaseToken));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<FirebaseToken>>) {
        result.subscribe((res: HttpResponse<FirebaseToken>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: FirebaseToken) {
        this.eventManager.broadcast({ name: 'firebaseTokenListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-firebase-token-popup',
    template: ''
})
export class FirebaseTokenPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private firebaseTokenPopupService: FirebaseTokenPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.firebaseTokenPopupService
                    .open(FirebaseTokenDialogComponent as Component, params['id']);
            } else {
                this.firebaseTokenPopupService
                    .open(FirebaseTokenDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
