import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { BatchService } from '../../../_services/batch/batch-service';

declare var $: any;
declare var commonfun: any;

@Component({
    templateUrl: 'addbatch.comp.html',
    providers: [BatchService, CommonService]
})

export class AddBatchComponent implements OnInit {
    loginUser: LoginUserModel;

    batchid: number = 0;
    batchcode: string = "";
    batchname: string = "";

    schoolDT: any = [];
    schoolid: number = 0;
    schoolname: string = "";

    fromtime: any = "";
    totime: any = "";
    instruction: string = "";

    weekDT: any = [];
    selectedWeek: string[] = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _autoservice: CommonService,
        private _loginservice: LoginService, private _batchervice: BatchService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getBatchDetails();
    }

    public onUploadError(event) {
        console.log('error');
    }

    public onUploadSuccess(event) {
        console.log('success');
    }

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._batchervice.getBatchDetails({ "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype }).subscribe(data => {
            try {
                var d = data.data;

                that.schoolDT = d.filter(a => a.group === "school");
                that.weekDT = d.filter(a => a.group === "week");
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

    // Clear Fields

    resetBatchFields() {
        $("input").val("");
        $("textarea").val("");
        $("select").val("");
    }

    // Save Data

    saveBatchInfo() {
        var that = this;

        var savebatch = {
            "autoid": that.batchid,
            "batchcode": that.batchcode,
            "batchname": that.batchname,
            "schoolid": that.schoolid,
            "fromtime": that.fromtime,
            "totime": that.totime,
            "uid": that.loginUser.ucode,
            "instruction": that.instruction,
            "weekallow": that.selectedWeek
        }

        this._batchervice.saveBatchInfo(savebatch).subscribe(data => {
            try {
                var dataResult = data.data;
                var msg = dataResult[0].funsave_batchinfo.msg;
                var msgid = dataResult[0].funsave_batchinfo.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);

                    if (msgid === "1") {
                        that.resetBatchFields();
                    }
                    else {
                        that.backViewData();
                    }
                }
                else {
                    var msg = dataResult[0].funsave_batchinfo.msg;
                    that._msg.Show(messageType.error, "Error", msg);
                }

                commonfun.loaderhide();
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Get Batch Data

    getBatchDetails() {
        var that = this;
        commonfun.loader();

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.batchid = params['id'];

                that._batchervice.getBatchDetails({ "flag": "edit", "id": this.batchid }).subscribe(data => {
                    try {
                        that.batchid = data.data[0].autoid;
                        that.batchcode = data.data[0].batchcode;
                        that.batchname = data.data[0].batchname;
                        that.schoolid = data.data[0].schoolid;
                        that.fromtime = data.data[0].fromtime;
                        that.totime = data.data[0].totime;
                        that.instruction = data.data[0].instruction;
                        that.selectedWeek = data.data[0].weekallow !== null ? data.data[0].weekallow : [];
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
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/batch']);
    }
}
