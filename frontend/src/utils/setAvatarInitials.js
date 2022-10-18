function setAvatarInitials(name) {
  const avatarColors = [
    '#A28FD0',
    '#CB946C',
    '#83CEC9',
    '#CC7584',
    '#A8D080',
    '#CCCC8B',
    '#489fb5',
    '#e26d5c',
    '#00a6fb',
    '#02c39a',
  ];

  /*
   *  Gets random color based on name length
   */

  function getRandomColor(value) {
    const secondDigit = value.toString()[1];
    const colorIndex = (value < 10 ? value : secondDigit) - 1;
    return avatarColors[colorIndex];
  }

  /*
   *  Gets random color based on name length
   */

  const [firstName, lastName] = name.toUpperCase().split(' ');
  const userInitials = firstName?.charAt(0) + lastName?.charAt(0);
  const randomColor = getRandomColor(firstName.length + lastName.length);

  return {
    userInitials,
    randomColor,
  };
}

export default setAvatarInitials;
