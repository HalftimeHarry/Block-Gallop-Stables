// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract HorseClaim {
    using SafeMath for uint256;

    address public dao;
    address public trainer;

    struct Claim {
        uint256 horseId;
        uint256 claimingPrice;
        bool finalized;
        bool approved;
        mapping(address => uint256) contributions;
        uint256 totalContributions;
    }

    mapping(uint256 => Claim) public claims;

    modifier onlyTrainer() {
        require(msg.sender == trainer, "Only trainer can call this method");
        _;
    }

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO can call this method");
        _;
    }

    constructor(address _dao, address _trainer) {
        dao = _dao;
        trainer = _trainer;
    }

    function createClaim(
        uint256 _horseId,
        uint256 _claimingPrice
    ) external onlyTrainer {
        Claim storage claim = claims[_horseId];
        claim.horseId = _horseId;
        claim.claimingPrice = _claimingPrice;
        claim.finalized = false;
        claim.approved = false;
    }

    function contributeToClaim(uint256 _horseId) external payable {
        Claim storage claim = claims[_horseId];
        require(!claim.finalized, "Claim has been finalized");

        claim.contributions[msg.sender] = claim.contributions[msg.sender].add(
            msg.value
        );
        claim.totalContributions = claim.totalContributions.add(msg.value);
    }

    function finalizeClaim(
        uint256 _horseId,
        bool _approved
    ) external onlyTrainer {
        Claim storage claim = claims[_horseId];
        require(!claim.finalized, "Claim has already been finalized");

        claim.finalized = true;
        claim.approved = _approved;

        if (_approved) {
            // Transfer the claimingPrice to the trainer
            payable(trainer).transfer(claim.claimingPrice);
        } else {
            // Refund the contributions to each contributor
            // You can either implement a manual refund method or use a push pattern (e.g., using a loop)
            // Make sure to handle the gas costs and the block gas limit if using a loop
        }
    }
}
