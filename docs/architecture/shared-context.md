# Shared Project Context — Kişisel Finans İşletim Sistemi

## Proje Adı ve Amacı
- **Proje Adı**: Kişisel Finans İşletim Sistemi (Personal Finance OS)
- **Proje Amacı**: Güvenli, ölçeklenebilir ve kanonik finansal doğruluğu birinci öncelik kabul eden kişisel finans işletim sistemi sunmak.

## Mevcut Aşama
- **Aşama**: PRE-RC repository split tamamlandı. Bağımsız repository doğrulama ve ekip geliştirme başlangıcı hazırlanmaktadır.
- **Kaynak Baseline SHA**: `66868ec39695b1a78d5cfe9937e801392b37ccd4` (legacy monorepo `personal-finance-os`)
- **Kapsam Kilidi**: Bu aşamada yeni ürün kapsamı, yeni ekran, yeni API endpoint veya mimari dönüşüm eklenmeyecektir.

## Ekip Üyeleri ve Rol Dağılımı
- **Furkan**: Ekip lideri ve backend geliştiricisi (`personal-finance-backend` sorumlusu)
- **Eyüp**: Web frontend geliştiricisi (`personal-finance-web` sorumlusu)
- **Arif Emre**: Mobil geliştirici (`personal-finance-mobile` sorumlusu)

## Dört Repository Modeli ve Kesin Sorumluluk Sınırları

### 1. `personal-finance-backend` (PRIVATE)
- **Sorumluluklar**: Kanonik finansal domain kuralları, exact decimal hesaplamaları (`decimal.js`), ledger ve posting motoru, veritabanı erişimi (Drizzle ORM), SQL migration'lar, RLS politikaları, Auth/Authorization doğrulaması, REST API handler'ları, kanonik OpenAPI sözleşmesi, idempotency, SERIALIZABLE finansal yazmalar, revision ve reversal işlemleri, rapor formülleri, backend unit/integration testleri.
- **URL**: `https://github.com/respected0/personal-finance-backend`

### 2. `personal-finance-web` (PRIVATE)
- **Sorumluluklar**: Next.js web ekranları, layout ve routing, React component'leri, responsive UX, formlar, browser state, loading/empty/success/error durumları, browser session ve HttpOnly cookie yönetimi, backend API istemcisi, web ve Playwright testleri.
- **Yasaklar**: Doğrudan veritabanına bağlanamaz. Supabase tablolarına doğrudan CRUD yapamaz. Migration sahibi olamaz. `packages/db` kullanamaz. Ledger/posting veya kanonik finans formülü oluşturamaz. Backend yanıtındaki finansal sonucu yeniden hesaplayamaz. Yalnızca gösterim amaçlı para/tarih biçimlendirme ve UI validation yapabilir.
- **URL**: `https://github.com/respected0/personal-finance-web`

### 3. `personal-finance-mobile` (PRIVATE)
- **Sorumluluklar**: Mobil ekranlar, navigasyon, mobil state, güvenli oturum saklama, backend API entegrasyonu, loading/empty/offline/success/error durumları, mobil test ve build.
- **Yasaklar**: Doğrudan veritabanına bağlanamaz. Kanonik finansal hesaplama yapamaz. Web kodunu kör biçimde kopyalayamaz. OpenAPI sözleşmesinin bağımsız kopyasını tutamaz. Kesin finans kaydını cihaz üzerinde tek başına oluşturamaz (offline veriler yalnızca açıkça taslak/DRAFT olabilir; kesin kaydolma backend commit yanıtından sonra gerçekleşir). Framework seçimi henüz netleşmemiştir (PENDING).
- **URL**: `https://github.com/respected0/personal-finance-mobile`

### 4. `personal-finance-project-hub` (PUBLIC)
- **Sorumluluklar**: Backend, web ve mobil sürümlerini kaydetmek (`versions/current.yaml`), birlikte doğrulanan sürümleri sabitlemek, entegrasyon planını tutmak, alpha/beta/release kayıtlarını tutmak, ortak test sonuçlarını kaydetmek, public proje vitrini olmak.
- **Yasaklar**: Domain kaynak kodlarını barındıramaz, alan kodunu Hub içinde yamalayamaz, ikinci bir ana kaynak hâline gelemez, tam OpenAPI kopyası veya DB migration/private fixture barındıramaz, secret/credential/gerçek finans verisi barındıramaz. Hata hangi alandaysa kendi repository'sinde düzeltilir.
- **URL**: `https://github.com/respected0/personal-finance-project-hub`

## API Sözleşmesi Kuralı
- API sözleşmesinin tek resmî kaynağı `personal-finance-backend` repository'si içindeki `packages/contracts/openapi/openapi.yaml` dosyasıdır.
- Web ve mobil repository'lerde bağımsız `openapi.yaml` kopyası tutulmaz.
- Sözleşme tek taraflı değiştirilemez; API uyumsuzluğu durumunda backend ekibine gerçek istek/yanıt örneği ile bildirim yapılır.

## Çalışma İlkeleri
- **AI/IDE Bağımsızlığı**: Belirli bir AI veya IDE zorunlu değildir. Proje hafızası AI sohbetine bırakılmaz; her repository README, skill, CURRENT_STATE ve HANDOFF dosyalarıyla bağımsız olarak devralınabilir durumdadır.
- **Finansal Doğruluk**: Parasal hesaplamalarda asla `number` kullanılmaz, backend domain engine `decimal.js` ile kesin hesaplama yaparlar.
- **Bürokrasi Yasağı**: Uzun karar kayıtları (ADR), karar günlükleri veya bürokratik yönetim sistemleri kullanılmaz.
