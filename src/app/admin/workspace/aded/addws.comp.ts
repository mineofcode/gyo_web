import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { WorkspaceService } from '../../../_services/workspace/ws-service';
import { Globals } from '../../../_const/globals';

declare var adminloader: any;

@Component({
    templateUrl: 'addws.comp.html',
    providers: [WorkspaceService, CommonService]
})

export class AddWorkspaceComponent implements OnInit {
    loginUser: LoginUserModel;

    wstypeDT: any = [];
    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    wsid: number = 0;
    wscode: string = "";
    wsname: string = "";
    wsdesc: string = "";
    oldcode: string = "";
    lgcode: string = "";
    lgpwd: string = "";
    cpname: string = "";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    remark: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;
    isactive: boolean = false;

    iscompany: boolean = false;
    cmppsngrrate: any = "0.00";
    cmpenttmaxno: number = 0;

    isschool: boolean = false;
    schpsngrrate: any = "0.00";
    schenttmaxno: number = 0;

    mode: string = "";

    uploadPhotoDT: any = [];
    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

    constructor(private _wsservice: WorkspaceService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this.getUploadConfig();

        this.fillDropDownList();
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngOnInit() {
        this.getWorkspaceDetails();
    }

    public ngAfterViewInit() {
        $.AdminBSB.input.activate();
    }

    // Entity Type DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._wsservice.getWorkspaceDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.wstypeDT = data.data;
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

    // Get State DropDown

    fillStateDropDown() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDropDownData({ "flag": "state" }).subscribe(data => {
            try {
                that.stateDT = data.data;
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

    // Get City DropDown

    fillCityDropDown() {
        var that = this;
        commonfun.loader();

        that.cityDT = [];
        that.areaDT = [];

        that.city = 0;
        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "city", "sid": that.state }).subscribe(data => {
            try {
                that.cityDT = data.data;
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

    // Get Area DropDown

    fillAreaDropDown() {
        var that = this;
        commonfun.loader();

        that.areaDT = [];

        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "area", "ctid": that.city, "sid": that.state }).subscribe(data => {
            try {
                that.areaDT = data.data;
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

    // File upload

    getUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": "29" }).subscribe(data => {
            that.uploadconfig.server = that.global.serviceurl + "uploads";
            that.uploadconfig.serverpath = that.global.serviceurl;
            that.uploadconfig.uploadurl = that.global.uploadurl;
            that.uploadconfig.maxFilesize = data.data[0]._filesize;
            that.uploadconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadPhotoDT = [];

        imgfile = JSON.parse(event.xhr.response);

        console.log(imgfile);

        for (var i = 0; i < imgfile.length; i++) {
            that.uploadPhotoDT.push({ "athurl": imgfile[i].path.replace("www\\uploads\\", "") })
        }
    }

    // Get File Size

    formatSizeUnits(bytes) {
        if (bytes >= 1073741824) {
            bytes = (bytes / 1073741824).toFixed(2) + ' GB';
        }
        else if (bytes >= 1048576) {
            bytes = (bytes / 1048576).toFixed(2) + ' MB';
        }
        else if (bytes >= 1024) {
            bytes = (bytes / 1024).toFixed(2) + ' KB';
        }
        else if (bytes > 1) {
            bytes = bytes + ' bytes';
        }
        else if (bytes == 1) {
            bytes = bytes + ' byte';
        }
        else {
            bytes = '0 byte';
        }

        return bytes;
    }

    removeFileUpload() {
        this.uploadPhotoDT.splice(0, 1);
    }

    // Clear Fields

    resetWorkspaceFields() {
        var that = this;

        that.wsid = 0
        that.wscode = "";
        that.wsname = "";
        that.wsdesc = "";
        that.lgcode = "";
        that.lgpwd = "";
        that.remark = "";
        that.cpname = "";
        that.mobileno1 = "";
        that.mobileno2 = "";

        that.email1 = "";
        that.email2 = "";
        that.address = "";
        that.country = "India";
        that.state = 0;
        that.city = 0;
        that.area = 0;
        that.pincode = 0;
        that.isactive = true;

        that.iscompany = false;
        that.cmppsngrrate = "0.00";
        that.cmpenttmaxno = 0;

        that.isschool = false;
        that.schpsngrrate = "0.00";
        that.schenttmaxno = 0;
    }

    // Active / Deactive Data

    active_deactiveWorkspaceInfo() {
        var that = this;

        var act_deactWorkspace = {
            "wsid": that.wsid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._wsservice.saveWorkspaceInfo(act_deactWorkspace).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_workspaceinfo.msgid != "-1") {
                    var msg = dataResult[0].funsave_workspaceinfo.msg;
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getWorkspaceDetails();
                }
                else {
                    var msg = dataResult[0].funsave_Workspaceinfo.msg;
                    that._msg.Show(messageType.error, "Error", msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Validation

    isWorkspaceValidation() {
        var that = this;

        if (that.wscode == "") {
            that._msg.Show(messageType.error, "Error", "Enter Workspace Code");
            $(".wscode").focus();
            return false;
        }
        else if (that.wsname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Workspace Name");
            $(".wsname").focus();
            return false;
        }
        else if (that.wsdesc == "") {
            that._msg.Show(messageType.error, "Error", "Enter Workspace Description");
            $(".wsdesc").focus();
            return false;
        }
        else if (that.lgcode == "") {
            that._msg.Show(messageType.error, "Error", "Enter Login Code");
            $(".lgcode").focus();
            return false;
        }
        else if (that.lgpwd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Password");
            $(".lgpwd").focus();
            return false;
        }
        else if (that.cpname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Contace Person");
            $(".cpname").focus();
            return false;
        }
        else if (that.mobileno1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".mobileno1").focus();
            return false;
        }
        else if (that.email1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Email");
            $(".email1").focus();
            return false;
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
            return false;
        }
        else if ((!that.iscompany) && (!that.isschool)) {
            that._msg.Show(messageType.error, "Error", "Select 1 Workspace Type");
            return false;
        }
        else if (that.iscompany) {
            if (that.cmppsngrrate == "0.00") {
                that._msg.Show(messageType.error, "Error", "Enter Rate / Passenger for Company");
                $(".cmppsngrrate").focus();
                return false;
            }
            else if (that.cmpenttmaxno == 0) {
                that._msg.Show(messageType.error, "Error", "Enter Max Allowed Entity for Company");
                $(".cmpenttmaxno").focus();
                return false;
            }

            console.log("abc 001");
        }
        else if (that.isschool) {
            if (that.schpsngrrate == "0.00") {
                that._msg.Show(messageType.error, "Error", "Enter Rate / Passenger for School");
                $(".schpsngrrate").focus();
                return false;
            }
            else if (that.schenttmaxno == 0) {
                that._msg.Show(messageType.error, "Error", "Enter Max Allowed Entity for School");
                $(".schenttmaxno").focus();
                return false;
            }

            console.log("abc 002");
        }

        return true;
    }

    // Save Data

    saveWorkspaceInfo() {
        var that = this;
        var _wstype = "";
        var _iswsvalid = false;

        _iswsvalid = that.isWorkspaceValidation();

        if (_iswsvalid) {
            commonfun.loader();
            console.log("abc 003");

            if ((that.iscompany) && (!that.isschool)) {
                _wstype = "Company";
            }
            else if ((!that.iscompany) && (that.isschool)) {
                _wstype = "School";
            }
            else if ((that.iscompany) && (that.isschool)) {
                _wstype = "Company,School";
            }

            var saveWorkspace = {
                "wsautoid": that.wsid,
                "wscode": that.wscode,
                "oldcode": that.oldcode,
                "wsname": that.wsname,
                "wsdesc": that.wsdesc,
                "wslogo": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "",
                "wstype": _wstype,
                "cmppsngrrate": that.cmppsngrrate,
                "cmpenttmaxno": that.cmpenttmaxno,
                "schpsngrrate": that.schpsngrrate,
                "schenttmaxno": that.schenttmaxno,
                "lgcode": that.lgcode,
                "lgpwd": that.lgpwd,
                "cpname": that.cpname,
                "mobileno1": that.mobileno1,
                "mobileno2": that.mobileno2,
                "email1": that.email1,
                "email2": that.email2,
                "address": that.address,
                "country": that.country,
                "state": that.state,
                "city": that.city,
                "area": that.area,
                "pincode": that.pincode,
                "cuid": that.loginUser.ucode,
                "isactive": that.isactive,
                "mode": ""
            }

            this._wsservice.saveWorkspaceInfo(saveWorkspace).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_workspaceinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid !== "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetWorkspaceFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", "Error 101 : " + dataResult.msg);
                        console.log("Error 101 : " + dataResult.msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", "Error 102 : " + e);
                    console.log("Error 102 : " + e);
                }
            }, err => {
                console.log("Error 103 : " + err);
                that._msg.Show(messageType.error, "Error", "Error 103 : " + err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Workspace Data

    getWorkspaceDetails() {
        var that = this;
        commonfun.loader();

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.wsid = params['id'];

                that._wsservice.getWorkspaceDetails({ "flag": "edit", "id": this.wsid }).subscribe(data => {
                    try {
                        that.wsid = data.data[0].wsautoid;
                        that.wscode = data.data[0].wscode;
                        that.wsname = data.data[0].wsname;

                        if (data.data[0].wslogo !== "") {
                            that.uploadPhotoDT.push({ "athurl": data.data[0].wslogo });
                        }

                        that.wsdesc = data.data[0].wsdesc;
                        that.oldcode = data.data[0].lgcode;
                        that.lgcode = data.data[0].lgcode;
                        that.lgpwd = data.data[0].lgpwd;

                        that.cpname = data.data[0].name;
                        that.email1 = data.data[0].email1;
                        that.email2 = data.data[0].email2;
                        that.mobileno1 = data.data[0].mobileno1;
                        that.mobileno2 = data.data[0].mobileno2;
                        that.address = data.data[0].address;
                        that.country = data.data[0].country;
                        that.state = data.data[0].state;
                        that.fillCityDropDown();
                        that.city = data.data[0].city;
                        that.fillAreaDropDown();
                        that.area = data.data[0].area;
                        that.pincode = data.data[0].pincode;
                        that.isactive = data.data[0].isactive;
                        that.remark = data.data[0].remark1;

                        that.iscompany = data.data[0].wstype == "Company" ? true : false;
                        that.cmppsngrrate = data.data[0].cmppsngrrate;
                        that.cmpenttmaxno = data.data[0].cmpenttmaxno;

                        that.isschool = data.data[0].wstype == "School" ? true : false;
                        that.schpsngrrate = data.data[0].schpsngrrate;
                        that.schenttmaxno = data.data[0].schenttmaxno;

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
        this._router.navigate(['/workspace']);
    }
}