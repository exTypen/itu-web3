# ITU Blockchain Klübü #HW2

Bu proje, basit bir dex projesidir.
Firebase ile simüle edebilir, sepolia ile blockchain işlemleri gerçekleştirilebilir.

## Projeler ve Mimarisi

### 1. Console Client (`/console-client`)
Blockchain ağları ve Firebase ile etkileşimi sağlayıp dex işlemlerini gerçekleştirmek için TypeScript tabanlı konsol uygulaması.

### 2. Smart Contracts (`/smart-contracts`)
Ethereum ağında çalışan akıllı kontratlar.

**Özellikler:**
- Token Kontratları
- Havuz Kontratları
- Testler

### 3. Backend Service (`/backend-service`)
Firebase altyapısını ve cüzdan imza fonksiyonlarını kontrol eden backend servis.

### 4. Frontend Service (`/frontend-service`)
Astro react tabanlı frontend servis.
