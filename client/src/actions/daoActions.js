import { getAllCharities, getVotingPower, vote } from "../services/daoService";

export const getInitialData = () => async (dispatch) => {
  dispatch({
    type: 'INITIAL_DAO_DATA',
    payload: {
      charities: []
    }
  });
};

export const getCharities = () => async (dispatch, getState) => {
  const { daoContract } = getState().web3Reducer;

  let charities = await getAllCharities(daoContract);

  console.log(charities);

  if (!charities) {
    charities = [];
  }


  dispatch({
    type: 'CHARITIES',
    payload: {
      charities,
    }});
};

export const getVotingPowerForUser = () => async (dispatch, getState) => {
  const { daoContract, account } = getState().web3Reducer;

  let votingPower = await getVotingPower(daoContract, account);

  console.log('Voting power: ', votingPower);

  dispatch({
    type: 'USER_VOTING_POWER',
    payload: 
      votingPower,
    });
};

export const callVote = (pos) => async (dispatch, getState) => {
  const { daoContract, account } = getState().web3Reducer;

  await vote(daoContract, pos, account);
 
};


