import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RdfService {
    constructor(private http: HttpClient) { }

    loadRDF(url: string): Observable<any> {
        return this.http.get(url, { responseType: 'text' })
    }
}
