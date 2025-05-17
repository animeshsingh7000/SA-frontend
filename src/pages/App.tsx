import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import { useNavigate} from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  function handleClick() {
      navigate(-1)
  }
  return (
    <Row className="bg-authlayout">
      <Col className="d-flex justify-content-center align-items-center  login-signup-page-card h-100vh ">
          <div className="login-form subscription">
              <div className="w-100">
              <div className="_logo">
                  {/* <img src={logo} alt="Nodata" /> */}
                </div>
                  <h2>
                      404 Page
                  </h2>
                  <div className="email-verification-message">
                    Application route Not found!
                  </div>
                  <div>
                    <Button variant="primary" className="mt-5" onClick={() => handleClick()}>
                        GO Back
                    </Button>
                  </div>
              </div>
          </div>
      </Col>
    </Row>
  );
}
