/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components';

const IconWrapper = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  svg{
    font-size: 28px;
    margin-bottom: 24px;
  }
  &:hover {
    color: #307AF2;
    background: #F7F8FA;
  }
  &:active {
    color: #0751DF;
    background: #F0F2F5;
  }
`;

export default ({ children }) => <IconWrapper>
    { children }
  </IconWrapper>;
