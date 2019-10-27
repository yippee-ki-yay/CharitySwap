

export const setWeb3Data = (web3, account, networkId, daoContract, swapContract) => async (dispatch) => {
    dispatch({
      type: 'SET_DATA',
      payload: {
          web3,
          account,
          networkId,
          daoContract,
          swapContract,
      }
    });
  };