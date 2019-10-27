const INITIAL_STATE = {
    account: null,
    networkId: 0,
    web3: null,
    daoContract: null,
    swapContract: null,
  };
  
  export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case 'SET_DATA':
        return {
          ...state,
          web3: payload.web3,
          account: payload.account,
          networkId: payload.networkId.toString(),
          daoContract: payload.daoContract,
          swapContract: payload.swapContract,
        };
  
      default:
        return state;
    }
  };