export default class Cookies {
    setCookie = props => {
        let d = new Date();
        d.setTime(d.getTime() + props.days * 1000 * 3600 * 24);
        let expires = "expires=" + d.toUTCString();
        document.cookie = `${props.name}=${props.value};${expires};path=/`;
    };

    setCookieBatch = props => {
        for(let i = 0; i < props.length; i++){
            let d = new Date();
            d.setTime(d.getTime() + props[i].days * 1000 * 3600 * 24);
            let expires = "expires=" + d.toUTCString();
            document.cookie = `${props[i].name}=${props[i].value};${expires};path=/`;
        }
    };

    getCookie = name => {
        name+= "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    removeCookie = name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    };

    removeCookieBatch = names => {
        for(let i = 0; i < names.length; i++){
            document.cookie = `${names[i]}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        }
    };
}