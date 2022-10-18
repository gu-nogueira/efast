import colors from '../../styles/colors';

export const styles = {
  placeholder: (styles) => ({ ...styles, color: colors.grey2 }),
  clearIndicator: (styles) => ({ ...styles }),
  container: (provided) => ({
    ...provided,
    margin: '0',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    marginRight: 0,
  }),
  menu: (provided, state) => ({
    ...provided,
    color: state.selectProps.menuColor,
    borderRadius: '5px',
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
  control: (provided, state) => ({
    ...provided,
    display: 'flex',
    background: state.isDisabled ? colors.grey3 : 'transparent',
    border: state.selectProps.hasError
      ? `1px solid ${colors.warning1}`
      : state.isFocused
      ? `1px solid ${colors.purple}`
      : `1px solid ${colors.grey2}`,
    boxShadow: state.selectProps.hasError
      ? `0 0 0 1px ${colors.warning1}`
      : state.isFocused && `0 0 0 1px ${colors.purple}`,
    ':hover': {
      border: state.isFocused
        ? `1px solid ${colors.purpleLight}`
        : `1px solid ${colors.grey2}`,
    },
    borderRadius: 5,
    height: 38,
    width: '100%',
  }),
  option: (provided, { isSelected, isFocused }) => ({
    ...provided,
    backgroundColor: isFocused && colors.background,
    borderRadius: isSelected && '5px',
    ':hover': {
      backgroundColor: isSelected ? colors.purple : colors.purpleLight + '22',
    },
    background: isSelected && colors.purple,
  }),
  singleValue: (provided) => ({ ...provided, color: colors.grey1 }),
};
