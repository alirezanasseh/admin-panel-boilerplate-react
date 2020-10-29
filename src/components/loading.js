import React from "react";

export default function Loading(props) {
    let {theme = "dark"} = props;

    return <div className={"lds-dual-ring " + theme}/>;
}