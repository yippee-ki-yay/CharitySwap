const INITIAL_STATE = {
  charities: [],
  totalDonations: '0',

};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'INITIAL_DAO_DATA':
      return {
        ...state,
        charities: payload.charities,
      };

    default:
      return state;
  }
};
