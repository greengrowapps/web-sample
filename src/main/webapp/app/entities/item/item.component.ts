import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Item } from './item.model';
import { ItemService } from './item.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-item',
    templateUrl: './item.component.html'
})
export class ItemComponent implements OnInit, OnDestroy {
items: Item[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private itemService: ItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.itemService.query().subscribe(
            (res: HttpResponse<Item[]>) => {
                this.items = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Item) {
        return item.id;
    }
    registerChangeInItems() {
        this.eventSubscriber = this.eventManager.subscribe('itemListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
