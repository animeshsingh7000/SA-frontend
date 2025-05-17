import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, } from "react-router-dom";
import buildingIcon from "../../../assets/images/building.svg";
import sortIcon from "../../../assets/images/Sort.svg";
import Table from 'react-bootstrap/Table';
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { getRentalInquiryGuestHistory } from "../../../api/admin/renterInquiry";
import { AxiosError } from "axios";
import { formatDate } from "../../../utils/common";
import { NoData } from "../../../components";
import { Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";

const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;

const GuestHistory: React.FC = () => {
    const [rowData, setRowData] = useState<any>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [loader, setLoader] = useState(true);
    const params = useParams();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const navigate = useNavigate();
    const effectRan = useRef(false);
    const [paginationPageSize, setPaginationPageSize] =
        useState<number>(INTIAL_OFFSET);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [sortBy, setSortBy] = useState<SortType>({ createdAt: -1 });


    useEffect(() => {
        if (!effectRan.current) {
            let data = {
                count: paginationPageSize,
                page: pageNumber,
                sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({ createdAt: -1 }),
            }

            getRentalInquiryGuestHistory(params.id, data)
                .then((res: any) => {
                    setRowData(res.data);
                    setTotalRows(res.count);
                    setLoader(false);
                })
                .catch((error: AxiosError<{ message: string; status: number }>) => {
                    setLoader(false);
                });
        }
        return () => {
            effectRan.current = true;
        };
    }, [pageNumber]);

    const pageCount = Math.ceil(totalRows / INTIAL_OFFSET);

    const handlePageClick = (event: any) => {
        setPageNumber(event.selected + 1);
    };

    const doSort = (keyName: any) => {
        if (sortBy?.[keyName]) {
            setSortBy({ [keyName]: sortBy?.[keyName] * -1 } as SortType);
        } else {
            setSortBy({ [keyName]: -1 });
        }
        setPageNumber(1);
    };


    return (
        <>
            {/* Rental  Inquiry edit form  start */}

            <div className="table-section-common">
                <Table responsive className="table-3-column">
                    <thead>
                        <tr>
                            <th>
                                <div className="th-data firstchild">Property
                                    <div className={`sort-table ${sortBy && Object.keys(sortBy).includes('name') ? 'active' : ''}`} onClick={() => doSort('name')}>
                                        <img src={sortIcon} alt="sort" />
                                    </div>
                                </div>
                            </th>
                            <th>
                                <div className="th-data">Arrival Date
                                    <div className={`sort-table ${sortBy && Object.keys(sortBy).includes('arrivalDate') ? 'active' : ''}`} onClick={() => doSort('arrivalDate')}>
                                        <img src={sortIcon} alt="sort" />
                                    </div>
                                </div>
                            </th>
                            <th>
                                <div className="th-data firstchild">Deaprture Date
                                    <div className={`sort-table ${sortBy && Object.keys(sortBy).includes('departureDate') ? 'active' : ''}`} onClick={() => doSort('departureDate')}>
                                        <img src={sortIcon} alt="sort" />
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    {
                        loader ?
                            <div className="spinner-wrapper"><Spinner /></div>
                            :
                            <tbody>
                                {
                                    rowData.length > 0 ?
                                        <>
                                            {rowData.map((data: any, key: any) => (
                                                <tr key={key}>
                                                    <td>
                                                        <div className="t-user">
                                                            <div className="t-user-icon">
                                                                <img src={buildingIcon} alt="icon" />
                                                            </div>
                                                            <div className="t-user-info">{data.name}</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {data.arrivalDate ? formatDate(data.arrivalDate) : '-'}
                                                    </td>
                                                    <td>
                                                        {data.departureDate ? formatDate(data.departureDate) : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                        :
                                        <NoData />
                                }


                            </tbody>
                    }
                </Table>
                {
                    totalRows > INTIAL_OFFSET
                        ?
                        <div className="custom-pagination p-0 pt-4 container container-fluid">
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel=""
                                activeClassName={"active"}
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={pageCount}
                                previousLabel=""
                                renderOnZeroPageCount={null}
                            />
                        </div>
                        :
                        null
                }

            </div>
        </>
    );
};

export default GuestHistory;
