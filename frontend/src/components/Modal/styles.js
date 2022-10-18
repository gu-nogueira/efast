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

const slideDown = keyframes`
  from {
    margin-top: -30px;
  }
  to {
    margin-top: 0;
  }
`;

export const ScreenWrapper = styled.div`
  animation: ${fadeIn} 0.2s;
  top: 0;
  left: 0;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: #000000ce;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 998;
  backdrop-filter: blur(5px);
`;

export const ModalContainer = styled.div`
  animation: ${slideDown} 0.2s;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  background: #fff;
  padding: 20px;
  margin: 0 15px;
  border-radius: 10px;
  z-index: 999;

  header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;

    h3 {
      width: 100%;
      text-align: left;

      /* Mobile adjustment */

      @media only screen and (max-width: 1049px) {
        margin: 0 0 20px 0;
      }
    }

    svg {
      width: 20px;
      height: 18px;
      margin-left: 10px;
      margin-right: -5px;
      transition: background 0.2s;
      cursor: pointer;
    }

    svg:hover {
      color: ${colors.purpleShadow};
      background: ${colors.purpleLight + '33'};
      border-radius: 3px;
    }
  }
  section {
    overflow-y: auto;

    /*
     *  Scroll bar
     */

    ::-webkit-scrollbar {
      width: 20px;
      margin-left: -10px;
    }
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 10px 10px ${colors.grey2 + '66'};
      border-left: 15px solid transparent;
    }
    ::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 10px 10px ${colors.grey1 + '66'};
      border-left: 15px solid transparent;
    }
    ::-webkit-scrollbar-thumb:hover {
      box-shadow: inset 0 0 10px 10px ${colors.grey1};
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: 25px 0 0;
      height: 34px;
      background: ${colors.purple};
      color: #fff;
      border: none;
      border-radius: 5px;
      transition: background 0.2s;

      &:hover {
        background: ${colors.purpleShadow};
      }

      svg {
        margin-right: 10px;
        width: 20px;
        fill: white;
      }
    }
  }
`;
