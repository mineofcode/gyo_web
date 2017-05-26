import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MenuService } from '../../../_services/menus/menu-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { ReportsService } from '../../../_services/reports/rpt-service';

@Component({
    templateUrl: 'rptdrvatt.comp.html',
    providers: [CommonService, MenuService, ReportsService]
})

export class DriverAttendanceReportsComponent implements OnInit {
    monthDT: any = [];

    attColumn: any = [];
    attData: any = [];
    entityDT: any = [];
    entityid: number = 0;
    entityname: string = "";
    monthname: string = "";

    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _rptservice: ReportsService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "search": query
        }).then((data) => {
            this.entityDT = data;
        });
    }

    // Selected Owners

    selectEntityData(event) {
        this.entityid = event.value;
        this.entityname = event.label;
    }

    // Fill Entity, Division, Gender DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._rptservice.getAttendanceReports({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.monthDT = data.data;
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

    // Get Attendent Data

    public viewAttendanceReportsRights() {
        var that = this;

        if (that.entityname === "") {
            that._msg.Show(messageType.warn, "Warning", "Search Entity");
        }
        else if (that.monthname === "") {
            that._msg.Show(messageType.warn, "Warning", "Select Month");
        }
        else {
            var addRights = [];
            var editRights = [];
            var viewRights = [];

            that._menuservice.getMenuDetails({
                "flag": "actrights", "uid": that.loginUser.uid, "mcode": "rptdrvatt", "utype": that.loginUser.utype
            }).subscribe(data => {
                addRights = data.data.filter(a => a.mrights === "add");
                editRights = data.data.filter(a => a.mrights === "edit");
                viewRights = data.data.filter(a => a.mrights === "view");

                that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
                that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
                that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

                that.getAttendanceColumn();
                that.getAttendanceReports();
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
            }, () => {

            })
        }
    }

    getAttendanceColumn() {
        var that = this;

        that._rptservice.getAttendanceReports({
            "flag": "column", "monthname": that.monthname, "schoolid": that.entityid
        }).subscribe(data => {
            if (data.data.length !== 0) {
                that.attColumn = data.data;
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
            // console.log("Complete");
        })
    }

    getAttendanceReports() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._rptservice.getAttendanceReports({
                "flag": "driver", "monthname": that.monthname, "schoolid": that.entityid
            }).subscribe(data => {
                try {
                    if (data.data.length !== 0) {
                        that.attData = data.data;
                    }
                    else {
                        that.attData = [];
                    }
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
    }
}
