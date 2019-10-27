const INITIAL_STATE = {
  charities: [],
  totalDonations: '0',
  userVotingPower: 0
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'INITIAL_DAO_DATA':
      return {
        ...state,
        charities: payload.charities,
      };

    case 'CHARITIES':
      return {
        ...state,
        charities: payload.charities,
      };

    case 'USER_VOTING_POWER':
        return {
          ...state,
          userVotingPower: payload,
        };


    default:
      return state;
  }
};
