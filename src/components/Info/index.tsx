import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Info({
  title,
  spantitle,
  nextTitle,
  subTitle,
  description1,
  description2,
  description3,
  description4,
  description5,
  buttonText,
  image,
  nextUrl,
}: {
  title?: React.ReactNode | string;
  spantitle?: string;
  nextTitle?: string;
  subTitle?: string;
  description1?: string;
  description2?: string;
  description3?: string;
  description4?: string;
  description5?: string;
  buttonText?: string;
  image?: string;
  nextUrl: string;
}) {
  return (
    <>
      <Row>
        <section className="main-container aligncenter_section resize_container">
         
    
        </section>
      </Row>
    </>
  );
}
