import styled from 'styled-components/native';
import colors from '~/styles/colors';

export default styled.View`
  flex: 1;
  background: ${(props) => props.background || colors.purple};
`;
