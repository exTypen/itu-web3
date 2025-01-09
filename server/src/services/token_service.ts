import { FirebaseHelper } from "../utils/firebase_helper";
import { Token } from "../types/types";

export class TokenService {
  private firebaseHelper = new FirebaseHelper();
  async getTokens(): Promise<Token[]> {
    return await this.firebaseHelper.fetchDocs<Token>("tokens");
  }

  async getTokenByAddress(address: string): Promise<Token | null> {
    return await this.firebaseHelper.fetchDoc<Token>("tokens", address);
  }
}
