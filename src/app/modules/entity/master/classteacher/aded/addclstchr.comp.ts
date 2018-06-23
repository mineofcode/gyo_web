import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassService } from '@services/master';

declare var google: any;

@Component({
    templateUrl: 'addclstchr.comp.html'
})

export class AddClassTeacherComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    clsid: number = 0;
    stdid: number = 0;
    divname: string = "";

    standardDT: any = [];
    classTeacherDT: any = [];
    clstchrdata: any = [];
    clstchrid: number = 0;
    clstchrname: string = "";

    otherTeacherDT: any = [];
    othtchrdata: any = [];
    othtchrid: number = 0;
    othtchrname: string = "";
    otherTeacherList: any = [];

    private subscribeParameters: any;

    constructor(private _clsservice: ClassService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getClassDetails();
    }

    // Clear Fields

    resetClassFields() {
        var that = this;

        that.stdid = 0;
        that.divname = "";

        that.clstchrid = 0;
        that.clstchrname = "";
        that.clstchrdata = [];

        that.othtchrid = 0;
        that.othtchrname = "";
        that.othtchrdata = [];
        that.otherTeacherDT = [];
    }

    // Fill Standard, Division and Subject Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._clsservice.getClassDetails({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.standardDT = data.data.filter(a => a.group == "standard");
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

    // Auto Completed Teacher

    getTeacherData(event, type) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": "teacher",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "classid": 0,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            if (type == "class") {
                this.classTeacherDT = data.data;
            }
            else {
                this.otherTeacherDT = data.data;
            }
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Class Teacher

    selectClassTeacherData(event) {
        this.clstchrid = event.value;
        this.clstchrname = event.label;
    }

    // Selected Other Teacher

    selectOtherTeacherData(event) {
        this.othtchrid = event.value;
        this.othtchrname = event.label;
        this.addOtherTeacher();
    }

    // Check Other Teacher

    isDuplicateOtherTeacher() {
        var that = this;

        if (that.othtchrid == that.clstchrid) {
            that._msg.Show(messageType.error, "Error", "This Teacher is Already Class Teacher");
            return true;
        }

        for (var i = 0; i < that.otherTeacherList.length; i++) {
            var field = that.otherTeacherList[i];

            if (field.othtchrid == that.othtchrid) {
                that._msg.Show(messageType.error, "Error", "Duplicate Teacher not Allowed");
                return true;
            }
        }

        return false;
    }

    // Add Other Teacher

    addOtherTeacher() {
        var that = this;
        var duplothtchr = that.isDuplicateOtherTeacher();

        if (!duplothtchr) {
            that.otherTeacherList.push({
                "othtchrid": that.othtchrid,
                "othtchrname": that.othtchrname,
            });
        }

        that.othtchrid = 0;
        that.othtchrname = "";
        that.othtchrdata = [];
        $(".othtchrname input").focus();
    }

    // Delete Other Teacher

    deleteOtherTeacher(row) {
        this.otherTeacherList.splice(this.otherTeacherList.indexOf(row), 1);
    }

    // Save Class

    saveDivisionInfo() {
        var that = this;
        var _subrights = null;

        if (that.stdid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Standard");
            $(".standard").focus();
        }
        else if (that.divname == "") {
            that._msg.Show(messageType.error, "Error", "Select Division");
            $(".division").focus();
        }
        else if (that.clstchrid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Class Teacher");
            $(".clstchrname input").focus();
        }
        else if (_subrights == null) {
            that._msg.Show(messageType.error, "Error", "Select Atleast 1 Subject");
        }
        else {
            commonfun.loader();

            var _othtchrids: string[] = [];
            _othtchrids = Object.keys(that.otherTeacherList).map(function (k) { return that.otherTeacherList[k].othtchrid });

            var saveClass = {
                "clsid": that.clsid,
                "stdid": that.stdid,
                "divname": that.divname,
                "clstchrid": that.clstchrid,
                "othtchrid": _othtchrids,
                "subid": "{" + _subrights + "}",
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._clsservice.saveClassInfo(saveClass).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_classinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetClassFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
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
    }

    // Get Class

    getClassDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.clsid = params['id'];

                that._clsservice.getClassDetails({
                    "flag": "edit", "clsid": that.clsid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.clsid = data.data[0].classid;
                            that.stdid = data.data[0].stdid;
                            that.divname = data.data[0].divname;

                            that.clstchrid = data.data[0].clstchrid;
                            that.clstchrname = data.data[0].clstchrname;

                            that.clstchrdata.value = that.clstchrid;
                            that.clstchrdata.label = that.clstchrname;

                            that.otherTeacherList = data.data[0].othtchrdata == null ? [] : data.data[0].othtchrdata;
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
            else {
                that.resetClassFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/class']);
    }
}