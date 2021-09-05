// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BookStore.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StoreFront {
    BookStore private _bookStore;

    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    function purchaseFromAuthor(uint256 _bookVersionID) public {
        ERC20 purcahseToken = ERC20(
            _bookStore.bookVersionCurrency(_bookVersionID)
        );

        address author = _bookStore.bookVersionAuthor(_bookVersionID);
        uint256 price = _bookStore.bookVersionPrice(_bookVersionID);

        purcahseToken.transferFrom(msg.sender, author, price);
        _bookStore.transferFromAuthor(msg.sender, _bookVersionID);
    }

    function setBookStore(address _bookStoreAddress) public {
        require(
            msg.sender == _owner,
            "StoreFront: Only contract owner can set bookstore"
        );
        _bookStore = BookStore(_bookStoreAddress);
    }
}
