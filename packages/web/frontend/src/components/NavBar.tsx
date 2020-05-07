import React from 'react';

import styled from 'styled-components';

import { Nav, Navbar, Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useAuth0 } from '../auth/Auth0Context';

const Styled = styled.div`
    #table-user {
        width: 500px;
        max-width: 500px;
    }
    #row-header {
        background-color: lightgray;
        color: white;
        height: 40px;
    }
    #avatar {
        width: 80px;
        height: 80px;
    }
    #userlabel {
        color: white;
    }
    #emaillabel {
        color: white;
    }

    .setting-button {
        display: block;
        width: 100%;
        padding: 0 0 0 0;
        clear: both;
        font-weight: 400;
        color: #007bff;
        text-align: inherit;
        white-space: nowrap;
        background-color: transparent;
        border: 0;
    }

    .setting-button:hover {
        color: #0056b3;
    }
`;

// TODO: NavBar gets rendered three times. Why?

type NavBarProps = {} & RouteComponentProps;
export const NavBar = withRouter((props: NavBarProps) => {
    const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
    const { location } = props;

    // ================================================================================================
    // NavigationBar - Large
    //
    const NavBarLarge: React.FC = () => (
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
                    {isAuthenticated ? (
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
                    {isAuthenticated ? (
                        <>
                            <UserAccountInfoLarge />
                        </>
                    ) : (
                        <>
                            <Nav.Link onClick={(): Promise<void> => loginWithRedirect({})}>Sign In</Nav.Link>
                        </>
                    )}
                </Container>
            </Nav>
        </Navbar>
    );

    const UserAccountInfoLarge: React.FC = () => {
        if (!user) {
            return <></>;
        }

        return (
            <DropdownButton alignRight className="" id="dropdown-basic-button" title={user.name}>
                <Container id="table-user">
                    <Row id="row-header" className="w-100 m-0 align-items-center">
                        <Col id="cell-brand" className="col-8 text-left">
                            Search Ninja
                        </Col>
                        <Col id="cell-logout" className="col-4 text-right">
                            <Nav.Link onClick={(): void => logout()}>Sign Out</Nav.Link>
                        </Col>
                    </Row>
                    <Row id="row-body" className="m-3 align-items-center">
                        <Col id="cell-avatar" className="col-4 text-center">
                            <FontAwesomeIcon id="avatar" icon={faUserCircle} />
                        </Col>
                        <Col id="cell-info" className="col-8">
                            <h4 className="">{user.name}</h4>
                            <p className="">{user.email}</p>
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

    // ================================================================================================
    // NavigationBar - Small
    //

    const NavigationBarSmall: React.FC = () => {
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
                                    {isAuthenticated ? (
                                        <UserAccountInfoSmall />
                                    ) : (
                                        <>
                                            <Nav.Link onClick={(): Promise<void> => loginWithRedirect({})}>
                                                Sign In
                                            </Nav.Link>
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

    const UserAccountInfoSmall: React.FC = () => {
        if (!user) {
            return <></>;
        }

        return (
            <>
                <Nav.Item id="userlabel" className="font-weight-bold m-0 p-0 pt-2">
                    {user.name}
                </Nav.Item>
                <Nav.Item id="emaillabel" className="font-weight-light m-0 p-0 pb-2">
                    {user.email}
                </Nav.Item>
                <Nav.Link className="m-0 p-0 pt-4 pb-2" onClick={(): void => logout()}>
                    Sign Out
                </Nav.Link>
            </>
        );
    };

    // ================================================================================================
    // NavigationBar
    //

    return (
        <Styled>
            <NavBarLarge />
            <NavigationBarSmall />
        </Styled>
    );
});

export default NavBar;
