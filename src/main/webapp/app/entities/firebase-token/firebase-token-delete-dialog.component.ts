import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { FirebaseToken } from './firebase-token.model';
import { FirebaseTokenPopupService } from './firebase-token-popup.service';
import { FirebaseTokenService } from './firebase-token.service';

@Component({
    selector: 'jhi-firebase-token-delete-dialog',
    templateUrl: './firebase-token-delete-dialog.component.html'
})
export class FirebaseTokenDeleteDialogComponent {

    firebaseToken: FirebaseToken;

    constructor(
        private firebaseTokenService: FirebaseTokenService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.firebaseTokenService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'firebaseTokenListModification',
                content: 'Deleted an firebaseToken'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-firebase-token-delete-popup',
    template: ''
})
export class FirebaseTokenDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private firebaseTokenPopupService: FirebaseTokenPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.firebaseTokenPopupService
                .open(FirebaseTokenDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
