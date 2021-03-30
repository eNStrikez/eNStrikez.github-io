import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Survey } from './survey';

@Injectable({
    providedIn: 'root',
})
export class RdfService {
    private server = "http://localhost:5000/";
    public surveys = [
        {url: 'sample_size', name: 'Sample Size', axis1: ['Industry'], axis2: ['Workforce Size']},
        {url: 'response_rates', name: 'Response Rates', axis1: ['Industry'], axis2: ['Workforce Size']},
        {url: 'trading_status', name: 'Trading Status', axis1: ['Industry', 'Workforce Size', 'Country'], axis2: ['Trading Status']},
        {url: 'government_schemes_1', name: 'Government Schemes (Applied)', axis1: ['Industry', 'Workforce Size', 'Country'], axis2: ['Government Schemes']},
        {url: 'government_schemes_2', name: 'Government Schemes (Received)', axis1: ['Industry', 'Workforce Size'], axis2: ['Government Schemes']},
        {url: 'government_schemes_3', name: 'Government Schemes (Intending)', axis1: ['Industry', 'Workforce Size'], axis2: ['Government Schemes']},
    ]

    constructor(private http: HttpClient) { }

    loadSurvey(name: string, x: string, y: string, val: string): Observable<any> {
        let ps = new HttpParams().set('name', name).set('x', x).set('y', y).set('val', val);
        return this.http.get<Survey[]>(this.server + "series", { params: ps, responseType: 'json' })
    }

    loadMeta(name: string, x: string, y: string): Observable<any> {
        let ps = new HttpParams().set('name', name).set('x', x).set('y', y);
        return this.http.get<Survey[]>(this.server + "meta", { params: ps, responseType: 'json' })
    }

    getAxis1(name: string): string[] {
        for (let survey of this.surveys){
            if (survey.url == name) {
                return survey.axis1;
            }
        };
        return [];
    }

    getAxis2(name: string): string[] {
        for (let survey of this.surveys){
            if (survey.url == name) {
                return survey.axis2;
            }
        };
        return [];
    }
}
