// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice A deliberately powerless approval target used only as a unique spender address.
contract ApprovalTarget {
    string public label;

    constructor(string memory label_) {
        label = label_;
    }
}

/// @notice Deploys all 36 immutable approval targets in one transaction.
contract ApprovalMatrixFactory {
    address[36] private _targets;

    constructor() {
        string[6] memory dappLabels = [
            "dapp-whitelist",
            "dapp-ai-low-risk",
            "dapp-unknown",
            "dapp-ai-caution",
            "dapp-ai-danger",
            "dapp-blacklist"
        ];
        string[6] memory authLabels = [
            "auth-whitelist",
            "auth-ai-low-risk",
            "auth-unknown",
            "auth-ai-caution",
            "auth-ai-danger",
            "auth-blacklist"
        ];

        for (uint256 dappIndex = 0; dappIndex < 6; dappIndex++) {
            for (uint256 authIndex = 0; authIndex < 6; authIndex++) {
                uint256 matrixIndex = dappIndex * 6 + authIndex;
                _targets[matrixIndex] = address(
                    new ApprovalTarget(string.concat(dappLabels[dappIndex], "-", authLabels[authIndex]))
                );
            }
        }
    }

    function getTargets() external view returns (address[36] memory) {
        return _targets;
    }
}
