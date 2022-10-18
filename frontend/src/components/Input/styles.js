import styled, { css } from 'styled-components';
import colors from '../../styles/colors';

export const Container = styled.div`
  /*
   *  Input
   */
  display: flex;
  align-items: center;
  border: 1px solid ${colors.grey2};
  border-radius: 5px;
  height: 38px;
  color: ${colors.grey2};

  svg {
    min-width: 16px;
    margin-left: 10px;
  }

  input {
    border: none;
    margin-left: 5px;
    padding: 0 0 0 5px;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    &::placeholder {
      color: ${colors.grey2};
    }
  }

  & + .input {
    margin-top: 15px;
  }

  ${(props) =>
    props.focused &&
    css`
      transition: all 0.2s;
      border: 1px solid ${colors.purple};
      box-shadow: 0 0 0 1px ${colors.purple};
      svg {
        color: ${colors.purple};
      }
    `}

  ${(props) =>
    props.hasError &&
    css`
      transition: all 0.2s;
      border: 1px solid ${colors.warning1} !important;
      box-shadow: 0 0 0 1px ${colors.warning1} !important;
      svg {
        color: ${colors.warning1} !important;
      }
    `}
  /*
   *  Button
   */
  button[type='button'] {
    display: flex;
    border: none;
    padding: 4px 5px;
    border-radius: 3px;
    margin-right: 2px;
    background: none;
    height: 26px;
    width: 26px;

    &:active {
      background: ${colors.background};
    }

    svg {
      margin-left: 0;
    }
  }
`;
