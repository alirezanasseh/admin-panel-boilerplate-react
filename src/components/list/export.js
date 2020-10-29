import React from "react";
import ProcessField from "./processField";

export default function Export(props) {
    let {export_fields, rows, model} = props.props;
    return(
        <table className="table table-striped hidden" id="table-to-xls">
            <thead>
            <tr>
                {export_fields && export_fields.map(field =>
                    <th key={model[field.name].title}>{model[field.name].title}</th>
                )}
            </tr>
            </thead>
            <tbody>
            {rows &&
            rows.map(row =>
                <tr key={`row_${row.id}`}>
                    {export_fields && export_fields.map(field =>
                        <td title={field.max_length ? row[field.name] : ""} style={field.style} key={`cell_${row.id}_${field.name}_${field.type}`}>
                            <ProcessField props={{
                                row,
                                field,
                                model: model[field.name],
                                imageShow: false,
                                setImageShow: () => {}
                            }}/>
                        </td>
                    )}
                </tr>
            )}
            </tbody>
        </table>
    );
}