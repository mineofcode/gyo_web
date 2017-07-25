import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { AuthGuard } from '../../../_services/authguard-service';

import { TripsReportsComponent } from './rpttrips.comp';
import { ReportsService } from '@services/master';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TripsReportsComponent, canActivate: [AuthGuard],
        data: { "module": "rpt", "submodule": "rpttrp", "rights": "view", "urlname": "/passenger" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TripsReportsComponent
  ],

  imports: [
    CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), DataTableModule, AutoCompleteModule
  ],

  providers: [AuthGuard, ReportsService]
})

export class TripsReportsModule {
  public static routes = routes;
}
