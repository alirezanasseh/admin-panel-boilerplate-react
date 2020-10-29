import React, {useContext, useMemo, useState} from "react";
import {Form, Button} from "react-bootstrap";
import xhr from "../xhr";
import moment from 'moment-jalaali';
import DatePicker from 'react-datepicker2';
import Loading from "../loading";
import {StyledImage} from "../image";
import Map from "../map";
import Picker from "../list/picker";
import {Context} from "../../providers/mainProvider";

const MashhadPosition = {lat: 36.300191, lng: 59.563351};

export default function Field(props) {
    let {base, field, data, mapCircle, changeField} = props.props;
    let fieldModel = useMemo(() => base.model[field.name], []);
    const {locale, calendar} = useContext(Context);
    let value = data[field.name];

    let mapPosition = value && value.coordinates ?
        {
            lat: value.coordinates[1],
            lng: value.coordinates[0]
        }
        :
        MashhadPosition;

    if(!fieldModel){
        fieldModel = {};
    }
    const [dateField, setDateField] = useState(fieldModel.type === "date" && value ? moment(value, 'YYYY/MM/DD') : null);
    const [uploading, setUploading] = useState(false);

    const change = e => {
        let target = e.target;
        let value;
        if(e.type === "checkbox"){
            value = e.target.checked;
        }else{
            value = target.value;
        }
        changeField(field.name, value);
    };

    const upload = file => {
        let data = new FormData();
        data.append('image', file);
        data.append('type', base.module);
        setUploading(true);
        new xhr({
            url: 'upload',
            data
        }).Post(response => {
            setUploading(false);
            let {link} = response.data ? response.data.item : null;
            if(link){
                if(fieldModel.type === "image"){
                    changeField(field.name, link);
                }
                if(fieldModel.type === "images"){
                    if(value.length > 0){
                        value.push(link);
                        changeField(field.name, value);
                    }else{
                        changeField(field.name, [link]);
                    }
                }
            }
        });
    };

    const removeImage = () => {
        changeField(field.name, '');
    };

    const changeDate = value => {
        changeField(field.name, value.format('YYYY/MM/DD'));
        setDateField(value);
    };

    const clickOnMap = e => {
        changeField(field.name, {
            type: "Point",
            coordinates: [e.latLng.lng(), e.latLng.lat()]
        });
    };

    const changePicker = args => {
        changeField(field.name, args.id);
    };

    const input = useMemo(() => {
        let inputField;
        let type = field.type ?? fieldModel.type;
        switch(type){
            case "image":
                inputField = <>
                    <StyledImage
                        width={fieldModel.width}
                        height={fieldModel.height}
                        upload={upload}
                    />
                    {value && <>
                        <img src={value} alt={fieldModel.title} className="icon"/>
                        <Button variant="danger" title={locale.remove} onClick={removeImage}>×</Button>
                    </>}
                </>;
                break;
            case "images":
                inputField = <>
                    <StyledImage
                        width={fieldModel.width}
                        height={fieldModel.height}
                        upload={upload}
                    />
                    {value && value.length > 0 && value.map(val =>
                        <>
                            <img src={val} alt={fieldModel.title} className="icon"/>
                            <Button variant="danger" title={locale.remove} onClick={removeImage}>×</Button>
                        </>
                    )}
                </>;
                break;
            case "textarea":
                inputField = <Form.Control
                    as="textarea"
                    name={field.name}
                    value={value}
                    onChange={change}
                    rows={field.rows ?? 10}
                    style={field.style}
                />;
                break;
            case "select":
                inputField = <Form.Control
                    as="select"
                    name={field.name}
                    value={value}
                    onChange={change}
                >
                    {fieldModel.items.map(item =>
                        <option value={item.key}>{item.value}</option>
                    )}
                </Form.Control>;
                break;
            case "date":
                inputField = <DatePicker
                    onChange={changeDate}
                    value={dateField ?? moment()}
                    isGregorian={calendar === "gregorian"}
                    timePicker={false}
                />;
                break;
            case "hidden":
                inputField = <Form.Control
                    type="hidden"
                    name={field.name}
                    value={value}
                />;
                break;
            case "password":
                inputField = <Form.Control
                    type="password"
                    name={field.name}
                    value={value}
                    onChange={change}
                    autoComplete="new-password"
                />;
                break;
            case "map":
                if(base.model[field.name].radius){
                    mapCircle = {radius: data[base.model[field.name].radius]};
                }
                inputField = <Map
                    center={mapPosition}
                    marker={mapPosition}
                    circle={mapCircle}
                    click={clickOnMap}
                />;
                break;
            case "picker":
                let pickerModule = base.model[field.name].module;
                inputField = <Picker props={{
                    module: pickerModule,
                    field: field.name,
                    field_title: base.model[field.name].title,
                    result: changePicker
                }}/>;
                break;
            case "checkbox":
                inputField = <Form.Check
                    type="checkbox"
                    name={field.name}
                    checked={value}
                    label={fieldModel.title}
                    onChange={change}
                />;
                break;
            default:
                inputField = <Form.Control
                    type="text"
                    name={field.name}
                    value={value}
                    onChange={change}
                />;
                break;
        }
        return inputField;
    }, [data]);

    let type = field.type ?? fieldModel.type;

    return <Form.Group>
        {type === "checkbox" ?
            input
            :
            <>
                <Form.Label>{fieldModel.title}</Form.Label>
                {uploading ? <Loading/> : input}
            </>
        }
    </Form.Group>;
}