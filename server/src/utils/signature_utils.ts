import { ec as EC } from 'elliptic';
import { Transaction } from '../types/types';
import { keccak256 } from 'ethereumjs-util';
import { ecrecover, hashPersonalMessage, pubToAddress, toBuffer } from 'ethereumjs-util';

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

    /**
     * İmzanın geçerli olup olmadığını kontrol eder
     * @param transaction İmzalı transaction
     * @param signature İmza
     * @param ethereumAddress Ethereum adresi (hex string)
     * @returns İmza geçerli mi?
     */
    public static verifyTransaction(
        transaction: any, 
        signature: string, 
        ethereumAddress: string
    ): boolean {
        try {
            if (!signature) {
                return false;
            }

            // Ethereum adresini normalize et
            let formattedAddress = ethereumAddress.toLowerCase();
            if (!formattedAddress.startsWith('0x')) {
                formattedAddress = '0x' + formattedAddress;
            }

            // Transaction'ı hash'le (Ethereum Signed Message formatı ile)
            const message = JSON.stringify(transaction); // JSON formatına çevir
            const formattedMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;
            const messageBuffer = Buffer.from(formattedMessage, 'utf8'); // UTF-8 olarak buffer'a çevir
            const messageHash = keccak256(messageBuffer); // Keccak-256 ile hash oluştur

            // İmzayı parçala
            const r = Buffer.from(signature.slice(2, 66), 'hex'); // 0x sonrası 64 karakter
            const s = Buffer.from(signature.slice(66, 130), 'hex'); // Sonraki 64 karakter
            const v = parseInt(signature.slice(130), 16); // Kalan kısım

            // İmzadan public key'i recover et
            const publicKey = ecrecover(messageHash, v, r, s);

            // Public key'den adresi hesapla
            const recoveredAddress = '0x' + pubToAddress(publicKey).toString('hex');

            // Adresleri karşılaştır
            return recoveredAddress.toLowerCase() === formattedAddress.toLowerCase();
        } catch (error) {
            console.error("Doğrulama hatası:", error);
            return false;
        }
    }

    /**
     * Transaction'ı hash'ler
     * @param transaction Hash'lenecek transaction
     * @returns Hash (Buffer)
     */
    public static hashTransaction(transaction: Transaction): Buffer {
        // İmza hariç transaction verilerini string'e çevir
        const { signature, ...transactionWithoutSignature } = transaction;
        const transactionString = JSON.stringify(transactionWithoutSignature);
        
        // Keccak256 hash'i hesapla
        return keccak256(Buffer.from(transactionString));
    }
} 