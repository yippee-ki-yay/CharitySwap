const getInitialData = () => async (dispatch) => {
  dispatch({
    type: 'INITIAL_DAO_DATA',
    payload: {
      charities: []
    }
  });
};
