import styled from 'styled-components';
import colors from '../../styles/colors';

export const Wrapper = styled.div`
  background-color: ${colors.background};
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const Content = styled.div`
  position: relative;
  flex: 1;
  width: 1200px;
  margin: 50px 0;

  /*
   *  Cards
   */

  .card {
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(125, 64, 231, 0.05);
    padding: 30px;

    @media only screen and (max-width: 1049px) {
      padding: 15px;
    }
  }

  /*
   *  Tags
   */

  .tag {
    display: inline;
    font-size: 14px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 5px;
  }

  /*
  *  Tag colors
  */

  .tag.green {
    color: ${colors.green2};
    background: ${colors.green2 + '40'};
  }

  .tag.cyan {
    color: ${colors.green3};
    background: ${colors.green3 + '40'};
  }

  .tag.orange {
    color: ${colors.orange2};
    background: ${colors.orange2 + '40'};
  }

  .tag.blue {
    color: ${colors.blue1};
    background: ${colors.blue1 + '40'};
  }

  /*
   *  Inputs
   */

  input[type='checkbox'] {
    -webkit-appearance: none;
    border: 2px solid ${colors.grey2};
    padding: 7px;
    border-radius: 3px;
    display: inline-block;
    position: relative;
    margin-right: 5px;
    transition: all 0.1s;
  }

  input[type='checkbox']:checked {
    background: ${colors.purpleShadow};
    border: 2px solid ${colors.purpleShadow};
    color: #fff;
  }

  input[type='checkbox']:after {
    content: '';
    position: absolute;
    display: none;
  }

  input[type='checkbox']:checked:after {
    display: block;
    left: 4px;
    top: 1px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  input[type='checkbox']:disabled {
    border: 2px solid ${colors.grey2};
    background: ${colors.grey1 + '33'};
  }

  input[type='radio'] {
    -webkit-appearance: none;
    border: 2px solid ${colors.grey2};
    padding: 7px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    margin-right: 5px;
    transition: all 0.1s;
  }

  input[type='radio']:checked {
    background: ${colors.purpleShadow};
    border: 2px solid ${colors.purpleShadow};
    color: #fff;
  }

  input[type='radio']:after {
    content: '';
    position: absolute;
    display: none;
  }

  input[type='radio']:checked:after {
    display: block;
    left: 3px;
    top: 3px;
    width: 2px;
    height: 2px;
    background: #fff;
    border: 3px solid #fff;
    border-radius: 50%;
  }

  input[type='radio']:disabled {
    border: 2px solid ${colors.grey2};
    background: ${colors.grey1 + '33'};
  }

  /*
   *  Buttons
   */

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    height: 38px;
    padding: 10px 16px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
    transition: background 0.2s;
    background: ${colors.purple};

    svg {
      width: 20px;
      fill: white;
    }

    svg + span {
      margin-left: 5px;
    }

    &:hover {
      background: ${colors.purpleShadow};
    }

    &:disabled {
      background: ${colors.grey2} !important;
      cursor: not-allowed !important;

      &:hover {
        background: ${colors.grey1} !important;
      }
    }
  }

  .button.grey {
    background: ${colors.grey2};
  }

  .button.small {
    height: 32px;
    font-size: 12px;
  }

  /*
   *  Selects
   */

  select {
    height: 38px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    border: 1px solid ${colors.grey2};
    border-radius: 5px;
  }

  /*
   *  Loaders
   */

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    svg {
      display: flex;
      align-self: center;
      width: 60px;
      fill: ${colors.purple};
      margin-bottom: 20px;
    }
  }

  /*
   *  Badges
   */

  .badge {
    font-size: 14px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      margin-left: 5px;
    }
  }

  .badge.purple {
    color: ${colors.purple};
    background: ${colors.border};
    box-shadow: 0 0 20px rgba(125, 64, 231, 0.05);
  }

  .badge.grey {
    color: ${colors.grey1};
    background: ${colors.grey2};
    box-shadow: 0 0 20px rgba(125, 64, 231, 0.05);
  }
`;
