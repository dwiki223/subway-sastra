import { Question } from '../types/game';

// Helper to shuffle options so correct answers are dynamically randomized across A, B, C, D
export function shuffleQuestion(q: Question): Question {
  const correctOptionText = q.options[q.correctAnswer];
  const shuffledOptions = [...q.options];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }
  const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

  return {
    ...q,
    options: shuffledOptions,
    correctAnswer: newCorrectIndex,
  };
}

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // --- GURINDAM (Soal 1 - 15) ---
  // ==========================================
  {
    id: 'g-01',
    category: 'gurindam',
    poemText: [
      'Kurang pikir kurang siasat,',
      'Tentu dirimu kelak tersesat.'
    ],
    question: 'Bait di atas merupakan contoh puisi rakyat jenis apa, dan apa polanya?',
    options: [
      'Pantun, terdiri dari 2 baris sampiran',
      'Gurindam, terdiri dari 2 baris dengan sajak a-a',
      'Syair, terdiri dari 2 baris bebas',
      'Karmina, terdiri dari 4 baris bersajak a-b-a-b'
    ],
    correctAnswer: 1, // B
    explanation: 'Bait tersebut adalah Gurindam karena terdiri atas 2 baris dalam satu bait dengan rima kembar (a-a: "siasat" - "tersesat"). Baris 1 merupakan sebab dan baris 2 merupakan akibat.',
    topic: 'Ciri-Ciri Gurindam',
    difficulty: 'mudah',
  },
  {
    id: 'g-02',
    category: 'gurindam',
    poemText: [
      'Barang siapa tiada memegang agama,',
      'Sekali-kali tiada boleh dibilang nama.'
    ],
    question: 'Kutipan terkenal di atas berasal dari karya sastra klasik apa?',
    options: [
      'Syair Perahu karya Hamzah Fansuri',
      'Hikayat Hang Tuah',
      'Gurindam Dua Belas karya Raja Ali Haji',
      'Babad Tanah Jawi'
    ],
    correctAnswer: 2, // C
    explanation: 'Kutipan tersebut berasal dari "Gurindam Dua Belas" pasal pertama karya sastrawan Melayu ternama Raja Ali Haji dari Pulau Penyengat, Riau.',
    topic: 'Karya Klasik Gurindam',
    difficulty: 'sedang',
  },
  {
    id: 'g-03',
    category: 'gurindam',
    poemText: [
      'Jika hendak mengenal orang berbangsa,',
      'Lihat kepada budi dan bahasa.'
    ],
    question: 'Pesan moral / amanat yang terkandung dalam bait gurindam di atas adalah...',
    options: [
      'Kemuliaan seseorang dinilai dari perilakunya yang berbudi pekerti dan sopan santun berbahasa',
      'Orang kaya harus memiliki banyak pakaian adat',
      'Bangsa yang besar harus memiliki wilayah yang luas',
      'Bahasa asing harus dikuasai oleh setiap pemimpin'
    ],
    correctAnswer: 0, // A
    explanation: 'Arti "orang berbangsa" adalah orang yang berderajat mulia/terhormat. Kemuliaan derajat seseorang tercermin dari budi pekerti serta tutur bahasa yang santun.',
    topic: 'Makna & Amanat Gurindam',
    difficulty: 'mudah',
  },
  {
    id: 'g-04',
    category: 'gurindam',
    question: 'Manakah dari pernyataan berikut yang merupakan ciri khas hubungan antarlarik pada gurindam?',
    options: [
      'Baris pertama dan kedua merupakan sampiran, baris ketiga dan keempat isi',
      'Semua baris adalah sampiran yang tidak memiliki makna langsung',
      'Tiap bait terdiri dari 4 baris dengan rima terus a-a-a-a',
      'Baris pertama berisi persoalan/sebab, baris kedua berisi jawaban/akibat'
    ],
    correctAnswer: 3, // D
    explanation: 'Pada gurindam: Baris 1 berisi syarat, persoalan, atau sebab; sedangkan baris 2 berisi jawaban, akibat, atau kesimpulan dari baris pertama.',
    topic: 'Struktur Gurindam',
    difficulty: 'mudah',
  },
  {
    id: 'g-05',
    category: 'gurindam',
    poemText: [
      'Hendaklah memegang amanat,',
      '...................................'
    ],
    question: 'Larik yang paling tepat untuk melengkapi gurindam di atas agar berima serasi (a-a) dan bermakna padu adalah...',
    options: [
      'Supaya hidup menjadi kaya',
      'Buanglah khianat jangan dibuat',
      'Bekerja giat sepanjang hari',
      'Jangan biarkan waktu terbuang'
    ],
    correctAnswer: 1, // B
    explanation: 'Gurindam bersajak a-a. Kata akhir baris 1 adalah "amanat" (akhiran -at). Larik pelengkap harus berakhiran seirama (-at) dan bermakna etis: "Buanglah khianat jangan dibuat".',
    topic: 'Melengkapi Larik Gurindam',
    difficulty: 'sedang',
  },
  {
    id: 'g-06',
    category: 'gurindam',
    poemText: [
      'Barang siapa mengenal yang empat,',
      'Maka ia itulah orang ma\'rifat.'
    ],
    question: 'Bait gurindam di atas terdiri atas berapa baris dan berapakah suku kata rata-rata per baris?',
    options: [
      '4 baris dengan 8-12 suku kata',
      '3 baris dengan 14 suku kata',
      '2 baris dengan 10-12 suku kata',
      '1 baris panjang dengan rima bebas'
    ],
    correctAnswer: 2, // C
    explanation: 'Gurindam selalu terdiri atas 2 baris tiap bait dengan kisaran 10 sampai 14 suku kata tiap barisnya.',
    topic: 'Struktur Baris Gurindam',
    difficulty: 'sedang',
  },
  {
    id: 'g-07',
    category: 'gurindam',
    poemText: [
      'Pekerjaan marah jangan dibela,',
      'Niscaya hilang akal di kepala.'
    ],
    question: 'Amanat yang disampaikan pengarang melalui bait gurindam tersebut adalah...',
    options: [
      'Marah diperbolehkan jika tujuannya membela kebenaran',
      'Menuruti amarah akan melenyapkan akal sehat dan kejernihan berpikir',
      'Kepala yang pusing dapat disembuhkan dengan meluapkan amarah',
      'Seseorang harus selalu membela teman yang sedang marah'
    ],
    correctAnswer: 1, // B
    explanation: 'Pengarang mengingatkan bahwa kemarahan yang terus dibela dan diikuti akan membutakan akal budi ("hilang akal di kepala").',
    topic: 'Nilai Budi Pekerti Gurindam',
    difficulty: 'mudah',
  },
  {
    id: 'g-08',
    category: 'gurindam',
    poemText: [
      'Cahari olehmu akan sahabat,',
      'Yang boleh dijadikan obat.'
    ],
    question: 'Makna kata "obat" dalam gurindam Raja Ali Haji tersebut adalah perumpamaan untuk...',
    options: [
      'Sahabat yang berprofesi sebagai dokter',
      'Minuman herbal penambah stamina tubuh',
      'Sahabat sejati yang mampu menenteramkan hati dan menasihati kebaikan saat dirundung duka',
      'Buku resep ramuan kuno warisan leluhur'
    ],
    correctAnswer: 2, // C
    explanation: 'Kata "obat" adalah metafora untuk sahabat sejati yang mampu menyembuhkan kegelisahan, menuntun ke jalan yang benar, dan menjauhkan dari keburukan.',
    topic: 'Kiasan & Simbol Gurindam',
    difficulty: 'sedang',
  },
  {
    id: 'g-09',
    category: 'gurindam',
    poemText: [
      'Barang siapa mengenal akhirat,',
      'Tahulah ia dunia melarat.'
    ],
    question: 'Kata "melarat" dalam konteks sastra klasik gurindam tersebut bermakna...',
    options: [
      'Tidak memiliki harta kekayaan di bank',
      'Fana, hina, dan sangat rendah nilainya bila dibandingkan dengan keabadian akhirat',
      'Mengalami kebangkrutan dalam berniaga',
      'Selalu kekurangan persediaan makanan'
    ],
    correctAnswer: 1, // B
    explanation: 'Dalam tradisi sastra Melayu Islam, "dunia melarat" berarti dunia ini sifatnya fana, hampa, dan tidak ada apa-apanya dibandingkan kemuliaan akhirat.',
    topic: 'Kosa Kata Klasik Gurindam',
    difficulty: 'sulit',
  },
  {
    id: 'g-10',
    category: 'gurindam',
    question: 'Ditinjau dari etimologi (asal-usul bahasa), kata "Gurindam" berasal dari bahasa...',
    options: [
      'Arab (qasidah)',
      'Tamil / India (kirindam yang bermakna perumpamaan)',
      'Persia (farsy)',
      'Sanskerta (sloka)'
    ],
    correctAnswer: 1, // B
    explanation: 'Kata Gurindam berasal dari bahasa Tamil (India) yaitu "kirindam" yang berarti perumpamaan atau pepatah yang berisi nasihat.',
    topic: 'Asal-Usul Gurindam',
    difficulty: 'sedang',
  },
  {
    id: 'g-11',
    category: 'gurindam',
    poemText: [
      'Jika hendak mengenal orang mulia,',
      'Lihatlah kepada kelakuan dia.'
    ],
    question: 'Konjungsi yang menghubungkan kedua baris gurindam tersebut menyatakan hubungan...',
    options: [
      'Pertentangan (walaupun / tetapi)',
      'Waktu (setelah / ketika)',
      'Syarat dan pembuktian (jika ... lihatlah ...)',
      'Perbandingan (seperti / laksana)'
    ],
    correctAnswer: 2, // C
    explanation: 'Baris 1 memakai kata penghubung syarat "jika", sedangkan baris 2 menunjukkan cara pembuktian atau akibatnya ("lihatlah kepada kelakuan dia").',
    topic: 'Kaidah Kebahasaan Gurindam',
    difficulty: 'sedang',
  },
  {
    id: 'g-12',
    category: 'gurindam',
    poemText: [
      'Hati itu kerajaan di dalam tubuh,',
      'Jikalau zalim segala anggota pun rubuh.'
    ],
    question: 'Maksud dari bait Gurindam Dua Belas Pasal Ketiga di atas adalah...',
    options: [
      'Organ jantung manusia rentan terserang penyakit',
      'Hati adalah pusat kendali moral; jika hati rusak/jahat, maka seluruh perbuatan anggota tubuh akan ikut rusak',
      'Seorang raja harus selalu menjaga benteng istananya agar tidak rubuh',
      'Penyakit fisik lebih berbahaya daripada penyakit kejiwaan'
    ],
    correctAnswer: 1, // B
    explanation: 'Hati dimetaforakan sebagai raja pengendali jasmani. Bila hati berbuat zalim, seluruh perilaku dan anggota tubuh niscaya akan binasa.',
    topic: 'Amanat Filosofis Gurindam',
    difficulty: 'sedang',
  },
  {
    id: 'g-13',
    category: 'gurindam',
    poemText: [
      'Barang siapa meninggalkan sembahyang,',
      'Seperti rumah tiada bertiang.'
    ],
    question: 'Gaya bahasa (majas) yang digunakan pada baris kedua gurindam di atas adalah...',
    options: [
      'Personifikasi',
      'Simile / Asosiasi (perumpamaan dengan kata "seperti")',
      'Hiperbola',
      'Ironi'
    ],
    correctAnswer: 1, // B
    explanation: 'Baris kedua menggunakan perumpamaan langsung dengan kata pembanding "seperti", sehingga tergolong majas simile/asosiasi.',
    topic: 'Gaya Bahasa Gurindam',
    difficulty: 'sedang',
  },
  {
    id: 'g-14',
    category: 'gurindam',
    poemText: [
      'Apabila terpelihara lidah,',
      'Niscaya dapat daripadanya faedah.'
    ],
    question: 'Pesan utama bait gurindam tersebut bagi pergaulan sehari-hari adalah...',
    options: [
      'Menjaga kebersihan rongga mulut setiap pagi',
      'Menjaga tutur kata dan tidak berucap sembarangan agar terhindar dari bahaya dan mendatangkan manfaat',
      'Seseorang harus pandai berdebat dalam setiap forum',
      'Jangan berbicara dengan orang yang belum dikenal'
    ],
    correctAnswer: 1, // B
    explanation: '"Terpelihara lidah" adalah ungkapan untuk menjaga lisan, bertutur kata santun, dan menghindari ghibah serta dusta.',
    topic: 'Etika Berbahasa Gurindam',
    difficulty: 'mudah',
  },
  {
    id: 'g-15',
    category: 'gurindam',
    poemText: [
      'Dengan bapa jangan durhaka,',
      'Supaya Allah tidak murka.'
    ],
    question: 'Rima akhir pada bait gurindam di atas adalah...',
    options: [
      'Rima kembar berbunyi -ka (durhaka - murka)',
      'Rima silang a-b-a-b',
      'Rima peluk a-b-b-a',
      'Rima bebas tak berpola'
    ],
    correctAnswer: 0, // A
    explanation: 'Kedua baris berakhir dengan vokal dan konsonan yang sama (-ka: durhaka - murka), membentuk rima kembar a-a khas gurindam.',
    topic: 'Rima Akhir Gurindam',
    difficulty: 'mudah',
  },

  // ==========================================
  // --- SYAIR (Soal 16 - 30) ---
  // ==========================================
  {
    id: 's-01',
    category: 'syair',
    poemText: [
      'Wahai muda kenali dirimu,',
      'Ialah perahu tamsil tubuhmu,',
      'Tiadalah berapa lama hidupmu,',
      'Ke akhirat jua kekal diammu.'
    ],
    question: 'Bait di atas tergolong syair karena memiliki karakteristik utama yaitu...',
    options: [
      'Memiliki sampiran di baris 1 dan 2, serta berima a-b-a-b',
      'Terdiri dari 2 baris yang saling berhubungan sebab-akibat',
      'Terdiri dari 4 baris, semua baris adalah isi, dan bersajak akhir a-a-a-a (-mu)',
      'Merupakan pantun jenaka yang ditujukan untuk menghibur pemuda'
    ],
    correctAnswer: 2, // C
    explanation: 'Bait ini adalah Syair Perahu karya Hamzah Fansuri. Ciri syair: 4 baris sebait, bersajak a-a-a-a (dirimu, tubuhmu, hidupmu, diammu), dan seluruh barisnya mengandung isi kiasan.',
    topic: 'Ciri-Ciri Syair',
    difficulty: 'mudah',
  },
  {
    id: 's-02',
    category: 'syair',
    question: 'Dari segi asal-usulnya, istilah "Syair" diserap dari bahasa Arab yaitu...',
    options: [
      '"Syi\'ir" atau "Syu\'ur" yang berarti perasaan atau puisi',
      '"Kalam" yang berarti percakapan',
      '"Hikmah" yang berarti kebijaksanaan',
      '"Qalbu" yang berarti suara hati nurani'
    ],
    correctAnswer: 0, // A
    explanation: 'Kata syair berasal dari bahasa Arab "syi\'ir" atau "syu\'ur" yang berarti perasaan mendalam yang diungkapkan secara puitis.',
    topic: 'Sejarah & Istilah Syair',
    difficulty: 'sedang',
  },
  {
    id: 's-03',
    category: 'syair',
    poemText: [
      'Dengarlah wahai kawan sejati,',
      'Syair dibuat semata hati,',
      'Memperingatkan sahabat berhati-hati,',
      'Hidup di dunia tiada yang abadi.'
    ],
    question: 'Apakah pola rima akhir pada bait syair di atas?',
    options: [
      'a-b-a-b (rima silang)',
      'a-a-a-a (rima terus / rata)',
      'a-a-b-b (rima berpasangan)',
      'a-b-b-a (rima peluk)'
    ],
    correctAnswer: 1, // B
    explanation: 'Rima akhirnya adalah "sejati", "hati", "berhati-hati", "abadi", semuanya berakhiran bunyi vokal sama (-i) sehingga bersajak terus a-a-a-a.',
    topic: 'Rima Syair',
    difficulty: 'mudah',
  },
  {
    id: 's-04',
    category: 'syair',
    poemText: [
      'Wahai ananda intan pilihan,',
      'Berbuat baik jadikan pedoman,',
      'Jangan terpedaya oleh bisikan setan,',
      '................................................'
    ],
    question: 'Larik yang tepat untuk melengkapi bait syair di atas adalah...',
    options: [
      'Agar dirimu lekas menjadi pintar',
      'Niscaya engkau disayang ibunda',
      'Hati gembira bermain ria',
      'Supaya selamat sepanjang zaman'
    ],
    correctAnswer: 3, // D
    explanation: 'Syair menuntut rima akhir rata a-a-a-a. Baris 1-3 berakhiran bunyi "-an" (pilihan, pedoman, setan). Maka baris ke-4 harus berakhiran seirama "-an": "Supaya selamat sepanjang zaman".',
    topic: 'Melengkapi Syair',
    difficulty: 'sedang',
  },
  {
    id: 's-05',
    category: 'syair',
    question: 'Perbedaan mendasar antara Syair dan Pantun terletak pada...',
    options: [
      'Syair hanya boleh ditulis oleh raja, pantun oleh rakyat jelata',
      'Syair tidak memiliki sampiran (semua baris isi), sedangkan pantun baris 1-2 adalah sampiran',
      'Pantun selalu bersajak a-a-a-a, sedangkan syair selalu a-b-a-b',
      'Syair hanya terdiri dari 2 baris, sedangkan pantun terdiri dari 6 baris'
    ],
    correctAnswer: 1, // B
    explanation: 'Pantun memiliki bagian sampiran di baris 1-2 dan isi di baris 3-4. Sedangkan pada syair, seluruh 4 baris merupakan rangkaian isi tuturan cerita atau petuah.',
    topic: 'Perbandingan Pantun vs Syair',
    difficulty: 'mudah',
  },
  {
    id: 's-06',
    category: 'syair',
    poemText: [
      'Hai muda arif budiman,',
      'Hasilkan kemudi dengan pedoman,',
      'Alat perahumu jua kerjakan,',
      'Itulah jalan membetuli insan.'
    ],
    question: 'Kata "kemudi" dan "pedoman" dalam syair tersebut melambangkan...',
    options: [
      'Peralatan navigasi kapal nelayan tradisional',
      'Prinsip hidup, ilmu pengetahuan, dan keimanan sebagai penuntun arah manusia',
      'Peta perjalanan para saudagar zaman kuno',
      'Keahlian berenang saat ombak pasang'
    ],
    correctAnswer: 1, // B
    explanation: 'Dalam metafora tasawuf bahari Hamzah Fansuri, "kemudi" dan "pedoman" adalah lambang ilmu syariat dan petunjuk keimanan agar insan tidak tersesat.',
    topic: 'Simbolisme Syair',
    difficulty: 'sedang',
  },
  {
    id: 's-07',
    category: 'syair',
    poemText: [
      'Inilah gerangan suatu madah,',
      'Mengarahkan syair terlalu indah,',
      'Membetulkan jalan tempat berpindah,',
      'Di sanalah iktikat diperbetul sudah.'
    ],
    question: 'Amanat utama dari bait syair di atas adalah...',
    options: [
      'Menulis puisi harus memakai kata yang sukar dipahami',
      'Orang yang merantau harus waspada di jalan raya',
      'Memperbaiki niat, keyakinan hati (iktikat), dan perbuatan untuk bekal akhirat',
      'Kemegahan karya seni melebihi nilai ajaran agama'
    ],
    correctAnswer: 2, // C
    explanation: '"Membetulkan jalan tempat berpindah" dan "iktikat diperbetul sudah" mengisyaratkan ajakan untuk meluruskan akidah dan amal saleh menuju kampung akhirat.',
    topic: 'Amanat Syair',
    difficulty: 'sedang',
  },
  {
    id: 's-08',
    category: 'syair',
    question: 'Manakah judul di bawah ini yang merupakan karya syair terkenal dalam sastra Melayu klasik?',
    options: [
      'Syair Burung Pungguk dan Syair Bidasari',
      'Gurindam Dua Belas',
      'Pantun Kilat Karmina',
      'Hikayat Abdullah'
    ],
    correctAnswer: 0, // A
    explanation: 'Syair Burung Pungguk, Syair Bidasari, Syair Ken Tambuhan, dan Syair Perahu merupakan judul-judul syair naratif legendaris di Nusantara.',
    topic: 'Karya Klasik Syair',
    difficulty: 'sedang',
  },
  {
    id: 's-09',
    category: 'syair',
    poemText: [
      'Sudahlah hasil kayu dan ayar,',
      'Angkatlah pula sauh dan layar,',
      'Pada beras bekal jantanlah taksir,',
      'Niscaya sempurna jalan yang kabir.'
    ],
    question: 'Kata "kabir" dalam larik keempat syair di atas diserap dari bahasa Arab yang bermakna...',
    options: [
      'Kecil dan sempit',
      'Besar, agung, dan mulia',
      'Gelap gulita',
      'Licin dan berbahaya'
    ],
    correctAnswer: 1, // B
    explanation: 'Kata "kabir" berasal dari bahasa Arab (الكبير) yang bermakna maha besar atau agung. "Jalan yang kabir" berarti jalan keselamatan yang agung dan mulia.',
    topic: 'Kosa Kata Klasik Syair',
    difficulty: 'sulit',
  },
  {
    id: 's-10',
    category: 'syair',
    question: 'Ciri bahasa yang sering dijumpai dalam teks syair Melayu klasik adalah...',
    options: [
      'Menggunakan kalimat perintah yang singkat dan kasar',
      'Menggunakan bahasa kiasan, kata-kata arkais (kuno), dan untaian cerita berkesinambungan',
      'Hanya menggunakan bahasa daerah tanpa pengaruh bahasa serapan',
      'Selalu diakhiri dengan pantun jenaka'
    ],
    correctAnswer: 1, // B
    explanation: 'Syair klasik banyak memakai bahasa kiasan/metafora, kata-kata serapan Arab/Melayu arkais, dan bait-baitnya saling bersambung membentuk cerita utuh.',
    topic: 'Ciri Kebahasaan Syair',
    difficulty: 'mudah',
  },
  {
    id: 's-11',
    category: 'syair',
    poemText: [
      'Terdengarlah kabar suatu negeri,',
      'Rajanya adil bijak bestari,',
      'Negeri makmur tiada terperi,',
      'Rakyat hidup bersuka diri.'
    ],
    question: 'Berdasarkan isinya, bait syair di atas tergolong jenis syair...',
    options: [
      'Syair romantis / percintaan',
      'Syair sejarah / cerita kerajaan',
      'Syair teka-teki',
      'Syair ratapan kesedihan'
    ],
    correctAnswer: 1, // B
    explanation: 'Bait tersebut menceritakan keadaan suatu kerajaan yang makmur dipimpin oleh raja adil, sehingga tergolong syair naratif bertema sejarah/kerajaan.',
    topic: 'Jenis-Jenis Syair',
    difficulty: 'sedang',
  },
  {
    id: 's-12',
    category: 'syair',
    question: 'Berapakah batas jumlah suku kata yang lazim dalam setiap larik syair?',
    options: [
      '4 sampai 6 suku kata',
      '8 sampai 14 suku kata',
      '16 sampai 24 suku kata',
      'Bebas tanpa batas'
    ],
    correctAnswer: 1, // B
    explanation: 'Dalam kaidah puisi klasik, tiap baris syair biasanya terdiri dari 4-5 kata atau sekitar 8 hingga 14 suku kata.',
    topic: 'Kaidah Suku Kata Syair',
    difficulty: 'sedang',
  },
  {
    id: 's-13',
    category: 'syair',
    poemText: [
      'Wahai anakanda muda remaja,',
      'Janganlah engkau berhati manja,',
      'Rajinlah selalu dalam bekerja,',
      'Kelak hidupmu tiada tersia.'
    ],
    question: 'Sasaran pembaca (audiens) yang dituju dalam bait syair nasihat di atas adalah...',
    options: [
      'Para orang tua lanjut usia',
      'Generasi muda / remaja',
      'Para saudagar kaya',
      'Prajurit perang di perbatasan'
    ],
    correctAnswer: 1, // B
    explanation: 'Bait diawali dengan seruan "Wahai anakanda muda remaja", yang ditujukan sebagai nasihat untuk generasi muda agar mandiri dan ulet bekerja.',
    topic: 'Sasaran Amanat Syair',
    difficulty: 'mudah',
  },
  {
    id: 's-14',
    category: 'syair',
    poemText: [
      'Bunga mawar kembang berseri,',
      'Harum semerbak di taman asri,',
      'Dihinggapi kumbang setiap hari,',
      'Menambah elok paras sang putri.'
    ],
    question: 'Pola sajak pada bait syair di atas berakhiran bunyi...',
    options: [
      '-an',
      '-ri',
      '-ah',
      '-kan'
    ],
    correctAnswer: 1, // B
    explanation: 'Semua baris berakhiran rima kembar -ri (berseri, asri, hari, putri), membentuk sajak a-a-a-a.',
    topic: 'Analisis Rima Syair',
    difficulty: 'mudah',
  },
  {
    id: 's-15',
    category: 'syair',
    question: 'Mengapa dalam satu bait syair tidak terdapat bagian "sampiran"?',
    options: [
      'Karena syair diciptakan untuk langsung melantunkan nasihat atau kisah dalam seluruh baitnya',
      'Karena penyair lupa menuliskan sampirannya',
      'Karena syair hanya boleh dibaca dalam hati',
      'Karena sampiran hanya berlaku untuk puisi modern'
    ],
    correctAnswer: 0, // A
    explanation: 'Secara konvensi puisi lama Arab-Melayu, syair dirancang sebagai untaian kisah naratif/didaktis di mana setiap larik langsung menjadi bagian isi cerita.',
    topic: 'Karakteristik Unik Syair',
    difficulty: 'sedang',
  },

  // ==========================================
  // --- PANTUN (Soal 16 - 35) ---
  // ==========================================
  {
    id: 'p-01',
    category: 'pantun',
    poemText: [
      'Bunga mawar harum baunya,',
      'Tumbuh subur di tepi taman,',
      'Barang siapa rajin membaca,',
      'Pasti luas ilmu dan wawasan.'
    ],
    question: 'Bagian yang berfungsi sebagai "isi pantun" pada bait di atas terdapat pada larik...',
    options: [
      'Larik ke-1 dan ke-2',
      'Larik ke-3 dan ke-4',
      'Larik ke-1 dan ke-3',
      'Semua larik merupakan isi'
    ],
    correctAnswer: 1, // B
    explanation: 'Struktur pantun: Larik 1 dan 2 adalah sampiran (pengantar rima), sedangkan larik 3 dan 4 merupakan isi yang memuat pesan sebenarnya.',
    topic: 'Struktur Pantun',
    difficulty: 'mudah',
  },
  {
    id: 'p-02',
    category: 'pantun',
    poemText: [
      'Pohon kelapa tumbuh sebatang,',
      'Daunnya melambai ditiup angin,',
      'Jangan suka berbuat curang,',
      'Kelak tak ada yang mau berteman.'
    ],
    question: 'Ditinjau dari isinya, pantun di atas termasuk jenis pantun...',
    options: [
      'Pantun jenaka',
      'Pantun teka-teki',
      'Pantun nasihat',
      'Pantun perpisahan'
    ],
    correctAnswer: 2, // C
    explanation: 'Pantun tersebut berisi petuah budi pekerti agar menjauhi perbuatan curang demi menjaga kerukunan pertemanan.',
    topic: 'Jenis-Jenis Pantun',
    difficulty: 'mudah',
  },
  {
    id: 'p-03',
    category: 'pantun',
    question: 'Berapakah jumlah suku kata yang ideal dalam tiap larik pantun menurut kaidah puisi rakyat?',
    options: [
      '4 sampai 6 suku kata',
      '15 sampai 20 suku kata',
      '8 sampai 12 suku kata',
      'Bebas tanpa batasan suku kata'
    ],
    correctAnswer: 2, // C
    explanation: 'Secara kaidah baku, tiap baris pantun terdiri dari 4-5 kata atau berkisar antara 8 sampai 12 suku kata.',
    topic: 'Kaidah Suku Kata Pantun',
    difficulty: 'mudah',
  },
  {
    id: 'p-04',
    category: 'pantun',
    poemText: [
      'Berakit-rakit ke hulu,',
      'Berenang-renang ke tepian,',
      'Bersakit-sakit dahulu,',
      'Bersenang-senang kemudian.'
    ],
    question: 'Analisis rima akhir (sajak) pada pantun pepatah Melayu terkenal di atas adalah...',
    options: [
      'a-a-a-a',
      'a-a-b-b',
      'b-b-a-a',
      'a-b-a-b (hulu [u] - tepian [an] - dahulu [u] - kemudian [an])'
    ],
    correctAnswer: 3, // D
    explanation: 'Baris 1 berima "-lu" (a), baris 2 berima "-an" (b), baris 3 berima "-lu" (a), baris 4 berima "-an" (b). Pola silang a-b-a-b adalah sajak khas pantun.',
    topic: 'Rima Pantun',
    difficulty: 'mudah',
  },
  {
    id: 'p-05',
    category: 'pantun',
    poemText: [
      'Pergi ke pasar membeli nangka,',
      '..........................................',
      'Hati siapa takkan gembira,',
      'Melihat kera berkaca mata.'
    ],
    question: 'Larik sampiran yang tepat untuk melengkapi pantun jenaka di atas adalah...',
    options: [
      'Pulang ke rumah memetik semangka',
      'Membeli baju warna merah muda',
      'Makan bersama teman sekelas',
      'Berangkat pagi naik sepeda'
    ],
    correctAnswer: 0, // A
    explanation: 'Larik "Pulang ke rumah memetik semangka" berima akhir -ka sepadan dengan nangka di baris 1 serta menjaga alur ritme pantun.',
    topic: 'Melengkapi Sampiran',
    difficulty: 'sedang',
  },
  {
    id: 'p-06',
    category: 'pantun',
    poemText: [
      'Asam kandis asam gelugur,',
      'Ketiga asam si riang-riang,',
      'Menangis mayat di pintu kubur,',
      'Teringat badan tidak sembahyang.'
    ],
    question: 'Pantun tersebut sarat dengan nilai religius. Nilai apa yang ditekankan?',
    options: [
      'Larangan menangisi orang yang telah meninggal',
      'Kewajiban menunaikan ibadah sembahyang sebelum ajal tiba',
      'Keharusan menanam pohon asam di pekarangan',
      'Adat istiadat pemakaman zaman dahulu'
    ],
    correctAnswer: 1, // B
    explanation: 'Lirik "Teringat badan tidak sembahyang" mengingatkan pentingnya ibadah selama masih hidup agar tidak menyesal kelak setelah meninggal.',
    topic: 'Pantun Agama',
    difficulty: 'mudah',
  },
  {
    id: 'p-07',
    category: 'pantun',
    poemText: [
      'Buah cempedak di luar pagar,',
      'Ambil galah tolong jolokkan,',
      'Saya budak baru belajar,',
      'Kalau salah tolong tunjukkan.'
    ],
    question: 'Nilai karakter luhur yang dicerminkan dalam pantun di atas adalah...',
    options: [
      'Sikap rendah hati dan terbuka menerima bimbingan serta koreksi',
      'Sikap suka meminta-minta kepada orang lain',
      'Suka memetik buah di pekarangan tetangga',
      'Ketakutan dalam mencoba hal-hal baru'
    ],
    correctAnswer: 0, // A
    explanation: 'Frasa "Saya budak baru belajar, Kalau salah tolong tunjukkan" adalah lambang kerendahan hati seorang pembelajar yang siap menerima koreksi.',
    topic: 'Nilai Moral Pantun',
    difficulty: 'mudah',
  },
  {
    id: 'p-08',
    category: 'pantun',
    poemText: [
      'Burung camar terbang tinggi,',
      'Hinggap di dahan pohon randu,',
      'Mari kita saling berbagi,',
      'Agar hidup terasa padu.'
    ],
    question: 'Hitunglah jumlah suku kata pada baris pertama: "Burung camar terbang tinggi"!',
    options: [
      '4 suku kata',
      '12 suku kata',
      '15 suku kata',
      '8 suku kata (Bu-rung ca-mar ter-bang ting-gi)'
    ],
    correctAnswer: 3, // D
    explanation: 'Pemenggalan suku kata: Bu(1)-rung(2) ca(3)-mar(4) ter(5)-bang(6) ting(7)-gi(8), tepat berjumlah 8 suku kata.',
    topic: 'Analisis Suku Kata Pantun',
    difficulty: 'mudah',
  },
  {
    id: 'p-09',
    category: 'pantun',
    poemText: [
      'Kalau ada sumur di ladang,',
      'Boleh kita menumpang mandi,',
      'Kalau ada umur yang panjang,',
      'Bolehlah kita berjumpa lagi.'
    ],
    question: 'Pantun di atas lazim dibacakan pada suasana...',
    options: [
      'Pesta pernikahan adat',
      'Perpisahan atau penutupan pertemuan',
      'Upacara peringatan hari pahlawan',
      'Lomba cerdas cermat sains'
    ],
    correctAnswer: 1, // B
    explanation: 'Pantun tersebut merupakan pantun perpisahan klasik yang mengandung harapan agar kelak dapat bersilaturahmi kembali.',
    topic: 'Fungsi Sosial Pantun',
    difficulty: 'mudah',
  },
  {
    id: 'p-10',
    category: 'pantun',
    poemText: [
      'Berlayar ke pulau Penyengat,',
      'Singgah sebentar membeli duku,',
      'Wahai kawan mari bersemangat,',
      'Membaca dan menuntut ilmu.'
    ],
    question: 'Larik yang berkedudukan sebagai "sampiran" pada pantun di atas adalah...',
    options: [
      'Larik 1 dan 2',
      'Larik 3 dan 4',
      'Hanya larik 1',
      'Larik 2 dan 4'
    ],
    correctAnswer: 0, // A
    explanation: 'Larik 1 ("Berlayar ke pulau Penyengat") dan larik 2 ("Singgah sebentar membeli duku") adalah sampiran yang membina rima bagi baris 3 dan 4.',
    topic: 'Struktur Sampiran Pantun',
    difficulty: 'mudah',
  },
  {
    id: 'p-11',
    category: 'pantun',
    poemText: [
      'Ada sisik bukannya ikan,',
      'Ada mahkota bukannya raja,',
      'Jika engkau bijak budiman,',
      'Buah apakah gerangan itu?'
    ],
    question: 'Berdasarkan isinya, bait tersebut tergolong jenis pantun...',
    options: [
      'Pantun nasihat',
      'Pantun teka-teki (jawabannya: nanas)',
      'Pantun jenaka',
      'Pantun berkasih-kasihan'
    ],
    correctAnswer: 1, // B
    explanation: 'Pantun teka-teki memuat tebakan atau teka-teki di bagian representsi isinya. Jawaban tebakan ini adalah buah nanas.',
    topic: 'Pantun Teka-Teki',
    difficulty: 'mudah',
  },
  {
    id: 'p-12',
    category: 'pantun',
    poemText: [
      'Gajah mengaum harimau bertelur,',
      'Cicak terbang di atas atap,',
      'Melihat kakek belajar meluncur,',
      'Tertawa nenek terbahak-bahak.'
    ],
    question: 'Pantun yang mengandung unsur lucu atau menggelikan hati seperti di atas disebut pantun...',
    options: [
      'Pantun jenaka',
      'Pantun duka cita',
      'Pantun agama',
      'Pantun adat'
    ],
    correctAnswer: 0, // A
    explanation: 'Pantun jenaka bertujuan menghibur pendengar melalui penggambaran situasi yang lucu, ganjil, atau menggelikan.',
    topic: 'Pantun Jenaka',
    difficulty: 'mudah',
  },
  {
    id: 'p-13',
    category: 'pantun',
    question: 'Pantun dua baris yang baris pertamanya sampiran dan baris keduanya isi dinamakan...',
    options: [
      'Talibun',
      'Seloka',
      'Karmina (pantun kilat)',
      'Soneta'
    ],
    correctAnswer: 2, // C
    explanation: 'Karmina atau pantun kilat adalah bentuk pantun mini yang hanya terdiri atas 2 baris (baris 1 sampiran, baris 2 isi) dengan sajak a-a.',
    topic: 'Bentuk Turunan Pantun (Karmina)',
    difficulty: 'sedang',
  },
  {
    id: 'p-14',
    category: 'pantun',
    poemText: [
      'Air surut memungut kerang,',
      'Kerang direbus di kuali baja,',
      'Jangan suka mencela orang,',
      '...................................'
    ],
    question: 'Larik yang tepat untuk melengkapi pantun nasihat di atas agar bersajak a-b-a-b adalah...',
    options: [
      'Agar hidup tidak tersiksa',
      'Cerminlah diri sendiri saja',
      'Bekerja giat bersama warga',
      'Makan bersama di teras senja'
    ],
    correctAnswer: 1, // B
    explanation: 'Baris 2 berakhir dengan kata "baja" (rima -ja). Maka baris 4 harus berima sepadan (-ja): "Cerminlah diri sendiri saja".',
    topic: 'Melengkapi Isi Pantun',
    difficulty: 'sedang',
  },
  {
    id: 'p-15',
    category: 'pantun',
    question: 'Asal mula kata "Pantun" dalam kebudayaan Nusantara berasal dari bahasa Minangkabau yaitu...',
    options: [
      'Patuntun (yang bermakna penuntun / pedoman)',
      'Pantang (yang bermakna larangan keras)',
      'Panton (yang bermakna dendang riang)',
      'Pantau (yang bermakna mengawasi)'
    ],
    correctAnswer: 0, // A
    explanation: 'Kata pantun berasal dari kata Minangkabau "patuntun" yang berarti penuntun jalan hidup atau pemberi arah budi pekerti.',
    topic: 'Etimologi Pantun',
    difficulty: 'sedang',
  },

  // ==========================================
  // --- PERBANDINGAN & ANALISIS MENDALAM (Soal 36 - 50) ---
  // ==========================================
  {
    id: 'c-01',
    category: 'perbandingan',
    question: 'Perhatikan ciri-ciri puisi berikut:\n1. Terdiri dari 2 baris tiap bait\n2. Bersajak a-a\n3. Baris kedua merupakan akibat dari baris pertama\nCiri tersebut merupakan ciri puisi...',
    options: [
      'Pantun',
      'Syair',
      'Gurindam',
      'Talibun'
    ],
    correctAnswer: 2, // C
    explanation: 'Ciri 2 baris per bait dengan rima kembar a-a serta hubungan syarat-jawab / sebab-akibat adalah definisi mutlak dari Gurindam.',
    topic: 'Identifikasi Puisi',
    difficulty: 'mudah',
  },
  {
    id: 'c-02',
    category: 'perbandingan',
    poemText: [
      'Jika suami tiada berilmu,',
      'Kuranglah pandai memimpin anakmu.'
    ],
    question: 'Bait di atas adalah contoh gurindam. Mengapa bait tersebut TIDAK BISA disebut pantun?',
    options: [
      'Karena isinya mengenai pernikahan',
      'Karena hanya terdiri dari 2 baris dan bersajak a-a, sedangkan pantun terdiri dari 4 baris bersajak a-b-a-b',
      'Karena tidak ada rima pada akhir katanya',
      'Karena menggunakan bahasa kiasan'
    ],
    correctAnswer: 1, // B
    explanation: 'Pantun standar terdiri atas 4 baris dengan rima silang a-b-a-b dan mempunyai sampiran di baris 1-2. Puisi 2 baris bersajak a-a adalah gurindam.',
    topic: 'Analisis Perbedaan',
    difficulty: 'mudah',
  },
  {
    id: 'c-03',
    category: 'perbandingan',
    question: 'Di antara pilihan berikut, manakah pasangan puisi rakyat dan pola sajaknya yang paling tepat?',
    options: [
      'Pantun: a-a-a-a | Syair: a-b-a-b | Gurindam: a-b',
      'Pantun: a-b-a-b | Syair: a-a-a-a | Gurindam: a-a',
      'Pantun: a-b-b-a | Syair: a-a-a-a | Gurindam: b-b-a-a',
      'Pantun: a-a | Syair: a-b-a-b | Gurindam: a-a-a-a'
    ],
    correctAnswer: 1, // B
    explanation: 'Pola rima baku puisi rakyat Nusantara: Pantun bersajak silang a-b-a-b, Syair bersajak terus a-a-a-a, dan Gurindam bersajak kembar a-a.',
    topic: 'Ringkasan Rima',
    difficulty: 'mudah',
  },
  {
    id: 'c-04',
    category: 'perbandingan',
    question: 'Di antara ketiga puisi rakyat (Pantun, Syair, Gurindam), manakah yang SELURUH barisnya merupakan isi dan TIDAK mempunyai sampiran sama sekali?',
    options: [
      'Hanya Pantun',
      'Syair dan Gurindam',
      'Semua puisi rakyat memiliki sampiran',
      'Tidak ada yang memiliki isi'
    ],
    correctAnswer: 1, // B
    explanation: 'Hanya Pantun yang memiliki sampiran (di baris 1-2). Baik Syair (semua 4 baris) maupun Gurindam (kedua barisnya) seluruh barisnya adalah isi pesan.',
    topic: 'Struktur Perbandingan',
    difficulty: 'sedang',
  },
  {
    id: 'c-05',
    category: 'perbandingan',
    question: 'Raja Ali Haji sangat terkenal sebagai pujangga pencipta karya puisi rakyat jenis...',
    options: [
      'Syair Burung Pungguk',
      'Gurindam Dua Belas',
      'Pantun Jenaka Betawi',
      'Babad Diponegoro'
    ],
    correctAnswer: 1, // B
    explanation: 'Raja Ali Haji dari Riau dinobatkan sebagai pahlawan nasional dan pencipta mahakarya "Gurindam Dua Belas" yang ditulis pada tahun 1847.',
    topic: 'Tokoh Sastra Klasik',
    difficulty: 'mudah',
  },
  {
    id: 'c-06',
    category: 'perbandingan',
    question: 'Tokoh sufi asal Barus (Sumatra Utara) yang sangat termasyhur dengan karya-karya syair tasawufnya adalah...',
    options: [
      'Hamzah Fansuri',
      'Chairil Anwar',
      'Marah Rusli',
      'Sutan Takdir Alisjahbana'
    ],
    correctAnswer: 0, // A
    explanation: 'Hamzah Fansuri adalah sastrawan sufi besar abad ke-16/17 yang mempelopori penulisan syair Melayu, termasuk Syair Perahu dan Syair Burung Pingai.',
    topic: 'Tokoh Pujangga Syair',
    difficulty: 'sedang',
  },
  {
    id: 'c-07',
    category: 'perbandingan',
    poemText: [
      'Bila selalu berbuat dusta,',
      'Hilanglah harga di depan mata.'
    ],
    question: 'Bait di atas memiliki hubungan antarlarik berupa hubungan...',
    options: [
      'Pertentangan',
      'Sebab - akibat / kondisi - konsekuensi',
      'Pemilihan',
      'Penjelasan tempat'
    ],
    correctAnswer: 1, // B
    explanation: 'Baris 1 memuat kondisi/sebab ("Bila selalu berbuat dusta"), baris 2 memuat konsekuensi/akibat buruknya ("Hilanglah harga di depan mata").',
    topic: 'Analisis Hubungan Larik',
    difficulty: 'mudah',
  },
  {
    id: 'c-08',
    category: 'perbandingan',
    question: 'Puisi rakyat lama yang mirip pantun namun terdiri atas 6, 8, atau 10 baris per bait disebut...',
    options: [
      'Karmina',
      'Gurindam',
      'Talibun',
      'Haiku'
    ],
    correctAnswer: 2, // C
    explanation: 'Talibun adalah puisi berlarik genap (6, 8, 10 baris atau lebih) di mana separuh baris awal adalah sampiran dan separuh baris akhir adalah isi.',
    topic: 'Pengenalan Talibun',
    difficulty: 'sedang',
  },
  {
    id: 'c-09',
    category: 'perbandingan',
    question: 'Kalimat berikut yang sering muncul dalam puisi rakyat dan berjenis kalimat saran adalah...',
    options: [
      '"Janganlah engkau mencuri"',
      '"Sebaiknya engkau rajin belajar agar masa depanmu cerah"',
      '"Pergilah dari sini sekarang juga!"',
      '"Siapakah nama saudaramu?"'
    ],
    correctAnswer: 1, // B
    explanation: 'Kalimat saran ditandai oleh pemakaian kata seperti "sebaiknya", "seyogianya", atau "hendaknya".',
    topic: 'Kebahasaan Puisi Rakyat (Kalimat Saran)',
    difficulty: 'mudah',
  },
  {
    id: 'c-10',
    category: 'perbandingan',
    question: 'Kalimat yang menyatakan larangan dalam puisi rakyat ditandai dengan kata tugas...',
    options: [
      'Jangan / janganlah',
      'Marilah',
      'Ayo',
      'Wahai'
    ],
    correctAnswer: 0, // A
    explanation: 'Kalimat larangan memakai penanda negasi imperatif "jangan" atau "janganlah".',
    topic: 'Kebahasaan Puisi Rakyat (Kalimat Larangan)',
    difficulty: 'mudah',
  },
  {
    id: 'c-11',
    category: 'perbandingan',
    poemText: [
      'Wahai pemuda harapan bangsa,',
      'Belajarlah tekun sepanjang masa,',
      'Jauhilah narkoba perusak jiwa,',
      'Agar negaramu makmur sentosa.'
    ],
    question: 'Mengapa bait di atas dikategorikan sebagai SYAIR dan bukan PANTUN?',
    options: [
      'Karena bertema nasionalisme pemuda',
      'Karena terdiri dari 4 baris yang semuanya merupakan isi nasihat dan bersajak sama (a-a-a-a)',
      'Karena jumlah katanya lebih dari sepuluh',
      'Karena tidak menggunakan kata-kata Melayu kuno'
    ],
    correctAnswer: 1, // B
    explanation: 'Keempat barisnya berisi nasihat utuh tanpa sampiran dan semuanya berakhiran rima kembar -a (bangsa, masa, jiwa, sentosa), yang merupakan sifat dasar syair.',
    topic: 'Uji Pembeda Pantun vs Syair',
    difficulty: 'mudah',
  },
  {
    id: 'c-12',
    category: 'perbandingan',
    poemText: [
      'Ke hulu membuat pagar,',
      'Jangan terpotong batang durian,',
      'Masa muda rajin belajar,',
      'Masa tua tidak kelaparan.'
    ],
    question: 'Hubungan rima akhir antarlarik pada pantun di atas adalah...',
    options: [
      'Larik 1 berima dengan larik 3 (-gar), larik 2 berima dengan larik 4 (-an)',
      'Semua larik berima sama',
      'Larik 1 berima dengan larik 2 saja',
      'Hanya larik 4 yang memiliki rima'
    ],
    correctAnswer: 0, // A
    explanation: 'Larik 1 (-gar) bersilang dengan larik 3 (-jar). Larik 2 (-an) bersilang dengan larik 4 (-an). Inilah pola persilangan sajak a-b-a-b.',
    topic: 'Analisis Pola Silang Rima',
    difficulty: 'mudah',
  },
  {
    id: 'c-13',
    category: 'perbandingan',
    question: 'Manakah nilai yang PALING dominan diajarkan dalam Gurindam Dua Belas karya Raja Ali Haji?',
    options: [
      'Nilai budi pekerti, akhlak mulia, dan keimanan kepada Tuhan',
      'Teknik berlayar mengarungi lautan',
      'Tata cara berniaga rempah-rempah',
      'Seni bela diri silat'
    ],
    correctAnswer: 0, // A
    explanation: 'Gurindam Dua Belas sarat dengan pendidikan moral, pengendalian nafsu lisan dan hati, serta ketaatan beribadah kepada Allah SWT.',
    topic: 'Nilai Dominan Gurindam Dua Belas',
    difficulty: 'mudah',
  },
  {
    id: 'c-14',
    category: 'perbandingan',
    poemText: [
      'Tahu pekerjaan tak baik tetapi dikerjakan,',
      'Bukanlah manusia dinamakan.'
    ],
    question: 'Kutipan gurindam di atas mengecam perbuatan...',
    options: [
      'Orang yang menuntut ilmu terlalu lama',
      'Kemunafikan / kesengajaan melakukan perbuatan buruk padahal sudah tahu hal itu salah',
      'Seseorang yang gemar tidur di siang hari',
      'Pedagang yang menjual barang dengan harga murah'
    ],
    correctAnswer: 1, // B
    explanation: 'Bait ini mencela orang yang mengetahui suatu perbuatan itu dosa/buruk namun tetap nekat melakukannya.',
    topic: 'Amanat Gurindam Terhadap Kemunafikan',
    difficulty: 'sedang',
  },
  {
    id: 'c-15',
    category: 'perbandingan',
    question: 'Dalam kurikulum Bahasa Indonesia SMP Kelas 9, mengapa puisi rakyat (Pantun, Syair, Gurindam) penting untuk dipelajari?',
    options: [
      'Hanya untuk memenuhi syarat kelulusan ujian',
      'Sebagai warisan kearifan lokal Nusantara yang menanamkan nilai budi pekerti, kehalusan bahasa, dan karakter mulia',
      'Agar siswa tidak perlu belajar puisi modern',
      'Untuk menggantikan lagu-lagu nasional'
    ],
    correctAnswer: 1, // B
    explanation: 'Puisi rakyat menyimpan kekayaan etika leluhur, melatih kepekaan estetika berbahasa, dan menanamkan nilai karakter positif dalam kehidupan.',
    topic: 'Tujuan Pembelajaran Puisi Rakyat',
    difficulty: 'mudah',
  }
];

