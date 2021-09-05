// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract BookStore is ERC1155 {
    uint256 private _currentBookVersionID;
    mapping(uint256 => uint256) private _bookVersionPrices;
    mapping(uint256 => address) private _bookVersionCurrencies;

    // mapping(uint256 => BookVersion) private _bookVersions;

    // struct BookVersion {
    //     uint256 price;
    //     address currency;
    // }

    constructor() ERC1155("https://example.com/api/{id}.json") {
        _currentBookVersionID = 1;
    }

    function publish(
        uint256 _quantity,
        uint256 _price,
        address _currency
    ) public {
        _mint(msg.sender, _currentBookVersionID, _quantity, "");
        // _bookVersions[_currentBookVersionID] = BookVersion(_price, _currency);
        _bookVersionPrices[_currentBookVersionID] = _price;
        _bookVersionCurrencies[_currentBookVersionID] = _currency;
        _currentBookVersionID++;
    }

    function bookVersionPrice(uint256 _bookVersionID)
        public
        view
        returns (uint256)
    {
        return _bookVersionPrices[_bookVersionID];
    }

    function bookVersionCurrency(uint256 _bookVersionID)
        public
        view
        returns (address)
    {
        return _bookVersionCurrencies[_bookVersionID];
    }
}
