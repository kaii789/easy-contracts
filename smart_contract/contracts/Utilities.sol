// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

contract Utilities {
    bytes32 lessThan;
    bytes32 lessThanOrEqualTo;
    bytes32 greaterThan;
    bytes32 greaterThanOrEqualTo;

    constructor() {
        lessThan = keccak256("<");
        lessThanOrEqualTo = keccak256("<=");
        greaterThan = keccak256(">");
        greaterThanOrEqualTo = keccak256(">=");
    }
}
