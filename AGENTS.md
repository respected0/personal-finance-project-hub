# Hub & Integration Çalışma Kuralları

Bu kurallar `personal-finance-project-hub` reposunda çalışırken geçerlidir.

## Hub'ın Rolü
- Backend, web ve mobil sürümlerini kaydeder ve birlikte doğrular.
- Integration testlerinin planlanma ve sonuç noktasıdır.
- Public proje vitrini olarak kullanılır.

## Kesin Sınırlar
- Hub içinde **domain kaynak kodu barındırma** — kod kendi reposunda yaşar.
- Hub içinde **alan kodunu yamalama** — hata hangi alandaysa orada düzeltilir.
- Hub içinde **OpenAPI kopyası, DB migration veya private fixture** tutma.
- Hub içinde **secret, credential veya gerçek finans verisi** barındırma.

## Integration Klasörü
- `integration/backend-web/` ve `integration/backend-mobil/` klasörleri **symlink** üzerinden çalışır.
- Bu klasörler `.gitignore`'da listelenmiştir, push'lanmaz.
- Güncelleme için: `./integration/pull-all.sh`

## Sürüm Yönetimi
- Mevcut sürümler: `versions/current.yaml`
- Release kayıtları: `releases/` klasörü
