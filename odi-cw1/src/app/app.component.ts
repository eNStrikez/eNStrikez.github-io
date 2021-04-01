import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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

    constructor(public rdfService: RdfService, private router: Router, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.surveys = this.rdfService.surveys;
        this.rdfService.loadAllNames();
    }

    openDialog() {
        const dialogRef = this.dialog.open(Dialogue);
    }

    public toggle(): void {
        this.opened = !this.opened;
    }

    public getKeys(data: any[]): string[] {
        return Object.keys(data).sort();
    }

    public navigateTo(cls: string, uri: string) {
        this.router.navigate(["/business/", cls, uri]);
    }
}

@Component({
    selector: 'dialogue',
    templateUrl: './dialogue.html',
  })
  export class Dialogue {}