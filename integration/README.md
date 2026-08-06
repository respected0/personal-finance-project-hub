# Integration Guidelines — Personal Finance OS

Bu dizin, Personal Finance OS projesinin çapraz-repository entegrasyon ilkelerini ve süreçlerini tanımlar.

---

## Entegrasyon Çalışma İlkeleri

1. **Alanlar Kendi Repository'lerinde Doğrulanır**: Backend, web ve mobil ekipleri öncelikle kendi repository'lerinde çalışan ve doğrulanmış sürümler üretir.
2. **Hub Sabit SHA veya Tag Kullanır**: Hub entegrasyon sürecinde bileşenlerin rastgele kodlarını değil, `versions/current.yaml` dosyasında sabitlenmiş commit SHA veya release tag değerlerini kullanır.
3. **Hub Alan Kodunu Kopyalamaz veya Yamalamaz**: Entegrasyon sırasında bir hata tespit edilirse, kod Hub içinde düzeltilmez; hata kanıtlarıyla birlikte ilgili domain repository'sine bildirilir.
4. **Gereksiz Otomasyon Kurulmaz**: İlk aşamada karmaşık CI/CD otomasyon hatları yerine net ve kontrol edilebilir manuel/yarı-otomatize entegrasyon adımları uygulanır.
5. **Kontrollü Yürütme**: Entegrasyon doğrulama süreçleri, bileşenlerin bağımsız ortam testleri tamamlandıktan sonra kontrollü bir şekilde çalıştırılır.
