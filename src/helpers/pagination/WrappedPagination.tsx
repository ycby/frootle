import {Pagination} from "react-bootstrap";
import {CSSProperties, useState} from "react";

interface WrappedPaginationProps {
    totalRows: number;
    limit: number;
    onPageClick: (pageNumber: number) => void;
    className?: string;
    style?: CSSProperties;
}

const WrappedPagination = (props: WrappedPaginationProps) => {

    const {
        totalRows,
        limit = 10,
        onPageClick,
    } = props;

    const [currentPage, setCurrentPage] = useState<number>(1);

    const numOfPages = (Math.floor(totalRows / limit)) + (totalRows % limit == 0 ? 0 : 1);
    const pageArray = [];

    if (numOfPages > 7) {

        if (currentPage <= 2 || currentPage >= numOfPages - 1) {
            for (let i = 1; i <= 3; i ++) {
                pageArray.push(i);
            }
            pageArray.push('...');
            for (let i = numOfPages - 2; i <= numOfPages; i++) {
                pageArray.push(i);
            }
        } else {
            pageArray.push(1);
            pageArray.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pageArray.push(i);
            }
            pageArray.push('...');
            pageArray.push(numOfPages);
        }
    } else {

        for (let i = 1; i <= numOfPages; i ++) {
            pageArray.push(i);
        }
    }

    return (
        <Pagination className={`my-2`}>
            <Pagination.Prev />
            {
                pageArray.map((element, index) => (
                    element !== '...'
                        ? <Pagination.Item
                            key={`p_${index}`}
                            active={element === currentPage}
                            onClick={() => {
                                onPageClick(Number(element));
                                setCurrentPage(Number(element));
                            }}
                        >
                            {element}
                        </Pagination.Item>
                        : <Pagination.Ellipsis key={`p_${index}`} />
                ))
            }
            <Pagination.Next />
        </Pagination>
    );
}

export {
    WrappedPagination
}