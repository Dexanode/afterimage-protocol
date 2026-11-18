// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title AfterimageRegistry
/// @notice Public, minimal release registry for encrypted Afterimage capsules.
/// @dev Capsule plaintext and recipient encryption keys never enter this contract.
contract AfterimageRegistry {
    error EmptyGuardians();
    error InvalidThreshold(uint256 threshold, uint256 guardianCount);
    error DuplicateGuardian(address guardian);
    error UnknownCapsule(uint256 capsuleId);
    error NotGuardian(address caller);
    error AlreadyApproved(address guardian);
    error CapsuleAlreadyReleased(uint256 capsuleId);

    struct Capsule {
        address creator;
        bytes32 envelopeCommitment;
        uint64 createdAt;
        uint16 threshold;
        uint16 approvalCount;
        bool released;
    }

    uint256 public nextCapsuleId;
    mapping(uint256 capsuleId => Capsule) private capsules;
    mapping(uint256 capsuleId => mapping(address guardian => bool)) public isGuardian;
    mapping(uint256 capsuleId => mapping(address guardian => bool)) public hasApproved;

    event CapsuleCreated(
        uint256 indexed capsuleId,
        address indexed creator,
        bytes32 indexed envelopeCommitment,
        uint16 threshold,
        address[] guardians
    );
    event GuardianApproved(uint256 indexed capsuleId, address indexed guardian, uint16 approvalCount);
    event CapsuleReleased(uint256 indexed capsuleId, bytes32 indexed envelopeCommitment);

    /// @notice Registers the release condition and a commitment to an off-chain encrypted envelope.
    /// @param envelopeCommitment keccak256 of the canonical encrypted capsule bytes.
    function createCapsule(
        bytes32 envelopeCommitment,
        address[] calldata guardians,
        uint16 threshold
    ) external returns (uint256 capsuleId) {
        uint256 guardianCount = guardians.length;
        if (guardianCount == 0) revert EmptyGuardians();
        if (threshold == 0 || threshold > guardianCount) {
            revert InvalidThreshold(threshold, guardianCount);
        }

        capsuleId = nextCapsuleId++;
        for (uint256 i; i < guardianCount; ++i) {
            address guardian = guardians[i];
            if (guardian == address(0) || isGuardian[capsuleId][guardian]) {
                revert DuplicateGuardian(guardian);
            }
            isGuardian[capsuleId][guardian] = true;
        }

        capsules[capsuleId] = Capsule({
            creator: msg.sender,
            envelopeCommitment: envelopeCommitment,
            createdAt: uint64(block.timestamp),
            threshold: threshold,
            approvalCount: 0,
            released: false
        });

        emit CapsuleCreated(capsuleId, msg.sender, envelopeCommitment, threshold, guardians);
    }

    /// @notice Records one guardian approval and releases the capsule when quorum is reached.
    function approveRelease(uint256 capsuleId) external {
        Capsule storage capsule = _capsule(capsuleId);
        if (capsule.released) revert CapsuleAlreadyReleased(capsuleId);
        if (!isGuardian[capsuleId][msg.sender]) revert NotGuardian(msg.sender);
        if (hasApproved[capsuleId][msg.sender]) revert AlreadyApproved(msg.sender);

        hasApproved[capsuleId][msg.sender] = true;
        capsule.approvalCount += 1;
        emit GuardianApproved(capsuleId, msg.sender, capsule.approvalCount);

        if (capsule.approvalCount >= capsule.threshold) {
            capsule.released = true;
            emit CapsuleReleased(capsuleId, capsule.envelopeCommitment);
        }
    }

    function getCapsule(uint256 capsuleId) external view returns (Capsule memory) {
        return _capsule(capsuleId);
    }

    function _capsule(uint256 capsuleId) private view returns (Capsule storage capsule) {
        capsule = capsules[capsuleId];
        if (capsule.creator == address(0)) revert UnknownCapsule(capsuleId);
    }
}
