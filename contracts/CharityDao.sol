pragma solidity ^0.5.0;

import "./helpers/ERC20.sol";
import "./helpers/KyberNetworkProxyInterface.sol";

// TODO: SafeMath
contract CharityDao {

    address constant KYBER_INTERFACE = 0x818E6FECD516Ecc3849DAf6845e3EC868087B755;
    address constant ETHER_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address constant KNC_ADDRESS = 0xdd974D5C2e2928deA5F71b9825b8b646686BD200;
    address constant GIVETH_ADDRESS = 0xdd974D5C2e2928deA5F71b9825b8b646686BD200;

    uint constant ACTIVE_PERIOD = 30 days;
    uint constant VOTING_PERIOD = 5 days;

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
    uint public startOfRoundTimestamp;

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

        startOfRoundTimestamp = now;
    }

    // Public methods
    
    function vote(uint _pos) public {
        Charity memory selectedCharity = charities[_pos];

        require(selectedCharity.state == CharityState.APPROVED);
        require(getCurrentState() == ContractState.VOTING);

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
        require(getCurrentState() == ContractState.PAYOUT);

        _convertKnc();

        address charityAddr = _getWinner();
        address payable payableCharity = address(uint160(charityAddr));

        payableCharity.transfer(address(this).balance);

        _newRound();
    }

    function addCharity(address _charityAccount, string memory _name, string  memory _desc) public {
        require(!charityExists[_charityAccount], "Must be a unqie charity address");
        require(_charityAccount != address(0));

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

    // TODO: double check this
    function getCurrentState() public view returns (ContractState) {
        uint endOfActivePeriod = startOfRoundTimestamp + ACTIVE_PERIOD;
        uint endOfVotingPeriod = endOfActivePeriod + VOTING_PERIOD;

        if (now > startOfRoundTimestamp && now < endOfActivePeriod) {
            return ContractState.ACTIVE;
        }

        if (now > endOfActivePeriod && now < endOfVotingPeriod) {
            return ContractState.VOTING;
        }

        if (now > endOfVotingPeriod) {
            return ContractState.PAYOUT;
        }
    }

    // Internal
    function _convertKnc() internal {
        uint minRate;
        ERC20 ethToken = ERC20(ETHER_ADDRESS);
        ERC20 token = ERC20(KNC_ADDRESS);

        uint kncAmount = ERC20(KNC_ADDRESS).balanceOf(address(this));
        
        KyberNetworkProxyInterface _kyberNetworkProxy = KyberNetworkProxyInterface(KYBER_INTERFACE);
        
        (, minRate) = _kyberNetworkProxy.getExpectedRate(token, ethToken, kncAmount);

        require(token.approve(address(_kyberNetworkProxy), 0));

        token.approve(address(_kyberNetworkProxy), kncAmount);

        _kyberNetworkProxy.trade(
            token,
            kncAmount,
            ethToken,
            address(this),
            uint(-1),
            minRate,
            address(this)
        );

    }

    function _getWinner() internal view returns (address) {
        uint numCharities = charitiesInARound[currRound].length;

        if (numCharities == 0) { return GIVETH_ADDRESS; }

        address biggestCharity = charitiesInARound[currRound][0];

        if (numCharities == 1) { return biggestCharity; }

        uint biggestVote = indexOfVotesPerRound[currRound][biggestCharity];

        for(uint i = 1; i < charitiesInARound[currRound].length; ++i) {
            address currCharity = charitiesInARound[currRound][i];
            uint currVote = indexOfVotesPerRound[currRound][currCharity];

            if (biggestVote < currVote) {
                biggestVote = currVote;
                biggestCharity = currCharity;
            }
        }

        return biggestCharity;
    }

    function _newRound() internal {
        currRound++;
        startOfRoundTimestamp = now;
    }
}