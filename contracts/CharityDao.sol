pragma solidity ^0.5.0;

import "./helpers/ERC20.sol";
import "./helpers/KyberNetworkProxyInterface.sol";

// TODO: SafeMath
contract CharityDao {

    address constant KYBER_INTERFACE = 0x818E6FECD516Ecc3849DAf6845e3EC868087B755;
    address constant ETHER_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address constant KNC_ADDRESS = 0xdd974d5c2e2928dea5f71b9825b8b646686bd200;

    address public owner;
    address public exchange;

    enum CharityState { NONE, UNDER_REVIEW, APPROVED, BLACKLISTED }

    enum ContractState { ACTIVE, VOTING, PAYOUT }

    struct Charity {
        address submiter;
        address charityAccount;
        string name;
        string desc;
        uint timestamp;
        CharityState state;
    }

    uint public currRound;

    Charity[] public charities;
    mapping(address => bool) public charityExists;

    mapping(address => uint) public points;

    mapping(uint => mapping(address => uint)) public indexOfVotesPerRound;
    mapping(uint => address[]) public charitiesInARound;

    modifier onlyExchange {
        require(msg.sender == exchange, "Must be exchange contract");
        _;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Must be owner");
        _;
    }
    
    constructor(address _exchange) public {
        owner = msg.sender;
        exchange = _exchange;
    }

    // Public methods
    
    function vote(uint _pos) public {
        Charity memory selectedCharity = charities[_pos];

        require(selectedCharity.state == CharityState.APPROVED);
        // TODO: check contract state

        address charityAddr = selectedCharity.charityAccount;
        uint usersVotingPower = points[msg.sender];

        indexOfVotesPerRound[currRound][charityAddr] += usersVotingPower;

        // first vote for the charity in this round
        if(indexOfVotesPerRound[currRound][charityAddr] == 0) {
            charitiesInARound[currRound].push(selectedCharity.charityAccount);
        }

        points[msg.sender] = 0;
    }

    function payToCharity() public {
        // is in Good state
        // convert moneyz
        // get the winner //TODO: potential DoS
        // payout
    }

    function addCharity(address _charityAccount, string memory _name, string  memory _desc) public {
        require(!charityExists[_charityAccount], "Must be a unqie charity address");

        charities.push(Charity({
            submiter: msg.sender,
            charityAccount: _charityAccount,
            name: _name,
            desc: _desc,
            timestamp: now,
            state: CharityState.UNDER_REVIEW
        }));

        charityExists[_charityAccount] = true;
    }

    // Exchange only functions
    function addPoints(address _user, uint _numPoints) public onlyExchange {
        points[_user] += _numPoints;
    }
    
    // Admin functions

    function blacklistCharity(uint _pos) public onlyOwner {
        Charity storage blockedCharity = charities[_pos];

        require(blockedCharity.state == CharityState.UNDER_REVIEW);

        blockedCharity.state = CharityState.BLACKLISTED;
    }

    // Internal
    function convertKnc() internal {
        uint minRate;
        ERC20 ethToken = ERC20(ETHER_ADDRESS);
        ERC20 token = ERC20(KNC_ADDRESS);

        uint kncAmount = ERC20(KNC_ADDRESS).balanceOf(address(this));
        
        KyberNetworkProxyInterface _kyberNetworkProxy = KyberNetworkProxyInterface(KYBER_INTERFACE);
        
        (, minRate) = _kyberNetworkProxy.getExpectedRate(token, ethToken, kncAmount);

        require(token.approve(address(_kyberNetworkProxy), 0));

        token.approve(address(_kyberNetworkProxy), kncAmount);

        uint destAmount = _kyberNetworkProxy.trade(
            token,
            kncAmount,
            ethToken,
            msg.sender,
            uint(-1),
            minRate,
            address(this)
        );

    }

    // function getWinner() internal returns (address) {
    //     uint mostVotes = charitiesInARound[0];

    //     for(uint i = 1; i < charitiesInARound[currRound].length; ++i) {
    //         charitiesInARound[i]
    //     }
    // }
}