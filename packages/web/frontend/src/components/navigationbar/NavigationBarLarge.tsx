import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Nav, Navbar, Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { Session } from '../../auth/Auth';
import { SessionActions } from '../../state/SessionActions';
import { SessionState } from '../../state/SessionStore';

export const NavigationBarLarge = (props: {
    sessionStore: [SessionState, SessionActions];
    routeCompProps: RouteComponentProps;
}): JSX.Element => {
    const [{ session }] = props.sessionStore;
    const { location } = props.routeCompProps;

    return (
        <Navbar
            id="navbar-large"
            fixed="top"
            sticky="top"
            bg="dark"
            variant="dark"
            expand="lg"
            className="d-none d-lg-block"
        >
            <Nav defaultActiveKey="/" activeKey={location.pathname}>
                <Container className="col-8">
                    <Navbar.Brand href="/">Search Ninja</Navbar.Brand>
                    {session ? (
                        <>
                            <LinkContainer exact to="/">
                                <Nav.Link>Home</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/search">
                                <Nav.Link className="mr-auto">Search</Nav.Link>
                            </LinkContainer>
                        </>
                    ) : (
                        <>
                            <LinkContainer exact to="/">
                                <Nav.Link className="mr-auto">Home</Nav.Link>
                            </LinkContainer>
                        </>
                    )}
                </Container>
                <Container className="col-4 justify-content-end">
                    {session ? (
                        <>
                            <UserAccountInfo {...session} />
                        </>
                    ) : (
                        <>
                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/signup">
                                <Nav.Link>Sign Up</Nav.Link>
                            </LinkContainer>
                        </>
                    )}
                </Container>
            </Nav>
        </Navbar>
    );
};

const UserAccountInfo = (session: Session): JSX.Element => {
    return (
        <DropdownButton alignRight className="" id="dropdown-basic-button" title={session.userAttributes['name']}>
            <Container id="table-user">
                <Row id="row-header" className="w-100 m-0 align-items-center">
                    <Col id="cell-brand" className="col-8 text-left">
                        Search Ninja
                    </Col>
                    <Col id="cell-logout" className="col-4 text-right">
                        <LinkContainer to="/logout">
                            <Dropdown.Item eventKey="/logout" className="setting-button">
                                Logout
                            </Dropdown.Item>
                        </LinkContainer>
                    </Col>
                </Row>
                <Row id="row-body" className="m-3 align-items-center">
                    <Col id="cell-avatar" className="col-4 text-center">
                        <FontAwesomeIcon id="avatar" icon={faUserCircle} />
                    </Col>
                    <Col id="cell-info" className="col-8">
                        <h4 className="">{session.userAttributes['name']}</h4>
                        <p className="">{session.userAttributes['email']}</p>
                        <p>
                            <LinkContainer to="/settings">
                                <Dropdown.Item eventKey="/settings" className="setting-button">
                                    Settings
                                </Dropdown.Item>
                            </LinkContainer>
                        </p>
                    </Col>
                </Row>
            </Container>
        </DropdownButton>
    );
};
