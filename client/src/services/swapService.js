

export const exchangeTokens = async (exchange, srcToken, dstToken, amount, sender) => {
    try {
        await exchange.methods.swapTokenToToken(srcToken, dstToken, amount).send({ account: sender });
    } catch(err) {
        console.log(err);
    }
};