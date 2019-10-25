export const getInitialData = () => async (dispatch) => {
  dispatch({
    type: 'INITIAL_DAO_DATA',
    payload: {
      charities: []
    }
  });
};

export const getCharities = () => async (dispatch) => {
  dispatch({
    type: 'CHARITIES',
    payload: {
      charities: [
        { id: 1, name: 'Charity Name', description: 'This organization works on bringing A to B', score: 12345 },
        { id: 2, name: 'Charity Name 2', description: 'This organization works on bringing A to B', score: 12345 },
      ]
    }
  });
};
