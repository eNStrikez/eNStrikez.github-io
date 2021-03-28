import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as rdf from 'rdf';
import { RdfService } from '../rdf.service';
import { Triple } from '../triple';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
    root: string = "https://raw.githubusercontent.com/eNStrikez/open-data-1/main/rdf/";
    url: string = "";
    data: Triple[] = [];

    constructor(private route: ActivatedRoute, private rdfService: RdfService) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.data = [];
            if (params.url) {
                this.url = this.root + params.url + ".ttl";
                console.log(this.url)
                this.rdfService.loadRDF(this.root + params.url + ".ttl").subscribe(data => {
                    this.data = rdf.TurtleParser.parse(data, '').graph.toArray();
                });
            }
        });
    }

}
