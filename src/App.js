import React, {useContext, useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {PrivateRoute, FuncProvider} from "./components";
import Layout from "./layout/layout";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Page from "./pages/page";
import {Context} from "./providers/mainProvider";
import * as models from "./models/";
import Pages from "./pages";

export default function App() {
    let pages = Pages();
    const {fullName} = useContext(Context);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        let rt = [];
        let path, operations;
        for(let i = 0; i < pages.length; i++){
            for(let j = 0; j < pages[i].options.length; j++){
                path = pages[i].options[j].path;
                operations = models[pages[i].options[j].module] && models[pages[i].options[j].module]({functions: {}}).list ?
                    models[pages[i].options[j].module]({functions: {}}).list.operations
                    :
                    [];
                if(operations && operations.indexOf("add") > -1){
                    rt.push(<PrivateRoute key={path + '_add'} path={path + '/add'} module={pages[i].options[j].module} component={Page}/>);
                }
                if(operations && operations.indexOf("edit") > -1){
                    rt.push(<PrivateRoute key={path + '_edit'} path={path + '/edit/:id'} module={pages[i].options[j].module} component={Page}/>);
                }
                rt.push(<PrivateRoute key={path} exact path={path} module={pages[i].options[j].module} component={Page}/>);
            }
        }
        setRoutes(rt);
    }, []);

    return (
        <Router>
            <Layout>
                <FuncProvider props={{fullName}}>
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <PrivateRoute exact path="/" component={Dashboard}/>
                        {routes.map(route => {
                            return route;
                        })}
                    </Switch>
                </FuncProvider>
            </Layout>
        </Router>
    );
}
