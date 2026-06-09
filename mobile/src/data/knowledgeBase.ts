export interface KnowledgeItem {
  id: string;
  category: string;
  keywords: string[];
  content: string;
}

export const knowledgeBase: KnowledgeItem[] = [
  {
    id: 'k1',
    category: 'Motor ve Araç Tekniği',
    keywords: ['motor', 'hararet', 'ısınma', 'soğutma', 'radyatör', 'vantilatör'],
    content: 'Motor hararet yapıyorsa: Radyatörde su kalmamış olabilir. Vantilatör kayışı kopmuş veya gevşemiş olabilir. Termostat arızalı olabilir. Su pompası arızalanmış olabilir. Hararet yapan motora hemen soğuk su eklenmez, aksi halde motor bloğu çatlayabilir. Araç rölantide çalıştırılıp soğuması beklenmeli veya motor kapatılıp suyun soğuması beklenmelidir.',
  },
  {
    id: 'k2',
    category: 'Motor ve Araç Tekniği',
    keywords: ['akü', 'şarj', 'akümülatör', 'elektrik', 'marş', 'kutup'],
    content: 'Akümülatör (Akü): Motor çalışırken şarj sisteminden aldığı akımı depo eder. Kutup başları oksitlenmişse sıcak su ile temizlenmelidir. Marş basmıyorsa akü boşalmış veya kutup başları gevşemiş olabilir. Aküye saf su ilave edilir ve seviyesi plakaların 1 cm üzerinde olmalıdır.',
  },
  {
    id: 'k3',
    category: 'Trafik ve Çevre Bilgisi',
    keywords: ['kırmızı', 'ışık', 'ceza', 'durmak', 'kavşak', 'trafik ışığı'],
    content: 'Kırmızı Işıkta Geçmek: Kavşaklarda kırmızı ışıkta geçmek yasaktır ve asli kusur sayılır. Sürücülere idari para cezası ve ceza puanı uygulanır. Kavşağa yaklaşırken sarı ışık yanarsa güvenli durulamayacak bir mesafede ise geçilir, aksi halde durulmalıdır.',
  },
  {
    id: 'k4',
    category: 'Trafik ve Çevre Bilgisi',
    keywords: ['hız', 'sınır', 'otoyol', 'şehir içi', 'limit', 'ceza'],
    content: 'Hız Sınırları: Otomobiller için şehir içi hız sınırı 50 km/s, şehirlerarası çift yönlü karayollarında 90 km/s, bölünmüş yollarda 110 km/s, otoyollarda 130 km/s dir (bazı otoyollarda 140 km/s olarak güncellenmiştir). Hız sınırını %10 ila %30, %30 ila %50 veya %50\'den fazla aşmak farklı kademelerde para ve ceza puanına tabidir.',
  },
  {
    id: 'k5',
    category: 'İlk Yardım Bilgisi',
    keywords: ['ilk yardım', 'kaza', 'kanama', 'turnike', 'kalp masajı', 'suni solunum', 'bilinç'],
    content: 'İlk Yardım Temel Uygulamaları (KBK): Koruma, Bildirme, Kurtarma. Kanama olan bölgeye temiz bir bezle bastırılır. Turnike sadece uzuv kopmalarında veya çok kanamalı, durdurulamayan durumlarda uygulanır. Kalp durmasında 30 kalp masajı 2 suni solunum (30/2) şeklinde temel yaşam desteği verilir. Bilinç kapalı ve solunum varsa Koma Pozisyonu verilir.',
  },
  {
    id: 'k6',
    category: 'Trafik Adabı',
    keywords: ['adap', 'saygı', 'öfke', 'sabır', 'stres', 'iletişim', 'diğergamlık'],
    content: 'Trafik Adabı: Sürücülerin trafikteki diğer insanlara saygılı ve sabırlı olması gerekir. Öfke kontrolü önemlidir. Sürücü stres altında daha fazla hata yapar. Başkalarından önce onları düşünmeye "Diğergamlık" denir. Trafikte beden dili ve iletişim, sorunların barışçıl çözümünde büyük rol oynar.',
  }
];
