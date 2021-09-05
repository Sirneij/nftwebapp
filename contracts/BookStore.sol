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
    address private _owner;

    constructor() ERC1155("https://example.com/api/{id}.json") {
        _currentBookVersionID = 1;
        _owner = msg.sender;
    }

    function setStoreFront(address _storeFrontAddress) public {
        require(
            msg.sender == _owner,
            "BookStore: Only contract owner can set storefront"
        );
        _storeFront = StoreFront(_storeFrontAddress);
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

    function transferFromAuthor(address _buyer, uint256 _bookVersionID) public {
        require(
            msg.sender == address(_storeFront),
            "Message can only be called from storefront"
        );
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

    function bookVersionAuthor(uint256 _bookVersionID)
        public
        view
        returns (address)
    {
        return _bookVersions[_bookVersionID].author;
    }
}
