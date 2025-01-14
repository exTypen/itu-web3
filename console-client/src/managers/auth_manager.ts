import { SignatureUtils } from '../utils/signature_utils';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';

class AuthManager {
  private loggedIn: boolean;
  private publicKey: string | null;
  private privateKey: string | null;
  private readonly walletPath: string;

  constructor() {
    this.loggedIn = false;
    this.publicKey = null;
    this.privateKey = null;
    this.walletPath = path.join(process.cwd(), 'wallet.txt');
  }

  private formatPrivateKey(privateKey: string): string {
    // Private key'in başında 0x yoksa ekle
    return privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  }

  private encryptPrivateKey(privateKey: string, password: string): string {
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  private decryptPrivateKey(encryptedData: string, password: string): string {
    try {
      const [ivHex, encryptedKey] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const key = crypto.scryptSync(password, 'salt', 32);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new Error('Yanlış şifre veya bozuk veri');
    }
  }

  hasStoredWallet(): boolean {
    return fs.existsSync(this.walletPath);
  }

  async setWallet(privateKey: string, password: string): Promise<boolean> {
    try {
      const formattedPrivateKey = this.formatPrivateKey(privateKey);
      const publicKey = SignatureUtils.getPublicKey(formattedPrivateKey);
      
      const encryptedKey = this.encryptPrivateKey(formattedPrivateKey, password);
      fs.writeFileSync(this.walletPath, encryptedKey);

      this.loggedIn = true;
      this.publicKey = publicKey;
      this.privateKey = formattedPrivateKey;
      return this.loggedIn;
    } catch (error) {
      console.error('Invalid private key format:', error);
      return false;
    }
  }

  async loadWallet(password: string): Promise<boolean> {
    try {
      if (!this.hasStoredWallet()) {
        return false;
      }

      const encryptedData = fs.readFileSync(this.walletPath, 'utf8');
      const privateKey = this.decryptPrivateKey(encryptedData, password);
      const publicKey = SignatureUtils.getPublicKey(privateKey);

      this.loggedIn = true;
      this.publicKey = publicKey;
      this.privateKey = privateKey;
      return true;
    } catch (error) {
      console.error('Error loading wallet:', error);
      return false;
    }
  }

  disconnect(): void {
    this.loggedIn = false;
    this.publicKey = null;
    this.privateKey = null;
    
    // Eğer wallet.txt dosyası varsa sil
    try {
      if (this.hasStoredWallet()) {
        fs.unlinkSync(this.walletPath);
      }
    } catch (error) {
      console.error('Error deleting wallet file:', error);
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getPublicKey(): string | null {
    return this.publicKey;
  }

  getPrivateKey(): string | null {
    return this.privateKey ? this.privateKey.replace(/^0x/, '') : null;
  }
}

export default new AuthManager();
