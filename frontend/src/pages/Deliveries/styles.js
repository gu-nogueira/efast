import styled, { css } from 'styled-components';
import colors from '../../styles/colors';

export const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: ${(props) => props.mt + 'px'};
  margin-bottom: ${(props) => props.mb + 'px'};

  & + & {
    margin-top: 15px;
  }
`;

export const Wrapper = styled.div`
  ${(props) =>
    props.flex &&
    css`
      display: flex;
      align-items: center;
    `}

  ${(props) =>
    props.stretch &&
    css`
      width: stretch;
    `}

  ${(props) =>
    props.gap &&
    css`
      gap: ${(props) => props.gap + 'px'};
    `}

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: 500;
  }

  span.error {
    margin-left: 0;
  }

  a + button {
    margin-left: 20px;
  }

  & + & {
    margin-left: 30px;
  }
`;

export const Content = styled.div`
  min-width: 25vw;

  strong {
    font-size: 14px;
    font-weight: 700;
  }

  small {
    opacity: 0.7;
  }

  p {
    margin: 10px 0;
  }

  span.pending {
    color: ${colors.yellow1};
    font-weight: 500;
  }

  img {
    display: block;
    position: relative;
    margin: -40px auto 0 auto;
    width: 180px;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
    transform: rotate(-0.25turn);
    transition: transform 0.2s;
  }

  img:hover {
    transform: rotate(-0.25turn) scale(1.5);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  }
`;
