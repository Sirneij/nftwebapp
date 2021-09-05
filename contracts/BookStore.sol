// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./StoreFront.sol";

contract BookStore is ERC1155 {
    uint256 private _currentBookVersionID;

    mapping(uint256 => BookVersion) private _bookVersions;
    StoreFront private _storeFront;
    struct BookVersion {
        uint256 price;
        address currency;
        address author;
    }

    constructor(address _storeFrontAddress)
        ERC1155("https://example.com/api/{id}.json")
    {
        _storeFront = StoreFront(_storeFrontAddress);
        _currentBookVersionID = 1;
    }

    function publish(
        uint256 _quantity,
        uint256 _price,
        address _currency
    ) public {
        _mint(msg.sender, _currentBookVersionID, _quantity, "");
        _bookVersions[_currentBookVersionID] = BookVersion(
            _price,
            _currency,
            msg.sender
        );
        _currentBookVersionID++;
    }

    function purchaseFromAuthor(address _buyer, uint256 _bookVersionID) public {
        BookVersion memory bookVersion = _bookVersions[_bookVersionID];
        safeTransferFrom(bookVersion.author, _buyer, _bookVersionID, 1, "");
    }

    function bookVersionPrice(uint256 _bookVersionID)
        public
        view
        returns (uint256)
    {
        return _bookVersions[_bookVersionID].price;
    }

    function bookVersionCurrency(uint256 _bookVersionID)
        public
        view
        returns (address)
    {
        return _bookVersions[_bookVersionID].currency;
    }
}
