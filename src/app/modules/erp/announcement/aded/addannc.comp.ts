import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AnnouncementService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addannc.comp.html',
    providers: [CommonService]
})

export class AddAnnouncementComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    groupDT: any = [];
    standardDT: any = [];

    anncid: number = 0;
    grpid: number = 0;
    title: string = "";
    desc: string = "";
    anncdate: any = "";

    private subscribeParameters: any;

    constructor(private _ntfservice: AnnouncementService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getAnnouncement();

        setTimeout(function () {
            $(".grpname").focus();
        }, 200);
    }

    // Clear Fields

    resetAnnouncementFields() {
        var that = this;

        that.anncid = 0;
        that.grpid = 0;
        that.title = "";
        that.desc = "";
        that.anncdate = "";
    }

    // Get Standard Rights

    getStandardRights() {
        var that = this;
        var stditem = null;

        var actrights = "";
        var stdights = {};

        for (var i = 0; i <= that.standardDT.length - 1; i++) {
            stditem = null;
            stditem = that.standardDT[i];

            if (stditem !== null) {
                $("#std" + stditem.id).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    stdights = actrights.slice(0, -1);
                }
            }
        }

        return stdights;
    }

    private selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private clearcheckboxes(): void {
        $(".allcheckboxes input[type=checkbox]").prop('checked', false);
    }

    // Save Announcement

    saveAnnouncement() {
        var that = this;
        var _stdrights = null;

        _stdrights = that.getStandardRights();

        if (that.grpid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Group");
            $(".grpname").focus();
        }
        else if (that.title == "") {
            that._msg.Show(messageType.error, "Error", "Enter Title");
            $(".title").focus();
        }
        else if (that.desc == "") {
            that._msg.Show(messageType.error, "Error", "Enter Message");
            $(".desc").focus();
        }
        else if (that.anncdate == "") {
            that._msg.Show(messageType.error, "Error", "Enter Date");
            $(".anncdate").focus();
        }
        else {
            commonfun.loader();

            var saventf = {
                "anncid": that.anncid,
                "frmid": that.loginUser.loginid,
                "toid": "{" + _stdrights + "}",
                "title": that.title,
                "desc": that.desc,
                "grpid": that.grpid,
                "anncdate": that.anncdate,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "annctype": "standard"
            }

            this._ntfservice.saveAnnouncement(saventf).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_announcement;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetAnnouncementFields();
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

    // Get Announcement

    getAnnouncement() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.anncid = params['id'];

                that._ntfservice.getAnnouncement({
                    "flag": "edit",
                    "anncid": that.anncid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var viewannc = data.data;

                        that.anncid = viewannc[0].anncid;
                        that.title = viewannc[0].title;
                        that.desc = viewannc[0].desc;
                        that.grpid = viewannc[0].grpid;
                        that.anncdate = viewannc[0].anncdate;

                        var _stdrights = null;
                        var _stditem = null;

                        if (viewannc[0] != null) {
                            _stdrights = null;
                            _stdrights = viewannc[0].toid;

                            if (_stdrights != null) {
                                for (var i = 0; i < _stdrights.length; i++) {
                                    _stditem = null;
                                    _stditem = _stdrights[i];

                                    if (_stditem != null) {
                                        $("#selectall").prop('checked', true);
                                        $("#std" + _stditem).find("#" + _stditem).prop('checked', true);
                                    }
                                    else {
                                        $("#selectall").prop('checked', false);
                                    }
                                }
                            }
                            else {
                                $("#selectall").prop('checked', false);
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
            else {
                that.resetAnnouncementFields();
                commonfun.loaderhide();
            }
        });
    }

    // Fill Group Drop Down and Checkbox List For Standard

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._ntfservice.getAnnouncement({
            "flag": "dropdown",
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.groupDT = data.data.filter(a => a.group == "anncgrp");
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/announcement']);
    }
}
