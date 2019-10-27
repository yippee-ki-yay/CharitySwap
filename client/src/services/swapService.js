import tokenInfo from "../utils/tokenInfo.json";

export const exchangeTokens = async (exchange, srcToken, dstToken, amount, sender) => {
    try {
        await exchange.methods.swapTokenToToken(srcToken, dstToken, amount).send({ account: sender });
    } catch(err) {
        console.log(err);
    }
};

export const getPrice = async (exchange, networkId, srcToken, dstToken, amount) => {
    try {
        const srcAddress = getTokenAddress(srcToken, networkId);
        const dstAddress = getTokenAddress(dstToken, networkId);

        const price = await exchange.methods.getExpectedRate(srcAddress, dstAddress, amount).call();

        return price[0] / 1e18;
    } catch(err) {
        console.log(err);
    }
};

const getTokenAddress = (token, networkId) => {
    const tokenData = tokenInfo[token];

    if (tokenData) {
        return tokenData[networkId].address;
    }
}