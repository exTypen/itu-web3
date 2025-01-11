pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDT is ERC20, Ownable {
    constructor() ERC20("Tether USD", "USDT") Ownable(msg.sender) {
        _mint(address(this), 100000000000 * 10 ** decimals());
    }

    function decimals() public pure virtual override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function usdvFaucet(uint256 faucet) public {
        require(faucet > 0, "Do not send zero or null values");
        require(faucet <= 100000, "A maximum of 100,000 USDT can be requested.");
        _transfer(address(this), msg.sender, faucet * (10 ** decimals()));
    }
}
