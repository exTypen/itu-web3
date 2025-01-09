export interface Wallet {
  public_key: string;
  balances: {
    [key: string]: number;
  };
}

export interface Token {
  name: string;
  symbol: string;
}

export interface Pool {
  id: string;
  k: number;
  token1: {
    address: string;
    amount: number;
  };
  token2: {
    address: string;
    amount: number;
  };
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  token: string;
  signature?: string;
  type: string;
}
