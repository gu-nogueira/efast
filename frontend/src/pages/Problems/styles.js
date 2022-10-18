import styled, { css } from 'styled-components';
import colors from '../../styles/colors';

export const Content = styled.div`
  min-width: 25vw;

  strong {
    font-size: 14px;
    font-weight: 700;
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
    margin: 20px auto 0 auto;
    width: auto;
    max-height: 60px;
  }
`;

export const Description = styled.p`
  max-width: 30vw;
  text-align: justify;
  line-height: 1.5rem;
`;

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
      width: ${typeof props.width === 'number'
        ? props.width + '%'
        : props.width};
    `}

  ${(props) =>
    props.gap &&
    css`
      gap: ${(props) => props.gap + 'px'};
    `}

  ${(props) =>
    props.text &&
    css`
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: pre;
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
