/*
 *  Receives a value and a mask, example:
 *  value: '12345678'
 *  mask: '.....-...'
 */

function setMaskedValue(value, mask) {
  let index = 0;
  const maskedValue = mask.replace(/\./g, (c) => {
    if (c === '.') {
      return value.charAt(index++);
    } else {
      return c;
    }
  });
  return maskedValue;
}

export default setMaskedValue;
