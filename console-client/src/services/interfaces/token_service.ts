import { Token } from "../../types/types";

export interface ITokenService {
    getTokenByAddress(address: string): Promise<Token>
}