import CryptoJS from "crypto-js";

class HashUtils {
    static sha256(data: string): string {
        return CryptoJS.SHA256(data).toString();
    }
}

export default HashUtils; 