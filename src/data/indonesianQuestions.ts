import { Question } from '../types/game';

// Helper to shuffle options so correct answers are never locked to a single option index
export function shuffleQuestion(q: Question): Question {
  const correctOptionText = q.options[q.correctAnswer];
  // Clone options
  const shuffledOptions = [...q.options];
  // Fisher-Yates shuffle
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
  // --- GURINDAM ---
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
    question: 'Manakah dari pernyataan berikut yang merupakan ciri khas struktur baris pada gurindam?',
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
    explanation: 'Gurindam bersajak a-a. Kata akhir baris 1 adalah "amanat" (akhiran -at). Larik pelengkap harus berakhiran seirama (-at) dan logis: "Buanglah khianat jangan dibuat".',
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
    question: 'Bait gurindam di atas terdiri atas berapa baris dan suku kata rata-rata per baris?',
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

  // --- SYAIR ---
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
    explanation: 'Bait ini adalah Syair Perahu karya Hamzah Fansuri. Ciri syair: 4 baris sebait, bersajak a-a-a-a (dirimu, tubuhmu, hidupmu, diammu), dan seluruh barisnya mengandung isi / pesan kiasan.',
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
    explanation: 'Kata syair berasal dari kata Arab "syi\'ir" atau "syu\'ur" yang berarti perasaan mendalam yang diungkapkan menjadi puisi. Masuk ke Nusantara bersamaan dengan penyebaran Islam.',
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
    explanation: 'Rima akhirnya adalah "sejati", "hati", "berhati-hati", "abadi", semuanya berima vokal sama -i (-ti/di) sehingga membentuk pola a-a-a-a yang disebut rima terus.',
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
    explanation: 'Syair menuntut rima a-a-a-a. Baris 1-3 berakhiran bunyi "-an" (pilihan, pedoman, setan). Maka baris ke-4 harus berakhiran "-an", yaitu "Supaya selamat sepanjang zaman".',
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
    explanation: 'Dalam pantun terdapat pemisahan tegas: baris 1-2 sebagai sampiran (pengantar rima) dan baris 3-4 sebagai isi. Sedangkan dalam syair, keempat baris seluruhnya berisi pesan/nasihat bertutur.',
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
    question: 'Kata "perahu" dalam bait syair tasawuf Hamzah Fansuri merupakan kiasan (metafora) untuk...',
    options: [
      'Kendaraan nelayan di pesisir pantai',
      'Harta benda yang dikumpulkan manusia',
      'Raga atau tubuh jasmani manusia dalam mengarungi kehidupan',
      'Negara kepulauan yang kaya rempah-rempah'
    ],
    correctAnswer: 2, // C
    explanation: 'Dalam Syair Perahu, perahu adalah metafora raga manusia yang berlayar melintasi samudra kehidupan dunia menuju pelabuhan akhirat.',
    topic: 'Metafora Syair',
    difficulty: 'sedang',
  },

  // --- PANTUN ---
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
    explanation: 'Struktur pantun: Larik 1 dan 2 adalah sampiran (tidak bermakna pesan langsung), sedangkan larik 3 dan 4 merupakan isi yang mengandung makna dan amanat sebenarnya.',
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
    explanation: 'Pantun ini berisi petuah/pesan moral agar tidak bersikap curang, sehingga tergolong pantun nasihat.',
    topic: 'Jenis-Jenis Pantun',
    difficulty: 'mudah',
  },
  {
    id: 'p-03',
    category: 'pantun',
    question: 'Berapakah jumlah suku kata yang ideal dalam tiap larik/baris pantun menurut kaidah puisi rakyat?',
    options: [
      '4 sampai 6 suku kata',
      '15 sampai 20 suku kata',
      '8 sampai 12 suku kata',
      'Bebas tanpa batasan suku kata'
    ],
    correctAnswer: 2, // C
    explanation: 'Secara kaidah baku, tiap baris pantun terdiri dari 4-5 kata atau berkisar antara 8 sampai 12 suku kata untuk menjaga irama estetika pembacaan.',
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

  // --- PERBANDINGAN DAN ANALISIS MENDALAM ---
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
    category: 'syair',
    poemText: [
      'Inilah gerangan suatu madah,',
      'Mengarahkan syair terlalu indah,',
      'Membetulkan jalan tempat berpindah,',
      'Di sanalah iktikat diperbetul sudah.'
    ],
    question: 'Amanat utama dari bait syair di atas adalah...',
    options: [
      'Menulis puisi harus menggunakan kata-kata yang rumit',
      'Orang yang berpindah tempat harus berhati-hati di jalan',
      'Memperbaiki niat, keyakinan, dan perbuatan sebagai bekal menuju kehidupan abadi di akhirat',
      'Keindahan seni sastra melebihi segalanya'
    ],
    correctAnswer: 2, // C
    explanation: '"Membetulkan jalan tempat berpindah" dan "iktikat diperbetul sudah" mengisyaratkan pesan agama agar manusia meluruskan aqidah dan keyakinan demi keselamatan hidup setelah mati.',
    topic: 'Amanat Syair',
    difficulty: 'sedang',
  },
  {
    id: 'c-04',
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
    explanation: 'Frasa "Saya budak baru belajar, Kalau salah tolong tunjukkan" adalah ungkapan kerendahan hati (tawaduk) seorang penuntut ilmu yang siap dinasihati jika keliru.',
    topic: 'Nilai Moral Pantun',
    difficulty: 'mudah',
  },
  {
    id: 'c-05',
    category: 'gurindam',
    poemText: [
      'Cahari olehmu akan sahabat,',
      'Yang boleh dijadikan obat.'
    ],
    question: 'Maksud kata "obat" pada baris kedua gurindam di atas adalah kiasan untuk...',
    options: [
      'Teman yang berprofesi sebagai dokter atau apoteker',
      'Ramuan tradisional untuk menyembuhkan penyakit demam',
      'Sahabat sejati yang mampu menenteramkan hati dan menasihati ke jalan yang benar saat dirundung masalah',
      'Seseorang yang membelikan makanan enak'
    ],
    correctAnswer: 2, // C
    explanation: 'Kata "obat" merupakan metafora untuk teman sejati yang membawa pengaruh positif, mampu mengobati kegelisahan jiwa, dan mencegah kita berbuat buruk.',
    topic: 'Kiasan Gurindam',
    difficulty: 'sedang',
  },
  {
    id: 'c-06',
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
    id: 'c-07',
    category: 'gurindam',
    poemText: [
      'Barang siapa mengenal akhirat,',
      'Tahulah ia dunia melarat.'
    ],
    question: 'Kata "melarat" dalam konteks gurindam Raja Ali Haji tersebut bermakna...',
    options: [
      'Mengalami kemiskinan harta benda yang parah',
      'Penuh dengan kesulitan berdagang',
      'Fana, sementara, dan tidak kekal bila dibandingkan dengan kehidupan akhirat',
      'Tidak memiliki rumah tinggal'
    ],
    correctAnswer: 2, // C
    explanation: 'Dalam sastra Melayu klasik, "dunia melarat" bermakna bahwa kenikmatan duniawi itu fana, rendah, dan sementara dibandingkan keabadian akhirat.',
    topic: 'Makna Kata Klasik',
    difficulty: 'sulit',
  },
  {
    id: 'c-08',
    category: 'perbandingan',
    question: 'Di antara ketiga puisi rakyat (Pantun, Syair, Gurindam), manakah yang SELURUH barisnya merupakan isi dan TIDAK mempunyai sampiran sama sekali?',
    options: [
      'Hanya Pantun',
      'Syair dan Gurindam',
      'Semua puisi rakyat memiliki sampiran',
      'Tidak ada yang memiliki isi'
    ],
    correctAnswer: 1, // B
    explanation: 'Hanya Pantun yang memiliki sampiran (di baris 1-2). Baik Syair (semua 4 baris) maupun Gurindam (kedua barisnya) seluruh barisnya adalah isi.',
    topic: 'Struktur Perbandingan',
    difficulty: 'sedang',
  },
  {
    id: 'c-09',
    category: 'pantun',
    poemText: [
      'Burung camar terbang tinggi,',
      'Hinggap di dahan pohon randu,',
      'Mari kita saling berbagi,',
      'Agar hidup terasa padu.'
    ],
    question: 'Hitunglah perkiraan jumlah suku kata pada baris pertama "Burung camar terbang tinggi"!',
    options: [
      '4 suku kata',
      '12 suku kata',
      '15 suku kata',
      '8 suku kata (Bu-rung ca-mar ter-bang ting-gi)'
    ],
    correctAnswer: 3, // D
    explanation: 'Penggalan suku katanya: Bu(1)-rung(2) ca(3)-mar(4) ter(5)-bang(6) ting(7)-gi(8), tepat 8 suku kata, memenuhi rentang syarat pantun (8-12 suku kata).',
    topic: 'Analisis Suku Kata',
    difficulty: 'mudah',
  },
  {
    id: 'c-10',
    category: 'gurindam',
    poemText: [
      'Kurang pikir kurang siasat,',
      'Tentu dirimu kelak tersesat.'
    ],
    question: 'Konjungsi yang tersirat menghubungkan baris pertama dan baris kedua pada gurindam adalah konjungsi hubungan...',
    options: [
      'Pertentangan (tetapi / melainkan)',
      'Sebab - akibat (karena/jika ... maka ...)',
      'Pemilihan (atau)',
      'Tujuan (agar / supaya)'
    ],
    correctAnswer: 1, // B
    explanation: 'Hubungan antarbaris gurindam selalu sebab-akibat atau syarat-akibat: "Jika/karena kurang pikir dan kurang siasat, maka tentu dirimu kelak tersesat".',
    topic: 'Kaidah Kebahasaan Gurindam',
    difficulty: 'sedang',
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
