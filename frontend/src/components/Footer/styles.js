import styled from 'styled-components';

import colors from '../../styles/colors';

export const Container = styled.footer`
  width: 100%;
  height: 32px;
  padding: 0 10px;
  background: linear-gradient(
    -90deg,
    ${colors.purpleShadow},
    ${colors.purpleLight}
  );
  box-shadow: 0 0 20px rgba(125, 64, 231, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    width: auto;
    height: 12px;
  }

  small {
    color: #fff;
    font-weight: 500;
  }

  a {
    color: #fff;
    font-weight: 600;
  }
`;
