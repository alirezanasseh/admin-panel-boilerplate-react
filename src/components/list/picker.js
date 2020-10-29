import React, {useContext, useMemo, useState} from "react";
import Search from "./search";
import Table from "./table";
import ListPagination from "./pagination";
import {Button, Modal} from "react-bootstrap";
import * as models from "../../models";
import {FuncContext} from "../../providers/funcProvider";

export default function Picker(props) {
    let {module, field, field_title, cp, result} = props.props;
    const {functions} = useContext(FuncContext);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        perPage: 10,
        count: 0
    });
    const [search, setSearch] = useState({});
    const [searchItem, setSearchItem] = useState({});
    const [searchLoading, setSearchLoading] = useState(false);
    const [doSearch, setDoSearch] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [caption, setCaption] = useState(cp);

    const pick = args => {
        let id = args.id;
        let cp = "";
        for(let i = 0; i < base.picker.caption.length; i++){
            if(base.picker.caption[i].static){
                cp += base.picker.caption[i].static;
            }else{
                cp += args[base.picker.caption[i]];
            }
        }
        setCaption(cp);
        setShowPicker(false);
        result({id, field, caption: cp});
    };

    const entity = useMemo(() => {
        return models[module]({
            page: 1,
            functions
        })
    }, []);

    let base = useMemo(() => {
        let temp = entity.base;
        temp.picker.params.push("id");
        return temp;
    }, []);

    let list = useMemo(() => {
        let temp = entity.list;
        temp.operations = [];
        temp.custom_operations = [
            {
                className: 'success',
                caption: 'انتخاب',
                click: {
                    func: pick,
                    params: base.picker.params
                }
            }
        ];
        temp.operations_style = {width: "100px"};
        return temp;
    }, []);

    return (
        <div>
            <Modal show={showPicker} onHide={() => setShowPicker(false)} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>انتخاب {field_title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {list.search &&
                    <Search props={{
                        search,
                        setSearch,
                        search_data: list.search,
                        searchLoading,
                        setSearchLoading,
                        searchItem,
                        setSearchItem,
                        doSearch,
                        setDoSearch,
                        model: base.model
                    }}/>
                    }
                    <Table
                        props={{
                            list,
                            base,
                            pagination,
                            setPagination,
                            page,
                            search,
                            setSearchLoading,
                            doSearch,
                            loading,
                            setLoading,
                            picker: true
                        }}
                    />
                    <ListPagination props={{
                        pagination,
                        page,
                        setPage,
                        loading
                    }}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={() => setShowPicker(false)}>بستن</Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={() => setShowPicker(true)}>{'انتخاب ' + field_title}</Button>
            {' '}
            {caption}
        </div>
    );
}