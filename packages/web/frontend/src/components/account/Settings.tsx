import React from 'react';
import { Col, Container, Jumbotron, Nav, Row, Tab } from 'react-bootstrap';
import styled from 'styled-components';
import { ChangePassword } from './ChangePassword';
import { Mfa } from './Mfa';
import { useSessionStore } from '../../state/SessionStore';
import { RouteComponentProps } from 'react-router-dom';

const Styled = styled.div``;

export const Settings = (props: {} & RouteComponentProps): JSX.Element => {
    const [sessionState, sessionActions] = useSessionStore();

    const clearMessage = (): void => {
        sessionActions.clearMessages();
    };

    return (
        <Styled>
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
                                            <Nav.Link onClick={clearMessage} eventKey="change-password">
                                                Change Password
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link onClick={clearMessage} eventKey="mfa">
                                                Multi Factor Authentication
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={9}>
                                    <Tab.Content>
                                        <Tab.Pane mountOnEnter eventKey="change-password">
                                            <ChangePassword {...props} sessionStore={[sessionState, sessionActions]} />
                                        </Tab.Pane>
                                        <Tab.Pane mountOnEnter eventKey="mfa">
                                            <Mfa {...props} sessionStore={[sessionState, sessionActions]} />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Container>
                </Jumbotron>
            </Container>
        </Styled>
    );
};

export default Settings;
