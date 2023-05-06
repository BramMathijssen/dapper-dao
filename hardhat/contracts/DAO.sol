// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";

error ParentContract__NotOwnerOfToken();

/// @title DAO
/// @author Bram Mathijssen
/// @notice My DAO
contract DAO {
    /* Type declarations */
    using Counters for Counters.Counter;

    enum Role {
        USER,
        ADMIN
    }

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

    mapping(address => Member) public members;
    mapping(uint256 => Proposal) public proposals;

    address[] private _membersList;

    /* Structs */
    struct Member {
        // uint256 id;
        bool valid; // checks if member has been initialised in mapping
        bytes32 name;
        uint256 memberSince;
        mapping(bytes32 => bool) role; // mapping gives ability to hold multiple roles
    }

    struct Proposal {
        uint256 id;
        bool valid;
        bool active;
        string description;
        uint32 startDate;
        uint32 endDate;
        int32 voteCount;
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
    constructor(bytes32 _name) {
        i_owner = msg.sender;

        // load struct in storage before assigning values since we are using a mapping inside struct
        Member storage member = members[msg.sender];
        member.valid = true;
        member.name = _name;
        member.memberSince = block.timestamp;
        member.role[ADMIN] = true;
    }

    /* Functions */

    /* external Functions */
    function addMember(
        address _address,
        bytes32 _name,
        Role _role
    ) external hasRole(ADMIN) {
        require(_address != address(0), "address can't be 0");
        require(_name != bytes32(0), "name can't be 0");
        require(members[_address].valid == false, "member already exists");

        Member storage member = members[_address];
        member.valid = true;
        member.name = _name;
        member.memberSince = block.timestamp;
        member.role[_getRole(_role)] = true;

        _membersList.push(_address); 

        emit MemberAdded(_address, _name, _role);
    }

    // todo: remove member

    function createProposal(
        string memory _description,
        Duration _duration
    ) external hasRole(USER) {
        require(bytes(_description).length > 10, "need atleast 10 characters");
        _proposalIds.increment();
        uint256 proposalId = _proposalIds.current();
        proposals[proposalId] = Proposal({
            id: proposalId,
            valid: true,
            description: _description,
            startDate: uint32(block.timestamp),
            endDate: uint32(_getTimestampByDuration(_duration)),
            active: true,
            voteCount: 0
        });
        emit ProposalCreated(proposalId, _description, _duration);
    }

    function vote(uint256 _proposalNumber, bool upVote) external hasRole(USER) {
        Proposal storage proposal = proposals[_proposalNumber];
        require(proposal.valid == true, "proposal not valid");
        require(proposal.active == true, "proposal not active");
        require(block.timestamp < proposal.endDate, "proposal ended");
        require(
            block.timestamp >= proposal.startDate,
            "proposal hasn't started"
        );
        if (upVote) {
            proposal.voteCount++;
        } else {
            proposals[_proposalNumber].voteCount--;
        }
        emit Voted(_proposalNumber, upVote, msg.sender);
    }

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

    function getMember(address _memberAddress) external view returns(bool, bytes32, uint256){ 
        
    }

    /* public Functions */
    /* internal Functions */

    /* private Functions */
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
    }

    function _grantRole(
        address _memberAddress,
        Role _role
    ) private hasRole(ADMIN) {
        Member storage member = members[_memberAddress];
        member.role[_getRole(_role)] = true;
    }

    function _getRole(Role _role) private pure returns (bytes32) {
        if (_role == Role.USER) {
            return USER;
        }
        if (_role == Role.ADMIN) {
            return ADMIN;
        }
        return 0;
    }
}
