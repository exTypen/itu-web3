import { TokenService } from '../services/token_service';

export class TokenManager {
    private tokenService = new TokenService();
    async getTokens() {
        return await this.tokenService.getTokens();
    }

    async getTokenByAddress(address: string) {
        return await this.tokenService.getTokenByAddress(address);
    }
} 