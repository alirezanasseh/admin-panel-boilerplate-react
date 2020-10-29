import React, {useContext} from "react";
import {Context} from "../providers/mainProvider";

export default function Dashboard() {
    const {locale} = useContext(Context);

    return (
        <div>{locale.dashboard}</div>
    );
}