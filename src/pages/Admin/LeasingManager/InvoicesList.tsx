
import React, { useEffect } from "react";
import Table from 'react-bootstrap/Table';
import invoiceIcon from "../../../assets/images/Invoice.svg";
import greenIcon from "../../../assets/images/green-tick.svg";
import lockedIcon from "../../../assets/images/Locked.svg";
import unlockedIcon from "../../../assets/images/LockOpen.svg";
import { NoData } from "../../../components";
import { formatDate } from "../../../utils/common";
import { useNavigate } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";

export default function InvoiceList({
    invoiceDetail,
    isLocked = false
}: {
    invoiceDetail?: any;
    isLocked?: boolean
}) {

    const navigate = useNavigate();

    function navigateToDetail(id:any ) {
        navigate(ROUTE_NAVIGATION_PATH.LEASE_INVOICE_DETAIL + '/'+id)
    }

    const trimFirstPart = (uuid: any) => {
        return uuid.split("-")[0].trim(); // Extracts and trims only the first part

    }

    return (
        <>
            <div className="table-section-common _leasing-manager-table">

                <Table responsive className="">

                    <thead>
                        <tr>
                            <th><div className="th-data">Id</div></th>
                            <th><div className="th-data">Due Date</div></th>
                            <th><div className="th-data">Status</div></th>
                            <th><div className="th-data">Locked</div></th>
                            <th><div className="th-data">Total Due</div></th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            invoiceDetail && invoiceDetail.length > 0 ?
                                <>
                                    {invoiceDetail.map((data: any, key: any) => (
                                        <tr>
                                            <td>
                                                <div className="t-user" onClick={(e) => navigateToDetail(data?._id)}>
                                                    <div className="t-user-icon">
                                                        <img src={invoiceIcon} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">{data?.invoiceId ? trimFirstPart(data?.invoiceId) : 'NA'}</div>
                                                </div>
                                            </td>

                                            <td>{data?.dueDate ? formatDate(data?.dueDate) : 'NA'}</td>
                                            <td>
                                                <div className="t-user _action">
                                                    {
                                                        data?.invoiceStatus == 3 ?
                                                        <>
                                                            <div className="t-user-icon">
                                                                <img src={greenIcon} alt="icon" />
                                                            </div>
                                                            <div className="t-user-info">Paid</div>
                                                        </>
                                                        :
                                                        <div>
                                                            {data?.invoiceStatus == 1 ? 'Issued' : data?.invoiceStatus == 2 ? 'Sent' : data?.invoiceStatus == 4 ? 'Partially Paid' : 'Past Due'  }
                                                        </div>
                                                    } 
                                                </div>
                                            </td>
                                            <td>
                                                {
                                                    !data.locked ?
                                                    <div className="t-locked _unlocked">
                                                        <div className="t-lock-icon">
                                                            <img src={unlockedIcon} alt="icon" />
                                                        </div>
                                                        <div className="t-lock-info">Unlocked</div>
                                                    </div>
                                                    :
                                                    <div className="t-locked _unlocked">
                                                        <div className="t-lock-icon">
                                                            <img src={lockedIcon} alt="icon" />
                                                        </div>
                                                        <div className="t-lock-info">Locked</div>
                                                    </div>
                                                } 
                                            </td>
                                            <td>{data.totalDue ? '$'+data.totalDue.toFixed(2) : 0}</td>

                                        </tr>
                                    ))}
                                </>
                            :
                                <NoData />
                        }
                    </tbody>
                </Table>
            </div>
        </>
    );
}
