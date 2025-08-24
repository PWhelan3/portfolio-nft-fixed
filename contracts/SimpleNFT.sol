// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SimpleNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    mapping(address => uint256[]) private _ownedTokens;
    mapping(uint256 => uint256) private _ownedTokensIndex;
    
    event NFTMinted(uint256 indexed tokenId, address indexed owner, string uri);

    constructor(address initialOwner) ERC721("Portfolio NFT", "PNFT") {
        _transferOwnership(initialOwner);
        _tokenIdCounter.increment();
    }

    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        _ownedTokens[to].push(tokenId);
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length - 1;
        
        emit NFTMinted(tokenId, to, uri);
        return tokenId;
    }
    
    function getOwnedTokens(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        if (from != address(0) && from != to) {
            uint256 lastTokenIndex = _ownedTokens[from].length - 1;
            uint256 tokenIndex = _ownedTokensIndex[tokenId];
            
            if (tokenIndex != lastTokenIndex) {
                uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];
                _ownedTokens[from][tokenIndex] = lastTokenId;
                _ownedTokensIndex[lastTokenId] = tokenIndex;
            }
            
            _ownedTokens[from].pop();
            delete _ownedTokensIndex[tokenId];
        }
        
        if (to != address(0) && to != from) {
            _ownedTokens[to].push(tokenId);
            _ownedTokensIndex[tokenId] = _ownedTokens[to].length - 1;
        }
    }
}
