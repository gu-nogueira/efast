import styled from 'styled-components';
import colors from '../../styles/colors';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  fill: ${colors.purple};

  svg {
    width: 55px;
    height: 55px;
    padding: 8px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 10px rgba(125, 64, 231, 0.1);
  }
`;
