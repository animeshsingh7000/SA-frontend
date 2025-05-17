import { useLocation, useNavigate } from "react-router-dom";
import { Footer, Header } from "../../..";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { Form } from "react-final-form";
import Button from "react-bootstrap/Button";
import { AxiosError } from "axios";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import {
  composeValidators,
  maxlength,
  required,
  validEmail,
  minValue,
} from "../../../../validations";
import { FormControl } from "../../../../components/FormElements/FormControl";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { VALIDATIONS } from "../../../../constants";
import { attacheProperty, stayCurrent } from "../../../../api";
import Loading from "../../../../components/Loader";
import MapView from "../../../../components/GoogleMap/MapView";

export default function ContactUs() {
  const { pathname } = useLocation();
  const effectRan = useRef(false);
  const navigate = useNavigate();
  const [showCaptchaError, setCaptchaError] = useState(false);
  const [loader, setLoader] = useState(true);
  const [markers, setMarkers] = useState<any[]>([]);
  const [initData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    inquiry: "",
    captcha: "",
  });

  const onSubmit = (values: any) => {
    setCaptchaError(false);
    let user_captcha = values.captcha;
    if (validateCaptcha(user_captcha) === true) {
      loadCaptchaEnginge(6);
      const data = {
        ...values,
      };
      delete data.captcha;

      stayCurrent
        .contactUs(data)
        .then((response: { user: any }) => {
          navigate(ROUTE_NAVIGATION_PATH.HOME);
        })
        .catch(
          (error: AxiosError<{ errorMessage: string; status: number }>) => {
            toast.error('Password Reset Successfully.');
          }
        );
    } else {
      setCaptchaError(true);
    }
  };

  useEffect(() => {
    loadCaptchaEnginge(8);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!effectRan.current) {
        attacheProperty
            .mapView()
            .then((res: any) => {
                setMarkers(res.data);
                setLoader(false);
                
        });
    }
    return () => {
        effectRan.current = true;
    };
  }, []);

  return (
    <>
      <Header mainClass="with-btn" isNavButton={true} />
      <main className="home-content main-content">
        <section className="contact-us-wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-5">
                <div className="get-in-touch-wrapper">
                  <h1>Get in touch with us</h1>
                  <div className="get-in-touch-info">
                    <strong>CONTACT</strong>
                    <span className="d-block">800-916-4903</span>
                    <span className="d-block">
                      reservations@stayattache.com
                    </span>
                  </div>
                  <div className="get-in-touch-info">
                    <strong>FIND US</strong>
                    <span className="d-block">
                      1800 R Street Northwest C-1,
                    </span>
                    <span className="d-block">Washington DC 20009</span>
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="contact-us-form-wrapper">
                  <h2>Contact</h2>
                  <Form
                    initialValues={initData}
                    onSubmit={onSubmit}
                    render={({ handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-12 col-md-6">
                            <FormControl
                              label="First Name*"
                              name="firstName"
                              type="text"
                              placeholder="Enter first name"
                              validate={composeValidators(
                                required,
                                maxlength(VALIDATIONS.MAX_NAME)
                              )}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <FormControl
                              label="Last Name*"
                              name="lastName"
                              type="text"
                              placeholder="Enter last name"
                              validate={composeValidators(
                                required,
                                maxlength(VALIDATIONS.MAX_NAME)
                              )}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <FormControl
                              label="Email Address*"
                              name="email"
                              type="email"
                              placeholder="Enter email address"
                              validate={composeValidators(required, validEmail)}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <FormControl
                              label="Mobile*"
                              name="contact"
                              type="mobile"
                              maxlength={15}
                              placeholder="Enter Mobile Number"
                              validate={composeValidators(
                                required,
                                minValue(VALIDATIONS.MIN_PHONE)
                              )}
                            />
                          </div>
                          <div className="col-12">
                            <FormControl
                              label="Feedback"
                              name="inquiry"
                              type="textarea"
                              rows="3"
                              maxlength={VALIDATIONS.MAX_DESCRIPTION}
                              validate={composeValidators(required)}
                              placeholder="Help us grow"
                            />
                          </div>
                        <div className="captcha-field">
                          <FormControl
                            label="Captcha"
                            name="captcha"
                            type="text"
                            validate={composeValidators(required)}
                          />
                          {
                            showCaptchaError ?
                            <div className="incorrect">Captcha is incorrect</div>
                            :
                            null
                          }
                        <LoadCanvasTemplate />
                        </div>
                        <div className="btn-bottom">
                        <Button className="btn primary" type="submit">
                          SEND
                        </Button>
                        </div>
                      
                        </div>

                      </form>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {
        !loader ?
          <MapView markers={markers}/>
        :
        <>
          <Loading />
        </>
      }

      <Footer footerLinks={true} isCopyRight={false} />
    </>
  );
}
