import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'odi-cw1';
    opened = true;
    surveys = [
        {url: 'sample_size', name: 'Sample Size'},
        {url: 'response_rates', name: 'Response Rates'},
        {url: 'trading_status', name: 'Trading Status'},
        {url: 'government_schemes_1', name: 'Government Schemes (Applied)'},
        {url: 'government_schemes_2', name: 'Government Schemes (Received)'},
        {url: 'government_schemes_3', name: 'Government Schemes (Intending)'},
    ]

    toggle(): void {
        this.opened = !this.opened;
    }
}
