// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice A deliberately powerless approval target used only as a unique spender address.
contract ApprovalTarget {
    string public label;

    constructor(string memory label_) {
        label = label_;
    }
}

/// @notice Deploys all six immutable approval targets in one transaction.
contract ApprovalMatrixFactory {
    address[6] private _targets;

    constructor() {
        _targets[0] = address(new ApprovalTarget("whitelist"));
        _targets[1] = address(new ApprovalTarget("ai-low-risk"));
        _targets[2] = address(new ApprovalTarget("unknown"));
        _targets[3] = address(new ApprovalTarget("ai-caution"));
        _targets[4] = address(new ApprovalTarget("ai-danger"));
        _targets[5] = address(new ApprovalTarget("blacklist"));
    }

    function getTargets() external view returns (address[6] memory) {
        return _targets;
    }
}
