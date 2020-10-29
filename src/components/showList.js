import React, {useContext, useEffect, useState} from 'react';
import List from "./list/index";
import * as models from "../models/";
import {FuncContext} from "../providers/funcProvider";

export default function ShowList(props) {
    const [entities, setEntities] = useState({});
    const {functions} = useContext(FuncContext);

    let {module} = props.props;
    let params = {...props.props};
    delete params['module'];
    delete params['title'];
    params.page = 1;
    params.functions = functions;

    useEffect(() => {
        setEntities(models[module](params));
    }, [module]);

    return (
        <div>
            {entities.base &&
                <List
                    props={{
                        base: entities.base,
                        list: entities.list,
                        showList: true
                    }}
                />
            }
        </div>
    );
}