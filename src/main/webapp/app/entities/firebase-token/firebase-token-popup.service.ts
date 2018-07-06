import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FirebaseToken } from './firebase-token.model';
import { FirebaseTokenService } from './firebase-token.service';

@Injectable()
export class FirebaseTokenPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private firebaseTokenService: FirebaseTokenService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.firebaseTokenService.find(id)
                    .subscribe((firebaseTokenResponse: HttpResponse<FirebaseToken>) => {
                        const firebaseToken: FirebaseToken = firebaseTokenResponse.body;
                        firebaseToken.lastUpdate = this.datePipe
                            .transform(firebaseToken.lastUpdate, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.firebaseTokenModalRef(component, firebaseToken);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.firebaseTokenModalRef(component, new FirebaseToken());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    firebaseTokenModalRef(component: Component, firebaseToken: FirebaseToken): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.firebaseToken = firebaseToken;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
