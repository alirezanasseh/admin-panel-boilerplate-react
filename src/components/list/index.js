import React, {useState} from "react";
import Header from "./header";
import Search from "./search";
import Table from "./table";
import ListPagination from "./pagination";

export default function List(props){
    let {base, list, showList} = props.props;
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        perPage: 25 ,
        count : 0
    });
    const [search, setSearch] = useState({});
    const [searchItem, setSearchItem] = useState({});
    const [searchLoading, setSearchLoading] = useState(false);
    const [showConfirmed, setShowConfirmed] = useState(1);
    const [doSearch, setDoSearch] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    return (
        <div>
            {!showList &&
                <>
                    <Header props={{
                        entities: base.entities,
                        entity: base.entity,
                        path: base.path,
                        confirm_field: base.confirm_field,
                        operations: list.operations,
                        custom_add: list.custom_add,
                        export_fields: list.export_fields,
                        setPagination,
                        pagination,
                        showConfirmed,
                        setShowConfirmed,
                        message
                    }}/>
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
                            showConfirmed,
                            model: base.model
                        }}/>
                    }
                </>
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
                    showConfirmed,
                    loading,
                    setLoading,
                    setMessage
                }}
            />
            <ListPagination props={{
                pagination,
                page,
                setPage,
                loading
            }}/>
        </div>
    );
}