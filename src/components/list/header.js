import React, {useContext, useState} from "react";
import {Button, Form} from "react-bootstrap";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {Link} from "react-router-dom";
import {Context} from "../../providers/mainProvider";

export default function Header(props) {
    let {
        entities,
        entity,
        operations,
        custom_add,
        path,
        confirm_field,
        showConfirmed,
        setShowConfirmed,
        export_fields,
        pagination,
        setPagination,
        message
    } = props.props;
    const [perPage, setPerPage] = useState(pagination.perPage);
    const {locale} = useContext(Context);

    const handleChangePerPage = e => {
        let target = e.target;
        if (pagination.perPage !== target.value) {
            setPagination(pagination.change('perPage', target.value));
            setPerPage(target.value);
        }
    };

    return (
        <div>
            <span>
                <h2>{entities}</h2>
                {message}
                <div className="row">
                    <div className="col-md-4">
                        {operations && operations.indexOf("add") > -1 && (
                            custom_add ?
                                <Button
                                    variant={custom_add.class}
                                    onClick={custom_add.click.func}
                                >
                                    {custom_add.caption}
                                </Button>
                                :
                                <Link to={`${path}/add`}><Button variant="primary">{locale.add_new.replace('%', entity)}</Button></Link>
                        )}
                    </div>
                    <div className="col-md-4">
                        <div className="count">
                            {locale.count} :{' ' + pagination.count}
                        </div>
                        {confirm_field &&
                        <div className="confirm-selector">
                            <Form.Check
                                type="radio"
                                name="show_confirmed"
                                label={locale.all}
                                inline
                                checked={showConfirmed === 1}
                                onChange={() => setShowConfirmed(1)}
                            />
                            {' '}
                            <Form.Check
                                type="radio"
                                name="show_confirmed"
                                inline
                                checked={showConfirmed === 2}
                                onChange={() => setShowConfirmed(2)}
                                label={locale.confirmed}
                            />
                            {' '}
                            <Form.Check
                                type="radio"
                                name="show_confirmed"
                                inline
                                checked={showConfirmed === 3}
                                onChange={() => setShowConfirmed(3)}
                                label={locale.unconfirmed}
                            />
                        </div>
                        }
                    </div>
                    <div className="col-md-4 form-inline per-page-select">
                        <div>
                            {locale.perPageSelect} :
                            {' '}
                            <select
                                className="form-control"
                                name="perPage"
                                value={perPage}
                                onChange={handleChangePerPage}
                            >
                                {[10, 25, 50, 100, 200, 500, 1000].map(number =>
                                    <option key={"per_page_" + number} value={number}>{number}</option>
                                )}
                            </select>
                        </div>
                        {export_fields &&
                        <div className="export-button">
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button btn btn-success"
                                table="table-to-xls"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText={locale.excel}
                            />
                        </div>
                        }
                    </div>
                </div>
                <div style={{height: "10px"}}/>
            </span>
        </div>
    );
}