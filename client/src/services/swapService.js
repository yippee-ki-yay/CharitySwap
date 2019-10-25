

export const exchangeTokens = async (exchange, srcToken, dstToken, amount, sender) => {
    try {
        await exchange.methods.swapTokenToToken(srcToken, dstToken, amount).send({ account: sender });
    } catch(err) {
        console.log(err);
    }
};

export const getPrice = async (exchange, srcToken, dstToken, amount) => {
    try {
        const price = await exchange.methods.getExpectedRate(srcToken, dstToken, amount).call();

        return price;
    } catch(err) {
        console.log(err);
    }
};