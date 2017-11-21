import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

@Injectable()
export class LibraryService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    // Library

    getLibraryDetails(req: any) {
        return this._dataserver.post(Globals.erproute + "getLibraryDetails", req)
    }

    saveLibraryInfo(req: any) {
        return this._dataserver.post(Globals.erproute + "saveLibraryInfo", req)
    }

    // Library Book

    getLibraryBooks(req: any) {
        return this._dataserver.post(Globals.erproute + "getLibraryBooks", req)
    }

    saveLibraryBooks(req: any) {
        return this._dataserver.post(Globals.erproute + "saveLibraryBooks", req)
    }

    saveLibraryBookIssued(req: any) {
        return this._dataserver.post(Globals.erproute + "saveLibraryBookIssued", req)
    }
}