export const OUTFIT_OPTIONS: { id: string; name: string; description: string; shirtColor: string; pantsColor: string; accentColor: string; cost: number }[] = [
  {
    id: 'smp',
    name: 'Siswa SMP Keren',
    description: 'Seragam putih biru kebanggaan pelajar SMP.',
    shirtColor: '#f8fafc',
    pantsColor: '#1d4ed8',
    accentColor: '#38bdf8',
    cost: 0,
  },
  {
    id: 'street',
    name: 'Streetwear Runner',
    description: 'Hoodie oranye cerah dengan celana kargo modern.',
    shirtColor: '#f97316',
    pantsColor: '#1e293b',
    accentColor: '#fbbf24',
    cost: 50,
  },
  {
    id: 'batik',
    name: 'Batik Sastrawan',
    description: 'Baju corak batik nusantara penuh wibawa budaya.',
    shirtColor: '#b45309',
    pantsColor: '#451a03',
    accentColor: '#fde047',
    cost: 120,
  },
  {
    id: 'cyber',
    name: 'Cyber Neo-Surfer',
    description: 'Jaket neon cyberpunk dengan efek aksen bersinar.',
    shirtColor: '#06b6d4',
    pantsColor: '#0f172a',
    accentColor: '#a855f7',
    cost: 250,
  },
];
