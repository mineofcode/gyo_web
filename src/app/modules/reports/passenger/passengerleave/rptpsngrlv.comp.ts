import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerLeaveService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptpsngrlv.comp.html',
    providers: [CommonService]
})

export class PassengerLeaveReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    frmdt: any = "";
    todt: any = "";

    passengerDT: any = [];
    psngrdata: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    status: number = -1;

    @ViewChild('rptpsngrlv') rptpsngrlv: ElementRef;

    lvpsngrDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _psngrlvservice: PassengerLeaveService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.setFromDateAndToDate();
        this.getPassengerLeaveReports();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Selected Calendar Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Format Date

    setFromDateAndToDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var after1month = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 30);

        this.frmdt = this.formatDate(today);
        this.todt = this.formatDate(after1month);
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "Passenger",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._enttdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.passengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Passenger

    selectPassengerData(event, arg) {
        var that = this;

        that.psngrid = event.value;
        that.psngrname = event.label;
    }

    // Get Passenger Leave Reports

    getPassengerLeaveReports() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "reports", "frmdt": that.frmdt, "todt": that.todt, "psngrid": that.psngrid,
            "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "status": that.status
        }

        that._psngrlvservice.getPassengerLeave(params).subscribe(data => {
            try {
                that.lvpsngrDT = data.data;
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

    // Reset Passenger Leave Reports

    resetPassengerLeaveReports() {
        this.setFromDateAndToDate();
        this.psngrid = 0;
        this.psngrname = "";
        this.psngrdata = [];
        this.status = -1;

        this.getPassengerLeaveReports();
    }

    // Export

    public exportToCSV() {
        var that = this;
        var params = {};

        commonfun.loader("#divExport");

        params = {
            "flag": "export", "frmdt": that.frmdt, "todt": that.todt, "psngrid": that.psngrid,
            "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin,
            "status": that.status, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }

        that._psngrlvservice.getPassengerLeave(params).subscribe(data => {
            try {
                that._autoservice.exportToCSV(data.data, that._enttdetails.psngrtype + " Leave Details");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#divExport");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#divExport");
        }, () => {

        })
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.rptpsngrlv.nativeElement, 0, 0, options, () => {
            pdf.save(this._enttdetails.psngrtype + " Leave.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}