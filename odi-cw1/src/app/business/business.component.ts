import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { RdfService } from '../rdf.service';

@Component({
    selector: 'app-business',
    templateUrl: './business.component.html',
    styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
    highcharts: typeof Highcharts = Highcharts;
    category: string = "";
    id: string = "";
    updateFlag = false;
    loading = true;
    surveys: any[] = [];
    loadingText = "Please wait...";

    constructor(private route: ActivatedRoute, private rdfService: RdfService) { }

    ngOnInit(): void {
        this.loading = true;
        this.route.params.subscribe(params => {
            this.category = params.type;
            this.id = decodeURI(params.id);
            this.surveys = this.rdfService.surveys.map(s => Object.assign({}, s)).map(s => {
                if(s.axis1.indexOf(this.category) > -1){
                    return {url: s.url, name: s.name, axis: s.axis2, ax:s.axis2[0], chartOptions:[]};
                } else if(s.axis2.indexOf(this.category) > -1){
                    return {url: s.url, name: s.name, axis: s.axis1, ax:s.axis1[0], chartOptions:[]};
                }
                return;
            }).filter(s => s !== undefined);
            this.loadCharts(this.surveys);
        });
    }

    public loadCharts(surveys: any[]) {
        this.loading = true;
        this.loadingText = "Loading metadata, please wait...";
        for(let survey of surveys) {
            let ax = survey.ax;
            survey.chartOptions = [];
            this.rdfService.loadMeta(survey.url, this.category, ax).subscribe(meta => {
                this.loadingText = "Loading survey data, please wait...";
                meta.sort((a: { Name: string; }, b: { Name: any; }) => a.Name.localeCompare(b.Name));
                for (let m of meta) {
                    this.rdfService.loadBusiness(survey.url, this.category, this.id, ax, m.Type).subscribe(data => {
                        data.forEach((d: any) => { d.Name = this.rdfService.getNameFromURI(d.Name) });
                        this.loadingText = "Rendering graphs, please wait...";
                        survey.chartOptions.push(this.drawBars(m, data, ax));
                        this.loading = false;
                    });
                }
            });
        }
    }

    public changeAxis(survey: any, axis: any) {
        survey.ax = axis;
        this.loadCharts(this.surveys);        
    }

    public setType(survey: any, type: string): void {
        survey.chart.type = type;
        this.updateFlag = true;
    }

    public toggleLegend(option: any): void {
        option.legend = { enabled: option.legend.enabled ? false : true }
        this.updateFlag = true;
    }


    private drawBars(meta: any, data: any[], ax: string): any {
        let chartOptions = {
            chart: {
                type: "column",
                zoomType: 'xy',
            },
            title: {
                text: meta.Name,
            },
            subtitle: {
                text: meta.Desc
            },
            xAxis: {
                categories: data.map(d => d.Name),
                title: {
                    text: ax
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: meta.Type
                },
                labels: {
                    overflow: 'justify'
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -200,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor: 'rgba(255,255,255,0.5)',
                shadow: true,
                title: {
                    text: this.category
                },
                enabled: true,
            },
            credits: {
                enabled: false
            },
            series: [{
                name: this.id,
                data: data.map(d => d.Values != undefined ? Math.round((+d.Values + Number.EPSILON) * 1000) / 1000 : null)
            }],
        };
        return chartOptions;
    }

}
