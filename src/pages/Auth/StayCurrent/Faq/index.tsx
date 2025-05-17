import { useEffect, useState } from "react";
import { Footer, Header } from "../../..";
import { stayCurrent } from "../../../../api";
import iconFAQ from "../../../../assets/images/icon-faq.png";
import createDOMPurify from "dompurify";
import { Breadcrumb, NoData } from "../../../../components";
import Spinner from "../../../../components/Spinner";

export default function FAQ() {
  const [selectedId, setSelectedId] = useState(null);
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const DOMPurify = createDOMPurify(window);

  useEffect(() => {
    stayCurrent.getFAQ().then((res: any) => {
      setItems(res.data);
      setLoader(false);
    });
  }, []);

  const clickAccordian = (id: any) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  return (
    <>
      <Header mainClass="with-btn" isNavButton={true} />
      <main className="main-content">
        {loader ? (
          <Spinner />
        ) : (
          <>
            <Breadcrumb
              icon={iconFAQ}
              iconAlt="icon faq"
              heading="StayCurious (FAQs)"
              description="How can we help you?"
              breadcrumbModuleRowClassName=""
            />
            <div className="container">
              {!items.length ? <NoData /> : null}
              <div id="accordion" className="faq-module">
                {items.map((data: any, key) => (
                  <div className="card" key={key}>
                    <div className="card-header" id="heading1">
                      <button
                        className={`btn btn-link ${
                          selectedId === key + 1 ? "" : "collapsed"
                        }`}
                        onClick={() => clickAccordian(key + 1)}
                      >
                        <span className="card-number">{key + 1}</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(data.question),
                          }}
                        ></span>
                        <em className="icon-right-arrow"></em>
                      </button>
                    </div>

                    <div
                      className={`collapse navbar-collapse ${
                        selectedId === key + 1 ? "show" : ""
                      }`}
                      aria-labelledby="heading1"
                      data-parent="#accordion"
                    >
                      <div
                        className="card-body faq-content"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(data.answer),
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
