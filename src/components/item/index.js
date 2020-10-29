import React, {useContext, useEffect, useMemo, useState} from "react";
import {Form, Button, Alert} from "react-bootstrap";
import {xhr} from "../index";
import Field from "./field";
import {Loading} from "../";
import {Context} from "../../providers/mainProvider";

export default function Item(props) {
    const [message, setMessage] = useState('');
    const [id, setId] = useState(null);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [mapCircle, setMapCircle] = useState({});
    const {locale} = useContext(Context);

    const base = useMemo(() => {
        return props.props.base;
    }, []);
    const item = useMemo(() => {
        return props.props.item;
    }, []);
    const title = useMemo(() => {
        let temp = '';
        if(item.id){
            setId(item.id);
            temp = locale.edit + ' ' + base.entity;
        }else{
            temp = locale.add_new.replace('%', base.entity);
        }
        return temp;
    }, []);

    const afterChange = (name, value) => {
        console.log(name, value);
        if(name === "radius"){
            setMapCircle(mapCircle.change("radius", value));
        }
    };

    const changeField = (name, value) => {
        setData(data.change(name, value));
        if(base.model[name] && base.model[name].afterChange){
            afterChange(name, value);
        }
    };

    const showResult = response => {
        if(response.status){
            setMessage(<Alert variant="success">{response.note}</Alert>);
        }else{
            setMessage(<Alert variant="danger">{response.note}</Alert>);
        }
        window.scroll(0, 0);
        setLoading(false);
    };

    const submit = e => {
        e.preventDefault();
        setLoading(true);
        if(id){
            new xhr({
                url: base.module,
                data
            }).Put(showResult);
        }else{
            new xhr({
                url: base.module,
                data
            }).Post(showResult);
        }
    };

    useEffect(() => {
        if(id) {
            new xhr({url: base.module + '/' + id, server: base.server}).GetOne(response => setData(response));
        }else{
            setData({});
        }
    }, []);

    return (
        <div>
            <h2>{title}</h2>
            {message}
            {data ?
                <Form onSubmit={submit}>
                    {item && item.fields.map(field => <Field props={{
                        id,
                        base,
                        field,
                        data,
                        mapCircle,
                        changeField
                    }}/>)}
                    <Button type="submit" disabled={loading ? "true" : ""}>{loading ? <Loading theme="light"/> : locale.save}</Button>
                </Form>
                :
                <Loading/>
            }
        </div>
    );
}