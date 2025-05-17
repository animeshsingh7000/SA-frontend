import { NoData } from "../../components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import Spinner from "../../components/Spinner";
import { deleteFeaturette, getFeaturetteListing } from "../../api/admin/ownerInquiry";
import { Button } from "react-bootstrap";
import editIcon from "../../assets/images/edit-icon.svg";
import deleteIcon from "../../assets/images/remove-red-icon.svg";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { DEFAULT_OFFSET } from "../../constants";


export default function FeaturetteListing() {
  const { pathname } = useLocation();
  const [currentItems, setCurrentItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const [totalProperties, setTotalProperties] = useState(1);
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);

    featuretteList();
  }, []);


  function navigateToEdit(id?:any) {
      navigate(ROUTE_NAVIGATION_PATH.ADD_EDIT_FEATURETTE + '?id=' + id)

  }

  function navigateToAdd() {
    navigate(ROUTE_NAVIGATION_PATH.ADD_EDIT_FEATURETTE)
  }

  function removeFeaturette(featuretteId: any) {
    setLoader(true);
    deleteFeaturette(featuretteId)
      .then((res) => {
        toast.success(res.data.message);
        featuretteList();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || error.message);
      });
  }

  function featuretteList() {
    getFeaturetteListing({
        count: 10,
        page: pageNo
    }).then((res: any) => {
      setCurrentItems(res.data);
      setTotalProperties(res.count);
      setLoader(false);
    });
  }

  const pageCount = Math.ceil(totalProperties / DEFAULT_OFFSET);

  const handlePageClick = (event: any) => {
    setPageNo(event.selected + 1);
  };


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
                <div className="container container-fluid">
                  <div className="lease-payment-head">
                    <div className="lease-col">Heading</div>
                    <div className="lease-col">
                      Subheading
                    </div>
                    <div className="lease-col">
                      Enabled
                    </div>
                    <div className="lease-col">
                      Position
                    </div>
                    <div className="lease-col">Action</div>
                    {/* <div className="lease-col">Action</div> */}
                  </div>
                  {currentItems &&
                    currentItems.map((data: any, key: any) => (
                      <div className="lease-payment-list" key={key}>
                        <div className="lease-payment-items align-items-center">
                          <div data-title="Property" className="lease-col">
                            <span
                              className="leaselist-link"
                            >
                              <div className="d-flex align-items-center">
                                <div className="lease-property-text">
                                  {data?.heading}
                                </div>
                              </div>
                            </span>
                          </div>
                          <div data-title="Start Date" className="lease-col">
                            {data?.subheading}
                          </div>
                          <div data-title="End Date" className="lease-col">
                              {data?.enabled ? 'Yes': 'No'}
                          </div>
                          <div data-title="End Date" className="lease-col">
                              {data?.position}
                          </div>
                          <div data-title="Action" className="lease-col d-flex actionmobile">
                            <a
                              className="delete-blobk leaselist-link2"
                              onClick={() => navigateToEdit(data?._id)}
                            >
                              <img className="_icons" src={editIcon} alt="Edit"></img>
                            </a>

                            <a
                              className="delete-blobk leaselist-link2"
                              onClick={() => removeFeaturette(data?._id)}
                            >
                              <img className="_icons" src={deleteIcon} alt="Edit"></img>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/* {totalLeases > DEFAULT_OFFSET ? ( */}
              <div className="custom-pagination container container-fluid">
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
              {/* ) : null} */}
            </div>
          )
          }

          <div className="action-btn-wrapper fixed-bottom ">
            <div className="action-btns oi-action-btn fixwidth2">
              <div className="Continuewrapper">
                <Button type="button" className="btn primary minwdth" onClick={navigateToAdd}>
                  Add Featurette Property
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* </div> */}
    </>
  );
}