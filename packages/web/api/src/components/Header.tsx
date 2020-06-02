import React from 'react';

const styles = {
    root: {
        fontFamily:
            '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
        fontWeight: 300,
    },
    header: {
        backgroundColor: '#03a9f4',
        color: 'white',
        padding: '16px',
        fontSize: '1.5em',
    },
};

type HeaderProps = {
    name: string;
    style?: Record<string, unknown>;
    title: string | JSX.Element;
    children: React.ReactNode;
};

export const Header = (props: HeaderProps): JSX.Element => {
    const rootStyle = props.style ? { ...styles.root, ...props.style } : styles.root;
    return (
        <div style={rootStyle}>
            <div style={styles.header}>{props.title}</div>
            {props.children}
        </div>
    );
};

export default Header;
