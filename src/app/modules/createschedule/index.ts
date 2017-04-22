import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreateScheduleComponent } from './addpd.comp';
import { PickDropService } from '../../_services/pickdrop/pickdrop-service';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, OrderListModule, ScheduleModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: CreateScheduleComponent },
    ]
  },
];

@NgModule({
  declarations: [
    CreateScheduleComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, OrderListModule,
    AutoCompleteModule, ScheduleModule
  ],

  providers: [PickDropService]
})

export class CreateScheduleModule {
  public static routes = routes;
}
