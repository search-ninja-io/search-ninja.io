import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';

import { Col, Container, Jumbotron, Nav, Row, Tab } from 'react-bootstrap';
import styled from 'styled-components';

import { useGlobalStore } from '../utils/store';

const Styled = styled.div``;

type SettingsProps = RouteComponentProps<{ tab: string }, StaticContext, {}>;

export const Settings: React.FC<SettingsProps> = (props: SettingsProps) => {
    const [, actions] = useGlobalStore();

    const clearMessage = (): void => {
        actions.clearMessages();
    };

    enum SettingsTabs {
        Tab1,
    }

    const SettingsUrls: { [key: string]: SettingsTabs } = {
        tab1: SettingsTabs.Tab1,
    };

    const tab = props.match.params.tab;
    const defaultActiveKey = SettingsUrls[tab] ? SettingsUrls[tab] : SettingsTabs.Tab1;

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
                                            <Nav.Link onClick={clearMessage} eventKey={SettingsTabs.Tab1}>
                                                Tab 1
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={9}>
                                    <Tab.Content>
                                        <Tab.Pane mountOnEnter eventKey={SettingsTabs.Tab1}>
                                            Tab Component 1
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
