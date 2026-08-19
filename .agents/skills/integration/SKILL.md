---
name: integration-test
description: >-
  Integration test skill'i. Backend + Web veya Backend + Mobil entegrasyonlarını
  test ederken, servisleri birlikte ayağa kaldırırken veya cross-repo
  uyumluluk kontrolü yaparken kullanılır.
---

# Integration Test Skill

## Yapı

```
integration/
├── backend-web/
│   ├── backend → symlink → personal-finance-backend
│   └── web     → symlink → personal-finance-web
├── backend-mobil/
│   ├── backend → symlink → personal-finance-backend
│   └── mobile  → symlink → personal-finance-mobile
└── pull-all.sh          → tüm repoları günceller
```

## Güncelleme

Tüm repoları güncellemek için:

```bash
cd integration && ./pull-all.sh
```

## Entegrasyon Testi Akışı

1. `pull-all.sh` ile tüm repoları güncelle
2. Backend'i ayağa kaldır (backend klasöründe)
3. Frontend'i ayağa kaldır (web veya mobile klasöründe)
4. API endpoint'lerini frontend üzerinden test et
5. Sonuçları `tests/` klasörüne kaydet

## Dikkat Edilecekler

- Symlink'ler üzerinden dosya düzenlersen **orijinal repo** değişir
- Backend'de yaptığın değişiklik hem backend-web hem backend-mobil'de yansır
- Her entegrasyon testinden önce `pull-all.sh` çalıştır
