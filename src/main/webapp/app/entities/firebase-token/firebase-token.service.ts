import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { FirebaseToken } from './firebase-token.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<FirebaseToken>;

@Injectable()
export class FirebaseTokenService {

    private resourceUrl =  SERVER_API_URL + 'api/firebase-tokens';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(firebaseToken: FirebaseToken): Observable<EntityResponseType> {
        const copy = this.convert(firebaseToken);
        return this.http.post<FirebaseToken>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(firebaseToken: FirebaseToken): Observable<EntityResponseType> {
        const copy = this.convert(firebaseToken);
        return this.http.put<FirebaseToken>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<FirebaseToken>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<FirebaseToken[]>> {
        const options = createRequestOption(req);
        return this.http.get<FirebaseToken[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<FirebaseToken[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: FirebaseToken = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<FirebaseToken[]>): HttpResponse<FirebaseToken[]> {
        const jsonResponse: FirebaseToken[] = res.body;
        const body: FirebaseToken[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to FirebaseToken.
     */
    private convertItemFromServer(firebaseToken: FirebaseToken): FirebaseToken {
        const copy: FirebaseToken = Object.assign({}, firebaseToken);
        copy.lastUpdate = this.dateUtils
            .convertDateTimeFromServer(firebaseToken.lastUpdate);
        return copy;
    }

    /**
     * Convert a FirebaseToken to a JSON which can be sent to the server.
     */
    private convert(firebaseToken: FirebaseToken): FirebaseToken {
        const copy: FirebaseToken = Object.assign({}, firebaseToken);

        copy.lastUpdate = this.dateUtils.toDate(firebaseToken.lastUpdate);
        return copy;
    }
}
