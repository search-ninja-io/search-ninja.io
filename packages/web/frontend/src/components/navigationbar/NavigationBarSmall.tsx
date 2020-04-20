import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Nav, Navbar, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { Session } from '../../auth/Auth';
import { SessionState } from '../../state/SessionStore';
import { SessionActions } from '../../state/SessionActions';

export const NavigationBarSmall = (props: {
    sessionStore: [SessionState, SessionActions];
    routeCompProps: RouteComponentProps;
}): JSX.Element => {
    const [{ session }] = props.sessionStore;
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
                <Nav defaultActiveKey="/home" activeKey={location.pathname}>
                    <Container id="menu" className="w-100 mw-100 p-0 m-0 mt-3">
                        <Row className="w-100 mw-100 p-0 m-0 align-items-start">
                            <Col className="col-2">
                                {session ? (
                                    <>
                                        <LinkContainer to="/home">
                                            <Nav.Link eventKey="/home">Home</Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/search">
                                            <Nav.Link eventKey="/search">Search</Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/settings">
                                            <Nav.Link eventKey="/settings">Settings</Nav.Link>
                                        </LinkContainer>
                                    </>
                                ) : (
                                    <>
                                        <LinkContainer to="/home">
                                            <Nav.Link eventKey="/home">Home</Nav.Link>
                                        </LinkContainer>
                                    </>
                                )}
                            </Col>
                            <Col className="col-10 text-right">
                                {session ? (
                                    <UserAccountInfo session={session} />
                                ) : (
                                    <>
                                        <LinkContainer to="/login">
                                            <Nav.Link eventKey="/login">Login</Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/signup">
                                            <Nav.Link eventKey="/signup">Sign Up</Nav.Link>
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

const UserAccountInfo = (props: { session: Session }): JSX.Element => {
    return (
        <>
            <Nav.Item id="userlabel" className="font-weight-bold m-0 p-0 pt-2">
                {props.session.userAttributes['name']}
            </Nav.Item>
            <Nav.Item id="emaillabel" className="font-weight-light m-0 p-0 pb-2">
                {props.session.userAttributes['email']}
            </Nav.Item>
            <LinkContainer to="/logout">
                <Nav.Link eventKey="/logout" className="m-0 p-0 pt-4 pb-2">
                    Logout
                </Nav.Link>
            </LinkContainer>
        </>
    );
};
