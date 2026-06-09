export type LessonTopic = {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  roadmap?: string[];
};

export type Lesson = {
  id: string;
  categoryId: string;
  title: string;
  description?: string;
  topics: LessonTopic[];
};

const YT = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

export const lessons: Lesson[] = [
  {
    id: 'trafik-isaretleri',
    categoryId: 'Trafik',
    title: 'Trafik İşaretleri',
    description: 'Levha ve işaretlerin sınıflandırılması, anlamları ve örnek uygulamalar.',
    topics: [
      {
        id: 'ti-1',
        title: 'Levha türleri ve renkler',
        summary: 'Uyarı, yasak, zorunluluk ve bilgilendirme levhalarının renk ve şekil ile sınıflandırılması. Örnek levhaların tanınması ve sınavda çıkış biçimleri.',
        content: `Levhalar genel olarak dört ana gruba ayrılır: uyarı (sarı/üçgen), zorunluluk (mavi/dairesel), yasak (kırmızı/daire içinde) ve bilgi (dikdörtgen veya kare). Her birinin şekli ve rengi sürücüye anında bilgi verir. Örneğin kırmızı kenarlı yuvarlak levhalar genellikle yasaklama iken, mavi yuvarlak levhalar sürücüye zorunlu davranış bildirir. Sınavlarda levha soruları genellikle görsel tanıma ve levha anlamını eşleştirme şeklindedir. Pratikte levhanın konumuna ve alt yazısına dikkat etmek önemlidir; bazen ek panolar hız aralığı veya zaman kısıtlaması gibi ayrıntılar içerir.`,
        imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop',
        videoUrl: YT,
        roadmap: ['Sınıflandırma', 'Renklerin anlamı', 'Örnek sorular'],
      },
      {
        id: 'ti-2',
        title: 'Zorunluluk ve yasak levhaları',
        summary: 'Hangi levhaların sürücünün davranışını nasıl etkilediği ve pratik örnekler.',
        content: `Zorunluluk levhaları sürücünün belirli bir davranışı yapmasını emreder; örneğin "sağa dönünüz" veya "mecbur hız" gibi direktifler içerir. Yasak levhaları ise belirli eylemleri sınırlar; park yasağı, hız sınırlaması veya geçiş yasağı gibi. Trafikte bu levhalara uyulmaması hem güvenlik riskini artırır hem de ceza doğurabilir. Pratikte bir levhayı uygularken önce levhanın kapsadığı alanı ve varsa ek panoyu kontrol edin.`,
        imageUrl: 'https://images.unsplash.com/photo-1518546305924-7b5b2b6c6a4a?w=800&auto=format&fit=crop',
        videoUrl: YT,
        roadmap: ['Tanım', 'Uygulama örnekleri'],
      },
      {
        id: 'ti-3',
        title: 'Yön ve bilgilendirme levhaları',
        summary: 'Yol yönlendirme, mesafe ve hizmet levhalarının okunması ve anlamlandırılması.',
        content: `Yön levhaları genellikle sürücüyü bir rota veya hizmet noktasına yönlendirir. Mesafe levhaları kalan kilometreyi belirtir, hizmet levhaları ise benzin, yemek, hastane gibi tesisleri gösterir. Bu levhalar özellikle uzun yolculuklarda ve yön aramada kritik öneme sahiptir. Hızlı kararlar verirken levhanın yön okunu ve işaret ettiği yönü birlikte değerlendirin.`,
        imageUrl: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&auto=format&fit=crop',
        videoUrl: YT,
        roadmap: ['Okuma ipuçları', 'Sınav örnekleri'],
      },
    ],
  },

  {
    id: 'trafik-kurallari',
    categoryId: 'Trafik',
    title: 'Trafik Kuralları',
    description: 'Temel yol kuralları, şerit kullanımı ve öncelik kuralları.',
    topics: [
      {
        id: 'tk-1',
        title: 'Hız kuralları ve hız sınırları',
        summary: 'Kentsel, şehirlerarası ve otoyol hız limitleri ile hızın güvenlik üzerindeki etkisi.',
        content: `Hız limitleri yol türüne, hava koşullarına ve özel bölgelere göre değişir. Kentsel alanlarda genellikle daha düşük hızlar uygulanır; okul ve inşaat bölgelerinde ekstra dikkat gerekir. Hız, duruş mesafesini ve çarpışma şiddetini doğrudan etkiler. Sınavlarda hız sınırları ve uygun hız seçimiyle ilgili senaryolarla karşılaşabilirsiniz; burada hız sınırına uymanın yanında şartlara göre hızı düşürme yeteneği de değerlendirilir.`,
        videoUrl: YT,
        roadmap: ['Hız limitleri', 'Güvenli hız seçimi'],
      },
      {
        id: 'tk-2',
        title: 'Öncelik kuralları',
        summary: 'Dönel kavşak, yaya geçidi ve kesişme noktalarında öncelik kullanımı. İki araçlı kavşaklarda davranış şekilleri.',
        content: `Öncelik kuralları, kimin önce geçeceğini belirler. Genel kural sağdan gelen aracın önceliği olsa da, işaretler, sinyaller ve trafik ışıkları her zaman önceliklidir. Dönel kavşaklarda içerideki araç dışarı çıkan araçtan önce hareket eder. Yaya geçitlerinde yayaya yol verilmesi zorunludur; sürücü her zaman yayaya dikkat etmeli ve gerektiğinde durmalıdır. Sınav soruları genellikle kavşak senaryoları üzerinden kimin önceliği olduğunu sorar.`,
        videoUrl: YT,
        roadmap: ['Kavşak kuralları', 'Uygulama örnekleri'],
      },
    ],
  },

  {
    id: 'suret-ve-guvenlik',
    categoryId: 'Güvenlik',
    title: 'Hız ve Güvenlik',
    description: 'Güvenli takip mesafesi, frenleme ve hız kontrol teknikleri.',
    topics: [
      {
        id: 'hg-1',
        title: 'Takip mesafesi ve frenleme',
        summary: 'Hızın karekökü prensibi, 2 saniye kuralı ve farklı yüzeylerde fren mesafesi hesaplama.',
        content: `Takip mesafesi, öndeki araçla güvenli bir duruş mesafesi bırakma pratiğidir. Yaygın bir kural arkadaki sürücünün en az 2 saniye kuralına uymasıdır; kötü hava koşullarında bu süre artırılmalıdır. Fren mesafesi hızın karesiyle orantılı olarak artar; dolayısıyla hızdaki küçük artışlar fren mesafesinde büyük artışlara yol açar. Frenleme teknikleri arasında motor freni kullanma ve ani frenlerden kaçınma sayılabilir.`,
        videoUrl: YT,
        roadmap: ['Takip mesafesi', 'Fren teknikleri'],
      },
      {
        id: 'hg-2',
        title: 'Güvenli hız seçimi',
        summary: 'Koşullara göre hız ayarlama: hava, görüş, trafik yoğunluğu ve yol yapısı.',
        content: `Güvenli hız seçmek sadece tabelaya bakmak değil, yol ve çevre koşullarını değerlendirmektir. Yağmur, sis veya buz gibi durumlarda hız ciddi şekilde düşürülmelidir. Ayrıca görüş mesafesi, yol yüzeyinin durumu ve hız limiti arasındaki dengeyi kurmak sürücünün görevidir.`,
        videoUrl: YT,
        roadmap: ['Hava koşulları', 'Trafik yoğunluğu'],
      },
    ],
  },

  {
    id: 'ilk-yardim',
    categoryId: 'Ilk Yardim',
    title: 'İlk Yardım',
    description: 'Kaza durumunda temel ilk yardım adımları ve acil müdahale prensipleri.',
    topics: [
      {
        id: 'iy-1',
        title: 'Olay yeri güvenliği ve yardım çağırma',
        summary: 'Önce kendi güvenliğinizi sağlama, bilinci kontrol etme ve 112/ambulans çağırma adımları.',
        content: `Kaza yerinde yapılacak ilk adım kendi ve olay yerindeki diğer kişilerin güvenliğini sağlamaktır. Aracı mümkünse güvenli bir alana çekin, tehlike varsa uyarı işaretleri koyun. Ardından kazazedenin bilincini kontrol edin, solunum ve kanama varsa öncelikli müdahaleyi yapın ve 112'yi arayarak net bir konum ve durum bilgisi verin.`,
        videoUrl: YT,
        roadmap: ['Güvenlik', 'Çağrı bilgileri'],
      },
      {
        id: 'iy-2',
        title: 'Temel yaşam desteği - kısa anlatım',
        summary:
          'Temel yaşam desteği (KPR) için kısa anlatım: Bilinci kontrol et, hava yolu açıklığını sağla, solunumu kontrol et. Solunum yoksa 30 göğüs basısı ve 2 kurtarıcı nefes uygulaması (yetişkinlerde). KPR sırasında kompresyonun hızı dakikada yaklaşık 100-120 arası olmalıdır. Bu adımlar temel yardımcının hayat kurtarmasında kritik rol oynar.',
        content: `KPR uygulamasında öncelik: hava yolu, solunum ve dolaşımdır. Önce bilinci kontrol edin; tepki yoksa yardım çağırın. Hava yolu açıklığını sağlamak için çene itme-mukus temizliği yapın; solunum yoksa 30:2 oranında kompresyon ve kurtarıcı nefes uygulayın. Kompresyon derinliği yetişkinlerde yaklaşık 5-6 cm olmalı ve ritim dakikada 100-120 arası olmalıdır. Eğitimler sırasında pratik yapmak önemlidir; sınavlarda teorik soruların yanında uygulama videosu analizleri de gelebilir.`,
        videoUrl: YT,
        roadmap: ['KPR adımları', 'Pratik uygulama'],
      },
    ],
  },

  {
    id: 'motor-bakim',
    categoryId: 'Motor',
    title: 'Motor ve Araç Bakımı',
    description: 'Basit günlük kontrol, lastik, yağ ve soğutma sıvısı kontrolleri.',
    topics: [
      {
        id: 'mb-1',
        title: 'Günlük araç kontrolleri',
        summary: 'Lastik basıncı, yağ seviyesi, ışıklar ve su deposu kontrollerinin nasıl yapılacağı.',
        content: `Günlük kontroller aracı güvenli tutar. Lastik basıncını üretici değerlerine göre kontrol edin, gözle çatlak ve yıpranma kontrolü yapın. Motor yağ seviyesini yağ çubuğuyla kontrol edin; düşük yağ motor hasarına neden olabilir. Tüm ışıkların çalıştığından emin olun ve silecek suyunu düzenli olarak doldurun. Bu kontroller sınavda sorulmaktan çok pratik güvenlik amacı taşır.`,
        videoUrl: YT,
        roadmap: ['Kontrol listesi', 'Günlük rutin'],
      },
      {
        id: 'mb-2',
        title: 'Motor uyarı ışıkları ve anlamları',
        summary: 'Gösterge panelindeki temel uyarılar ve ilk müdahale adımları.',
        content: `Motor arıza ışığı, yağ basınç uyarısı veya sıcaklık uyarısı gibi göstergeler aracın durumu hakkında hızlı bilgi verir. Bu ışıklar yandığında aracı güvenli bir şekilde durdurup gerekli kontrolleri yapmak veya servise başvurmak gerekir. Bazı durumlarda kısa bir kontrol sonrası güvenli devam edilebilirken, kritik uyarılarda derhal müdahale gereklidir.`,
        videoUrl: YT,
        roadmap: ['Işıkların anlamı', 'İlk müdahale'],
      },
    ],
  },

  {
    id: 'park-manevra',
    categoryId: 'Sürüş',
    title: 'Park Etme ve Manevra',
    description: 'Geri park, paralel park ve dar alanda manevra teknikleri.',
    topics: [
      {
        id: 'pm-1',
        title: 'Paralel park adımları',
        summary: 'Adım adım paralel park tekniği ve dikkat edilmesi gereken noktalar.',
        content: `Paralel park yaparken önce uygun bir boşluk seçin ve sinyal verin. Aracı durdurup geri vitese alın, aynaları kullanarak referans noktalarına göre direksiyonu çevirin. Küçük düzeltmelerle aracı hizalayın; pratik yaparak mesafe ve açı hesaplama yeteneğinizi geliştirin.`,
        videoUrl: YT,
        roadmap: ['Pozisyon alma', 'Düzeltmeler'],
      },
      {
        id: 'pm-2',
        title: 'Geri manevra ve güvenlik',
        summary: 'Geri manevra sırasında çevre kontrolü, aynaların kullanımı ve güvenli hız.',
        content: `Geri manevra yaparken çevrenizi dikkatle kontrol edin; mümkünse bir yardımcı ile çalışın. Aynalar ve geri görüş kameralarını kullanın, yavaş ilerleyin ve gerektiğinde durup kontrol edin. Hızlı hareketlerden kaçının; küçük adımlarla ilerlemek daha güvenlidir.`,
        videoUrl: YT,
        roadmap: ['Ayna kullanımı', 'Güvenlik kontrolleri'],
      },
    ],
  },

  {
    id: 'alkol-uyuşturucu',
    categoryId: 'Davranış',
    title: 'Alkollü ve Uyuşturucu Etkisi',
    description: 'Alkolün sürüş üzerindeki etkileri, yasal sınırlar ve sonuçlar.',
    topics: [
      {
        id: 'au-1',
        title: 'Alkolün etkileri ve limitler',
        summary: 'BAC nedir, yasal sınırlar ve alkolün reaksiyon süresi üzerindeki etkileri.',
        content: `Alkol kanındaki promil (BAC) sürücünün tepki süresini uzatır ve karar verme kabiliyetini bozar. Yasal limitler ülkeye göre değişir; sınavlarda genellikle güvenli sınır ve etkileri hakkında sorular çıkar. Alkol alındıktan sonra etkiler saatlerce sürebilir; sadece ayılma hissi gerçek iyileşme anlamına gelmez.`,
        videoUrl: YT,
        roadmap: ['BAC', 'Yasal sınırlar'],
      },
      {
        id: 'au-2',
        title: 'Uyuşturucu ve ilaçların etkileri',
        summary: 'Reçeteli ilaçlar ve yasadışı maddelerin sürüş performansına etkileri.',
        content: `Bazı reçeteli ilaçlar da sürüş yeteneğini düşürebilir; uyku hali, baş dönmesi veya dikkat kaybı yapabilir. İlaç kutusundaki uyarıları okuyun ve gerekiyorsa araç kullanmayın. Uyuşturucu maddeler ise tepki süresini ciddi şekilde bozarak kazalara yol açar.`,
        videoUrl: YT,
        roadmap: ['İlaç uyarıları', 'Riskler'],
      },
    ],
  },

  {
    id: 'trafik-adabi',
    categoryId: 'Davranış',
    title: 'Trafik Adabı ve Sorumluluk',
    description: 'Sakin ve saygılı sürüş, korna kullanımı ve öfke yönetimi.',
    topics: [
      {
        id: 'ta-1',
        title: 'Saygılı sürüş ve etik',
        summary: 'Diğer yol kullanıcılarına saygı, sabır ve güvenli davranışlar.',
        content: `Trafikte empati önemlidir. Geçişlerde nazik olmak, yol vermek ve ani manevralardan kaçınmak genel güvenliği artırır. Sınavlarda bu tür davranışların örnekleri ve doğru yaklaşımlar sorulabilir.`,
        videoUrl: YT,
        roadmap: ['Empati', 'Etkili iletişim'],
      },
      {
        id: 'ta-2',
        title: 'Korna ve ışık kullanımı kuralları',
        summary: 'Korna ve uzun far kullanımının uygun zamanı ve yasal sınırlar.',
        content: `Korna yalnızca tehlike uyarısı için kullanılmalıdır; gereksiz korna kullanımı rahatsızlığa ve cezaya neden olabilir. Uzun farlar ise karşıdan gelen sürücüyü rahatsız etmemek için uygun yerlerde kapatılmalıdır.`,
        videoUrl: YT,
        roadmap: ['Doğru kullanım', 'İhlal örnekleri'],
      },
    ],
  },

  {
    id: 'yaya-bisiklet',
    categoryId: 'Güvenlik',
    title: 'Yaya ve Bisiklet Güvenliği',
    description: 'Yaya geçitleri, bisiklet yolları ve karşılıklı sorumluluklar.',
    topics: [
      {
        id: 'yb-1',
        title: 'Yaya geçitleri ve öncelik',
        summary: 'Yaya geçitlerinde durma, bekleme ve güvenli geçiş ilkeleri.',
        content: `Yaya geçitlerinde yayaya yol vermek temel bir kuraldır. Yayalar görünür olmasa dahi dikkatli olmak gerekir; özellikle okul bölgelerinde hız azaltılmalıdır.`,
        videoUrl: YT,
        roadmap: ['Öncelik kuralları', 'Gözlem teknikleri'],
      },
      {
        id: 'yb-2',
        title: 'Bisikletlilerle etkileşim',
        summary: 'Bisiklet yolları, sürücü dikkat noktaları ve güvenli mesafe.',
        content: `Bisikletlilere yeterli boşluk bırakmak, ani dönüşlerden önce sinyal vermek ve bisiklet yollarına dikkat etmek gereklidir. Bisikletliler bazen tahmin edilemeyen hareketler yapabilir; bu yüzden yavaşlamak ve mesafe bırakmak en güvenli yaklaşımdır.`,
        videoUrl: YT,
        roadmap: ['Mesafe bırakma', 'Dönüş kuralları'],
      },
    ],
  },

  {
    id: 'surus-teknikleri',
    categoryId: 'Sürüş',
    title: 'Sürüş Teknikleri',
    description: 'Defansif sürüş, direksiyon hakimiyeti ve görüş açısı yönetimi.',
    topics: [
      {
        id: 'st-1',
        title: 'Defansif sürüşün temelleri',
        summary:
          'Defansif sürüş, diğer sürücü hatalarına karşı önceden hazırlıklı olmayı ve riskleri yönetmeyi içerir. Hız yönetimi, öngörü ve güvenli takip mesafesi defansif sürüşün temel taşlarıdır.',
        content: `Defansif sürüş, çevreyi sürekli tarama, potansiyel tehlikeleri önceden belirleme ve uygun reaksiyon planı yapmayı kapsar. Kör noktaları kontrol etmek, sinyalleri zamanında kullanmak ve diğer sürücülerin hatalarını telafi edecek önlemler almak defansif sürüşün parçalarıdır.`,
        videoUrl: YT,
        roadmap: ['Önlem alma', 'Risk analizi'],
      },
      {
        id: 'st-2',
        title: 'Direksiyon ve görüş yönetimi',
        summary: 'Doğru el pozisyonu, görüş noktası seçimi ve viraj alma teknikleri.',
        content: `Doğru direksiyon tutuşu genellikle 9-3 veya 10-2 pozisyonlarıdır; bu pozisyonlar kontrolü artırır. Viraj alırken bakış açınızı hedefe yönlendirmek, frenlemeyi viraj öncesinde tamamlamak ve gazı kontrollü vermek önemlidir.`,
        videoUrl: YT,
        roadmap: ['El pozisyonu', 'Viraj teknikleri'],
      },
    ],
  },
];
