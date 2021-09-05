// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PurchaseToken is ERC20 {
    constructor(uint256 _totalSupply) ERC20("Purcahse Token", "PHRC") {
        _mint(msg.sender, _totalSupply);
    }
}
