

export const getDaoStatus = async (charityDao) => {
    try {
        const status = await charityDao.methods.getCurrentState().call();

        return status;
    } catch(err) {
        console.log(err);
    }
};