import { Component } from '@angular/core';
import { RdfService } from './rdf.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'odi-cw1';
    opened = true;
    surveys: any;

    constructor(private rdfService: RdfService) {}

    ngOnInit(): void {
        this.surveys = this.rdfService.surveys;
    }

    toggle(): void {
        this.opened = !this.opened;
    }
}
