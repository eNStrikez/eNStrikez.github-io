import { Component, OnInit } from '@angular/core';
import * as rdf from 'rdf';
import { RdfService } from '../rdf.service';
import { Triple } from '../triple';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    data: Triple[] = [];

    constructor(private rdfService: RdfService) { }

    ngOnInit(): void {
        this.rdfService.loadRDF('https://raw.githubusercontent.com/eNStrikez/open-data-1/main/rdf/sample_size.ttl').subscribe(data => {
            const parse = rdf.TurtleParser.parse(data, '');
            this.data = parse.graph.toArray();
        });
    }
}
