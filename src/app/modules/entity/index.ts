import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddEntityComponent } from './aded/addentity.comp';
import { ViewEntityComponent } from './view/viewentity.comp';

import { EntityService } from '../../_services/entity/entity-service';

import { LazyLoadEvent, DataTableModule, CheckboxModule } from 'primeng/primeng';

export const routes = [
  {
    path: '', children: [
      { path: '', component: ViewEntityComponent },
      { path: 'add', component: AddEntityComponent },
      { path: 'details/:id', component: AddEntityComponent },
      { path: 'edit/:id', component: AddEntityComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AddEntityComponent,
    ViewEntityComponent
  ],

  imports: [
    CommonModule, FormsModule, RouterModule.forChild(routes), DataTableModule, CheckboxModule
  ],

  providers: [EntityService]
})

export class EntityModule {
  public static routes = routes;
}