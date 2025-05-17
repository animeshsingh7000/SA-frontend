import { NoData } from "../../../components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../..//../routes/routes";
import Spinner from "../../../components/Spinner";
import { getDynamicPricingList } from "../../../api/admin/ownerInquiry";
import { Button } from "react-bootstrap";


export default function DynamicPriceList() {
  const { pathname } = useLocation();
  const [currentItems, setCurrentItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);

    getDynamicPricingList().then((res: any) => {
      setCurrentItems(res);
      setLoader(false);
    });
  }, []);


  function navigateToEdit() {
    navigate(ROUTE_NAVIGATION_PATH.EDIT_DYNAMIC_PRINCING)
  }


  return (
    <>
      {/* <div className="right-container"> */}
      {loader ? (
        <Spinner />
      ) : (
        <>

          {!currentItems.length ? (
            <NoData />
          ) : (
            <div className="lease-page-container">
              <div className="lease-payment-schedule">
                <div className="container container-fluid _lease-maxcontainer dynamipricetable">
                  <div className="lease-payment-head">
                    <div className="lease-col">Month</div>
                    <div className="lease-col">
                      Percentage
                    </div>
                    {/* <div className="lease-col">
                      Per Diem
                    </div> */}
                  </div>
                  {currentItems &&
                    currentItems.map((data: any, key: any) => (
                      <div className="lease-payment-list" key={key}>
                        <div className="lease-payment-items align-items-center">
                          <div data-title="Property" className="lease-col">
                            <span

                            >
                              {data?.monthName ? data?.monthName : 'NA'}
                            </span>
                          </div>
                          <div className="lease-col">
                            {data?.value ? data.value : 0}%
                          </div>
                          {/* <div className="lease-col">
                            {data?.perDiemRate ? data.perDiemRate : 0}
                          </div> */}

                        </div>
                      </div>
                    ))}

                </div>
              </div>
              <div className="action-btn-wrapper fixed-bottom ">
                <div className="action-btns oi-action-btn fixwidth2">
                  <div className="Continuewrapper">
                    <Button type="button" className="btn primary minwdth" onClick={navigateToEdit}>
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
          }
        </>
      )}
      {/* </div> */}
    </>
  );
}