// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./RaceHorse.sol";
import "./HorseEscrow.sol" as EscrowContract;
import "./HorseClaim.sol";

contract HorseMarket {
    enum SaleType {
        Auction,
        PrivateSale,
        Claim
    }

    struct Sale {
        SaleType saleType;
        address seller;
        uint256 tokenId;
        uint256 price;
        uint256 auctionEndTime;
    }

    RaceHorse private _raceHorseContract;
    mapping(uint256 => Sale) private _horseSales;

    address private nftAddress;
    address private governanceTokenAddress;
    address private veterinarian;
    address private dao;
    address private horseTokenAddress;

    event HorseEscrowCreated(uint256 indexed tokenId, address escrowAddress);
    event HorseListed(
        uint256 indexed tokenId,
        SaleType saleType,
        uint256 price
    );
    event HorseSold(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );
    event HorseSaleCanceled(uint256 indexed tokenId);

    constructor(
        address raceHorseContractAddress,
        address _nftAddress,
        address _governanceTokenAddress,
        address _veterinarian,
        address _dao,
        address _horseTokenAddress
    ) {
        _raceHorseContract = RaceHorse(raceHorseContractAddress);
        nftAddress = _nftAddress;
        governanceTokenAddress = _governanceTokenAddress;
        veterinarian = _veterinarian;
        dao = _dao;
        horseTokenAddress = _horseTokenAddress;
    }

    function listHorseForSale(
        uint256 tokenId,
        SaleType saleType,
        uint256 price,
        uint256 deadline,
        address account // <--- add this argument
    ) external {
        require(
            _raceHorseContract.ownerOf(tokenId) == account, // use account instead of msg.sender
            "Caller must be token owner"
        );
        require(
            _raceHorseContract.getApproved(tokenId) == address(this),
            "Contract not approved for token"
        );
        require(
            saleType != SaleType.Auction || deadline > 0,
            "Invalid auction duration"
        );

        uint256 auctionEndTime = saleType == SaleType.Auction
            ? block.timestamp + deadline
            : 0;
        _horseSales[tokenId] = Sale(
            saleType,
            msg.sender,
            tokenId,
            price,
            auctionEndTime
        );

        emit HorseListed(tokenId, saleType, price);

        // Approve the HorseMarket contract to manage the token on behalf of the token owner
        _raceHorseContract.approve(address(this), tokenId);

        // Create HorseEscrow contract
        EscrowContract.HorseEscrow escrow = new EscrowContract.HorseEscrow(
            nftAddress,
            governanceTokenAddress,
            payable(msg.sender), // seller, cast to address payable
            veterinarian,
            dao,
            horseTokenAddress
        );

        // Approve the HorseEscrow contract to handle the NFT on behalf of the seller
        _raceHorseContract.approve(address(escrow), tokenId);

        escrow.list(tokenId, price, deadline);

        emit HorseEscrowCreated(tokenId, address(escrow));
    }

    function buyHorse(uint256 tokenId) external payable {
        // Check if the account has the BUYER_ROLE, if not, assign it
        if (
            !_raceHorseContract.hasRole(
                _raceHorseContract.BUYER_ROLE(),
                msg.sender
            )
        ) {
            _raceHorseContract.grantRole(
                _raceHorseContract.BUYER_ROLE(),
                msg.sender
            );
        }

        Sale storage sale = _horseSales[tokenId];
        require(
            sale.saleType != SaleType.Auction,
            "Cannot buy an auctioned horse directly"
        );

        require(msg.value >= sale.price, "Insufficient payment");
        address seller = sale.seller;

        // Get the HorseEscrow contract associated with the tokenId
        EscrowContract.HorseEscrow escrow = EscrowContract.HorseEscrow(
            payable(_raceHorseContract.getApproved(tokenId))
        );

        // Transfer the NFT from the HorseEscrow contract to the buyer
        _raceHorseContract.transferFrom(address(escrow), msg.sender, tokenId);

        if (msg.value > sale.price) {
            payable(msg.sender).transfer(msg.value - sale.price);
        }

        payable(seller).transfer(sale.price);

        delete _horseSales[tokenId];
        emit HorseSold(tokenId, msg.sender, sale.price);
    }

    function cancelHorseSale(uint256 tokenId) external {
        Sale storage sale = _horseSales[tokenId];
        require(sale.seller == msg.sender, "Not the owner of the horse");

        _raceHorseContract.transferFrom(address(this), msg.sender, tokenId);
        delete _horseSales[tokenId];
        emit HorseSaleCanceled(tokenId);
    }

    function getHorseSale(uint256 tokenId) external view returns (Sale memory) {
        return _horseSales[tokenId];
    }
}
