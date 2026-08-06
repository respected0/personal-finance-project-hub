# Entegrasyon Test Planı — Personal Finance OS

Bu doküman, Kişisel Finans İşletim Sistemi'nin repository split sonrası çapraz-bileşen entegrasyon test planını tanımlar.

> ⚠️ **Not**: Bu test planı hazırlık amaçlıdır. Bu görev kapsamında testler **çalıştırılmamıştır**. Testler, ekipler bağımsız ortam doğrulamalarını tamamladıktan sonra yürütülecektir.

---

## Entegrasyon Test Senaryoları

### 1. Backend API Sağlık Kontrolü (Health Check)
- **Hedef**: Backend API sunucusunun sorunsuz yanıt vermesi (`GET /api/v1/health` -> HTTP 200).
- **Kriter**: API route handler'ları ve veritabanı bağlantısı aktif olmalıdır.

### 2. Web - Backend REST API Bağlantısı
- **Hedef**: Next.js web uygulamasının `BACKEND_API_URL` üzerinden backend API'ye istek göndermesi.
- **Kriter**: Web istemcisi veriyi doğrudan DB'den değil, backend REST API yanıtından alarak ekrana basmalıdır.

### 3. Mobil - Backend REST API Bağlantısı
- **Hedef**: Mobil uygulamanın backend REST API ile haberleşmesi.
- **Kriter**: Mobil uygulama backend API'ye bağlanmalı, yanıtı başarıyla parse etmelidir.

### 4. Kimlik Doğrulama (Auth) ve Oturum Yönetimi
- **Hedef**: Kullanıcı girişi, session token üretimi ve HttpOnly cookie doğrulaması.
- **Kriter**: Oturum bilgisi doğru şekilde taşınmalı ve doğrulanmalıdır.

### 5. Yetkisiz İsteklerin Reddedilmesi (Authorization & RLS)
- **Hedef**: Auth token'ı olmayan veya yetkisiz kullanıcının istek yapması.
- **Kriter**: Backend isteği HTTP 401 veya HTTP 403 ile reddetmeli, RLS verileri izole etmelidir.

### 6. Finansal Akış Tutarlılığı (Web & Mobil)
- **Hedef**: Aynı hesabın bakiye ve işlem verilerinin hem web hem mobil ekranlarda tam olarak eşit gösterilmesi.
- **Kriter**: Kanonik finansal sonuç backend tarafından üretildiği için her iki istemcide de tutarlı değerler görünmelidir.

### 7. Backend Kapalıyken Anlaşılır Hata Sunumu
- **Hedef**: Backend servisinin erişilemez olduğu durumda web ve mobil istemcilerin davranışı.
- **Kriter**: Kullanıcıya çökme (crash) yerine anlaşılır bir "Servise ulaşılamıyor" hatası gösterilmelidir.

### 8. Geçersiz Verinin Backend Tarafından Reddi
- **Hedef**: İstemciden geçersiz payload (negatif tutar, hatalı para birimi vb.) gönderilmesi.
- **Kriter**: Backend Zod/OpenAPI doğrulayıcısı isteği HTTP 422 Problem Details ile reddetmelidir.

### 9. Hassas Bilgilerin Loglarda Gizlenmesi (Log Redaction)
- **Hedef**: İstek ve yanıt loglarının incelenmesi.
- **Kriter**: Şifre, token veya hassas kişisel veriler loglarda düz metin olarak yer almamalıdır.
