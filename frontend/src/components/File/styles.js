import styled from 'styled-components';
import colors from '../../styles/colors';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  label {
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
      opacity: 0.7;
    }

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      padding: 4px;
      border: 2px solid ${colors.border};
      background: ${colors.background};
      object-fit: cover;
      background-position: center;
    }

    input {
      display: none;
    }
  }
`;

export const AvatarInitials = styled.div`
  width: 150px;
  height: 150px;
  border: 2px dashed ${(props) => props.color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  font-weight: bold;
  color: ${(props) => props.color};
  background: ${(props) => props.color + '33'};
`;

export const DefaultInput = styled.div`
  width: 150px;
  height: 150px;
  border: 2px dashed ${colors.grey2};
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${colors.grey2};
`;
