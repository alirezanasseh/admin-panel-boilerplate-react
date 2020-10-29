import React, {useContext, useEffect, useState} from "react";
import xhr from "../xhr";
import Loading from "../loading";
import ProcessField from "./processField";
import ShowImages from "./showImages";
import Operations from "./operations";
import {Alert} from "react-bootstrap";
import Export from "./export";
import {Context} from "../../providers/mainProvider";

export default function Table(props) {
    let {
        base,
        list,
        search,
        pagination,
        setPagination,
        page,
        doSearch,
        setSearchLoading,
        showConfirmed,
        loading,
        setLoading,
        setMessage,
        picker
    } = props.props;
    const [rows, setRows] = useState([]);
    const [imageShow, setImageShow] = useState({
        image: {},
        images: {photo_index: 0}
    });
    const {locale} = useContext(Context);

    const hasOperations = (list.operations && list.operations.length > 0) || (list.custom_operations && list.custom_operations.length > 0);

    const getRows = () => {
        setLoading(true);
        let request = {
            url: base.module,
            server: base.server,
            page,
            perPage: pagination.perPage,
            data: {
                conditions: generateConditions(),
                sort: {_id: -1}
            }
        };
        new xhr(request).GetMany(response => {
            setLoading(false);
            setSearchLoading(false);
            if (response && response.status) {
                setRows(response.data.list);
                setPagination(pagination.change('count', response.data.count));
                window.scroll(0, 0);
            } else {
                setMessage(<Alert variant="danger">{response.note}</Alert>);
            }
        });
    };

    const generateConditions = () => {
        let search_data = list.search;
        let cond = list.default_conditions || {};
        if (search_data) {
            let value;
            for (let i = 0; i < search_data.length; i++) {
                search_data[i].field = search_data[i].field ? search_data[i].field : search_data[i].name;
                value = '';
                if (search[search_data[i].name] || (search[search_data[i].name + "_from"] && search[search_data[i].name + "_to"])) {
                    if (search_data[i].search_type === "exact") {
                        value = search[search_data[i].name];
                    }
                    if (!search_data[i].search_type || search_data[i].search_type === "regex") {
                        if (!search_data[i].search_type || search_data[i].regex_type === "middle") {
                            value = {$regex: ".*" + search[search_data[i].name] + ".*"};
                        }
                        if (search_data[i].regex_type === "start") {
                            value = {$regex: search[search_data[i].name] + ".*"};
                        }
                    }
                    if (search_data[i].search_type === "gte") {
                        value = {$gte: parseInt(search[search_data[i].name])};
                    }
                    if (search_data[i].search_type === "lte") {
                        value = {$lte: parseInt(search[search_data[i].name])};
                    }
                    if (search_data[i].search_type === "between") {
                        value = {
                            $gte: parseInt(search[search_data[i].name + "_from"]),
                            $lte: parseInt(search[search_data[i].name + "_to"])
                        };
                    }
                }
                if (value) {
                    search_data[i].field ? cond[search_data[i].field] = value : cond[search_data[i].field] = value;
                }
                if (search_data[i].fields) {
                    let condArray = [];
                    for (let j = 0; j < search_data[i].fields.length; j++) {
                        let search_field = search_data[i].fields[j];
                        value = '';
                        if (search[search_data[i].name]) {
                            if (search_field.search_type === "exact") {
                                value = search[search_data[i].name];
                            }
                            if (search_field.search_type === "regex") {
                                if (search_field.regex_type === "middle") {
                                    value = {$regex: ".*" + search[search_data[i].name] + ".*"};
                                }
                                if (search_field.regex_type === "start") {
                                    value = {$regex: search[search_data[i].name] + ".*"};
                                }
                            }
                        }
                        if (value) {
                            if(search_data[i].field_type === "number"){
                                value = parseInt(value);
                            }
                            condArray.push({[search_field.field]: value});
                        }
                    }
                    if (condArray.length > 0) {
                        cond["$or"] = condArray;
                    }
                }
            }
        }
        switch (showConfirmed) {
            case 2:
                cond[base.confirm_field] = true;
                break;
            case 3:
                cond[base.confirm_field] = false;
                break;
            default:
                break;
        }
        return cond;
    };

    useEffect(() => {
        getRows();
    }, [base, pagination.perPage, page, showConfirmed]);

    useEffect(() => {
        page = 1;
        getRows();
    }, [doSearch]);

    return (
        <div className="table-responsive">
            {
                loading ?
                    <Loading/>
                    :
                    <>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                {picker && base.picker.fields ?
                                    base.picker.fields.map(field => {
                                        return <th key={"header_cell_" + field.name + "_" + field.type}>{base.model[field.name] ? base.model[field.name].title : field.title}</th>;
                                    })
                                    :
                                    list.fields && list.fields.map(field => {
                                    return <th key={"header_cell_" + field.name + "_" + field.type}>{base.model[field.name] ? base.model[field.name].title : field.title}</th>;
                                })
                                }
                                {hasOperations && <th style={list.operations_style || {width: "120px"}}>{locale.operations}</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {rows && rows.map(row => <tr key={`row_${row.id}`}>
                                {
                                    picker && base.picker.fields ?
                                        base.picker.fields.map(field =>
                                            <td
                                                key={`cell_${row.id}_${field.name}_${field.type}`}
                                                style={
                                                    {
                                                        ...field.style,
                                                        ...{
                                                            wordBreak: 'break-word',
                                                            maxWidth: '200px'
                                                        }
                                                    }
                                                }
                                            >
                                                <ProcessField props={{
                                                    row,
                                                    field,
                                                    model: base.model,
                                                    imageShow,
                                                    setImageShow
                                                }}/>
                                            </td>
                                        )
                                        :
                                        list.fields && list.fields.map(field =>
                                            <td
                                                key={`cell_${row.id}_${field.name}_${field.type}`}
                                                style={
                                                    {
                                                        ...field.style,
                                                        ...{
                                                            wordBreak: 'break-word',
                                                            maxWidth: '200px'
                                                        }
                                                    }
                                                }
                                            >
                                                <ProcessField props={{
                                                    row,
                                                    field,
                                                    model: base.model,
                                                    imageShow,
                                                    setImageShow
                                                }}/>
                                            </td>
                                        )
                                }
                                {hasOperations && <td>
                                    <Operations props={{
                                        base,
                                        operations: list.operations,
                                        custom_operations: list.custom_operations,
                                        setMessage,
                                        row,
                                        rows,
                                        setRows
                                    }}/>
                                </td>}
                            </tr>)}
                            </tbody>
                        </table>
                        {list.export_fields && <Export props={{
                            export_fields: list.export_fields,
                            model: base.model,
                            rows
                        }}/>}
                    </>
            }
            <ShowImages props={{imageShow, setImageShow}}/>
        </div>
    );
}
