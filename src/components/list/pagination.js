import React from "react";
import {Pagination} from "react-bootstrap";

export default function ListPagination(props) {
    let {pagination, page, setPage, loading} = props.props;
    if(!pagination.count){
        return <div/>;
    }
    let {count, perPage} = pagination;
    let items = [];
    if(count > perPage){
        let pageCount = Math.ceil(count / perPage);
        if(pageCount <= 20){
            for(let number = 1; number <= pageCount; number++){
                items.push(
                    <Pagination.Item key={number} active={number === page} onClick={() => setPage(number)}>
                        {number}
                    </Pagination.Item>
                );
            }
        }else{
            if (page > 3) {
                items.push(<Pagination.First key={1} onClick={() => setPage(1)}/>);
                items.push(<Pagination.Prev key={-1} onClick={() => setPage(page - 1)}/>);
            }
            if (page > 3) items.push(<Pagination.Ellipsis key={-2}/>);
            let start = page - 2;
            if (start < 1) start = 1;
            for (let i = start; i < page; i++) {
                items.push(<Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>{i}</Pagination.Item>);
            }
            items.push(<Pagination.Item key={page} active={true}>{page}</Pagination.Item>);
            let finish = page + 2;
            if (finish > pageCount) finish = pageCount;
            for (let i = page + 1; i <= finish; i++) {
                items.push(<Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>{i}</Pagination.Item>);
            }
            if (page < pageCount - 2) items.push(<Pagination.Ellipsis key={-3}/>);
            if (page < pageCount - 2) {
                items.push(<Pagination.Next key={-4} onClick={() => setPage(page + 1)}/>);
                items.push(<Pagination.Last key={-5} onClick={() => setPage(pageCount)}/>);
            }
        }
        return(
            <>
                {!loading && <Pagination>
                    {items}
                </Pagination>}
            </>
        );
    }else{
        return <div/>;
    }
}