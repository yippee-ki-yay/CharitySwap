

export const getDaoStatus = async (charityDao) => {
    try {
        const status = await charityDao.methods.getCurrentState().call();

        if (status === 0) {
            return "ACTIVE";
        } else if (status === 1) {
            return "VOTING";
        } else {
            return "PAYOUT";
        }
    } catch(err) {
        console.log(err);
    }
};

export const getCharities = async (charityDao) => {

};

export const getCurrDonationAmount = async (charityDao) => {

};

export const getTotalDonationAmount = async (charityDao) => {

};

export const getUserDonationAmount = async (charityDao, user) => {

};

export const getVotingPower = async (charityDao, user) => {

};

export const vote = async (charityDao, charity) => {

};

export const addCharity = async (charityDao, charityData) => {

};