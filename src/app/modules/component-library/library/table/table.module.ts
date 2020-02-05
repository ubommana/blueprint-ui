import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'epsilon-blueprint';

import { ComponentHeaderModule } from 'src/app/shared/component-header/component-header.module';
import { TableRoutingModule } from './table-routing.module';

import { OverviewComponent } from './overview/overview.component';
import { TableComponent } from './table.component';
import { UsageComponent } from './usage/usage.component';
import { PlaygroundComponent } from './playground/playground.component';
import { ApiComponent } from './api/api.component';
import { DummyObjectComponent } from './dummy-object/dummy-object.component';

@NgModule({
  declarations: [
    TableComponent,
    OverviewComponent,
    UsageComponent,
    PlaygroundComponent,
    ApiComponent,
    DummyObjectComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ComponentHeaderModule,
    TableRoutingModule,
    TableModule
  ],
  providers: [],
  exports: [TableComponent]
})
export class TableLibraryModule { }