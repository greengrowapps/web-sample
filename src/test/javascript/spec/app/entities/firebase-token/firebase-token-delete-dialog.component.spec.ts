/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { ShoppinglistTestModule } from '../../../test.module';
import { FirebaseTokenDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token-delete-dialog.component';
import { FirebaseTokenService } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token.service';

describe('Component Tests', () => {

    describe('FirebaseToken Management Delete Component', () => {
        let comp: FirebaseTokenDeleteDialogComponent;
        let fixture: ComponentFixture<FirebaseTokenDeleteDialogComponent>;
        let service: FirebaseTokenService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ShoppinglistTestModule],
                declarations: [FirebaseTokenDeleteDialogComponent],
                providers: [
                    FirebaseTokenService
                ]
            })
            .overrideTemplate(FirebaseTokenDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FirebaseTokenDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FirebaseTokenService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
