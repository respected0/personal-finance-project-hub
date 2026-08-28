---
name: integration-test
description: >-
  Integration test skill'i. Backend + Web veya Backend + Mobil entegrasyonlarını
  test ederken, servisleri birlikte ayağa kaldırırken, cross-repo uyumluluk kontrolü
  yaparken veya versions/current.yaml manifestini güncellerken kullanılır.
---

# Integration & Release Workflow Skill

Bu skill, `personal-finance-project-hub` reposunda cross-repository entegrasyon doğrulaması, commit sabitleme ve release hazırlığı yaparken izlenecek adımları tanımlar.

---

## 1. Çalışma Mantığı ve Sınırlar

- **Kendi Sorumluluk Alanında Kal**: Hub içinde backend/web/mobil domain kodu yamalama. Hata varsa ilgili repoya commit SHA ile bildir.
- **Manifest vs Sibling HEAD**: Sibling repoya yeni commit geldiğinde `versions/current.yaml` otomatik güncellenmez. Manifest yalnızca bilinçli entegrasyon/release çalışmasında yeni commit pinlerine geçirilir.
- **İki Aşamalı Doğrulama**:
  - `pnpm manifest:check` (Hızlı deterministik format/şema kontrolü)
  - `pnpm manifest:verify-refs` (Lokal sibling repolarda commit existence kontrolü)

---

## 2. Lokal Entegrasyon Çalışma Ortamı

```text
integration/
├── backend-web/
│   ├── backend → symlink → ../../../personal-finance-backend
│   └── web     → symlink → ../../../personal-finance-web
└── backend-mobile/
    ├── backend → symlink → ../../../personal-finance-backend
    └── mobile  → symlink → ../../../personal-finance-mobile
```

*Not: Symlink klasörleri `.gitignore` içindedir, asla commit edilmez.*

---

## 3. Entegrasyon Doğrulama Adımları

1. **Repoları Güncelle**: İlgili sibling repolarda test edilecek commit'leri checkout et.
2. **Backend'i Ayağa Kaldır**: Backend API sunucusunu başlat (`pnpm dev` veya test modu).
3. **Frontend'i Ayağa Kaldır**: Web (`pnpm dev`) veya Mobil uygulamasını başlat.
4. **API & Entegrasyon Senaryolarını Çalıştır**: [tests/INTEGRATION_TEST_PLAN.md](../../../tests/INTEGRATION_TEST_PLAN.md) içerisindeki senaryoları doğrula.
5. **Manifest'i Güncelle**: Testler başarılı olduğunda `versions/current.yaml` dosyasındaki commit SHA'larını güncelle.
6. **Doğrulama Komutlarını Çalıştır**:
   ```bash
   pnpm manifest:check
   pnpm manifest:verify-refs
   pnpm verify:quick
   ```
7. **Release Kaydı Oluştur**: Bir release tamamlandığında `releases/vX.Y.Z[-prerelease].md` dosyasını oluştur ve `RELEASES.md` indeksini güncelle.
