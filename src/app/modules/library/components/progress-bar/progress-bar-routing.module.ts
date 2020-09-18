import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProgressBarComponent } from './progress-bar.component';
import { OverviewComponent } from './overview/overview.component';
import { UsageComponent } from './usage/usage.component';
import { ApiComponent } from './api/api.component';

const routes: Routes = [
  { path: '', component: ProgressBarComponent, children: [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    { path: 'overview', component: OverviewComponent, pathMatch: 'full' },
    { path: 'usage', component: UsageComponent, pathMatch: 'full' },
    { path: 'api', component: ApiComponent, pathMatch: 'full' },
    { path: '**', redirectTo: 'overview', pathMatch: 'full' }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgressBarRoutingModule { }