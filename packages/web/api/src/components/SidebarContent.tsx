import React from 'react';

import { Header } from './Header';
import { config } from '../config';
import { Link } from 'react-router-dom';
import { Nav, NavType, NavDocument, NavApi } from '../config';

const styles = {
    sidebar: {
        width: 256,
        height: '100%',
    },
    sidebarLink: {
        display: 'block',
        padding: '16px 0px 16px 0px',
        color: '#757575',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    sidebarLinkL0: {
        display: 'block',
        padding: '16px 0px 16px 0px',
        color: '#757575',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    sidebarLinkL1: {
        display: 'block',
        padding: '8px 0px 8px 16px',
        color: '#757575',
        textDecoration: 'none',
    },
    sidebarLinkL2: {
        display: 'block',
        padding: '8px 0px 8px 32px',
        color: '#757575',
        textDecoration: 'none',
    },
    sidebarLinkL3: {
        display: 'block',
        padding: '8px 0px 8px 48px',
        color: '#757575',
        textDecoration: 'none',
    },
    divider: {
        margin: '16px -16px',
        height: 1,
        backgroundColor: '#757575',
    },
    content: {
        padding: '16px',
        height: '100%',
        backgroundColor: 'white',
    },
};

const TocListItem = (props: { path: string; title: string; level: number }): JSX.Element => {
    const { path, title, level } = props;
    const { sidebarLinkL0, sidebarLinkL1, sidebarLinkL2, sidebarLinkL3 } = styles;
    const style =
        level === 0 ? sidebarLinkL0 : level === 1 ? sidebarLinkL1 : level === 2 ? sidebarLinkL2 : sidebarLinkL3;
    const link = (
        <Link to={path} style={style}>
            {title}
        </Link>
    );

    return link;
};

const TocItemDivider = () => <div style={styles.divider} />;

const TocItem = (props: { nav: NavApi | NavDocument; level: number; path: string }): JSX.Element => {
    const { nav, level, path } = props;
    const nodePath = (path.endsWith('/') ? path.substring(0, path.length - 1) : path) + '/' + nav.Key;

    if (!nav.Navigation) {
        return <TocListItem level={level} path={nodePath} title={nav.Name} />;
    }
    return (
        <>
            <TocListItem level={level} path={nodePath} title={nav.Name} />
            <Toc navs={nav.Navigation} level={level + 1} path={nodePath} />
        </>
    );
};

let dividerCount = 0;
const Toc = (props: { navs: Nav[]; level: number; path?: string }): JSX.Element => {
    const nodes: JSX.Element[] = [];
    const { navs, level, path } = props;

    navs.forEach((nav) => {
        if (nav.Type === NavType.DOC) {
            nodes.push(
                <TocItem
                    key={'toc-item' + (path || '') + '/' + nav.Key}
                    nav={nav as NavDocument}
                    level={level}
                    path={path || ''}
                />,
            );
        } else if (nav.Type === NavType.API) {
            nodes.push(
                <TocItem
                    key={'toc-item' + (path || '') + '/' + nav.Key}
                    nav={nav as NavApi}
                    level={level}
                    path={path || ''}
                />,
            );
        } else if (nav.Type === NavType.DIVIDER) {
            nodes.push(<TocItemDivider key={'toc-item-divider-' + dividerCount++} />);
        }
    });
    return <>{nodes}</>;
};

export const SidebarContent = (props: { style?: Record<string, unknown> }): JSX.Element => {
    const style = props.style ? { ...styles.sidebar, ...props.style } : styles.sidebar;
    return (
        <Header name="sidebar-header" title="Menu" style={style}>
            <div key="sidebar-content" style={styles.content}>
                <Toc navs={config.Navigation} level={0} />
            </div>
        </Header>
    );
};

export default SidebarContent;
