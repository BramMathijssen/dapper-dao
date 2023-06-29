// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Dapper.dao
/// @author Bram Mathijssen
/// @notice A contract to manage proposals which can be voted on by members which are registered by others
contract DAO {
    /* Type declarations */
    using Counters for Counters.Counter;

    /// @notice Enum to declare the role for members
    enum Role {
        USER,
        ADMIN
    }

    /// @notice Enum to hold the durations for a proposal
    enum Duration {
        DAY,
        WEEK,
        MONTH
    }

    /* State Variables */
    Counters.Counter private _proposalIds;
    Counters.Counter private _memberIds;
    address private immutable i_owner;
    bytes32 private constant USER = keccak256(abi.encodePacked("USER"));
    bytes32 private constant ADMIN = keccak256(abi.encodePacked("ADMIN"));

    /// @notice Associative array to get members from mapping
    address[] private _membersList;

    /* Mappings */
    /// @notice Member address to member struct
    mapping(address => Member) public members;

    /// @notice _proposalId to proposal struct
    mapping(uint256 => Proposal) public proposals;

    /* Structs */
    /**
    @param memberAddress Address of the member.
    @param valid Boolean to check if instance of struct has been created
    @param name Name of member stored in bytes32
    @param memberSince Timestamp of when member has been added
    @param role Mapping which holds roles of member
    */
    struct Member {
        address memberAddress;
        bool valid; 
        bytes32 name;
        uint256 memberSince;
        mapping(bytes32 => bool) role; 
    }

    /** 
    @param id Id of the proposal which corresponds to the _proposalIds counter.
    @param title Title of the proposal.
    @param creator Address of the creator of the proposal.
    @param valid Boolean to check if proposal has been initialised in mapping
    @param active Boolean to check if proposal is currently active for voting
    @param description Description of the proposal
    @param startDate Start date of the proposal, startDate is equal to creation date of the proposal
    @param endDate End Date of the proposal, after this date voting will close
    @param upVotes Holds the amount of upvotes for the proposal
    @param downVotes Holds the amount of downvotes for the proposal
    @param downVotes Holds the amount of downvotes for the proposal
    @param voteCount Holds the total amount of votes for the proposal
    @param voters Holds a list of all the addresses which have voted on the proposal 
    */
    struct Proposal {
        uint256 id;
        string title;
        address creator;
        bool valid;
        bool active;
        string description;
        uint32 startDate;
        uint32 endDate;
        uint32 upVotes;
        uint32 downVotes;
        int32 voteCount;
        address[] voters;
    }

    /* Events */
    event MemberAdded(address indexed memberAddress, bytes32 name, Role role);
    event ProposalCreated(
        uint256 indexed proposalCount,
        string description,
        Duration duration
    );
    event Voted(
        uint256 indexed proposalNumber,
        bool upVote,
        address voterAddress
    );

    /* Modifiers */
    /** @dev This modifier checks if a member has the required role(s)
     * @param _role either USER or ADMIN role
     */
    modifier hasRole(bytes32 _role) {
        bool authorized;

        if (_role == USER) {
            members[msg.sender].role[ADMIN] || members[msg.sender].role[USER]
                ? authorized = true
                : authorized = false;
        }
        if (_role == ADMIN) {
            members[msg.sender].role[ADMIN]
                ? authorized = true
                : authorized = false;
        }
        require(authorized == true, "don't have correct role");
        _;
    }

    /* Constructor */
    /** @dev Initialises the one who deploys the contract as the first admin member
     * @param _name name of owner in bytes32
     */
    constructor(bytes32 _name) {
        i_owner = msg.sender;

        // load struct in storage before assigning values since we are using a mapping inside struct
        Member storage member = members[msg.sender];
        member.valid = true;
        member.name = _name;
        member.memberSince = block.timestamp;
        member.role[ADMIN] = true;
    }


    /* External Functions */
    /** @notice Adds a member to the DAO, only Admins can add new members
     * @param _address Address of the member
     * @param _name Member of the name in bytes32
     * @param _role Role of the member (0 = USER, 1 = ADMIN)
     */
    function addMember(
        address _address,
        bytes32 _name,
        Role _role
    ) external hasRole(ADMIN) {
        require(_address != address(0), "address can't be 0");
        require(_name != bytes32(0), "name can't be 0");
        require(members[_address].valid == false, "member already exists");

        Member storage member = members[_address];
        member.memberAddress = _address;
        member.valid = true;
        member.name = _name;
        member.memberSince = block.timestamp;
        member.role[_getRole(_role)] = true;

        _membersList.push(_address);

        emit MemberAdded(_address, _name, _role);
    }

    /** @notice Creates a new Proposal, either an admin or user can create a proposal.
     * @param _title Title of the proposal
     * @param _description Description of the proposal
     * @param _duration Duration which the proposal will be open from the moment of creation (0 = DAY, 1 = WEEK, 2 = MONTH)
     */
    function createProposal(
        string memory _title,
        string memory _description,
        Duration _duration
    ) external hasRole(USER) {
        require(bytes(_description).length > 10, "need atleast 10 characters");
        _proposalIds.increment();
        uint256 proposalId = _proposalIds.current();
        proposals[proposalId] = Proposal({
            id: proposalId,
            title: _title,
            creator: msg.sender,
            valid: true,
            description: _description,
            startDate: uint32(block.timestamp),
            endDate: uint32(_getTimestampByDuration(_duration)),
            active: true,
            voteCount: 0,
            upVotes: 0,
            downVotes: 0,
            voters: new address[](0)
        });
        emit ProposalCreated(proposalId, _description, _duration);
    }

    /** @notice up or downvote a proposal by id
     * @param _proposalNumber Id of the proposal which will be voted on
     * @param _vote To give a downvote bool should be 0, to give a upvote bool should be 1
     */
    function vote(uint256 _proposalNumber, bool _vote) external hasRole(USER) {
        Proposal storage proposal = proposals[_proposalNumber];
        require(proposal.valid == true, "proposal not valid");
        require(proposal.active == true, "proposal not active");
        require(block.timestamp < proposal.endDate, "proposal ended");
        require(
            block.timestamp >= proposal.startDate,
            "proposal hasn't started"
        );
        require(
            _checkVoted(_proposalNumber, msg.sender) == false,
            "already voted"
        );
        if (_vote) {
            proposal.upVotes++;
        } else {
            proposal.downVotes++;
        }
        proposal.voters.push(msg.sender);
        proposal.voteCount++;
        emit Voted(_proposalNumber, _vote, msg.sender);
    }

    /** @notice Gets all the proposals from the proposals mapping
     *  @dev Loops over all the entries from the proposals mapping by using the _proposalIds as associative variable
     */
    function getAllProposals() external view returns (Proposal[] memory) {
        uint256 proposalId = _proposalIds.current();

        Proposal[] memory proposalsList = new Proposal[](proposalId);
        for (uint256 i = 0; i < proposalId; i++) {
            uint256 currentId = i + 1;
            Proposal storage currentItem = proposals[currentId];
            proposalsList[i] = currentItem;
        }
        return proposalsList;
    }

    /** @notice Gets all the members from the members mapping
     *  @dev Loops over all the entries from the members mapping by using the addresses from _memberslist as associative array
     *  returning individual properties from members, excluding the role since it's a mapping.
     */
    function getMembers()
        external
        view
        returns (
            address[] memory,
            bool[] memory,
            bytes32[] memory,
            uint256[] memory
        )
    {
        address[] memory addresses = new address[](_membersList.length);
        bool[] memory valid = new bool[](_membersList.length);
        bytes32[] memory names = new bytes32[](_membersList.length);
        uint256[] memory memberSince = new uint256[](_membersList.length);

        for (uint256 i = 0; i < _membersList.length; i++) {
            address tempAddress = _membersList[i];
            addresses[i] = members[tempAddress].memberAddress;
            valid[i] = members[tempAddress].valid;
            names[i] = members[tempAddress].name;
            memberSince[i] = members[tempAddress].memberSince;
        }
        return (addresses, valid, names, memberSince);
    }

    /** @notice Helper function to get the timestamp corresponding to the given duration
     * @param _duration Duration which the proposal will be open from the moment of creation (0 = DAY, 1 = WEEK, 2 = MONTH)
     */
    function _getTimestampByDuration(
        Duration _duration
    ) private view returns (uint256) {
        if (_duration == Duration.DAY) {
            return block.timestamp + 1 days;
        }
        if (_duration == Duration.WEEK) {
            return block.timestamp + 1 weeks;
        }
        if (_duration == Duration.MONTH) {
            return block.timestamp + 4 weeks;
        }
        revert("Invalid duration"); // Reverts if no valid duration was found
    }

    /** @notice Change the role of a member, can only be called by an Admin
     * @param _memberAddress Address of the member which will be granted another role
     * @param _role Enum of the role which will be granted to the member (0 = USER, 1 = ADMIN)
     */
    function _grantRole(
        address _memberAddress,
        Role _role
    ) private hasRole(ADMIN) {
        Member storage member = members[_memberAddress];
        member.role[_getRole(_role)] = true;
    }

    /** @notice Helper function to get the keccak256 encoded bytes32 of a role
     * @param _role Enum of the role which will be granted to the member (0 = USER, 1 = ADMIN)
     */
    function _getRole(Role _role) private pure returns (bytes32) {
        if (_role == Role.USER) {
            return USER;
        }
        if (_role == Role.ADMIN) {
            return ADMIN;
        }
        return 0;
    }

    /** @notice Checks a proposal if a member has already voted on it.
     * @param _proposalNumber Id of the proposal which will be checked for vote
     * @param _voterAddress Address of the member which will be checked for vote
     */
    function _checkVoted(
        uint _proposalNumber,
        address _voterAddress
    ) internal view returns (bool) {
        Proposal memory proposal = proposals[_proposalNumber];
        address[] memory voters = proposal.voters;
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == _voterAddress) return true;
        }
        return false;
    }
}
