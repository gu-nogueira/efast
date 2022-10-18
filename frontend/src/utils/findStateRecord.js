import axios from 'axios';

/*
 *  Cached states
 */

const states = [];

async function fetchStates() {
  const response = await axios.get(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
  );
  if (states.length === 0) {
    states.push(...response.data);
  }
}

fetchStates();

/*
 *  Finds the correct Brazilian state based on it's initials
 */

function findStateRecord(stateInitials) {
  const state = states.find((state) => state.sigla === stateInitials);
  return state;
}

export default findStateRecord;
