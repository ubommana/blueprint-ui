import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { LandingPageHeaderModule, ActionModule, BreadcrumbsModule, DropdownModule, StatusIndicatorModule } from 'epsilon-blueprint';
import { ObjectPageHeaderRoutingModule } from './object-page-header-routing.module';

import { ObjectPageHeaderComponent } from './object-page-header.component';
import { OverviewComponent } from './overview/overview.component';
import { UsageComponent } from './usage/usage.component';

@NgModule({
  declarations: [
    ObjectPageHeaderComponent,
    OverviewComponent,
    UsageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgSelectModule,
    ObjectPageHeaderRoutingModule,
    LandingPageHeaderModule,
    ActionModule,
    BreadcrumbsModule,
    DropdownModule,
    StatusIndicatorModule
  ],
  providers: [],
  exports: [ObjectPageHeaderComponent]
})
export class ObjectPageHeaderModule { }