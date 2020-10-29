import React, {useContext, useEffect} from "react";
import {Accordion, Card, Button, Form, Row, Col} from "react-bootstrap";
import DatePicker from 'react-datepicker2';
import {Loading} from "../index";
import SelectSearch from 'react-select-search';
import Picker from "./picker";
import {Context} from "../../providers/mainProvider";

export default function Search(props) {
    let {
        search,
        setSearch,
        search_data,
        searchLoading,
        setSearchLoading,
        searchItem,
        setSearchItem,
        doSearch,
        setDoSearch,
        model
    } = props.props;
    let optionCount = 0;
    const {locale} = useContext(Context);

    const changeSearch = e => {
        let target = e.target;
        if(target.type === "checkbox"){
            setSearch(search.change([target.name], target.checked));
            setSearchItem(searchItem.change([target.name], [target.name, target.checked]));
        }else{
            setSearch(search.change([target.name], target.value));
            setSearchItem(searchItem.change([target.name], [target.name, target.value]));
        }

        if(target.value === ''){
            setSearchItem(searchItem.removeKey([target.name]));
        }
    };

    const changeSearchDate = (value, field) => {
        if(!value || typeof value === "string") return;
        setSearch(search.change([field], value.format('YYYY/MM/DD HH:mm:ss')));
        let pre = locale.from + " ";
        if(field.indexOf("_to") > -1) pre = locale.to + " ";
        setSearchItem(searchItem.change([field], [field, pre + value.format('jYYYY/jMM/jDD HH:mm')]));

        if(value === ''){
            setSearchItem(searchItem.removeKey(field));
        }
    };

    const changeSelectSearch = args => {
        if(args.event){
            setSearch(search.changeBatch({
                [args.name]: args.event.value,
                [args.value]: args.event.name
            }));
            setSearchItem(searchItem.change([args.name], [args.name, args.event.name]));
        }
    };

    const changePicker = args => {
        setSearch(search.change([args.field], args.id));
        setSearchItem(searchItem.change([args.field], [args.field, args.caption]));
    };

    const handleSearch = () => {
        setSearchLoading(true);
        setDoSearch(doSearch + 1);
    };

    const removeSearchItem = key => {
        setSearch(search.change([key], ''));
        setSearchItem(searchItem.removeKey([key]));
        handleSearch();
    };

    useEffect(() => {}, [searchLoading]);

    return (
        <Accordion id="search-panel">
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    {locale.search}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <Form onSubmit={handleSearch}>
                            {search_data.map(search_field => {
                                let input;
                                search_field.placeholder = search_field.placeholder || model[search_field.name].title;
                                switch(search_field.field_type){
                                    case "between":
                                        input = <Row>
                                            <Col sm={6}>
                                                <Form.Control
                                                    type="text"
                                                    name={search_field.name + "_from"}
                                                    value={search_field.value ? search[search_field.value + "_form"] : search[search_field.name + "_form"]}
                                                    placeholder={search_field.placeholder + locale.from + " "}
                                                    onChange={changeSearch}
                                                />
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Control
                                                    type="text"
                                                    name={search_field.name + "_to"}
                                                    value={search_field.value ? search[search_field.value + "_to"] : search[search_field.name + "_to"]}
                                                    placeholder={search_field.placeholder + locale.to + " "}
                                                    onChange={changeSearch}
                                                />
                                            </Col>
                                        </Row>;
                                        break;
                                    case "between_dates":
                                        input = <Row>
                                            <Col sm={12}>{search_field.placeholder}</Col>
                                            <Col sm={6}>
                                                از <DatePicker
                                                    onChange={value => changeSearchDate(value, search_field.name + "_from")}
                                                    value={search_field.value ? search[search_field.value + "_form"] : search[search_field.name + "_form"]}
                                                    isGregorian={false}
                                                />
                                            </Col>
                                            <Col sm={6}>
                                                تا <DatePicker
                                                    onChange={value => changeSearchDate(value, search_field.name + "_from_to")}
                                                    value={search_field.value ? search[search_field.value + "_form_to"] : search[search_field.name + "_form_to"]}
                                                    isGregorian={false}
                                                />
                                            </Col>
                                        </Row>;
                                        break;
                                    case "select":
                                        input = <Form.Control
                                            as="select"
                                            name={search_field.name}
                                            value={search[search_field.value]}
                                            placeholder={search_field.placeholder}
                                            onChange={changeSearch}
                                        >
                                            <option value="">
                                                {search_field.placeholder ? search_field.placeholder : "-"}
                                            </option>
                                            {search_field.source_data && search_field.source_data.map(source_item =>
                                                <option key={optionCount++} value={source_item.key}>
                                                    {source_item.value || source_item.name}
                                                </option>
                                            )}
                                        </Form.Control>;
                                        break;
                                    case "select_search":
                                        input = <SelectSearch
                                            options={search_field.source_data}
                                            name={search_field.name}
                                            value={search[search_field.value]}
                                            placeholder={search_field.placeholder}
                                            onChange={event => changeSelectSearch({event: event, name: search_field.name, value: search_field.value || search_field.name})}
                                        />;
                                        break;
                                    case "checkbox":
                                        input = <Form.Check
                                            type="checkbox"
                                            name={search_field.name}
                                            checked={search_field.value ? search[search_field.value] : search[search_field.name]}
                                            onChange={changeSearch}
                                            label={search_field.title || search_field.placeholder}
                                        />;
                                        break;
                                    case "picker":
                                        input = <Picker props={{
                                            module: search_field.module,
                                            field: search_field.name,
                                            field_title: model[search_field.name].title,
                                            result: changePicker
                                        }}/>;
                                        break;
                                    default:
                                        input = <Form.Control
                                            type="text"
                                            name={search_field.name}
                                            value={search_field.value ? search[search_field.value] : search[search_field.name]}
                                            placeholder={search_field.placeholder}
                                            onChange={changeSearch}
                                        />;
                                        break;
                                }
                                return(
                                    <Form.Group key={search_field.name}>
                                        {input}
                                    </Form.Group>
                                );
                            })}
                            <Button type="submit" variant="info" onClick={handleSearch} disabled={searchLoading}>
                                {searchLoading ? <Loading theme="light"/> : locale.search}
                            </Button>
                            <div>
                                {Object.values(searchItem).map(item =>
                                    <div className="search-item">
                                        {item[1] + ' '}
                                        <Button variant="danger" bsSize="xsmall" onClick={() => removeSearchItem(item[0])}>×</Button>
                                    </div>
                                )}
                            </div>
                        </Form>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}