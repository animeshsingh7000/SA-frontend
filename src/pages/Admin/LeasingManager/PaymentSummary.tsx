
import React, { useEffect } from "react";
import { formatCurrency, formatDate } from "../../../utils/common";

export default function PaymentSummary({
    paymentSummary,
    disabled = false
}: {
    paymentSummary?: any;
    disabled?: boolean
}) {

    return (
        <>
            <div className="payment-summary-wrapper">
                <div className="payment-grid">
                    <div className="grid-content">
                        <div className="pay-label">Created Date</div>
                        <div className="pay-info">{paymentSummary?.createdAt ? formatDate(paymentSummary?.createdAt) : 'NA'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Total {paymentSummary.isNightRate == true ? 'Night' : 'Day'} Count</div>
                        <div className="pay-info">{paymentSummary?.totalDayCount}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Required Base Rent</div>
                        <div className="pay-info">{paymentSummary?.baseRentRequired || paymentSummary.baseRentRequired === 0 ? formatCurrency(paymentSummary.baseRentRequired) : '$0'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Per Diem Value</div>
                        <div className="pay-info">{(paymentSummary?.perDiemSummary || paymentSummary?.perDiemSummary === 0) && (paymentSummary?.perDiemSummary?.perDiemValue || paymentSummary?.perDiemSummary?.perDiemValue == 0) ? formatCurrency(paymentSummary?.perDiemSummary?.perDiemValue) : '$0'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Per Diem Base</div>
                        <div className="pay-info">{(paymentSummary?.perDiemSummary || paymentSummary?.perDiemSummary === 0) && (paymentSummary?.perDiemSummary?.perDiemBaseDiff || paymentSummary?.perDiemSummary?.perDiemBaseDiff == 0) ? formatCurrency(paymentSummary?.perDiemSummary?.perDiemBaseDiff) : '$0'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Standard Rent Payment</div>
                        <div className="pay-info">{paymentSummary?.perDiemSummary || paymentSummary?.perDiemSummary === 0 && (paymentSummary?.perDiemSummary?.standardRentPayments || paymentSummary?.perDiemSummary?.standardRentPayments == 0) ? formatCurrency(paymentSummary.perDiemSummary?.standardRentPayments) : '$0'}</div>
                    </div>

                </div>
                <div className="payment-grid">
                    <div className="grid-content">
                        <div className="pay-label">Total Tax</div>
                        <div className="pay-info">{paymentSummary.totalTax || paymentSummary.totalTax === 0 ? formatCurrency(paymentSummary.totalTax) : '$0'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Parking Rent</div>
                        <div className="pay-info">{paymentSummary.parkingRent || paymentSummary.parkingRent === 0 ? formatCurrency(paymentSummary.parkingRent) : '$0'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Pet Fee</div>
                        <div className="pay-info">{paymentSummary.petFee || paymentSummary.petFee === 0 ? formatCurrency(paymentSummary.petFee) : '$0'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Departure Cleaning</div>
                        <div className="pay-info">{paymentSummary.departureCleaning || paymentSummary.departureCleaning === 0 ? formatCurrency(paymentSummary.departureCleaning) : '$0'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Recurring Cleaning</div>
                        <div className="pay-info">{paymentSummary.recurringCleaning || paymentSummary.recurringCleaning === 0 ? formatCurrency(paymentSummary.recurringCleaning) : '$0'}</div>
                    </div>

                    <div className="grid-content">
                        <div className="pay-label">Service Fee ({paymentSummary.leaseServiceFee}%)</div>
                        <div className="pay-info">{paymentSummary.serviceFee || paymentSummary.serviceFee === 0 ? formatCurrency(paymentSummary.serviceFee) : '$0'}</div>
                    </div>

                    <div className="grid-content">
                        <div className="pay-label">Miscellaneous:</div>
                        <div className="pay-info">{paymentSummary.miscPayments || paymentSummary.miscPayments === 0 ? formatCurrency(paymentSummary.miscPayments) : '$0'}</div>
                    </div>

                </div>
                <div className="payment-grid">
                <div className="grid-content">
                        <div className="pay-label">Total Required Payments:</div>
                        <div className="pay-info">{paymentSummary.totalRequiredPayments || paymentSummary.totalRequiredPayments === 0 ? formatCurrency(paymentSummary.totalRequiredPayments) : '$0'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">With Tax</div>
                        <div className="pay-info">{paymentSummary.totalRequiredPaymentsWithTax || paymentSummary.totalRequiredPaymentsWithTax === 0 ? formatCurrency(paymentSummary.totalRequiredPaymentsWithTax) : '$0'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Total Included Value</div>
                        <div className="pay-info">{paymentSummary.includedValue || paymentSummary.includedValue === 0 ? formatCurrency(paymentSummary.includedValue) : '$0'}</div>
                    </div>
                    <div className="grid-content">
                        <div className="pay-label">Total Non-included Value</div>
                        <div className="pay-info">{paymentSummary.nonIncludedValue || paymentSummary.nonIncludedValue === 0 ? formatCurrency(paymentSummary.nonIncludedValue) : '$0'}</div>
                    </div>
                </div>

            </div>
        </>
    );
}
