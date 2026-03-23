# Ehliyet AI - Gelistirme Standartlari

Bu dokuman 1. hafta ciktisi olarak proje ekip kurallarini netlestirir.

## 1. Teknoloji Karari
- Mobil uygulama: React Native + Expo
- Dil: TypeScript
- Klasor: mobile/

## 2. Branch Yapisi
- main: Her zaman calisir ve release alinabilir olmali.
- develop: Entegre gelistirme branchi.
- feature/<kisa-isim>: Yeni ozellikler.
- fix/<kisa-isim>: Hata duzeltmeleri.
- hotfix/<kisa-isim>: Uretim kritik acil duzeltmeler.

## 3. Commit Kurallari
- Conventional Commit formati kullan:
  - feat: yeni ozellik
  - fix: bug duzeltme
  - chore: altyapi, bagimlilik, bakim
  - docs: dokuman guncelleme
  - refactor: davranisi degistirmeyen kod iyilestirme
  - test: test ekleme veya guncelleme
- Ornek: feat(auth): add guest login entry screen

## 4. Kod Stili
- TypeScript strict mod tercih edilir.
- Bilesen, hook ve util dosyalari tek sorumluluk ilkesine gore ayrilir.
- Anlamli isimlendirme kullan: tek harfli degiskenlerden kacinin.
- Import sirasi: dis paketler -> proje ic moduller.
- Uzun fonksiyonlar yerine kucuk ve test edilebilir parcalar yazin.

## 5. Pull Request Akisi
- PR acmadan once:
  - npm install (ilk kurulumda)
  - npm run start komutunun acilabildigini dogrula
  - TypeScript derleme hatasi olmadigini kontrol et
- PR icerigi:
  - Ne degisti?
  - Neden degisti?
  - Test/manuel kontrol notu
- PR boyutu kucuk tutulur (tek amac, tek degisiklik temasi).

## 6. Issue Akisi
- Her is bir issue ile baslar.
- Issue sablonu:
  - Baslik
  - Kapsam (in/out)
  - Kabul kriterleri
  - Teknik notlar
  - Tahmini sure
- Durumlar: Backlog -> In Progress -> Review -> Done

## 7. Definition of Done
- Ozellik veya duzeltme tanima uygun tamamlandi.
- Uygulama acilisinda kritik hata yok.
- Dokuman guncellendi (gerekiyorsa).
- Ilgili issue ve PR baglantilari eklendi.
