import { Cookie } from 'ng2-cookies/ng2-cookies';

export class Globals {
    //serviceurl: string = "http://localhost:8082/goyoapi/";
    uploadurl: string = "http://localhost:8082/images/";

    public static getWSDetails() {
        let _wsdetails = Cookie.get("_wsdetails_");
        return JSON.parse(_wsdetails);
    }

 serviceurl: string = "http://35.154.230.244:8082/goyoapi/";

    static socketurl: string = "http://35.154.230.244:8082/";

    otherurl: string = "http://35.154.27.42:8081/goyoapi/";
}