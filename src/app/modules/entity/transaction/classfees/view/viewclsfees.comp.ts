import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'viewclsfees.comp.html',
    providers: [CommonService]
})

export class ViewClassFeesComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    classDT: any = [];

    feesDT: any = [];

    installmentDT: any = [];

    ayid: number = 0;
    classid: number = 0;

    private subscribeParameters: any;

    constructor(private _router: Router, private _loginservice: LoginService, private _msg: MessageService,
        private _feesservice: FeesService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getClassFees();
    }

    public ngOnInit() {
        var that = this;
        commonfun.loader();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Academic Year, Class, Sub Category Drop Down

    fillDropDownList() {
        var that = this;
        var ddlData: any = [];
        var defayDT: any = [];

        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                ddlData = data.data[1];

                that.ayDT = ddlData.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                        that.getClassFees();
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.classDT = ddlData.filter(a => a.group == "class");
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

    // Get Class Fees

    getClassFees() {
        var that = this;
        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype, "catid": 0,
            "classid": that.classid, "ayid": that.ayid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.feesDT = data.data[0];
                that.installmentDT = data.data[1];
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

    totalFees() {
        var that = this;
        var field: any = [];

        var totalfees = 0;

        for (var i = 0; i < that.feesDT.length; i++) {
            field = that.feesDT[i];
            totalfees += parseFloat(field.fees);
        }

        return totalfees;
    }

    totalInstallmentFees() {
        var that = this;
        var field: any = [];
        var totalinstlfees = 0;

        for (var i = 0; i < that.installmentDT.length; i++) {
            field = that.installmentDT[i];
            totalinstlfees += parseInt(field.instlfees);
        }

        return totalinstlfees;
    }

    totalPenaltyFees() {
        var that = this;
        var field: any = [];
        var totalpnltyfees = 0;

        for (var i = 0; i < that.installmentDT.length; i++) {
            field = that.installmentDT[i];
            totalpnltyfees += parseInt(field.pnltyfees);
        }

        return totalpnltyfees;
    }

    // Add Class Fees

    addClassFees() {
        this._router.navigate(['/transaction/classfees/add']);
    }

    // Edit Class Fees

    editFeesDetails(row) {
        this._router.navigate(['/transaction/classfees/edit', row.cfid]);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
