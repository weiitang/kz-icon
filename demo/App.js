/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import * as icons from '../src/index';
import Header from './components/Header';
import IconWrapper from './components/IconWrapper';

const Page = styled.div`
  position: relative;
`;

const Container = styled.ul`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: stretch;
  align-items: stretch;
  margin: 0;
  padding: 0 0 50px 0;
  list-style: none;
  max-width: 1200px;
  margin: 0 auto;
`;

const IconName = styled.span`
  max-width: 240px;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Message = styled.div`
  position: fixed;
  left: 50%;
  top: 5%;
  transform: translateX(-50%);
  box-shadow: 0px 1px 10px rgb(0 0 0 / 5%), 0px 2px 5px rgb(0 0 0 / 8%), 0px 4px 4px -1px rgb(0 0 0 / 12%);
  border-radius: 3px;
  line-height: 22px;
  font-size: 14px;
  padding: 13px 16px;
  background-color: #BCEBDC;
  color: #00A870;
  transition: opacity 1s ease-in-out;
  opacity: 0;
`;

class List extends React.Component {
  render() {
    return (
      <Page>
        <Header/>
        <Container>
          {
            Object.keys(icons)
              .map((key, index) => {
                const Icon = icons[key];
                return <li key={index} style={{ cursor: 'pointer' }} onClick={() => handleCopyIcon('爱你的Seven')}>
                  <IconWrapper>
                    <Icon/>
                    {/* <IconName>{key}</IconName> */}
                  </IconWrapper>
                </li>;
              })
          }
        </Container>
        <Message id="message">
          爱你寇子
        </Message>
      </Page>
    );
  }
}

function showMessage() {
  const el = document.querySelector('#message');
  el.style.opacity = 1;
  setTimeout(() => {
    el.style.opacity = 0;
  }, 2000);
}

// copy icon
function handleCopyIcon(str) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  console.log('复制成功');
  showMessage();
}

export default List;
