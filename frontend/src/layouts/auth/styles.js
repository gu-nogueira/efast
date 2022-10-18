import styled from 'styled-components';
import colors from '../../styles/colors';

export const Wrapper = styled.div`
  background-color: ${colors.background};
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  /*
   *  Mobile screen adjustment
   */

  @media only screen and (max-width: 767px) {
    align-items: flex-start;
  }
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  height: 450px;
  max-width: 800px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(125, 64, 231, 0.1);

  form {
    display: flex;
    width: 100%;
    flex-direction: column;

    a {
      margin: 15px 0;
    }

    /*
     *  Buttons
     */

    button[type='submit'] {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 15px 0 0;
      height: 38px;
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

  /*
   *  Mobile
   */

  @media only screen and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 15px !important;
    margin: 0;
  }
`;
