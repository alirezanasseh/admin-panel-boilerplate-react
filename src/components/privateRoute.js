import React, {Component} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {Context} from "../providers/mainProvider";

export default class PrivateRoute extends Component {
    static contextType = Context;
    render(){
        const { component: Component, ...restProps } = this.props;
        let {auth} = this.context;
        return <Route {...restProps} render={(props) => (
            auth ? (
                <Component {...props.changeBatch(restProps)} />
            ) : (
                <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
            )
        )} />
    }
}