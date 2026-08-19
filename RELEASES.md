# Releases — Kişisel Finans İşletim Sistemi

Bu doküman, çapraz-repository entegrasyon sürümlerinin doğrulama durumlarını ve sabitlenmiş bileşen SHA değerlerini kaydeder.

---

## Release Geçmişi ve Planlanan Sürümler

| Hub Sürümü | Backend SHA / Sürüm | Web SHA / Sürüm | Mobil SHA / Sürüm | Sonuç | Tarih |
|---|---|---|---|---|---|
| `v0.1.0-alpha.1` | `92b3064` | `3382755` | `493c27b` | **VERIFIED / PASS** | 2026-08-20 |

---

## Sürüm Notları

- **`v0.1.0-alpha.1`**: Backend RC Hardening (Log Redaction, 40 Tablo RLS Matrisi, Destructive Migration Scanner, Sliding Window Rate Limiter, OpenAPI TypeScript Client Generation) tamamlandı. Web & Backend Alpha entegrasyonu (12 modül E2E akışı) doğrulanarak release statüsü **`VERIFIED / PASS`** olarak güncellendi. Detaylar için [releases/v0.1.0-alpha.1.md](./releases/v0.1.0-alpha.1.md) dokümanını inceleyin.
