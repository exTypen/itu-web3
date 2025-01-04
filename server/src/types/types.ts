export interface Wallet {
  id: string;
  public_key: string;
  balances: {
    [key: string]: number;
  };
}

export interface Pool {
  id: string;
  k: number;
  token_1: {
    [key: string]: number;
  };
  token_2: {
    [key: string]: number;
  };
} 