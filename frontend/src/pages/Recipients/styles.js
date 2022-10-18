import styled, { css } from 'styled-components';

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
    props.width &&
    css`
      width: ${props.width}%;
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
