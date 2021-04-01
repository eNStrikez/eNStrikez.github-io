import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Survey } from './survey';

@Injectable({
    providedIn: 'root',
})
export class RdfService {
    private server = "https://open-data.azurewebsites.net/";
    //private server = "http://127.0.0.1:5000/";
    public surveys = [
        { url: 'sample_size', name: 'Sample Size', axis1: ['Industry'], axis2: ['Workforce Size'] },
        { url: 'response_rates', name: 'Response Rates', axis1: ['Industry'], axis2: ['Workforce Size'] },
        { url: 'trading_status', name: 'Trading Status', axis1: ['Industry', 'Workforce Size', 'Country'], axis2: ['Trading Status'] },
        { url: 'government_schemes_1', name: 'Government Schemes (Applied)', axis1: ['Industry', 'Workforce Size', 'Country'], axis2: ['Government Schemes'] },
        { url: 'government_schemes_2', name: 'Government Schemes (Received)', axis1: ['Industry', 'Workforce Size'], axis2: ['Government Schemes'] },
        { url: 'government_schemes_3', name: 'Government Schemes (Intending)', axis1: ['Industry', 'Workforce Size'], axis2: ['Government Schemes'] },
    ]

    public classes = [
        { name: 'sample_size', cls: 'Industry' },
        { name: 'sample_size', cls: 'Workforce Size' },
        { name: 'trading_status', cls: 'Country' },
        { name: 'government_schemes_1', cls: 'Government Schemes' },
        { name: 'trading_status', cls: 'Trading Status' },
        { name: 'sample_size', cls: 'Industry' },
    ]

    public businesses: any = {}

    constructor(private http: HttpClient) { }

    public loadSurvey(name: string, x: string, y: string, val: string): Observable<any> {
        let ps = new HttpParams().set('name', name).set('x', x).set('y', y).set('val', val);
        return this.http.get<Survey[]>(this.server + "series", { params: ps, responseType: 'json' })
    }

    public loadBusiness(name: string, cls: string, x: string, y: string, val: string): Observable<any> {
        let ps = new HttpParams().set('name', name).set('x', x).set('y', y).set('val', val).set('cls', cls);
        return this.http.get<Survey[]>(this.server + "business", { params: ps, responseType: 'json' })
    }

    public loadMeta(name: string, x: string, y: string): Observable<any> {
        let ps = new HttpParams().set('name', name).set('x', x).set('y', y);
        return this.http.get<Survey[]>(this.server + "meta", { params: ps, responseType: 'json' })
    }

    public loadAllNames(): void {
        for (let c of this.classes) {
            this.loadName(c.name, c.cls).subscribe((data) => {
                let bs = []
                for(let d of data) {
                    bs.push({uri: d.URI, name: d.Name})
                }
                this.businesses[c.cls] = bs;
            });
        }
    }

    public getNameFromURI(uri: string): string {
        for (let s of Object.keys(this.businesses)){
            for (let b of this.businesses[s]){
                if (b.uri === uri){
                    return b.name;
                }
            }
        }
        return "";
    }

    private loadName(name: string, cls: string): Observable<any> {
        let ps = new HttpParams().set('name', name).set('class', cls);
        return this.http.get<Survey[]>(this.server + "name", { params: ps, responseType: 'json' })
    }

    public getAxis1(name: string): string[] {
        for (let survey of this.surveys) {
            if (survey.url == name) {
                return survey.axis1;
            }
        };
        return [];
    }

    public getAxis2(name: string): string[] {
        for (let survey of this.surveys) {
            if (survey.url == name) {
                return survey.axis2;
            }
        };
        return [];
    }

    public uriToURL(uri: string){
        return location.origin + uri.split('/').slice(-2).join('/');
    }

    public getValidSurveys(name: string): any[]{
        let surveys: any[] = []
        this.surveys.forEach(s => {
            s.axis1.includes(name) || s.axis2.includes(name) ? surveys.push(s) : ''
        });
        return surveys;
    }
}
