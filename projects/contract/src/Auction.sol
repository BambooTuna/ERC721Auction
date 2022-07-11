//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract AuctionBase is
Context,
AccessControlEnumerable,
ERC721Enumerable,
ERC721Burnable,
Ownable
{
    using Strings for uint256;
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.Bytes32Set;
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    Counters.Counter private _tokenIdTracker;
    IERC721Metadata spot;

    struct Offer {
        address bidder;
        uint256 bid;
    }
    struct Auction {
        address owner;
        uint256 tokenId;
        uint256 createdAt;
        uint256 startAt;
        uint256 period;
        uint256 attempts;
        Offer[] offer;
    }

    // tokenId => Auction
    mapping(uint256 => Auction) _auctions;

    // user => tokenId amount of stocked bid
    mapping(address => mapping(uint256 => uint256)) _pending;


    constructor(
        string memory name,
        string memory symbol,
        address _spotAddr
    ) ERC721(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());

        spot = IERC721Metadata(_spotAddr);
    }

    function depositToken(uint256 _tokenId, uint256 _startAt, uint256 _period, uint256 _attempts) external {
        require(_startAt > block.timestamp, "invalid _startAt");
        spot.safeTransferFrom(msg.sender, address(this), _tokenId, "");
        _auctions[_tokenId] = Auction(
            msg.sender,
            _tokenId,
            block.timestamp,
            _startAt,
            _period,
            _attempts,
            new Offer[](_attempts)
        );
        // TODO emit Event
    }

    function bid(uint256 _tokenId, uint256 _turn, uint256 _price) external {
        require(msg.value == _price, "invalid price");

        uint256 turn = this.getTurn(_tokenId);
        require(turn == _turn, "wrong turn");

        Auction storage auction = _auctions[_tokenId];
        require(auction.offer[turn-1].bidder != msg.sender, "you are bidder");
        require(auction.offer[turn-1].bid < _price, "not highest");

        auction.offer[turn-1].bidder = msg.sender;
        auction.offer[turn-1].bid = msg.value;

        _pending[msg.sender][_tokenId] += msg.value;
        // TODO emit Event
    }

    function claimToken(uint256 _tokenId) external {
        require(this.isFinished(_tokenId), "not finished");
        address wonUser = this.wonUser(_tokenId);
        require(wonUser == msg.sender, "not won user");
        for (uint256 i = 0; i < auction.attempts; i++) {
            _pending[auction.offer[i].bidder][_tokenId] -= auction.offer[i].bid;
        }
        spot.safeTransferFrom(address(this), wonUser, _tokenId, "");
        // TODO emit Event
    }

    function withdrawToken(uint256 _tokenId) external {
        require(this.isFinished(_tokenId), "not finished");
        require(this.wonUser(_tokenId) == address(0), "sold");

        Auction storage auction = _auctions[_tokenId];
        spot.safeTransferFrom(address(this), auction.owner, _tokenId, "");
        auction = Auction(
            address(0),
            0,
            0,
            0,
            0,
            0,
            new Offer[](0)
        );
        // TODO emit Event
    }

    function wonUser(uint256 _tokenId) external view returns (address memory user) {
        user = address(0);
        if (this.isFinished(_tokenId)) {
            Auction memory auction = _auctions[_tokenId];
            uint256 wonCount = 0;
            for (uint256 i = 0; i < auction.attempts; i++) {
                // TODO
                user = address(auction.offer[i].bidder);
            }
        }
    }

    function withdrawBiddingMoney(uint256 _tokenId) external {
        require(this.isFinished(_tokenId), "not finished");
        Auction memory auction = _auctions[_tokenId];
        uint256 storage amount = _pending[msg.sender][_tokenId];
        for (uint256 i = 0; i < auction.attempts; i++) {
            if (auction.offer[i].bidder == msg.sender) {
                amount -= auction.offer[i].bid;
            }
        }
        payable(msg.sender).transfer(amount);
        amount = 0;
        // TODO emit Event
    }

    function getTurn(uint256 _tokenId) external view returns (uint256) {
        Auction memory auction = _auctions[_tokenId];

        require(auction.createdAt > 0 && auction.startedAt > 0 && auction.startedAt > block.timestamp, "invalid");
        (bool ok, uint256 turn) = (block.timestamp - auction.startAt).tryDiv(auction.period);
        require(ok, "internal");
        require(turn <= auction.attempts, "finished");
        return turn;
    }

    function isFinished(uint256 _tokenId) external returns (bool) {
        Auction memory auction = _auctions[_tokenId];
        require(auction.createdAt > 0 && auction.startedAt > 0 && auction.startedAt > block.timestamp, "invalid");
        return turn > auction.attempts;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }



    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId),"nonexistent token");
        bytes memory json = abi.encodePacked(
            '{',
            '"name": "NFT #', _tokenId.toString(),
            '",',
            '"description": "Web3 template created by BambooTuna",',
            '"image": "https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png"',
            '}'
        );
        bytes memory metadata = abi.encodePacked(
            "data:application/json;base64,", Base64.encode(bytes(json))
        );
        return string(metadata);
    }

    function mint(address to) public {
        uint256 tokenId = _tokenIdTracker.current();
        _mint(to, tokenId);
        _tokenIdTracker.increment();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControlEnumerable, ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

