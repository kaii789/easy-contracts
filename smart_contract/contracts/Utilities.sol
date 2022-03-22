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

    // From https://ethereum.stackexchange.com/questions/10932/how-to-convert-string-to-int.
    function stringToUint(string storage s) internal pure returns (uint) {
        bytes memory b = bytes(s);
        uint result = 0;
        for (uint i = 0; i < b.length; i++) { // c = b[i] was not needed
            if (uint8(b[i]) >= 48 && uint8(b[i]) <= 57) {
                result = result * 10 + (uint8(b[i]) - 48);
            }
        }
        return result; // this was missing
    }
}
