// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RaceHorse is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum SaleType {
        PrivateSale,
        Claim,
        Auction
    }

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

    mapping(uint256 => HorseData) private _horseData;

    constructor() ERC721("RaceHorse", "HRS") {}

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

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getHorseData(
        uint256 tokenId
    ) public view returns (HorseData memory) {
        require(_exists(tokenId), "Token does not exist");
        return _horseData[tokenId];
    }
}
