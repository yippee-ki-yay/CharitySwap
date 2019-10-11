pragma solidity ^0.5.0;

// TODO: SafeMath
contract CharityDao {
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

    }

    // function getWinner() internal returns (address) {
    //     uint mostVotes = charitiesInARound[0];

    //     for(uint i = 1; i < charitiesInARound[currRound].length; ++i) {
    //         charitiesInARound[i]
    //     }
    // }
}