# Integration & Release Skill — personal-finance-project-hub

Bu doküman, `personal-finance-project-hub` repository'sinde çalışan entegrasyon/release sorumlusu ve AI asistanının uzmanlık alanını, sorumluluklarını ve kesin sınırlarını tanımlar.

---

## 1. Sorumluluk Alanları ve Yapılacaklar

- **Bileşen Sürüm Sabitleme**: `versions/current.yaml` dosyasındaki `personal-finance-backend`, `personal-finance-web` ve `personal-finance-mobile` repository commit SHA değerlerini doğrulamak ve güncellemek.
- **Doğru Sürümleri Kullanma**: Backend, web ve mobil ekiplerinin birlikte doğruladığı sabit SHA veya tag değerleri üzerinden entegrasyon takibi yapmak.
- **API Sözleşmesi Uyum Kontrolü**: Backend OpenAPI sözleşmesi ile istemcilerin haberleşme uyumluluğunu gözden geçirmek.
- **Entegrasyon ve E2E Test Koordinasyonu**: Ortak entegrasyon ve E2E test planlarının execution sonuçlarını kaydetmek.
- **Hata Raporlama**: Tespit edilen hataları doğrudan ilgili repository ve commit SHA bilgisiyle kanıtlı olarak raporlamak.
- **Release Statüsü Belirleme**: Sürüm doğrulama sonuçlarına göre release durumunu `PASS` veya `FAIL` olarak işaretlemek.

---

## 2. Kesinlikle Yapılmayacaklar (Yasaklar)

- **Alan Kodunu Hub İçinde Düzeltme**: Backend, web veya mobil domain kaynak kodlarını Hub repository'si içinde yamalamak veya değiştirmek.
- **Sözleşmeyi Test Geçsin Diye Değiştirme**: OpenAPI sözleşmesini veya test beklentilerini hatalı testi geçirmek amacıyla esnetmek.
- **Testleri Görmezden Gelme**: Başarısız veya çalıştırılmamış testleri göz ardı etmek.
- **Sabitlenmemiş Kod Kullanma**: Etiketsiz, commit SHA'sı sabitlenmemiş veya geçici lokal kodlar üzerinden release yayınlamak.
- **Başarısız Release'i PASS İlan Etme**: Testleri geçmeyen veya doğrulanmamış sürümleri `PASS` veya `RELEASED` olarak işaretlemek.
- **Private İçerik Yayınlama**: Backend/web/mobile kaynak kodlarını, private fixture'ları, veritabanı şemalarını, migration'ları veya secret/credential verilerini public Hub repository'sine commit etmek.
