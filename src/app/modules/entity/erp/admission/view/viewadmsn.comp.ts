import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;

@Component({
    templateUrl: 'viewadmsn.comp.html',
    providers: [CommonService]
})

export class ViewAdmissionComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    ayDT: any = [];
    ayid: number = 0;

    classDT: any = [];
    classid: number = 0;

    autoStudentDT: any = [];
    studsdata: any = [];
    studid: number = 0;
    studname: string = "";

    studentDT: any = [];

    // Upload File

    uploadFileDT: any = [];
    uploadfileconfig = { server: "", serverpath: "", uploadxlsurl: "", xlsfilepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _admsnservice: AdmissionService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getUploadConfig();
        this.fillDropDownList();
        this.viewStudentDataRights();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Bulk Upload

    getUploadConfig() {
        var that = this;

        that.uploadfileconfig.server = that.global.serviceurl + "bulkUpload";
        that.uploadfileconfig.serverpath = that.global.serviceurl;
        that.uploadfileconfig.uploadxlsurl = that.global.uploadurl;
        that.uploadfileconfig.xlsfilepath = that.global.xlsfilepath;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.xlsid }).subscribe(data => {
            that.uploadfileconfig.maxFilesize = data.data[0]._filesize;
            that.uploadfileconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    // File Upload

    onBeforeUpload(event) {
        event.formData.append("bulktype", "student");
        event.formData.append("wsautoid", this._enttdetails.wsautoid);
        event.formData.append("enttid", this._enttdetails.enttid);
        event.formData.append("ayid", this.ayid);
        event.formData.append("cuid", this.loginUser.ucode);
    }

    onFileUpload(event) {
        var that = this;
        that.uploadFileDT = [];

        var xlsfile = JSON.parse(event.xhr.response).data.funsave_multistudentinfo;

        if (xlsfile.msgid == 401) {
            that._msg.Show(messageType.error, "Error", xlsfile.msg);
        }
        else if (xlsfile.msgid == 1) {
            for (var i = 0; i < xlsfile.length; i++) {
                that.uploadFileDT.push({ "athurl": xlsfile[i].path.replace(that.uploadfileconfig.xlsfilepath, "") });
            }

            that.closeBulkUploadPopup();
            that.getStudentDetails();
        }
        else {
            that._msg.Show(messageType.warn, "Warning", xlsfile.msg);
        }
    }

    isshStudent(viewtype) {
        var that = this;
        commonfun.loader("#divShow");

        if (viewtype == "grid") {
            that.isShowGrid = true;
            that.isShowList = false;
            commonfun.loaderhide("#divShow");
        }
        else {
            that.isShowGrid = false;
            that.isShowList = true;
            commonfun.loaderhide("#divShow");
        }

        that.refreshButtons();
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    // Auto Completed Student

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoStudentDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        Cookie.set("_studid_", event.value);
        Cookie.set("_studnm_", event.label);

        this.getStudentDetails();
    }

    // Fill Entity, Standard, Month DropDown

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._admsnservice.getStudentDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = data.data.filter(a => a.group === "class");
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].key;
                    }
                    else {
                        that.ayid = 0;
                    }
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

    // View Data Rights

    public viewStudentDataRights() {
        var that = this;

        if (Cookie.get('_studnm_') != null) {
            that.studid = parseInt(Cookie.get('_studid_'));
            that.studname = Cookie.get('_studnm_');

            that.studsdata.value = that.studid;
            that.studsdata.label = that.studname;
        }

        that.getStudentDetails();
    }

    getStudentDetails() {
        var that = this;
        var params = {};

        commonfun.loader("#fltrstud");

        if (that.studid == 0) {
            Cookie.set("_studid_", "0");
            Cookie.set("_studnm_", "");

            that.studsdata.value = parseInt(Cookie.get('_studid_'));
            that.studsdata.label = Cookie.get('_studnm_');
        }

        params = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "studid": that.studid.toString() == "" ? 0 : that.studid,
            "classid": that.classid, "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid
        };

        that._admsnservice.getStudentDetails(params).subscribe(data => {
            try {
                that.studentDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#fltrstud");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#fltrstud");
        }, () => {

        })
    }

    public addAdmissionForm() {
        this._router.navigate(['/erp/student/admission']);
    }

    public uploadAdmissionForm() {
        this._router.navigate(['/erp/student/upload']);
    }

    public editAdmissionForm(row) {
        this._router.navigate(['/erp/student/edit', row.enrlmntid]);
    }

    openBulkUploadPopup() {
        $("#bulkUploadModal").modal('show');
    }

    closeBulkUploadPopup() {
        $("#bulkUploadModal").modal("hide");
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
