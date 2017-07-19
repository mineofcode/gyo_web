import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: 'viewuser.comp.html',
    providers: [CommonService]
})

export class ViewUserComponent implements OnInit {
    autoUserDT: any = [];

    autouid: number = 0;
    autouname: string = "";

    utypeDT: any = [];
    srcutype: string = "";

    usersDT: any = [];
    loginUser: LoginUserModel;

    global = new Globals();
    _wsdetails: any = [];

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _autoservice: CommonService, private _loginservice: LoginService, private _userservice: UserService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.fillUserTypeDropDown();
        this.viewUserDataRights();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();
    }

    isshUser(viewtype) {
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

    fillUserTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._userservice.getUserDetails({ "flag": "dropdown", "utype": that.loginUser.utype }).subscribe(data => {
            that.utypeDT = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Auto Completed User

    getAutoUsers(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "allusers",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin,
            "wsautoid": that._wsdetails.wsautoid,
            "srcutype": that.srcutype,
            "search": query
        }).subscribe(data => {
            that.autoUserDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectAutoUsers(event, arg) {
        var that = this;

        that.autouid = event.uid;
        that.autouname = event.uname;

        that.getUserDetails();
    }

    public viewUserDataRights() {
        var that = this;

        if (Cookie.get('_srcutype_') != null) {
            that.srcutype = Cookie.get('_srcutype_');
            that.getUserDetails();
        }
    }

    getUserDetails() {
        var that = this;
        var uparams = {};

        Cookie.set("_srcutype_", that.srcutype);
        that.srcutype = Cookie.get('_srcutype_');

        commonfun.loader("#users");

        uparams = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid, "srcutype": that.srcutype,
            "srcuid": that.autouid
        };

        that._userservice.getUserDetails(uparams).subscribe(data => {
            try {
                that.usersDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#users");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#users");
        }, () => {

        })
    }

    resetUserDetails() {
        Cookie.delete('_srcutype_');
        this.srcutype = "";
        this.autouid = 0;
        this.autouname = "";
        this.getUserDetails();
    }

    public addUserForm() {
        this._router.navigate(['/master/user/add']);
    }

    public editUserForm(row) {
        this._router.navigate(['/master/user/edit', row.uid]);
    }
}
