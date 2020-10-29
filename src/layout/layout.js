import React, {useContext, useState} from "react";
import {Container, Row, Col} from "react-bootstrap";
import Header from "./header";
import SideBar from "./sidebar";
import {Context} from "../providers/mainProvider";

export default function Layout(props) {
    const {auth} = useContext(Context);
    const [open, setOpen] = useState(true);

    return (
            <>
                <Header props={{open, setOpen}}/>
                <Container fluid={true}>
                    <Row>
                        {auth ?
                            <>
                                <Col bsPrefix={open ? "sidebar col-xl-2 col-md-3 col-12" : "sidebar close"}><SideBar/></Col>
                                <Col bsPrefix={open ? "content col-xl-10 col-md-9 col-12" : "content col-12"}>{props.children}</Col>
                            </>
                            :
                            <Col bsPrefix="content">{props.children}</Col>
                        }
                    </Row>
                </Container>
            </>
    );
}