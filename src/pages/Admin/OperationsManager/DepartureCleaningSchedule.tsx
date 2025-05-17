import React, { useState, useEffect, useRef } from "react";
import arrowDown from "../../../assets/images/down-arrow.png";
import sortIcon from "../../../assets/images/Sort.svg";
import arrowRight from "../../../assets/images/CaretRight.svg";
import placeHolder from "../../../assets/images/placeHolder.png";
import Table from 'react-bootstrap/Table';
import "ag-grid-community/styles/ag-grid.css";
import { getDepartureScheduleList } from "../../../api/admin/opeartions";
import { Spinner } from "react-bootstrap";
import { NoData } from "../../../components";
import SearchBar from "../../../components/SearchBar";
import { formatDate, formatDateNotes, formatDateTime, isToday } from "../../../utils/common";


export default function DepartureCleaningSchedule() {
    const [currentItems, setCurrentItems] = useState([])
    const [loader, setLoader] = useState(false);
    const [isOpen, setIsOpen] = useState('');

    const toggleAccordion = (key: any) => {
        setIsOpen(key);
    };

    useEffect(() => {

        fetchData();
    }, []);

    const fetchData = async () => {
        setLoader(true);
        try {
            getDepartureScheduleList().then((res) => {
                setLoader(false);
                setCurrentItems(res.data);
                setIsOpen(res.data[0].date + '-0')

            });
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data:", error);
        }
    };

    const toggleData = (value: any) => {
        if (isOpen === value) {
            setIsOpen('');
        } else {
            setIsOpen(value)
        }

    }

    return (
        <>
            <div className="departure-listing-wrapper scrollbar">

                {
                    loader ?
                        <div className="spinner-wrapper"><Spinner /></div>
                        :
                        <>
                            <div className="alert2 alert-info2">
                                <a className="close" href="#" data-dismiss="alert">×</a>
                                <strong>Info:</strong>
                                The list begins two days ago and ends 21 days from now. Departures are grouped by date. Sunday departures are scheduled for the following Monday.
                                Each group is sorted in ascending order of number of days to the next arrival.
                            </div>
                            {
                                currentItems.length > 0 ?
                                    <>
                                        {currentItems.map((data: any, key: any) => (
                                            <div className="departure-listing-content" key={key}>

                                                <div className="heading-d">
                                                    <img src={arrowRight} alt="Icon" />
                                                    {data.date ? (isToday(data.date) ? 'Today' : formatDate(data.date)) : 'NA'}
                                                </div>
                                                <>

                                                    {
                                                        data.leases && data.leases.length > 0 ?
                                                            data.leases.map((lease: any, k: any) => (

                                                                <div className="d-listing-content" key={k}>
                                                                    <div className="listing-info-top">
                                                                        <div className={`arrow-down ${isOpen === data.date + `-${String(k)}` ? 'active' : ''}`} onClick={() => toggleData(data.date + `-${String(k)}`)}>
                                                                            <img src={arrowDown} alt="Icon" />
                                                                        </div>
                                                                        <div className="d-list-desc">
                                                                            <div className="_d-image">
                                                                                <img src={lease?.imageUrl ? lease?.imageUrl : placeHolder} alt="Image" />
                                                                            </div>
                                                                            <div className="d-desc-aside">
                                                                                <div className="p-name">{lease?.propertyName ? lease?.propertyName : 'NA'}</div>
                                                                                {
                                                                                    lease?.operationsManager ?
                                                                                        <p>
                                                                                            <span>{lease?.operationsManager?.fullName ? lease?.operationsManager?.fullName : 'NA'}</span>
                                                                                            {lease?.operationsManager?.alternatePhoneIds && lease?.operationsManager?.alternatePhoneIds.length > 0 ? ' - ' + lease?.operationsManager?.alternatePhoneIds[0].phone : ''}
                                                                                        </p>
                                                                                        :
                                                                                        null
                                                                                }
                                                                            </div>

                                                                        </div>
                                                                        {
                                                                            lease?.amenities && lease?.amenities.length > 0 && (
                                                                                <div className="d-property-tags">
                                                                                    <ul>
                                                                                        {
                                                                                            lease?.amenities.map((amm: any) => (
                                                                                                <li key={amm}>{amm}</li>
                                                                                            ))}
                                                                                    </ul>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    {
                                                                        isOpen === data.date + `-${String(k)}` && (
                                                                            <div className="departure-accordian">

                                                                                <div className="_girdlist">
                                                                                    <div className="txt-data-listing ">
                                                                                        <div className="labeltxt">Current Reservation</div>
                                                                                        <div className="valuetxt">
                                                                                            {
                                                                                                lease?.currentReservation && (
                                                                                                    lease?.currentReservation?.from ? formatDate(lease?.currentReservation?.from) + (lease?.currentReservation?.to ? ' - ' + formatDateTime(lease?.currentReservation?.to) : '') :
                                                                                                        'NA'
                                                                                                )
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="txt-data-listing ">
                                                                                        <div className="labeltxt">Lockbox Info</div>
                                                                                        <div className="valuetxt">{lease?.lbInfo ? lease?.lbInfo : 'NA'}</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="_girdlist">
                                                                                    <div className="txt-data-listing ">
                                                                                        <div className="labeltxt">Lockbox Code</div>
                                                                                        <div className="valuetxt">{lease?.lbCode ? lease?.lbCode : 'NA'}</div>
                                                                                    </div>

                                                                                </div>
                                                                                <div className="_girdlist">
                                                                                    <div className="txt-data-listing ">
                                                                                        <div className="labeltxt">Gap in Days</div>
                                                                                        <div className="valuetxt">{lease?.gapInDays ? lease?.gapInDays : 'NA'}</div>
                                                                                    </div>
                                                                                    <div className="txt-data-listing ">
                                                                                        <div className="labeltxt">Next Reservation</div>
                                                                                        <div className="valuetxt">{
                                                                                            lease?.nextReservation && (
                                                                                                lease?.nextReservation?.from ? formatDate(lease?.nextReservation?.from) + (lease?.nextReservation?.to ? ' - ' + formatDateTime(lease?.nextReservation?.to) : '') :
                                                                                                    'NA'
                                                                                            )
                                                                                        }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        )
                                                                    }

                                                                </div>
                                                            ))
                                                            :
                                                            null
                                                    }


                                                </>


                                            </div>
                                        ))}
                                    </>
                                    :
                                    <NoData />
                            }
                        </>
                }
            </div>
        </>
    );
}
