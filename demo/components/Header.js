/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components';

const Header = styled.header`
  padding: 0 20px;
  display: block;
  max-width: 1200px;
  margin: 20px auto;
  border-bottom: 1px solid #eeeeee;
  
  p {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.5);
    margin: 20px 0;
  }
`;

export default () => <Header>
    <h1>Icons</h1>
    <p>* 点击复制组件名称</p>
  </Header>;
