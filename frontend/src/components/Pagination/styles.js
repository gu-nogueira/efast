import styled, { css } from 'styled-components';
import colors from '../../styles/colors';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    padding: 0 6px !important;
    margin: 0 10px;
  }

  @media only screen and (max-width: 1049px) {
    flex-direction: column;

    & > h4 {
      margin: 0 auto 10px auto;
    }

    div {
      margin-left: 0;

      button {
        margin-top: 10px;
      }
    }
  }
`;

export const PageList = styled.ul`
  display: flex;
  list-style-type: none;
  background: #fff;
  border-radius: 5px;
  border: 1px solid ${colors.border};
  box-shadow: 0 0 10px rgba(125, 64, 231, 0.1);
`;

export const PageItem = styled.li`
  display: flex;
  align-items: center;
  height: 32px;
  min-width: 32px;
  padding: 0 12px;
  border-radius: 5px;
  font-size: 14px;
  transition: all 0.2s;

  &.dots:hover {
    background-color: transparent;
    cursor: default;
  }

  ${(props) =>
    props.selected
      ? css`
          background: ${colors.purpleLight};
          color: #fff;
          font-weight: bold;
        `
      : css`
          &:hover {
            background: ${colors.border};
            color: ${colors.purple};
            font-weight: bold;
            cursor: pointer;
          }
        `}
`;
