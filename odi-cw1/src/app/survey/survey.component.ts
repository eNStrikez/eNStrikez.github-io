import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { RdfService } from '../rdf.service';


@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

    highcharts: typeof Highcharts = Highcharts;
    chartOptions: any[] = [];
    updateFlag = false;
    chartType = "column";
    loading = true;
    axis1: string[] = []
    axis2: string[] = []
    a1: string = "";
    a2: string = "";
    survey: string = "";
    loadingText = "Please wait...";

    constructor(private route: ActivatedRoute, private rdfService: RdfService) { }

    ngOnInit(): void {
        this.loading = true;
        this.route.params.subscribe(params => {
            this.chartOptions = [];
            this.axis1 = this.rdfService.getAxis1(params.url)
            this.axis2 = this.rdfService.getAxis2(params.url)
            this.survey = params.url;
            this.loadChart(this.survey, this.axis1[0], this.axis2[0]);
        });
    }

    public loadChart(survey: string, axis1: string, axis2: string) {
        this.loading = true;
        this.a1 = axis1;
        this.a2 = axis2;
        this.chartOptions = [];
        this.loadingText = "Loading metadata, please wait...";
        this.rdfService.loadMeta(survey, axis1, axis2).subscribe(meta => {
            this.loadingText = "Loading survey data, please wait...";
            let loaders = []
            for (let m of meta){
                this.rdfService.loadSurvey(survey, axis1, axis2, m.Type).subscribe(data => {
                    this.loadingText = "Rendering graphs, please wait...";
                    this.chartOptions.push(this.drawBars(m, data));
                    loaders.push(true);
                    this.loading = loaders.length < meta.length;
                }); 
            }
        });
    }

    public swapAxis(){
        const axis3 = this.axis1.map(x => x);
        this.axis1 = this.axis2.map(x => x);
        this.axis2 = axis3;
        this.loadChart(this.survey, this.a2, this.a1);
    }

    public setType(chartType: string, option: any): void {
        this.chartType = chartType;
        option.chart.type = chartType;
        this.updateFlag = true;
    }

    public toggleLegend(option: any): void {
        option.legend = {enabled: option.legend.enabled ? false : true}
        this.updateFlag = true;
    }

    private transformSeries(data: any[]): any[] {
        let series: any = []

        let keys = this.getKeys(data);
        data.forEach(d => {
            let values: any[] = [];
            keys.forEach(k => {
                values.push(d.Values[k] != undefined ? +d.Values[k] : null)
            });
            series.push({
                data: values,
                name: d.Name,
            });
        });
        return series;
    }

    private getKeys(data: any[]): string[] {
        let keys = new Set<string>();
        data.forEach(d => {
            for (var key of Object.keys(d.Values)) {
                keys.add(key);
            }
        });

        return Array.from(keys).sort();
    }

    private drawBars(meta: any, data: any[]): any {
        let chartOptions = {
            chart: {
                type: this.chartType,
                zoomType: 'xy',
            },
            title: {
                text: meta.Name,
            },
            subtitle: {
                text: meta.Desc
            },
            xAxis: {
                categories: this.getKeys(data),
                title: {
                    text: this.a2
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
                    text: this.a1
                },
                enabled: true,
            },
            credits: {
                enabled: false
            },
            series: this.transformSeries(data),
        };
        return chartOptions;
    }

}
