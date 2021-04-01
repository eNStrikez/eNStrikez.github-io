import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessComponent } from './business/business.component';
import { HomeComponent } from './home/home.component';
import { SurveyComponent } from './survey/survey.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'survey/:url', component: SurveyComponent},
  {path: 'business/:type/:id', component: BusinessComponent},
  //{path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
