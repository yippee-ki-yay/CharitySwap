

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
    try {
        const charities = await charityDao.methods.getCharities().call();

        return charities;
    } catch(err) {
        console.log(err);
    }
};

export const getCurrDonationAmount = async (charityDao) => {

};

export const getTotalDonationAmount = async (charityDao) => {

};

export const getUserDonationAmount = async (charityDao, user) => {

};

export const getVotingPower = async (charityDao, userAddr) => {
    try {
        const votingPower = await charityDao.methods.points(userAddr).call();

        return votingPower;

    } catch(err) {
        console.log(err);
    }
};

export const vote = async (charityDao, charity, sender) => {
    try {
        await charityDao.methods.vote(charity.arrPos).send({ account: sender });

    } catch(err) {
        console.log(err);
    }
};

export const addCharity = async (charityDao, charityAcc, name, desc, sender) => {
    try {
        await charityDao.methods.addCharity(charityAcc, name, desc).send({ account: sender });

    } catch(err) {
        console.log(err);
    }
};