/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { ShoppinglistTestModule } from '../../../test.module';
import { FirebaseTokenDialogComponent } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token-dialog.component';
import { FirebaseTokenService } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token.service';
import { FirebaseToken } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token.model';
import { UserService } from '../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('FirebaseToken Management Dialog Component', () => {
        let comp: FirebaseTokenDialogComponent;
        let fixture: ComponentFixture<FirebaseTokenDialogComponent>;
        let service: FirebaseTokenService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ShoppinglistTestModule],
                declarations: [FirebaseTokenDialogComponent],
                providers: [
                    UserService,
                    FirebaseTokenService
                ]
            })
            .overrideTemplate(FirebaseTokenDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FirebaseTokenDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FirebaseTokenService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new FirebaseToken(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.firebaseToken = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'firebaseTokenListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new FirebaseToken();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.firebaseToken = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'firebaseTokenListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
