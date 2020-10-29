import React from "react";
import {Button, Modal} from "react-bootstrap";
import * as locales from "../locales";

export const FuncContext = React.createContext({});

export default class FuncProvider extends React.Component {
    constructor(props) {
        super(props);
        this.fullName = props.props.fullName;
        this.lng = localStorage.getItem("locale") ?? "en";
        this.state = {
            setValue: this.setValue,
            modal: {
                title: '',
                body: '',
                show: false
            },
            functions: {}
        };
    }

    setValue = val => {
        this.setState(val);
    };

    hideModal = () => this.setState({
        modal: {
            title: '',
            body: '',
            show: false
        },
    });

    render() {
        let {modal} = this.state;
        return (
            <FuncContext.Provider value={this.state}>
                <Modal show={modal.show} onHide={this.hideModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{modal.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modal.body}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-primary" onClick={this.hideModal}>{locales[this.lng].texts.close}</Button>
                    </Modal.Footer>
                </Modal>
                {this.props.children}
            </FuncContext.Provider>
        );
    }
}
