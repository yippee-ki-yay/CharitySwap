const CharitySwap = artifacts.require("CharitySwap");
const CharityDao = artifacts.require("CharityDao");

module.exports = async (deployer) => {

  await deployer.deploy(CharityDao, {gas: 6000000 });
  let charityDao = await CharityDao.deployed();

  await deployer.deploy(CharitySwap, charityDao.address, {gas: 6000000 });

  let charitySwap = await CharityDao.deployed();

  console.log(charitySwap.address);

  await charityDao.setExchange(charitySwap.address, {gas: 6000000});
};