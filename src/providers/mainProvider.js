import React from "react";
import Cookies from "../components/cookies";
import * as locales from "../locales";

export const Context = React.createContext({});

export default class MainProvider extends React.Component {

    constructor(props) {
        super(props);
        const CookieObj = new Cookies();
        let token = CookieObj.getCookie('token');
        let lng = localStorage.getItem("locale") ?? "en";
        this.state = {
            auth: !!token,
            user_id: CookieObj.getCookie('UID'),
            setValue: this.setValue,
            logout: this.logout,
            fullName: this.fullName,
            lng,
            locale: locales[lng].texts,
            calendar: locales[lng].calendar,
            setLocale: this.setLocale,
        };
        document.getElementById("rtl_css").disabled = locales[lng].direction === "ltr";
    }

    setLocale = lng => {
        document.getElementById("rtl_css").disabled = locales[lng].direction === "ltr";
        document.title = locales[lng].texts.title;
        this.setState({
            lng,
            locale: locales[lng].texts
        });
        localStorage.setItem("locale", lng);
    };

    setValue = val => {
        this.setState(val);
    };

    logout = () => {
        this.setState({
            auth: false,
            user_id: null
        });
        const CookieObj = new Cookies();
        CookieObj.removeCookieBatch(['token', 'UID', 'UNAME']);
        window.location = '/login';
    };

    fullName = (first, last) => {
        first = first.trim();
        last = last.trim();
        if(!first && !last) return '';
        return first ? first + ' ' + last : last;
    };

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        );
    }
}
