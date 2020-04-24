import React from 'react';
import { StaticContext } from 'react-router';
import { Col, Container, Jumbotron, Nav, Row, Tab } from 'react-bootstrap';
import styled from 'styled-components';
import { ChangePassword } from './ChangePassword';
import { Totp } from './Totp';
import { useGlobalStore } from '../../state';
import { RouteComponentProps } from 'react-router-dom';

const Styled = styled.div``;

type SettingsProps = RouteComponentProps<{ tab: string }, StaticContext, {}>;

export const Settings = (props: SettingsProps): JSX.Element => {
    const [state, actions] = useGlobalStore();

    const clearMessage = (): void => {
        actions.clearMessages();
    };

    enum SettingsTabs {
        ChangePassword,
        Mfa,
    }

    const SettingsUrls: { [key: string]: SettingsTabs } = {
        changepassword: SettingsTabs.ChangePassword,
        mfa: SettingsTabs.Mfa,
    };

    const tab = props.match.params.tab;
    const defaultActiveKey = SettingsUrls[tab] ? SettingsUrls[tab] : SettingsTabs.ChangePassword;

    return (
        <Styled>
            <Container className="d-flex mt-5 justify-content-center">
                <Jumbotron className="m-0 p-5 w-100">
                    <h1>Settings</h1>
                    <hr />
                    <Container className="m-0 mt-2 p-0">
                        <Tab.Container id="settings-nav" defaultActiveKey={defaultActiveKey}>
                            <Row>
                                <Col sm={3}>
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                            <Nav.Link onClick={clearMessage} eventKey={SettingsTabs.ChangePassword}>
                                                Change Password
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link onClick={clearMessage} eventKey={SettingsTabs.Mfa}>
                                                Multi Factor Authentication
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={9}>
                                    <Tab.Content>
                                        <Tab.Pane mountOnEnter eventKey={SettingsTabs.ChangePassword}>
                                            <ChangePassword {...props} store={[state, actions]} />
                                        </Tab.Pane>
                                        <Tab.Pane mountOnEnter eventKey={SettingsTabs.Mfa}>
                                            <Totp {...props} store={[state, actions]} />
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
