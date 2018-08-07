import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService, DashboardService } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NvD3Module } from 'ng2-nvd3';

import { HelpDeskComponent } from './helpdesk.comp';
import { PassengerDashboardComponent } from './passenger/psngrdb.comp';
import { DriverDashboardComponent } from './driver/drvdb.comp';
import { VehicleDashboardComponent } from './vehicle/vehdb.comp';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
    {
        path: '', children: [
            {
                path: '', component: HelpDeskComponent, canActivate: [AuthGuard],
                data: { "module": "", "submodule": "hd", "rights": "view", "urlname": "/helpdesk" }
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), AutoCompleteModule, NvD3Module
    ],

    entryComponents: [PassengerDashboardComponent, DriverDashboardComponent, VehicleDashboardComponent],

    declarations: [
        HelpDeskComponent,
        PassengerDashboardComponent,
        DriverDashboardComponent,
        VehicleDashboardComponent
    ],

    providers: [AuthGuard, CommonService, DashboardService]
})

export class HelpDeskModule {

}
