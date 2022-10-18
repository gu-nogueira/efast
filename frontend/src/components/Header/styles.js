import styled, { css } from 'styled-components';

import { Link } from 'react-router-dom';

import colors from '../../styles/colors';

export const Container = styled.header`
  width: 100%;
  height: 64px;
  background: #fff;
  box-shadow: 0 0 20px rgba(125, 64, 231, 0.08);
  display: flex;
  justify-content: space-between;
  padding: 15px;

  nav {
    height: 100%;
    display: flex;
    align-items: center;

    img {
      width: auto;
      height: 20px;
    }
  }
`;

export const Menu = styled.div`
  border-left: 1px solid ${colors.grey2};
  margin-left: 25px;
  padding-left: 25px;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const Item = styled(Link).attrs(({ route }) => ({ to: route || '/' }))`
  color: #333;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;

  ${(props) =>
    props.selected &&
    css`
      color: ${colors.purple};
      letter-spacing: 2px;
    `}

  &:hover {
    opacity: 0.8;
  }

  & + a {
    margin-left: 7%;
  }
`;

export const Profile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  span {
    display: block;
    font-weight: bold;
  }

  button {
    border: none;
    background: none;
    color: ${colors.warning1};
    font-weight: bold;
    font-size: 14px;
    margin-top: 5px;
    display: flex;
    align-items: center;

    svg {
      width: 18px;
      height: 18px;
      margin-left: 5px;
    }
  }
`;
