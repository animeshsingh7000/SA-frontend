import { useNavigate } from "react-router-dom";
import { Footer, Header } from "../../..";
import iconBlog from "../../../../assets/images/icon-blog.png";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { stayCurrent } from "../../../../api";
import { NoData } from "../../../../components";
import Spinner from "../../../../components/Spinner";
import { formatDate, stripTagsAndTruncate } from "../../../../utils/common";
import { DEFAULT_OFFSET } from "../../../../constants";

export default function News() {
  const { pathname } = useLocation();
  const [currentItems, setCurrentItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalNews, setTotalNews] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const data = {
      page: pageNo,
      count: DEFAULT_OFFSET,
    };
    stayCurrent.getNews(data).then((res: any) => {
      setTotalNews(res.totalNews);
      setCurrentItems(res.data);
      setLoader(false);
    });
  }, [pageNo]);

  const pageCount = Math.ceil(totalNews / DEFAULT_OFFSET);

  const handlePageClick = (event: any) => {
    setPageNo(event.selected + 1);
  };

  function routeToDetail(detail: any) {
    localStorage.setItem("blogDetail", JSON.stringify(detail));
    navigate(ROUTE_NAVIGATION_PATH.BLOG_DETAIL+'/'+detail.slug);
  }

  return (
    <>
      <Header mainClass="with-btn" isNavButton={true} />
      <main className="main-content">
        {loader ? (
          <Spinner />
        ) : (
          <>
            <div className="breadcrumb-module">
              <div className="container">
                <div className="breadcrumb-row">
                  <div className="breadcrumb-icon">
                    <img src={iconBlog} alt="icon blog" />
                  </div>
                  <div className="breadcrumb-content">
                    <h4>StayCurrent (Our News)</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              {!currentItems.length ? (
                <NoData />
              ) : (
                <div className="blog-list-module row">
                  {currentItems &&
                    currentItems.map((data: any, key: any) => (
                      <div className="col-12 col-md-4 d-flex" key={key}>
                        <div
                          className="blog-card"
                          onClick={() => routeToDetail(data)}
                        >
                          <div className="blog-card-content">
                            <div className="blog-date">
                              {formatDate(data.createdAt)}
                            </div>
                            <h4>{data.title}</h4>
                            <p>{stripTagsAndTruncate(data.content)}</p>
                          </div>
                          <div className="blog-card-footer">Posted by {data.createdBy ? data.createdBy : 'NA'}</div>
                        </div>
                      </div>
                    ))}
                  <div className="custom-pagination">
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
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
