import axios from "axios";
import Cookies from "./cookies";
import * as locales from "../locales";
import config from "../config";

export default class xhr {
    constructor(props) {
        this.currentLocale = localStorage.getItem("locale") ?? "en";
        this.texts = locales[this.currentLocale].texts;
        let {
            url,
            data = {},
            page = 1,
            perPage,
            server = "base",
            locale = this.currentLocale,
            no_locale
        } = props;

        this.url = this.convertLetters(this.convertNumbers(url));
        let newData = data;
        if(typeof data === 'object') {
            for (let [key, value] of Object.entries(data)) {
                if (value === null) {
                    delete newData[key];
                    continue;
                }
                if(typeof value === "string") {
                    value = this.convertLetters(this.convertNumbers(value));
                }
                newData[key] = value;
            }
        }else{
            newData = this.convertLetters(this.convertNumbers(data));
        }
        this.data = newData;
        const CookieObj = new Cookies();
        this.data.token = CookieObj.getCookie('token');
        this.page = page;
        this.perPage = perPage;
        this.locale = locale;
        this.no_locale = no_locale;
        axios.defaults.baseURL = config.servers[server];
    }

    convertLetters = value => {
        if(!value) return '';
        let arabicLetters = ["ي", "ك"];
        let farsiLetters = ["ی", "ک"];
        let regex = '';
        for(let i = 0; i < 2; i++){
            regex = new RegExp(arabicLetters[i], "g");
            value = value.replace(regex, farsiLetters[i]);
        }
        return value;
    };

    convertNumbers = value => {
        if(!value) return '';
        let farsiNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
        let englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let regex = '';
        for(let i = 0; i < 10; i++){
            regex = new RegExp(farsiNumbers[i], "g");
            value = value.replace(regex, englishNumbers[i]);
        }
        return value;
    };

    handleExpiredToken = () => {
        window.location = "/login";
    };

    sendRequest = (props, cb) => {
        let url = props.url ?? this.url;
        try {
            axios({
                method: props.method,
                url,
                params: props.method === "get" ? this.data : {},
                data: props.method !== "get" ? this.data : {}
            }).then(response => {
                if (response.status >= 200 && response.status < 300) {
                    response.data.status = true;
                    cb(response.data);
                } else {
                    if (response.status === 401) {
                        this.handleExpiredToken();
                    } else {
                        console.error(response.data.note);
                        cb(response.data);
                    }
                }
            }).catch(e => {
                if (e.response && e.response.data.note) {
                    cb({status: false, note: e.response.data.note});
                } else {
                    console.log(e.message);
                    cb({status: false, note: this.texts.connection_error});
                }
            });
        }catch (e) {
            console.error(e);
            cb({status: false, note: this.texts.internal_error});
        }
    };

    GetOne = callback => {
        this.sendRequest({method: 'get'}, res => {
            if(res.status){
                callback(res.data.item);
            }else{
                callback(res);
            }
        });
    };

    GetMany = callback => {
        if(this.page > 0){
            this.data.page_size = this.perPage;
            this.data.page = this.page;
        }else{
            this.data.page_size = 1000000;
            this.data.page = 1;
        }
        this.sendRequest({method: 'get'}, callback);
    };

    Post = callback => {
        if(!this.no_locale){
            this.data['locale'] = this.locale;
        }
        this.sendRequest({method: 'post'}, callback);
    };

    Put = callback => {
        this.data.locale = this.locale;
        this.sendRequest({method: 'put'}, callback);
    };
}