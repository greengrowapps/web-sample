/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ShoppinglistTestModule } from '../../../test.module';
import { FirebaseTokenDetailComponent } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token-detail.component';
import { FirebaseTokenService } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token.service';
import { FirebaseToken } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token.model';

describe('Component Tests', () => {

    describe('FirebaseToken Management Detail Component', () => {
        let comp: FirebaseTokenDetailComponent;
        let fixture: ComponentFixture<FirebaseTokenDetailComponent>;
        let service: FirebaseTokenService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ShoppinglistTestModule],
                declarations: [FirebaseTokenDetailComponent],
                providers: [
                    FirebaseTokenService
                ]
            })
            .overrideTemplate(FirebaseTokenDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FirebaseTokenDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FirebaseTokenService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new FirebaseToken(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.firebaseToken).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
