import React, {useContext} from "react";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import {Context} from "../providers/mainProvider";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Header(props) {
    const {auth, logout, locale, setLocale} = useContext(Context);
    const {open, setOpen} = props.props;

    return (
        <header className="main-header">
            <Navbar bg="light" expand="lg">
                <Navbar.Brand>
                    <Link onClick={() => setOpen(!open)}><div className="toggle-menu"><FontAwesomeIcon icon={faBars}/></div></Link>
                    <Link to="/">{locale.title}</Link>
                </Navbar.Brand>
                <Nav className="mr-auto"/>
                <NavDropdown title="Language" id="basic-nav-dropdown">
                    <NavDropdown.Item><Link to="#" onClick={() => setLocale('en')}>English</Link></NavDropdown.Item>
                    <NavDropdown.Item><Link to="#" onClick={() => setLocale('fa')}>فارسی</Link></NavDropdown.Item>
                </NavDropdown>
                {auth ?
                    <Nav.Item><Link onClick={() => logout()} to="#">{locale.logout}</Link></Nav.Item>
                    :
                    <Nav.Item><Link to="/login">{locale.login}</Link></Nav.Item>
                }
            </Navbar>
        </header>
    );
}