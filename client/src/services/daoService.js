import { ERC20 } from "../utils/config.json";
import { DAI } from "../utils/tokenInfo.json";

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

export const getCurrDonationAmount = async (web3, networkId, charityDao, exchange) => {
    try {
        const kncAddress = ERC20.networks[networkId].address;
        const daiAddress = DAI[networkId].address;

        const kncToken = new web3.eth.Contract(ERC20.abi, kncAddress);

        let kncBalance = await kncToken.methods.balanceOf(charityDao.address).call();

        const price = await exchange.methods.getExpectedRate(kncAddress, daiAddress, kncBalance).call();

        kncBalance = kncBalance / 1e18;

        return kncBalance * price;
    } catch (err) {
        console.log(err);
    }
};

export const getTotalDonationAmount = async (charityDao) => {
    try {
        const totalDonations = await charityDao.methods.totalDonated().call();

        return totalDonations;
    } catch (err) {
        console.log(err);
    }
};

export const getUserDonationAmount = async (charityDao, user) => {
    try {
        const userDonation = await charityDao.methods.totalExchanged(user).call();

        return userDonation;
    } catch (err) {
        console.log(err);
    }
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
        await charityDao.methods.vote(charity.arrPos).send({ from: sender });

    } catch(err) {
        console.log(err);
    }
};

export const addCharity = async (charityDao, charityAcc, name, desc, sender) => {
    try {
        await charityDao.methods.addCharity(charityAcc, name, desc).send({ from: sender });

    } catch(err) {
        console.log(err);
    }
};