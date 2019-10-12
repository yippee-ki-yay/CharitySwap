const CharitySwap = artifacts.require("CharitySwap");
const CharityDao = artifacts.require("CharityDao");

module.exports = (deployer) => {
  deployer.deploy(CharitySwap, "");
};