import { ec as EC } from 'elliptic';
import { keccak256 } from 'ethereumjs-util';
import { Wallet } from 'ethers';

export class SignatureUtils {
  private static ec = new EC('secp256k1');

  public static signTransaction(transaction: any, privateKey: string): string {
    // Transaction'ı hash'le (Ethereum Signed Message formatı ile)
    const message = JSON.stringify(transaction); // JSON formatına çevir
    const formattedMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;
    const messageBuffer = Buffer.from(formattedMessage, 'utf8');
    const messageHash = keccak256(messageBuffer);

    // Private key'den key pair oluştur
    const keyPair = this.ec.keyFromPrivate(privateKey);

    // Hash'i imzala
    const signature = keyPair.sign(messageHash, { canonical: true });

    // r, s ve v değerlerini al
    const r = signature.r.toString('hex').padStart(64, '0'); // 64 karaktere tamamla
    const s = signature.s.toString('hex').padStart(64, '0');
    const v = (signature.recoveryParam ?? 0) + 27; // Ethereum için 27 veya 28 ekle

    // İmzayı hex string'e çevir
    const signatureHex = `0x${r}${s}${v.toString(16)}`;

    return signatureHex;
  }

  public static getPublicKey(privateKey: string): string {
    const wallet = new Wallet(privateKey);
    return wallet.address;
  }
}
