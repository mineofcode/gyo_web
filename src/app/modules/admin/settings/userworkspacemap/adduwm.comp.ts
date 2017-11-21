import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { WorkspaceService } from '@services/master';
import { UserService } from '@services/master';

@Component({
    templateUrl: 'adduwm.comp.html',
    providers: [MenuService, CommonService]
})

export class AddUserWorkspaceMapComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;

    usersDT: any = [];

    userdata: any = [];
    uid: number = 0;
    uname: string = "";
    utype: string = "";

    workspaceDT: any = [];
    selectedWorkspace: string[] = [];

    global = new Globals();
    uploadconfig = { uploadurl: "" };

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _autoservice: CommonService, private _userservice: UserService,
        private _wsservice: WorkspaceService, private _loginservice: LoginService, public _menuservice: MenuService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();

        this.getUploadConfig();
        this.getWorkspaceDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $(".uname input").focus();
        }, 100);
    }

    getUploadConfig() {
        this.uploadconfig.uploadurl = this.global.uploadurl;
    }

    resetUserRights() {
        $("#uname input").focus();

        this.uid = 0;
        this.uname = "";
        this.userdata = [];
    }

    // Auto Completed User

    getUserData(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "formapwsuser",
            "wsautoid": that.loginUser.wsautoid,
            "search": query
        }).subscribe(data => {
            that.usersDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectUserData(event, arg) {
        var that = this;

        that.uid = event.uid;
        that.uname = event.uname;
        that.utype = event.utype;

        that.getUserRightsById();
    }

    // Get Workspace Details

    getWorkspaceDetails() {
        var that = this;
        var myWorkspaceDT = [];

        commonfun.loader();

        that._wsservice.getWorkspaceDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that.loginUser.wsautoid
        }).subscribe(data => {
            try {
                that.workspaceDT = data.data.filter(a => !a.issysadmin);
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

    // Get Workspace Rights

    getUserRights() {
        var that = this;
        var wsitem = null;

        var _wsrights = {};
        var actrights = "";

        for (var i = 0; i <= that.workspaceDT.length - 1; i++) {
            wsitem = null;
            wsitem = that.workspaceDT[i];

            if (wsitem !== null) {
                $("#ws" + wsitem.wsautoid).find("input[type=checkbox]").each(function () {
                    actrights += (this.checked ? $(this).val() + "," : "");
                });

                if (actrights != "") {
                    _wsrights = actrights.slice(0, -1);
                }
            }
        }

        return _wsrights;
    }

    saveUserWorkspaceMapping() {
        var that = this;
        var _wsrights = null;

        _wsrights = that.getUserRights();

        if (that.uid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter User");
            $(".uname input").focus();
        }
        else if (that.workspaceDT.length == 0) {
            that._msg.Show(messageType.error, "Error", "No any Workspace");
        }
        else if (_wsrights == null) {
            that._msg.Show(messageType.error, "Error", "Select Atleast 1 Rights");
        }
        else {
            var saveUR = {
                "uid": that.uid,
                "utype": that.utype,
                "wsrights": "{" + _wsrights + "}",
                "forrights": "wsmap",
                "wsautoid": that.loginUser.wsautoid,
                "cuid": that.loginUser.login
            }

            that._userservice.saveUserRights(saveUR).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_userrights;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        $("#menus").prop('checked', false);
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
            }, () => {
            });
        }
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

    getUserRightsById() {
        var that = this;
        this.clearcheckboxes();

        that._userservice.getUserRights({
            "flag": "wsmap", "uid": that.uid, "utype": that.utype, "wsautoid": that.loginUser.wsautoid
        }).subscribe(data => {
            try {
                var viewUR = data.data;

                var _wsrights = null;
                var _wsitem = null;

                if (viewUR[0] != null) {
                    _wsrights = null;
                    _wsrights = viewUR[0].wsrights;

                    if (_wsrights != null) {
                        for (var i = 0; i < _wsrights.length; i++) {
                            _wsitem = null;
                            _wsitem = _wsrights[i];

                            if (_wsitem != null) {
                                $("#selectall").prop('checked', true);
                                $("#ws" + _wsitem).find("#" + _wsitem).prop('checked', true);
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
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    ngOnDestroy() {

    }
}