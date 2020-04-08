import React, { useState } from "react";

import { ChangePassword } from "./ChangePassword";
import { ChangeEmail } from "./ChangeEmail";
import { Mfa } from "./Mfa";

import styled from 'styled-components';
import ErrorBanner from '../banner/ErrorBanner';
import { Container, Jumbotron, Row, Tab, Col, Nav } from "react-bootstrap";

const Styled = styled.div`
`;

export const Settings = () => {
    const [error, setError] = useState<Error>();

    return (
        <Styled>

            {error ? <ErrorBanner errors={[error]} /> : <></>}

            <Container className="d-flex mt-5 justify-content-center">

                <Jumbotron className="m-0 p-5 w-100">

                    <h1>Settings</h1>
                    <hr />
                    <Container className="m-0 mt-2 p-0">

                        <Tab.Container id="settings-nav" defaultActiveKey="change-password">
                            <Row>
                                <Col sm={3}>
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                            <Nav.Link eventKey="change-password">Change Password</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="change-email">Change Email</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="mfa">MFA</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={9}>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="change-password">
                                            <ChangePassword setError={setError} />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="change-email">
                                            <ChangeEmail setError={setError} />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="mfa">
                                            <Mfa setError={setError} />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>

                    </Container>

                </Jumbotron>
            </Container>

        </Styled >
    );
};

export default Settings;
