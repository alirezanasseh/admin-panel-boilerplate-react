import React from "react";
import moment from "moment-jalaali";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram, faTelegram} from '@fortawesome/free-brands-svg-icons'
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import * as locales from "../../locales";

export default function processField(props) {
    let {row, field, model, imageShow, setImageShow} = props.props;
    if (!field) return;
    let lng = localStorage.getItem("locale") ?? "en";
    let calendar = locales[lng].calendar;

    const socials = {
        "telegram": faTelegram,
        "instagram": faInstagram
    };

    const showNestedField = (row, field) => {
        let nested_fields = field.name.split(".");
        let value = row[nested_fields[0]];
        if(value) {
            for (let i = 1; i < nested_fields.length; i++) {
                if (nested_fields[i]) {
                    value = value[nested_fields[i]];
                }
            }
        }
        return value;
    };

    const process = field => {
        let type = '';
        if(model[field.name]){
            type = model[field.name].type;
        }
        if(field.type){
            type = field.type;
        }
        let result = '';
        let value = '';
        switch (type) {
            case "nested":
                result = showNestedField(row, field);
                break;
            case "image":
                if (row[field.name]) {
                    result = <img
                        src={row[field.name]}
                        className="small-icon"
                        onClick={() => {
                            setImageShow(imageShow.changeBatch({
                                image: {
                                    src: row[field.name],
                                    show: true
                                }
                            }));
                        }}
                        alt={row[field.name]}
                    />;
                }
                break;
            case "images":
                if (row[field.name] && row[field.name][0]) {
                    result = <img
                        src={row[field.name][0]}
                        className={row[field.name].length > 1 ? "small-icon multiple-images" : "small-icon"}
                        onClick={() => setImageShow(imageShow.changeBatch({
                            images: imageShow.images.changeBatch({
                                src: row[field.name],
                                show: true
                            })
                        }))}
                        alt={row[field.name]}
                    />;
                }
                break;
            case "multiple":
                let temp = '';
                for (let i = 0; i < field.result.length; i++) {
                    value = '';
                    if (field.result[i].title) {
                        value = field.result[i].title + ' : ';
                    }
                    temp = process(field.result[i]);
                    if(!temp) continue;
                    result = <>{result}{i < field.result.length ? field.separator : ''}{value}{temp}</>;
                }
                break;
            case "select":
                let a = model[field.name].items.filter(item => item.key === row[field.name])[0];
                if (a) result = a.value;
                else result = '';
                break;
            case "function":
                result = field.value.func(field.value.params.map(param => {
                    if (param.type === "static") {
                        return param.value;
                    } else {
                        return row[param];
                    }
                }));
                break;
            case "static":
                result = field.value;
                break;
            case "date":
                let fmt = calendar === "jalali" ? "jYYYY/jMM/jDD" : "YYYY/MM/DD";
                result = row[field.name] ? moment(row[field.name], "YYYY/MM/DD HH:mm:ss").format(fmt) : '';
                break;
            case "time":
                result = row[field.name] ? moment(row[field.name], "YYYY/MM/DD HH:mm:ss").format("HH:mm:ss") : '';
                break;
            case "timeago":
                result = row[field.name] ? moment(row[field.name], "YYYY/MM/DD HH:mm:ss").fromNow() : '';
                break;
            case "formatted_number":
                result = row[field.name] ? new Intl.NumberFormat().format(row[field.name]) : '';
                break;
            case "social":
                result = row[field.name] ?
                    row[field.name].indexOf(field.url) > -1 ?
                        <a href={row[field.name]} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={socials[field.icon]} size="lg"/></a>
                        :
                        <a href={field.url + row[field.name]} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={socials[field.icon]} size="lg"/></a>
                    :
                    '';
                break;
            case "checkbox":
                result = row[field.name] ? <FontAwesomeIcon icon={faCheck} size="lg" color="green"/> : '';
                break;
            default:
                result = row[field.name];
        }
        if (field.max_length) {
            if (row[field.name]) {
                result = row[field.name].length > field.max_length ? <span title={result}>{result.substring(0, field.max_length) + "..."}</span> : result;
            }
        }
        if (!result) {
            result = '';
        }
        return result;
    };

    return process(field);
};
