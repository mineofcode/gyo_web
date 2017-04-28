import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../../_services/driver/driver-service';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'adddriver.comp.html',
    providers: [DriverService]
})

export class AddDriverComponent implements OnInit {
    driverid: number = 0;
    drivercode: string = "";
    driverpwd: string = "";
    drivername: string = "";
    ownerid: number = 0;
    aadharno: string = "";
    licenseno: string = "";
    lat: string = "";
    lon: string = "";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    country: string = "";
    state: string = "";
    city: string = "";
    pincode: string = "";
    remark1: string = "";

    mode: string = "";
    isactive: boolean = true;

    ownerDT: any = [];

    private subscribeParameters: any;

    constructor(private _driverservice: DriverService, private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService) {
        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getDriverDetails();
    }

    // Fill Owner Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._driverservice.getDriverDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.ownerDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Active / Deactive Data

    active_deactiveDriverInfo() {
        var that = this;

        var act_deactDriver = {
            "autoid": that.driverid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._driverservice.saveDriverInfo(act_deactDriver).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_driverinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_driverinfo.msg);
                    that.getDriverDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_driverinfo.msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Save Data

    saveDriverInfo() {
        var that = this;
        commonfun.loader();

        var saveDriver = {
            "autoid": that.driverid,
            "drivercode": that.drivercode,
            "driverpwd": that.driverpwd,
            "drivername": that.drivername,
            "aadharno": that.aadharno,
            "licenseno": that.licenseno,
            "geoloc": that.lat + "," + that.lon,
            "mobileno1": that.mobileno1,
            "mobileno2": that.mobileno2,
            "email1": that.email1,
            "email2": that.email2,
            "address": that.address,
            "country": that.country,
            "state": that.state,
            "city": that.city,
            "pincode": that.pincode,
            "ownerid": that.ownerid,
            "remark1": that.remark1,
            "uid": "vivek",
            "isactive": that.isactive,
            "mode": ""
        }

        this._driverservice.saveDriverInfo(saveDriver).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_driverinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_driverinfo.msg);
                    that.getDriverDetails();
                    commonfun.loaderhide();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_driverinfo.msg);
                    commonfun.loaderhide();
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Get Driver Data

    getDriverDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.driverid = params['id'];

                that._driverservice.getDriverDetails({ "flag": "edit", "id": that.driverid }).subscribe(data => {
                    try {
                        that.driverid = data.data[0].autoid;
                        that.drivercode = data.data[0].drivercode;
                        that.driverpwd = data.data[0].driverpwd;
                        that.drivername = data.data[0].drivername;
                        that.lat = data.data[0].lat;
                        that.lon = data.data[0].lon;
                        that.aadharno = data.data[0].aadharno;
                        that.licenseno = data.data[0].licenseno;
                        that.email1 = data.data[0].email1;
                        that.email2 = data.data[0].email2;
                        that.mobileno1 = data.data[0].mobileno1;
                        that.mobileno2 = data.data[0].mobileno2;
                        that.address = data.data[0].address;
                        that.country = data.data[0].country;
                        that.state = data.data[0].state;
                        that.city = data.data[0].city;
                        that.pincode = data.data[0].pincode;
                        that.ownerid = data.data[0].ownerid;
                        that.remark1 = data.data[0].remark1;
                        that.isactive = data.data[0].isactive;
                        that.mode = data.data[0].mode;
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }

                    commonfun.loaderhide();
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    console.log(err);
                    commonfun.loaderhide();
                }, () => {

                })
            }
            else {
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/driver']);
    }
}