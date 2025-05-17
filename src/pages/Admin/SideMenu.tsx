import React from "react";
import { Nav, Navbar, Container, Row, Col } from "react-bootstrap";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";

const SideMenu = () => {
  return (
    <Nav defaultActiveKey={ROUTE_NAVIGATION_PATH.ADMIN_OWNER_INQUIRY_LIST} className="flex-column">
      <Nav.Link href="/#">Dashboard</Nav.Link>
      <Nav.Link href={ROUTE_NAVIGATION_PATH.ADMIN_OWNER_INQUIRY_LIST}>Owner Inquiry</Nav.Link>
      <Nav.Link href="/contact">Contact</Nav.Link>
      {/* Add more links here */}
    </Nav>
  );
};

export default SideMenu;
