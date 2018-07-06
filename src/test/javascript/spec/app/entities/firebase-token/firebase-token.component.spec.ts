/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ShoppinglistTestModule } from '../../../test.module';
import { FirebaseTokenComponent } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token.component';
import { FirebaseTokenService } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token.service';
import { FirebaseToken } from '../../../../../../main/webapp/app/entities/firebase-token/firebase-token.model';

describe('Component Tests', () => {

    describe('FirebaseToken Management Component', () => {
        let comp: FirebaseTokenComponent;
        let fixture: ComponentFixture<FirebaseTokenComponent>;
        let service: FirebaseTokenService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ShoppinglistTestModule],
                declarations: [FirebaseTokenComponent],
                providers: [
                    FirebaseTokenService
                ]
            })
            .overrideTemplate(FirebaseTokenComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FirebaseTokenComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FirebaseTokenService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new FirebaseToken(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.firebaseTokens[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
