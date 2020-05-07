import React from 'react';
import styled from 'styled-components';

const Styled = styled.div`
    margin-top: 1em;
    margin-left: 6em;
    margin-right: 6em;
`;

export const NotFound: React.FC = () => (
    <Styled>
        <h2>Not Found</h2>
    </Styled>
);
