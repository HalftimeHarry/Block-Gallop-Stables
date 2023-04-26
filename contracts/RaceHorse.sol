// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RaceHorse is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    bytes32 public constant SELLER_ROLE = keccak256("SELLER_ROLE");
    bytes32 public constant VETERINARIAN_ROLE = keccak256("VETERINARIAN_ROLE");
    bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");

    // Define SaleType enum
    enum SaleType {
        PrivateSale,
        Claim,
        Auction
    }

    // Define HorseData struct
    struct HorseData {
        string name;
        uint16 age;
        string breed;
        string racingStats;
        string tokenURI;
        string imageURL;
        SaleType saleType;
        uint256 price;
    }

    // Mapping to store HorseData
    mapping(uint256 => HorseData) private _horseData;

    // Constructor
    constructor() ERC721("RaceHorse", "HRS") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(SELLER_ROLE, _msgSender());
        _setupRole(VETERINARIAN_ROLE, _msgSender());
        _setupRole(BUYER_ROLE, _msgSender());
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Function to mint a new horse
    function mintHorse(
        string memory name,
        uint16 age,
        string memory breed,
        string memory racingStats,
        string memory tokenURI,
        string memory imageURL,
        SaleType _saleType,
        uint256 _price
    ) public returns (uint256) {
        // Check if the account has the SELLER_ROLE, if not, assign it
        if (!hasRole(SELLER_ROLE, msg.sender)) {
            grantRole(SELLER_ROLE, msg.sender);
        }

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _horseData[newItemId] = HorseData(
            name,
            age,
            breed,
            racingStats,
            tokenURI,
            imageURL,
            _saleType,
            _price
        );

        return newItemId;
    }

    // Function to return the total supply of horse tokens
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    // Function to get HorseData for a specific token ID
    function getHorseData(
        uint256 tokenId
    ) public view returns (HorseData memory) {
        require(_exists(tokenId), "Token does not exist");
        return _horseData[tokenId];
    }

    // Function to check if a token is approved for transfer
    function isTokenApprovedForTransfer(
        uint256 tokenId,
        address spender
    ) public view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        address owner = ownerOf(tokenId);
        return
            getApproved(tokenId) == spender || isApprovedForAll(owner, spender);
    }
}
