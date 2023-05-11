// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract HorseNFT is ERC721URIStorage, AccessControl {
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

    // Define cost
    uint256 public cost;

    // Define contract owner
    address public owner;

    // Constructor
    constructor(uint256 _cost) ERC721("HorseNFT", "HRSNFT") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(SELLER_ROLE, _msgSender());
        _setupRole(VETERINARIAN_ROLE, _msgSender());
        _setupRole(BUYER_ROLE, _msgSender());
        owner = msg.sender;
        cost = _cost;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Function to mint a new horse
    function mint(string memory tokenURI) public payable {
        require(msg.value >= cost);

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function withdraw() public {
        require(msg.sender == owner);
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
