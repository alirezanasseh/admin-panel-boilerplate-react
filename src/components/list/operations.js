import React, {useContext, useState} from "react";
import {Alert, Button} from "react-bootstrap";
import {CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon, HeartIcon, MailIcon} from "@primer/octicons-react";
import Loading from "../loading";
import xhr from "../xhr";
import {Link} from "react-router-dom";
import {Context} from "../../providers/mainProvider";

export default function Operations(props) {
    let {base, operations, custom_operations, setMessage, row, rows, setRows} = props.props;
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [currentRow, setCurrentRow] = useState(row);
    const {locale} = useContext(Context);

    const icons = {
        'HeartIcon': <HeartIcon/>,
        'MailIcon': <MailIcon/>
    };

    const remove = id => {
        let ans = window.confirm(locale.remove_confirm);
        if(!ans) return;
        setRemoveLoading(true);
        new xhr({
            url: base.module,
            data: {id}
        }).sendRequest({method: "DELETE"},response => {
            setMessage(<Alert variant={response.status ? "success" : "danger"}>{response.note}</Alert>);
            if(response.status) {
                setRows(rows.filter(item => item.id !== id));
            }
            setRemoveLoading(false);
        });
    };

    const confirm = confirmed => {
        setConfirmLoading(true);

        let data = {
            id: currentRow.id,
        };
        if (base.confirm_other_fields) {
            let otherField = '';
            for (let i = 0; i < base.confirm_other_fields.length; i++) {
                otherField = base.confirm_other_fields[i];
                if (otherField.name) {
                    if (otherField.name.indexOf('.') > -1) {
                        //TODO: add support for multilevel nested fields (now it's just two level nested fields)
                        let otherFieldArray = otherField.name.split('.');
                        data[otherField.alias] = currentRow[otherFieldArray[0]][otherFieldArray[1]];
                    } else {
                        data[otherField.alias] = currentRow[otherField.name];
                    }
                } else {
                    data[base.confirm_other_fields[i]] = currentRow[base.confirm_other_fields[i]];
                }
            }
        }
        data[base.confirm_field] = confirmed;
        let confirmExtraFields = base.confirm_extra_fields;
        if(confirmExtraFields){
            for(let i = 0; i < confirmExtraFields.length; i++){
                data[confirmExtraFields[i]] = confirmed;
            }
        }

        new xhr({
            url: base.module,
            data
        }).Put((response) => {
            setConfirmLoading(false);
            if(response.status){
                setCurrentRow(currentRow.change(base.confirm_field, confirmed));
            }else{
                setMessage(<Alert variant="danger">{response.note}</Alert>);
            }
        });
    };
    let opKey = 0;

    return <>
        {custom_operations && custom_operations.map(op =>
            <span key={opKey++}>
                <Button
                    variant={op.className}
                    style={op.style}
                    onClick={() => {
                        let params = {};
                        for (let i = 0; i < op.click.params.length; i++) {
                            if (op.click.params[i].type === "static") {
                                params[op.click.params[i].name] = op.click.params[i].value;
                            } else {
                                params[op.click.params[i]] = currentRow[op.click.params[i]];
                            }
                        }
                        op.click.func(params);
                    }}
                    title={op.title}
                >
                    {op.caption.icon ? icons[op.caption.icon] : op.caption}
                </Button>{' '}
            </span>
        )}
        {operations && operations.indexOf("confirm") > -1 && (
            !confirmLoading ?
                currentRow[base.confirm_field] ?
                    <span key={opKey++}>
                        <Button
                            variant="success"
                            title={locale.reject}
                            onClick={() => confirm(false)}
                        >
                            <CheckCircleIcon verticalAlign='middle' size={20} aria-label=""/>
                        </Button>{' '}
                    </span>
                    :
                    <span key={opKey++}>
                        <Button
                            variant="danger"
                            title={locale.confirm + " " + base.entity}
                            onClick={() => confirm(true)}
                        >
                            <XCircleIcon verticalAlign='middle' size={20}/>
                        </Button>{' '}
                    </span>
                :
                <span key={opKey++}><Button variant="default">{<Loading theme="dark"/>}</Button>{' '}</span>
        )}
        {operations && operations.indexOf("edit") > -1 &&
        <Link to={base.path + "/edit/" + currentRow.id}>
            <Button variant="info" title={locale.edit}>
                <PencilIcon verticalAlign='middle' size={20}/>
            </Button>
            {' '}
        </Link>}
        {operations && operations.indexOf("remove") > -1 && (
            !removeLoading ?
                <Button variant="danger" title={locale.remove} onClick={() => {
                    remove(currentRow.id)
                }}>
                    <TrashIcon verticalAlign='middle' size={20}/>
                </Button>
                :
                <Button variant="danger">{<Loading theme="light"/>}</Button>
        )}
    </>;
}