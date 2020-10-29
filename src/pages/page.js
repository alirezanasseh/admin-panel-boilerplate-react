import React, {useContext, useEffect, useState} from 'react';
import List from "../components/list/index";
import * as models from "../models/";
import Item from "../components/item";
import {Modal, Button} from "react-bootstrap";
import ShowList from "../components/showList";
import {FuncContext} from "../providers/funcProvider";
import {Context} from "../providers/mainProvider";

export default function Page(props) {
    const {module} = props;
    const [entities, setEntities] = useState({});
    const [modal, setModal] = useState({
        title: '',
        body: '',
        show: false
    });
    const {functions} = useContext(FuncContext);
    const {locale} = useContext(Context);
    let pathname = props.location ? props.location.pathname : '';

    const linkWithIdAndTitle = args => {
        return <a href={`/${args[0]}/edit/${args[1]}`} target="_blank" rel="noopener noreferrer">{args[2]}</a>;
    };

    const linkWithUrlAndTitle = args => {
        return <a href={args[0]} target="_blank" rel="noopener noreferrer">{args[1]}</a>;
    };

    const showListModal = args => {
        setModal({
            title: args.title,
            body: <ShowList props={args}/>,
            show: true
        });
    };

    const hideModal = () => {
        setModal({
            title: '',
            body: '',
            show: false
        });
    };

    const roundToDeci = args => Math.round(args[0] * 100) / 100;

    useEffect(() => {
        setEntities(models[module]({
            page: props.match.params.page,
            id: props.match.params.id,
            linkWithIdAndTitle,
            showListModal,
            roundToDeci,
            linkWithUrlAndTitle,
            functions
        }));
    }, [module]);

    return (
        <div>
            <Modal show={modal.show} onHide={hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modal.body}</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={hideModal}>{locale.close}</Button>
                </Modal.Footer>
            </Modal>
            {entities.base ?
                pathname.indexOf("add") > -1 || pathname.indexOf("edit") > -1 ?
                    <Item
                        props={{
                            base: entities.base,
                            item: entities.item
                        }}
                    />
                    :
                    <List
                        props={{
                            base: entities.base,
                            list: entities.list
                        }}
                    />
                : ''
            }
        </div>
    );
}