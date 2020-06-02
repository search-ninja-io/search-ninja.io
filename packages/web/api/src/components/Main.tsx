import React, { useState, useEffect, MouseEvent } from 'react';
import { Switch, Route } from 'react-router-dom';

import Sidebar from 'react-sidebar';

import { Header } from './Header';
import { SidebarContent } from './SidebarContent';
import { Page } from './Page';

const styles = {
    contentHeaderMenuLink: {
        textDecoration: 'none',
        color: 'white',
        padding: 8,
    },
    content: {
        padding: '16px',
    },
};

const mql = window.matchMedia(`(min-width: 800px)`);

export const Main = (): JSX.Element => {
    const [docked, setDocked] = useState<boolean>(mql.matches);
    const [open, setOpen] = useState<boolean>(false);

    const transitions = true;
    const touch = true;
    const shadow = true;
    const pullRight = false;
    const touchHandleWidth = 20;
    const dragToggleDistance = 30;

    useEffect(() => {
        mql.addListener(mediaQueryChanged);
        return () => {
            mql.removeListener(mediaQueryChanged);
        };
    }, []);

    const onSetOpen = (open: boolean): void => {
        setOpen(open);
    };

    const mediaQueryChanged = (): void => {
        setDocked(mql.matches);
        setOpen(false);
    };

    const toggleOpen = (ev: MouseEvent): void => {
        setOpen(!open);
        if (ev) {
            ev.preventDefault();
        }
    };

    const sidebar = <SidebarContent />;

    const contentHeader = (
        <span>
            {!docked && (
                <a onClick={toggleOpen} href="#" style={styles.contentHeaderMenuLink}>
                    =
                </a>
            )}
            <span> Search Ninja - Documentation</span>
        </span>
    );

    const sidebarProps = {
        key: 'sidebar',
        sidebar,
        docked: docked,
        sidebarClassName: 'custom-sidebar-class',
        contentId: 'custom-sidebar-content-id',
        open: open,
        touch: touch,
        shadow: shadow,
        pullRight: pullRight,
        touchHandleWidth: touchHandleWidth,
        dragToggleDistance: dragToggleDistance,
        transitions: transitions,
        onSetOpen: onSetOpen,
    };

    return (
        <Sidebar {...sidebarProps}>
            <Header name="main-header" title={contentHeader}>
                <div key="main-header-content" style={styles.content}>
                    <Switch>
                        <Route path="/" component={Page} />
                    </Switch>
                </div>
            </Header>
        </Sidebar>
    );
};

export default Main;
