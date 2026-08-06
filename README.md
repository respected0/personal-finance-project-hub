# Personal Finance OS — Project Hub

Public project showcase and integration versioning hub for the Personal Finance OS.

- **Visibility**: PUBLIC
- **Kaynak Baseline SHA**: `personal-finance-os@66868ec39695b1a78d5cfe9937e801392b37ccd4`
- **Tek Sürüm Manifesti**: `versions/current.yaml`

> ⚠️ **Bu repository kaynak kod barındırmaz.**
> Backend, web ve mobil kaynak kodları özel (PRIVATE) repository'lerde tutulmaktadır.
> Bu Hub yalnızca kamuya açık mimari özetlerini, entegrasyon planlarını ve çapraz-repository sürüm sabitlemelerini barındırır.

---

## Proje Hakkında

Kişisel Finans İşletim Sistemi (Personal Finance OS), finansal doğruluğu birinci tasarım kuralı olarak kabul eden modüler ve güvenli bir kişisel finans yönetim sistemidir.

Bu Hub repository'sinin amaçları:
- Projenin kamusal mimari ve tasarım ilkelerini sunmak.
- Bağımsız çalışan backend, web ve mobil repository'lerinin doğrulanan sürümlerini sabitlemek (`versions/current.yaml`).
- Entegrasyon test planlarını ve release durumlarını takip etmek.

---

## Dört Repository Modeli

| Repository | Visibility | Sorumluluk Özeti |
|---|---|---|
| [`respected0/personal-finance-backend`](https://github.com/respected0/personal-finance-backend) | 🔒 PRIVATE | Kanonik finansal domain motoru, veritabanı (Drizzle/Supabase), SQL migration'lar, REST API ve OpenAPI sözleşmesi. |
| [`respected0/personal-finance-web`](https://github.com/respected0/personal-finance-web) | 🔒 PRIVATE | Next.js web frontend, UI bileşenleri, HttpOnly cookie ve browser session yönetimi. |
| [`respected0/personal-finance-mobile`](https://github.com/respected0/personal-finance-mobile) | 🔒 PRIVATE | Mobil uygulama ekranları, navigasyon ve API entegrasyonu (Framework kararı PENDING). |
| [`respected0/personal-finance-project-hub`](https://github.com/respected0/personal-finance-project-hub) | 🌐 PUBLIC | Proje vitrini, entegrasyon koordinasyonu ve bileşen sürüm manifesti (`versions/current.yaml`). |

---

## Mimari Bakış

```text
┌──────────────────────────────────────────────────────────────────────┐
│                     Personal Finance OS                              │
│                                                                      │
│  ┌──────────────┐                   ┌──────────────────────────────┐ │
│  │  Web Client  │◄──── REST API ───►│  Backend API                 │ │
│  │  (Next.js)   │                   │  (Next.js Route Handlers)    │ │
│  └──────────────┘                   │                              │ │
│                                     │  ┌────────────────────────┐  │ │
│  ┌──────────────┐                   │  │ Domain Engine          │  │ │
│  │    Mobile    │◄──── REST API ───►│  │ (decimal.js, Zod)      │  │ │
│  │  (TBD)       │                   │  ├────────────────────────┤  │ │
│  └──────────────┘                   │  │ Database Layer         │  │ │
│                                     │  │ (Drizzle ORM, RLS)     │  │ │
│                                     │  ├────────────────────────┤  │ │
│  (No Direct DB                      │  │ Supabase / PostgreSQL  │  │ │
│   Access Allowed)                   │  └────────────────────────┘  │ │
│                                     └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Entegrasyon ve Sürüm Yönetimi Kuralları

- **Tek Sürüm Manifesti**: Çapraz-repository sürüm sabitlemeleri yalnızca `versions/current.yaml` dosyası üzerinden takip edilir.
- **Alan Kodu Yamalanamaz**: Hub repository'si içinde backend, web veya mobil domain kodları değiştirilemez veya düzeltilemez. Hata tespit edildiğinde ilgili alan repository'sine bildirilir.
- **Alpha Release Durumu**: `v0.1.0-alpha.1` sürümü planlanmış durumdadır (**PLANNED / NOT TESTED**). Bağımsız smoke ve entegrasyon doğrulamaları tamamlanmadan PASS veya RELEASED ilan edilmez.

---

## Mevcut Durum

**PRE-RC — Repository Split Tamamlandı**

- Repository split işlemi tamamlanmış ve çalışma temel dosyaları eklenmiştir.
- Ekiplerin bağımsız ortam kurulumları ve smoke doğrulamaları beklenmektedir.
- Detaylı sürüm sabitlemeleri için [versions/current.yaml](./versions/current.yaml) dosyasını inceleyin.

---

## Bu Repository'de Neler BULUNMAZ?

Public Hub repository'sinde kesinlikle yer almayan içerikler:
- Domain kaynak kodları (backend, web, mobil)
- Veritabanı şema detayları veya SQL migration dosyaları
- Tam OpenAPI sözleşmesi veya private fixture'lar
- Gizli anahtarlar, API token'ları, .env dosyaları veya credentials
- Gerçek finansal veriler veya kullanıcı bilgileri
