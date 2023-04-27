// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./BGSToken.sol";
import "./GBGSToken.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./RoleManager.sol"; // Import the RoleManager contract

contract HorseEscrow is
    RoleManager // Inherit from the RoleManager contract
{
    address public nftAddress;
    address public governanceTokenAddress;
    address payable public seller;
    address public veterinarian;
    address public dao;
    address public bgstTokenAddress;

    modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only buyer can call this method");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this method");
        _;
    }

    modifier onlyVeterinarian() {
        require(
            msg.sender == veterinarian,
            "Only veterinarian can call this method"
        );
        _;
    }

    modifier notExpired(uint256 _nftID) {
        require(block.timestamp < deadline[_nftID], "Deadline has passed");
        _;
    }

    modifier goalReached(uint256 _nftID) {
        require(
            currentDeposit[_nftID] >= goalAmount[_nftID],
            "Target amount not reached"
        );
        _;
    }

    mapping(uint256 => address payable) public horseSeller;
    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public veterinarianPassed;
    mapping(uint256 => mapping(address => bool)) public approval;
    mapping(uint256 => uint256) public goalAmount;
    mapping(uint256 => uint256) public currentDeposit;
    mapping(uint256 => mapping(address => uint256)) public buyerDeposit;
    mapping(uint256 => uint256) public deadline;
    mapping(uint256 => bool) public saleFinalized;

    event LogSuccess(bool success);

    constructor(
        address _nftAddress,
        address _governanceTokenAddress,
        address payable _seller,
        address _veterinarian,
        address _dao,
        address _bgstTokenAddress
    ) {
        nftAddress = _nftAddress;
        governanceTokenAddress = _governanceTokenAddress;
        seller = _seller;
        veterinarian = _veterinarian;
        dao = _dao;
        bgstTokenAddress = _bgstTokenAddress;

        // Grant the SELLER_ROLE to the initial seller address
        _setupRole(SELLER_ROLE, _seller);

        // Grant the VETERINARIAN_ROLE to the initial veterinarian address
        _setupRole(VETERINARIAN_ROLE, _veterinarian);

        // Grant the DAO_ROLE to the initial DAO address
        _setupRole(DAO_ROLE, _dao);
    }

    function calculateGovernanceTokens(
        uint256 amount
    ) internal pure returns (uint256) {
        // Implement your logic for calculating the number of governance tokens based on the buyer's contribution
    }

    fallback() external payable {
        // handle unknown function selector
    }

    function setGoalAmount(
        uint256 _nftID,
        uint256 _goalAmount
    ) public onlySeller {
        goalAmount[_nftID] = _goalAmount;
    }

    function setSeller(address payable _seller) public onlySeller {
        // Revoke the role from the old seller
        revokeRole(SELLER_ROLE, seller);

        // Update the seller
        seller = _seller;

        // Grant the role to the new seller
        grantRole(SELLER_ROLE, seller);
    }

    function setVeterinarian(address _veterinarian) public onlySeller {
        veterinarian = _veterinarian;
    }

    function setDao(address _dao) public onlySeller {
        dao = _dao;
    }

    function setDeadline(uint256 _nftID, uint256 _deadline) public onlySeller {
        deadline[_nftID] = _deadline;
    }

    function list(
        uint256 _nftID,
        address _buyer,
        uint256 _purchasePrice,
        uint256 _goalAmount,
        uint256 _deadline,
        address payable _seller
    ) public {
        // Transfer NFT from seller to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);

        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        goalAmount[_nftID] = _goalAmount;
        buyer[_nftID] = _buyer;
        deadline[_nftID] = _deadline;
        horseSeller[_nftID] = _seller;
    }

    // Update Veterinarian Status (only veterinarian)
    function updateVeterinarianStatus(
        uint256 _nftID,
        bool _passed
    ) public onlyVeterinarian {
        veterinarianPassed[_nftID] = _passed;
    }

    // Approve Sale
    function approveSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true;
    }

    // Finalize Sale
    // -> Require veterinarian status (add more items here, like appraisal)
    // -> Require sale to be authorized
    // -> Require funds to be correct amount
    // -> Transfer NFT to DAO
    // -> Transfer Funds to seller
    // -> Mint and distribute governance tokens to buyer based on their contribution
    // -> Return excessFunds to buyer when goalAmount is achieved
    function finalizeSale(uint256 _nftID) public {
        require(veterinarianPassed[_nftID], "Veterinarian has not been passed");
        require(approval[_nftID][seller], "Seller has not approved");
        require(approval[_nftID][dao], "DAO has not approved");
        require(isListed[_nftID], "NFT not listed for sale");
        require(
            currentDeposit[_nftID] >= goalAmount[_nftID],
            "Funds not sufficient"
        );

        isListed[_nftID] = false;

        uint256 excessFunds = currentDeposit[_nftID] - goalAmount[_nftID];

        (bool success, ) = payable(horseSeller[_nftID]).call{
            value: purchasePrice[_nftID]
        }("");
        emit LogSuccess(success);
        require(success);

        IERC721(nftAddress).transferFrom(address(this), dao, _nftID);

        //Mint and distribute governance tokens to buyer based on their contribution
        uint256 governanceTokensToMint = calculateGovernanceTokens(
            currentDeposit[_nftID]
        );
        BGSToken(bgstTokenAddress).mint(buyer[_nftID], governanceTokensToMint);

        if (excessFunds > 0) {
            BGSToken(bgstTokenAddress).transfer(buyer[_nftID], excessFunds);
        }

        saleFinalized[_nftID] = true;
    }

    // New function to refund contributions after the deadline has passed
    function refund(uint256 _nftID) public {
        require(!saleFinalized[_nftID], "Sale has been finalized");
        require(
            block.timestamp >= deadline[_nftID],
            "Deadline has not passed yet"
        );
        require(
            block.timestamp >= deadline[_nftID],
            "Deadline has not passed yet"
        );
        require(
            veterinarianPassed[_nftID] == false,
            "Veterinarian has been passed"
        );
        uint256 amount = buyerDeposit[_nftID][msg.sender];
        require(amount > 0, "No contribution found for the sender");

        buyerDeposit[_nftID][msg.sender] = 0;
        currentDeposit[_nftID] -= amount;

        payable(msg.sender).transfer(amount);
    }

    function getIsListed(uint256 nftID) public view returns (bool) {
        return isListed[nftID];
    }

    // Cancel Sale (handle earnest deposit)
    // -> if Veterinarian status is not approved, then refund, otherwise send to seller
    function cancelSale(uint256 _nftID) public {
        if (veterinarianPassed[_nftID] == false) {
            payable(buyer[_nftID]).transfer(address(this).balance);
        } else {
            payable(seller).transfer(address(this).balance);
        }
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
