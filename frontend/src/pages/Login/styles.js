import styled, { keyframes } from 'styled-components';
import colors from '../../styles/colors';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Column = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px;
  animation: ${fadeIn} 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &:nth-child(1) {
    background: ${colors.purple};
    border-radius: 10px 0 0 10px;
  }

  img {
    width: 200px;
    height: 32px;
  }

  h2 {
    margin-bottom: 30px;
  }

  small {
    margin-top: 20px;
    text-align: center;
  }

  /*
   *  Mobile
   */

  @media only screen and (max-width: 767px) {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      margin-top: 15%;
    }

    & + div {
      margin: 30px 0 0;
      padding: 0;
    }

    h1 {
      text-align: center;
    }
  }
`;
