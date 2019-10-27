import { getAllCharities } from "../services/daoService";

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

  const charities = await getAllCharities(daoContract);

  console.log(charities);

  dispatch({
    type: 'CHARITIES',
    payload: {
      charities,
    }});
};
