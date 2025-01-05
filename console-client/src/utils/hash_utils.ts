import CryptoJS from "crypto-js";

export class HashUtils {
    static sha256(data: string): string {
        return CryptoJS.SHA256(data).toString();
    }
}