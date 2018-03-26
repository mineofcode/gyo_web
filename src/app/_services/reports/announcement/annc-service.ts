import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class AnnouncementService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getAnnouncement(req: any) {
        return this._dataserver.rawget(Globals.reporturl + "getAnnouncement", req)
    }
}