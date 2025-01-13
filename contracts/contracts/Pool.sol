// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Pool {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    event Swap(
        address indexed swapper, address inputToken, uint256 inputAmount, address outputToken, uint256 outputAmount
    );

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    // Add liquidity to the pool
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than zero");

        if (reserveA > 0 && reserveB > 0) {
            // Ensure the added liquidity maintains the pool ratio
            require(amountA * reserveB == amountB * reserveA, "Liquidity must maintain pool ratio");
        }

        // Transfer tokens to the pool
        require(tokenA.transferFrom(msg.sender, address(this), amountA), "TokenA transfer failed");
        require(tokenB.transferFrom(msg.sender, address(this), amountB), "TokenB transfer failed");

        // Update reserves
        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    // Swap tokens
    function swap(address inputToken, uint256 inputAmount) external {
        require(inputAmount > 0, "Input amount must be greater than zero");
        require(inputToken == address(tokenA) || inputToken == address(tokenB), "Invalid input token");

        bool isTokenA = inputToken == address(tokenA);

        IERC20 inputTokenContract = isTokenA ? tokenA : tokenB;
        IERC20 outputTokenContract = isTokenA ? tokenB : tokenA;

        uint256 inputReserve = isTokenA ? reserveA : reserveB;
        uint256 outputReserve = isTokenA ? reserveB : reserveA;

        // Transfer input tokens to the pool
        require(inputTokenContract.transferFrom(msg.sender, address(this), inputAmount), "Input token transfer failed");

        // Calculate output amount
        uint256 outputAmount = (inputAmount * outputReserve) / (inputReserve + inputAmount);

        require(outputAmount > 0, "Output amount is too small");

        // Transfer output tokens to the user
        require(outputTokenContract.transfer(msg.sender, outputAmount), "Output token transfer failed");

        // Update reserves
        if (isTokenA) {
            reserveA += inputAmount;
            reserveB -= outputAmount;
        } else {
            reserveB += inputAmount;
            reserveA -= outputAmount;
        }

        emit Swap(msg.sender, inputToken, inputAmount, address(outputTokenContract), outputAmount);
    }

    // Get the current reserves in the pool
    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }
}
