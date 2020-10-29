import React from "react";
import {Accordion, Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import Pages from "../pages";

export default function SideBar() {
    let pages = Pages();
    let activeId = null;
    let path = '';
    let {pathname} = window.location;
    let slashPos = pathname.substring(1).indexOf("/") + 1;
    if(slashPos === 0) slashPos = pathname.length;
    path = pathname.substring(0, slashPos);
    for(let p = 0; p < pages.length; p++){
        for(let o = 0; o < pages[p].options.length; o++){
            if(pages[p].options[o].path === path){
                activeId = pages[p].id;
                break;
            }
        }
        if(activeId) break;
    }

    const changePage = e => {
        if(document.getElementsByClassName('active-link')[0]){
            document.getElementsByClassName('active-link')[0].className = '';
        }
        e.target.className = 'active-link';
    };

    return (
        <div>
            <Accordion defaultActiveKey={activeId}>
                {pages.map(page =>
                    <Card key={page.id}>
                        <Accordion.Toggle as={Card.Header} eventKey={page.id}>
                            {page.title}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={page.id}>
                            <Card.Body>
                                <ul className="sidebar-list">
                                    {page.options.map(option =>
                                        <li key={option.id}>
                                            <Link to={option.path} onClick={changePage} className={option.path === path ? "active-link" : ""}>{option.title}</Link>
                                        </li>
                                    )}
                                </ul>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                )}
            </Accordion>
        </div>
    );
}