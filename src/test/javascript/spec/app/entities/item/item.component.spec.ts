/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ShoppinglistTestModule } from '../../../test.module';
import { ItemComponent } from '../../../../../../main/webapp/app/entities/item/item.component';
import { ItemService } from '../../../../../../main/webapp/app/entities/item/item.service';
import { Item } from '../../../../../../main/webapp/app/entities/item/item.model';

describe('Component Tests', () => {

    describe('Item Management Component', () => {
        let comp: ItemComponent;
        let fixture: ComponentFixture<ItemComponent>;
        let service: ItemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ShoppinglistTestModule],
                declarations: [ItemComponent],
                providers: [
                    ItemService
                ]
            })
            .overrideTemplate(ItemComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ItemComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ItemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Item(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.items[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
