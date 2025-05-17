
import React, { useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { NoData } from "../../../components";
import { formatDate } from "../../../utils/common";


export default function BillingInvoiceList({
    billingDetail,
    disabled = false
}: {
    billingDetail: any;
    disabled?: boolean
}) {

    const formatCurrency = (amount: any) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <>
            <div className="table-section-common _leasing-manager-table">
                <Table responsive className="">
                    <thead>
                        <tr>
                            <th>
                                <div className="th-data">Due
                                </div>
                            </th>
                            <th>
                                <div className="th-data">Line Item</div>
                            </th>
                            <th>
                                <div className="th-data">Ammount </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            billingDetail && billingDetail.length > 0 ?
                                <>
                                    {billingDetail.map((data: any, key: any) => (
                                        <tr>
                                            <td>
                                                {data.dueDateStart ? formatDate(data.dueDateStart) : 'NA'}
                                            </td>
                                            <td>
                                                {data.message ? data.message : 'NA'}
                                            </td>
                                            <td>
                                                {data.amount ? formatCurrency(data.amount) : 'NA'}
                                            </td>

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
