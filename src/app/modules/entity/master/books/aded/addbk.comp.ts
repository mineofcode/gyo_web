import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { BookService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addbk.comp.html',
    providers: [CommonService]
})

export class AddBooksComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    subjectDT: any = [];
    subid: number = 0;

    bktypeDT: any = [];
    bktypid: number = 0;

    bkid: number = 0;
    bkname: string = "";
    bkdesc: string = "";
    athrname: string = "";
    publication: string = "";

    private subscribeParameters: any;

    constructor(private _bkservice: BookService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getBooksDetails();

        setTimeout(function () {
            $(".grpname").focus();
        }, 200);
    }

    // Clear Fields

    resetBooksFields() {
        var that = this;

        that.bkid = 0;
        that.bkname = "";
        that.bkdesc = "";
        that.bktypid = 0;
        that.athrname = "";
        that.publication = "";
        that.subid = 0;
    }

    // Save Books

    saveBooksInfo() {
        var that = this;
        
        if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            $(".subname").focus();
        }
        else if (that.bktypid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Book Type");
            $(".bktype").focus();
        }
        else if (that.bkname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Book Name");
            $(".bkname").focus();
        }
        else {
            commonfun.loader();

            var saventf = {
                "bkid": that.bkid,
                "bkname": that.bkname,
                "bkdesc": that.bkdesc,
                "bktypid": that.bktypid,
                "subid": that.subid,
                "athrname": that.athrname,
                "publication": that.publication,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._bkservice.saveBooksInfo(saventf).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_booksinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetBooksFields();
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

    // Get Books

    getBooksDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.bkid = params['id'];

                that._bkservice.getBooksDetails({ "flag": "edit", "bkid": that.bkid, "wsautoid": that._enttdetails.wsautoid }).subscribe(data => {
                    try {
                        var viewntf = data.data;

                        that.bkid = viewntf[0].bkid;
                        that.bkname = viewntf[0].bkname;
                        that.bkdesc = viewntf[0].bkdesc;
                        that.bktypid = data.data[0].bktypid;
                        that.subid = data.data[0].subid;
                        that.athrname = data.data[0].athrname;
                        that.publication = data.data[0].publication;
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
                that.resetBooksFields();
                commonfun.loaderhide();
            }
        });
    }

    // Fill Group Drop Down and Checkbox List For Standard

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._bkservice.getBooksDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.subjectDT = data.data.filter(a => a.group == "subject");
                that.bktypeDT = data.data.filter(a => a.group == "bktype");
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/books']);
    }
}