import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Nav, Navbar, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const NavigationBarSmall = (props: {
    currentUser: [boolean, { email: string; name: string; totpDevice: string } | undefined];
    routeCompProps: RouteComponentProps;
}): JSX.Element => {
    const [isAuthenticated, currentUserDetails] = props.currentUser;
    const { location } = props.routeCompProps;

    return (
        <Navbar
            id="navbar-small"
            collapseOnSelect
            fixed="top"
            sticky="top"
            bg="dark"
            variant="dark"
            expand="lg"
            className="d-lg-none"
        >
            <Navbar.Brand href="/">Search Ninja</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav defaultActiveKey="/" activeKey={location.pathname}>
                    <Container id="menu" className="w-100 mw-100 p-0 m-0 mt-3">
                        <Row className="w-100 mw-100 p-0 m-0 align-items-start">
                            <Col className="col-2">
                                {isAuthenticated ? (
                                    <>
                                        <LinkContainer exact to="/">
                                            <Nav.Link>Home</Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/search">
                                            <Nav.Link>Search</Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/settings">
                                            <Nav.Link>Settings</Nav.Link>
                                        </LinkContainer>
                                    </>
                                ) : (
                                    <>
                                        <LinkContainer exact to="/">
                                            <Nav.Link>Home</Nav.Link>
                                        </LinkContainer>
                                    </>
                                )}
                            </Col>
                            <Col className="col-10 text-right">
                                {currentUserDetails ? (
                                    <UserAccountInfo {...currentUserDetails} />
                                ) : (
                                    <>
                                        <LinkContainer to="/login">
                                            <Nav.Link>Sign In</Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/signup">
                                            <Nav.Link>Sign Up</Nav.Link>
                                        </LinkContainer>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

const UserAccountInfo = (currentUserDetails: { email: string; name: string; totpDevice: string }): JSX.Element => {
    return (
        <>
            <Nav.Item id="userlabel" className="font-weight-bold m-0 p-0 pt-2">
                {currentUserDetails.name}
            </Nav.Item>
            <Nav.Item id="emaillabel" className="font-weight-light m-0 p-0 pb-2">
                {currentUserDetails.email}
            </Nav.Item>
            <LinkContainer to="/logout">
                <Nav.Link eventKey="/logout" className="m-0 p-0 pt-4 pb-2">
                    Sign Out
                </Nav.Link>
            </LinkContainer>
        </>
    );
};
