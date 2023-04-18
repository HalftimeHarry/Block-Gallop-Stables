// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./RaceHorse.sol";
import "./HorseEscrow.sol" as EscrowContract;

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

    Racehorse private _racehorseContract;
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
        address racehorseContractAddress,
        address _nftAddress,
        address _governanceTokenAddress,
        address _veterinarian,
        address _dao,
        address _horseTokenAddress
    ) {
        _racehorseContract = Racehorse(racehorseContractAddress);
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
        uint256 goalAmount,
        uint256 deadline,
        address buyer
    ) external {
        require(
            _racehorseContract.ownerOf(tokenId) == msg.sender,
            "Not the owner of the horse"
        );
        require(
            saleType != SaleType.Auction || deadline > 0,
            "Invalid auction duration"
        );

        _racehorseContract.transferFrom(msg.sender, address(this), tokenId);

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

        // Create HorseEscrow contract
        EscrowContract.HorseEscrow escrow = new EscrowContract.HorseEscrow(
            nftAddress,
            governanceTokenAddress,
            payable(msg.sender), // seller, cast to address payable
            veterinarian,
            dao,
            horseTokenAddress
        );

        escrow.list(
            tokenId,
            buyer, // Include the buyer address when listing the horse
            price,
            goalAmount,
            deadline,
            payable(msg.sender) // seller, cast to address payable
        );

        emit HorseEscrowCreated(tokenId, address(escrow));
    }

    function buyHorse(uint256 tokenId) external payable {
        Sale storage sale = _horseSales[tokenId];
        require(
            sale.saleType != SaleType.Auction,
            "Cannot buy an auctioned horse directly"
        );

        require(msg.value >= sale.price, "Insufficient payment");
        address seller = sale.seller;
        _racehorseContract.transferFrom(address(this), msg.sender, tokenId);

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

        _racehorseContract.transferFrom(address(this), msg.sender, tokenId);
        delete _horseSales[tokenId];
        emit HorseSaleCanceled(tokenId);
    }

    function getHorseSale(uint256 tokenId) external view returns (Sale memory) {
        return _horseSales[tokenId];
    }
}
