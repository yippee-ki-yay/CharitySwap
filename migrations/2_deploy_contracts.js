const CharitySwap = artifacts.require("CharitySwap");

module.exports = function(deployer) {
  deployer.deploy(CharitySwap, "");
};