import {useContext} from "react";
import {Context} from "./providers/mainProvider";

export default function Pages(){
    const {locale} = useContext(Context);
    let id = 1;
    return [
        {
            id: id++,
            title: locale.basic_info,
            options: [
                {id: id++, module: "users", title: locale.users, path: "/users"},
            ]
        },
    ];
}