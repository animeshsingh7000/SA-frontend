import { formatDate } from "../../../utils/common";

export default function RentalDetail({
    inquiryData,
}: {
    inquiryData?: any;
}) {
    return (
        <>
            <div className="tab-userdetail-wrapper">
                <div className="cards-grid">
                    <div className="h4">User Details</div>
                    <div className="row">
                        <div className="col-6">
                            <div className="lable">Arrival</div>
                            <div className="feildtxt">{formatDate(inquiryData.estimatedArrivalDate)}</div>
                        </div>
                        <div className="col-6">
                            <div className="lable">Departure</div>
                            <div className="feildtxt">{formatDate(inquiryData.estimatedDepartureDate)}</div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="lable">Email</div>
                            <div className="feildtxt">{inquiryData.email}</div>
                        </div>
                        <div className="col-6">
                            <div className="lable">Phone</div>
                            <div className="feildtxt">
                                <span>{inquiryData.mobile}</span>
                            </div>
                            {/* <div className="feildtxt">231-564-7890 (Ellen)</div>
                      <div className="feildtxt">231-564-7890 (A)</div> */}

                        </div>
                        <div className="col-6">
                            <div className="lable">Guests</div>
                            <div className="feildtxt">{inquiryData.occupantCount}</div>
                        </div>
                        <div className="col-6">
                            <div className="lable">Budget</div>
                            <div className="feildtxt">{inquiryData.maxMonthlyBudget}</div>
                        </div>
                        <div className="col-6">
                            <div className="lable">Length Of Stay</div>
                            <div className="feildtxt">{inquiryData.lengthOfStay}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}