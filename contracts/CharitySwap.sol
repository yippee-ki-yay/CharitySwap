pragma solidity ^0.5.0;

import "./helpers/ERC20.sol";
import "./helpers/KyberNetworkProxyInterface.sol";
import "./CharityDao.sol";

contract CharitySwap {

    // Kovan
    address constant KYBER_INTERFACE = 0x692f391bCc85cefCe8C237C01e1f636BbD70EA4D;
    address constant ETHER_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    
    // Mainnet
    // address constant KYBER_INTERFACE = 0x818E6FECD516Ecc3849DAf6845e3EC868087B755;
    // address constant ETHER_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    
    CharityDao public charityDao;
    
    constructor(address _charityDao) public {
        charityDao = CharityDao(_charityDao);
    }
    
    event Swap(address indexed _user, address _srcToken, address _destToken, uint _amount);
    
    function swap(address _srcToken, address _destToken, uint _amount) external payable {
        swapTokenToToken(_srcToken, _destToken, _amount);
        
        emit Swap(msg.sender, _srcToken, _destToken, _amount);
        
    }

    function swapTokenToToken(address _srcAddress, address _dstAddress, uint _amount) internal {
        uint minRate;
        ERC20 srcToken = ERC20(_srcAddress);
        ERC20 dstToken = ERC20(_dstAddress);

        KyberNetworkProxyInterface _kyberNetworkProxy = KyberNetworkProxyInterface(KYBER_INTERFACE);

        (, minRate) = _kyberNetworkProxy.getExpectedRate(srcToken, dstToken, _amount);

        uint ethValue = 0;
        
        if (_srcAddress == ETHER_ADDRESS) {
            ethValue = _amount;
        } else {
            require(srcToken.approve(address(_kyberNetworkProxy), 0));
            
            srcToken.transferFrom(msg.sender, address(this), _amount);
            srcToken.approve(address(_kyberNetworkProxy), _amount);
        }

        uint destAmount = _kyberNetworkProxy.trade.value(ethValue)(
            srcToken,
            _amount,
            dstToken,
            msg.sender,
            uint(-1),
            minRate,
            address(charityDao)
        );

        if (_dstAddress == ETHER_ADDRESS) {
            charityDao.addPoints(msg.sender, destAmount);
        } else {
            uint expectedRate;
            (expectedRate, ) = _kyberNetworkProxy.getExpectedRate(srcToken, ERC20(ETHER_ADDRESS), _amount);

            charityDao.addPoints(msg.sender, destAmount * expectedRate); //TODO: check this
        }
    }

    function getExpectedRate(address _src, address _dest, uint _srcQty) public returns (uint, uint) {
        return KyberNetworkProxyInterface(KYBER_INTERFACE).getExpectedRate(ERC20(_src), ERC20(_dest), _srcQty);
    }
}