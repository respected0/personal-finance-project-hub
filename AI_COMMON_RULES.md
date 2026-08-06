# AI Common Rules — Ortak AI Çalışma Kuralları

Bu kurallar `personal-finance-backend`, `personal-finance-web`, `personal-finance-mobile` ve `personal-finance-project-hub` repository'lerinde çalışan tüm AI asistanları için geçerlidir.

---

## 1. Çalışmaya Başlamadan Önce

1. **`README.md`** dosyasını oku ve repository'nin amacını anla.
2. **`SHARED_PROJECT_CONTEXT.md`** dosyasını oku ve proje sınırlarını kavra.
3. İlgili **rol skill dosyasını** (`BACKEND_SKILL.md`, `WEB_FRONTEND_SKILL.md`, `MOBILE_SKILL.md` veya `INTEGRATION_RELEASE_SKILL.md`) oku.
4. **`CURRENT_STATE.md`** (veya `versions/current.yaml`) dosyasını oku ve mevcut çalışma durumunu incele.
5. İlgili entegrasyon veya sürüm kaydını incele.

---

## 2. Çalışma Sırasında

- **Kendi Sorumluluk Alanında Kal**: Yalnızca üzerinde çalıştığın repository'nin görev alanına giren kod ve dokümantasyon üret.
- **Kapsam Dışı Refactor Yapma**: Kullanıcının açıkça istemediği refactoring, mimari değişiklik veya kütüphane güncellemelerini başlatma.
- **Başka Alanın Kodunu Üretme**: Web içinde veritabanı veya domain kodu; backend içinde UI bileşeni üretme; Hub içinde domain kodu üretme.
- **Secret ve Credential Yazma**: `.env` dosyalarına, koda veya dokümanlara gerçek secret, token veya private key ekleme.
- **Güvenliği ve Doğruluğu Gevşetme**: Testlerin geçmesi için RLS politikalarını, validasyonları veya finansal kuralları esnetme.
- **Hataları Gizleme**: Hataları `any`, `@ts-ignore` veya sahte başarı mesajlarıyla gizleme.
- **API Sözleşmesini Habersiz Değiştirme**: OpenAPI sözleşmesini backend ekibi dışında veya tek taraflı değiştirme.
- **Kendiliğinden İş Başlatma**: Kullanıcının vermediği görevleri, RC veya roadmap maddelerini kendiliğinden uygulamaya kalkışma.

---

## 3. Görev Tamamlanırken

- **Değiştirilen Dosyaları Raporla**: Yapılan tüm dosya ekleme ve değişikliklerini listele.
- **Çalıştırılan Testleri ve Doğrulama Sonuçlarını Yaz**: Gerçekleştirilen testlerin sonuçlarını net olarak bildir.
- **Bilinen Sorunları Raporla**: Tamamlanamayan veya ek müdahale gerektiren durumları belirt.
- **`versions/current.yaml` ve Release Dokümanlarını Güncelle**: Sürüm ve entegrasyon durumunu güncel tut.
- **Sonraki Tek Net Adımı Yaz**: Belirsizlik bırakmadan yapılması gereken ilk adımı belirt.
