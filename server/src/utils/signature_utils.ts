import { ec as EC } from 'elliptic';
import { Transaction } from '../types/types';
import { keccak256 } from 'ethereumjs-util';
import { ecrecover, pubToAddress } from 'ethereumjs-util';

export class SignatureUtils {
    private static ec = new EC('secp256k1');

    /**
     * Transaction'ı private key ile imzalar
     * @param transaction İmzalanacak transaction
     * @param privateKey Private key (hex string)
     * @returns İmzalanmış transaction
     */
    public static signTransaction(transaction: Transaction, privateKey: string): string {
        // Private key'den key pair oluştur
        const keyPair = this.ec.keyFromPrivate(privateKey);
        
        // Transaction'ı hash'le
        const messageHash = this.hashTransaction(transaction);
        
        // Hash'i imzala
        const signature = keyPair.sign(messageHash);
        
        // İmzayı hex string'e çevir
        const signatureHex = signature.r.toString('hex') + signature.s.toString('hex') + (signature.recoveryParam ?? 0).toString();
        
        // Transaction'a imzayı ekle ve geri döndür
        return signatureHex;
    }

    /**
     * İmzanın geçerli olup olmadığını kontrol eder
     * @param transaction İmzalı transaction
     * @param signature İmza
     * @param ethereumAddress Ethereum adresi (hex string)
     * @returns İmza geçerli mi?
     */
    public static verifyTransaction(transaction: Transaction, signature: string, ethereumAddress: string): boolean {
        try {
            if (!signature) {
                return false;
            }

            // Ethereum adresini normalize et
            let formattedAddress = ethereumAddress.toLowerCase();
            if (!formattedAddress.startsWith('0x')) {
                formattedAddress = '0x' + formattedAddress;
            }

            // Transaction hash'ini al
            const messageHash = this.hashTransaction(transaction);

            // İmzayı parçala
            const r = Buffer.from(signature.slice(0, 64), 'hex');
            const s = Buffer.from(signature.slice(64, 128), 'hex');
            const v = parseInt(signature.slice(128));

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