import tokenInfo from "../utils/tokenInfo.json";
import { ERC20, CharitySwap } from "../utils/config.json";


export const exchangeTokens = async (web3, exchange, networkId, srcToken, dstToken, amount, sender) => {
    try {
        const srcAddress = getTokenAddress(srcToken, networkId);
        const dstAddress = getTokenAddress(dstToken, networkId);

        const convertedAmount = web3.utils.toWei(amount, "ether");

        const exchangeAddr = CharitySwap.networks[networkId].address;

        if (srcToken !== "ETH") {
            await handleApproval(web3, srcAddress, sender, exchangeAddr);
        }

        let ethValue = 0;

        if (srcToken === "ETH") {
            ethValue = convertedAmount;
        }

        await exchange.methods.swap(srcAddress, dstAddress, convertedAmount).send({ from: sender, value: ethValue });
    } catch(err) {
        console.log(err);
    }
};

export const getPrice = async (web3, exchange, networkId, srcToken, dstToken, amount) => {
    try {
        const srcAddress = getTokenAddress(srcToken, networkId);
        const dstAddress = getTokenAddress(dstToken, networkId);

        const convertedAmount = web3.utils.toWei(amount, "ether");

        const price = await exchange.methods.getExpectedRate(srcAddress, dstAddress, convertedAmount).call();

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
};

const handleApproval = async (web3, dstTokenAddr, sender, exchangeAddr) => {
    try {
        const token = new web3.eth.Contract(ERC20.abi, dstTokenAddr);

        const allowance = await token.methods.allowance(sender, exchangeAddr).call();

        if (allowance === "0") {
            await token.methods.approve(exchangeAddr, web3.utils.toWei(Number.MAX_SAFE_INTEGER.toString(), "ether")).send({from: sender});
        }
    } catch(err) {
        console.log(err);
    }
};
