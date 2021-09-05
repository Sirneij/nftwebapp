// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BookStore.sol";

contract StoreFront {
    BookStore private _bookStore;

    function purchaseFromAuthor(uint256 _bookVersionID) public {
        _bookStore.purchaseFromAuthor(msg.sender, _bookVersionID);
    }

    function setBookStore(address _bookStoreAddress) public {
        _bookStore = BookStore(_bookStoreAddress);
    }
}
