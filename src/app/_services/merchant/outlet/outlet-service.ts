import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class OutletService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getOutletDetails(req: any) {
        return this._dataserver.post(Globals.mrchtroute + "getOutletDetails", req)
    }

    saveOutletInfo(req: any) {
        return this._dataserver.post(Globals.mrchtroute + "saveOutletInfo", req)
    }
}