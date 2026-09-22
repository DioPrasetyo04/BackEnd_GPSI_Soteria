import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const renunganSeed = [
  {
    title: "Tetap Bertumbuh dalam Iman",
    slug: "tetap-bertumbuh-dalam-iman",
    excerpt:
      "Dalam setiap proses kehidupan, Tuhan mengajarkan kita untuk tetap percaya dan bertumbuh dalam iman.",
    description:
      "Dalam setiap proses kehidupan, Tuhan mengajarkan kita untuk tetap percaya dan bertumbuh dalam iman. Kita harus tetap percaya dan bertumbuh dalam iman untuk menjadi orang yang lebih baik.",
    image: "/images/articles/renungan.jpg",
    author: "Pdt. Jane Doe",
    category: "Renungan",
    publishedAt: new Date("2026-08-22"),
  },
  {
    title: "Menjadi Kawan Sekerja Allah",
    slug: "menjadi-kawan-sekerja-allah",
    excerpt:
      "Setiap orang percaya dipanggil untuk mengambil bagian dalam pekerjaan Tuhan melalui kehidupan dan pelayanan.",
    description:
      "Setiap orang percaya dipanggil untuk mengambil bagian dalam pekerjaan Tuhan melalui kehidupan dan pelayanan. Kita harus tetap percaya dan bertumbuh dalam iman untuk menjadi orang yang lebih baik.",
    image: "/images/articles/renungan.jpg",
    author: "Pdt. John Doe",
    category: "Renungan",
    publishedAt: new Date("2026-08-20"),
  },
  {
    title: "Hidup dalam Kebersamaan",
    slug: "hidup-dalam-kebersamaan",
    excerpt:
      "Kehidupan dalam Kristus mengajarkan kita untuk saling menguatkan, melayani, dan bertumbuh bersama.",
    description:
      "Kehidupan dalam Kristus mengajarkan kita untuk saling menguatkan, melayani, dan bertumbuh bersama. Kita harus tetap percaya dan bertumbuh dalam iman untuk menjadi orang yang lebih baik.",
    image: "/images/articles/renungan.jpg",
    author: "Pdt. Jane Doe",
    category: "Renungan",
    publishedAt: new Date("2026-08-18"),
  },
  {
    title: "Berdaya dan Bersuara untuk Kebanggan Tuhan",
    slug: "berdaya-dan-bersuara-untuk-kebanggan-tuhan",
    excerpt:
      "Setiap orang percaya harus berdaya dan bersuara untuk kebanggan Tuhan.",
    description:
      "Setiap orang percaya harus berdaya dan bersuara untuk kebanggan Tuhan. Kita harus tetap percaya dan bertumbuh dalam iman untuk menjadi orang yang lebih baik.",
    image: "/images/articles/renungan.jpg",
    author: "Pdt. John Doe",
    category: "Renungan",
    publishedAt: new Date("2026-08-16"),
  },
  {
    title: "Kasih yang Mengubahkan",
    slug: "kasih-yang-mengubahkan",
    excerpt:
      "Kasih Kristus mengubah cara kita memandang sesama dan menjalani kehidupan sehari-hari.",
    description:
      "Kasih Kristus mengubah cara kita memandang sesama dan menjalani kehidupan sehari-hari. Ketika kasih Tuhan memenuhi hati, kita dipanggil untuk mengasihi tanpa syarat.\n\nMari kita belajar mempraktikkan kasih itu dalam keluarga, jemaat, dan masyarakat.",
    image: "/images/articles/renungan.jpg",
    author: "Pdt. Jane Doe",
    category: "Renungan",
    publishedAt: new Date("2026-08-14"),
  },
  {
    title: "Berdoa tanpa Berhenti",
    slug: "berdoa-tanpa-berhenti",
    excerpt:
      "Doa adalah napas kehidupan rohani yang menjaga kita tetap dekat dengan Tuhan.",
    description:
      "Doa adalah napas kehidupan rohani yang menjaga kita tetap dekat dengan Tuhan. Dalam setiap situasi, kita diundang untuk datang kepada-Nya dengan percaya.\n\nJangan lelah berdoa, sebab Tuhan mendengar dan menjawab pada waktu-Nya.",
    image: "/images/articles/renungan.jpg",
    author: "Pdt. John Doe",
    category: "Renungan",
    publishedAt: new Date("2026-08-12"),
  },
  {
    title: "Terang di Tengah Kegelapan",
    slug: "terang-di-tengah-kegelapan",
    excerpt:
      "Sebagai murid Kristus, kita dipanggil menjadi terang yang membawa harapan bagi dunia.",
    description:
      "Sebagai murid Kristus, kita dipanggil menjadi terang yang membawa harapan bagi dunia. Di tengah tantangan, terang Tuhan tetap bersinar melalui hidup kita.\n\nHiduplah sedemikian rupa sehingga orang lain melihat kebaikan Tuhan melalui kita.",
    image: "/images/articles/renungan.jpg",
    author: "Pdt. Jane Doe",
    category: "Renungan",
    publishedAt: new Date("2026-08-10"),
  },
];

const jadwalSeed = [
  {
    date: new Date("2026-08-23"),
    time: "09.00",
    activity: "Ibadah Minggu Utama 1",
    organizer: "Majelis Jemaat",
    location: "Ruang Ibadah",
    description: "Ibadah Minggu Utama 1",
  },
  {
    date: new Date("2026-08-23"),
    time: "09.00",
    activity: "Ibadah BPK PA",
    organizer: "BPK PA",
    location: "Ruang Midian",
    description: "Ibadah BPK PA",
  },
  {
    date: new Date("2026-08-23"),
    time: "11.00",
    activity: "Latihan Soteria Kids Choir",
    organizer: "Komisi Muslager",
    location: "Ruang Ibadah",
    description: "Latihan Soteria Kids Choir",
  },
  {
    date: new Date("2026-08-23"),
    time: "12.00",
    activity: "Katekisasi Anak Muda",
    organizer: "Pendeta Jemaat",
    location: "Konsistori",
    description: "Katekisasi Anak Muda",
  },
  {
    date: new Date("2026-08-23"),
    time: "13.00",
    activity: "Latihan Soteria Female Choir",
    organizer: "Komisi Muslager",
    location: "Ruang Ibadah",
    description: "Latihan Soteria Female Choir",
  },
  {
    date: new Date("2026-08-23"),
    time: "15.00",
    activity: "Ibadah BPK PT",
    organizer: "Pengurus BPK PT",
    location: "Ruang Ibadah",
    description: "Ibadah BPK PT",
  },
  {
    date: new Date("2026-08-23"),
    time: "18.00",
    activity: "Ibadah Minggu Utama 2",
    organizer: "Majelis Jemaat",
    location: "Ruang Ibadah",
    description: "Ibadah Minggu Utama 2",
  },
  {
    date: new Date("2026-08-24"),
    time: "17.00",
    activity: "Ibadah BPK PKB",
    organizer: "Ibu Erla Salim",
    location: "Ruang Ibadah",
    description: "Ibadah BPK PKB",
  },
  {
    date: new Date("2026-08-24"),
    time: "19.00",
    activity: "Latihan Paduan Suara BPK PKB",
    organizer: "BPK PKB",
    location: "Ruang Ibadah",
    description: "Latihan Paduan Suara BPK PKB",
  },
  {
    date: new Date("2026-08-25"),
    time: "19.00",
    activity: "Persiapan Majelis Jemaat",
    organizer: "Pendeta Jemaat",
    location: "Ruang Ibadah",
    description: "Persiapan Majelis Jemaat",
  },
  {
    date: new Date("2026-08-26"),
    time: "19.30",
    activity: "Latihan muslager bersama organs",
    organizer: "Komisi Muslager",
    location: "Ruang Ibadah",
    description: "Latihan muslager bersama organs",
  },
  {
    date: new Date("2026-08-27"),
    time: "19.00",
    activity: "Ibadah KRT Sektor 1",
    organizer: "Ibu Sulce Silalembi",
    location: "Jl. Kampung Bahari GG 5 A 7 No. 43",
    description: "Ibadah KRT Sektor 1",
  },
  {
    date: new Date("2026-08-27"),
    time: "19.00",
    activity: "Ibadah KRT Sektor 3",
    organizer: "An. Put The Lili Umu Lestral Tulle",
    location: "Ruang Galilea",
    description: "Ibadah KRT Sektor 3",
  },
  {
    date: new Date("2026-08-27"),
    time: "19.00",
    activity: "Ibadah KRT Sektor 4",
    organizer: "Ibu Susan Odlinger",
    location: "Ruang Ibadah",
    description: "Ibadah KRT Sektor 4",
  },
  {
    date: new Date("2026-08-27"),
    time: "19.00",
    activity: "Ibadah KRT Sektor 5",
    organizer: "Ibu Yuliana Alokabel",
    location: "Jl. Swasembada Barat VIII No. 20 RT.002 RW.013",
    description: "Ibadah KRT Sektor 5",
  },
  {
    date: new Date("2026-08-28"),
    time: "19.00",
    activity: "Latihan VG Soteria Voice Junior",
    organizer: "Komisi Muslager",
    location: "Ruang Galilea",
    description: "Latihan VG Soteria Voice Junior",
  },
  {
    date: new Date("2026-08-29"),
    time: "05.00",
    activity: "Ibadah Doa Pagi",
    organizer: "Komisi Doa",
    location: "Ruang Ibadah",
    description: "Ibadah Doa Pagi",
  },
  {
    date: new Date("2026-08-29"),
    time: "13.00",
    activity: "Les Keyboard",
    organizer: "Komisi Muslager",
    location: "Ruang Ibadah",
    description: "Les Keyboard",
  },
  {
    date: new Date("2026-08-29"),
    time: "18.00",
    activity: "Ibadah BPK PP",
    organizer: "Pengurus BPK PP",
    location: "Ruang Ibadah",
    description: "Ibadah BPK PP",
  },
  {
    date: new Date("2026-08-29"),
    time: "19.00",
    activity: "Ibadah BPK PKB",
    organizer: "Bp. Harold F. J. Henussa",
    location: "Konsistori",
    description: "Ibadah BPK PKB bersama Bp. Harold F. J. Henussa",
  },
];

const gallerySeed = [
  {
    title: "Ibadah Minggu",
    category: "Ibadah",
    date: new Date("2026-08-23"),
    image: "/images/gallery/gallery.jpg",
    alt: "Ibadah Minggu GPSI Soteria",
  },
  {
    title: "Persekutuan Pemuda",
    category: "Pemuda",
    date: new Date("2026-08-16"),
    image: "/images/gallery/gallery.jpg",
    alt: "Persekutuan Pemuda GPSI Soteria",
  },
  {
    title: "Pelayanan Jemaat",
    category: "Pelayanan",
    date: new Date("2026-08-09"),
    image: "/images/gallery/gallery.jpg",
    alt: "Pelayanan Jemaat GPSI Soteria",
  },
  {
    title: "Kebersamaan Jemaat",
    category: "Kebersamaan",
    date: new Date("2026-08-02"),
    image: "/images/gallery/gallery.jpg",
    alt: "Kebersamaan Jemaat GPSI Soteria",
  },
  {
    title: "Ibadah Keluarga",
    category: "Ibadah",
    date: new Date("2026-07-26"),
    image: "/images/gallery/gallery.jpg",
    alt: "Ibadah Keluarga GPSI Soteria",
  },
  {
    title: "Kegiatan Gereja",
    category: "Kegiatan",
    date: new Date("2026-07-19"),
    image: "/images/gallery/gallery.jpg",
    alt: "Kegiatan Gereja GPSI Soteria",
  },
];

const wartaSeed = [
  {
    title: "Warta Gereja Minggu, 31 Agustus 2026",
    slug: "warta-gereja-minggu-31-agustus-2026",
    description:
      "Berita jemaat, jadwal ibadah, dan pengumuman pelayanan minggu ini.",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    publishedAt: new Date("2026-08-31"),
  },
  {
    title: "Warta Gereja Minggu, 24 Agustus 2026",
    slug: "warta-gereja-minggu-24-agustus-2026",
    description:
      "Ringkasan kegiatan jemaat, doa syafaat, dan informasi pelayanan.",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    publishedAt: new Date("2026-08-24"),
  },
  {
    title: "Warta Gereja Minggu, 17 Agustus 2026",
    slug: "warta-gereja-minggu-17-agustus-2026",
    description: "Pengumuman khusus HUT RI, jadwal ibadah, dan kabar sektor.",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    publishedAt: new Date("2026-08-17"),
  },
  {
    title: "Warta Gereja Minggu, 10 Agustus 2026",
    slug: "warta-gereja-minggu-10-agustus-2026",
    description: "Informasi ibadah, kunjungan pastoral, dan kegiatan pemuda.",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    publishedAt: new Date("2026-08-10"),
  },
  {
    title: "Warta Gereja Minggu, 3 Agustus 2026",
    slug: "warta-gereja-minggu-3-agustus-2026",
    description:
      "Warta awal bulan: fokus doa, keuangan jemaat, dan pelayanan sosial.",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    publishedAt: new Date("2026-08-03"),
  },
  {
    title: "Warta Gereja Minggu, 27 Juli 2026",
    slug: "warta-gereja-minggu-27-juli-2026",
    description:
      "Berita jemaat minggu lalu beserta pengumuman kegiatan mendatang.",
    fileUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    publishedAt: new Date("2026-07-27"),
  },
];

const organizationSeed = [
  {
    category: "PENGURUS_HARIAN" as const,
    position: "Pendeta Jemaat",
    name: "Pdt. Joni, S.Th",
    phone: "0813-8042-4139",
    order: 1,
  },
  {
    category: "PENGURUS_HARIAN" as const,
    position: "Ketua",
    name: "Pnt. Charles Aritonang",
    phone: "0821-7000-8940",
    order: 2,
  },
  {
    category: "PENGURUS_HARIAN" as const,
    position: "Sekretaris",
    name: "Pnt. V. Debbie Bara Ruru",
    phone: "0821-1239-6832",
    order: 3,
  },
  {
    category: "PENGURUS_HARIAN" as const,
    position: "Ketua I",
    name: "Pnt. L. Paulus Mokodaser",
    phone: "0858-1487-8319",
    order: 4,
  },
  {
    category: "PENGURUS_HARIAN" as const,
    position: "Sekretaris I",
    name: "Dkn. Dekky R. Budi Utomo",
    phone: "0853-2693-2696",
    order: 5,
  },
  {
    category: "PENGURUS_HARIAN" as const,
    position: "Ketua II",
    name: "Pnt. Mariana A. Manuriwu Bunga",
    phone: "0812-1906-727",
    order: 6,
  },
  {
    category: "PENGURUS_HARIAN" as const,
    position: "Sekretaris II",
    name: "Pnt. Rolina Rihi",
    phone: "0896-2753-4009",
    order: 7,
  },
  {
    category: "PENGURUS_HARIAN" as const,
    position: "Bendahara",
    name: "Pnt. Heri Bowo Santoso",
    phone: "0813-1053-1259",
    order: 8,
  },
  {
    category: "PENGURUS_HARIAN" as const,
    position: "Wakil Bendahara",
    name: "Pnt. Lisyuana Pah",
    phone: "0813-8030-3330",
    order: 9,
  },
  {
    category: "KOORDINATOR_SEKTOR" as const,
    position: "SEKTOR I",
    name: "Pnt. Dominggus Ratu",
    phone: "0812-6564-8414",
    order: 1,
  },
  {
    category: "KOORDINATOR_SEKTOR" as const,
    position: "SEKTOR II",
    name: "Pnt. Rosmei Kailem-Halawa",
    phone: "0813-1535-4931",
    order: 2,
  },
  {
    category: "KOORDINATOR_SEKTOR" as const,
    position: "SEKTOR III",
    name: "Dkn. Susana Agustina Kamaleng",
    phone: "0813-8240-4545",
    order: 3,
  },
  {
    category: "KOORDINATOR_SEKTOR" as const,
    position: "SEKTOR IV",
    name: "Dkn. Herlica Tedju-Haba",
    phone: "0812-3609-2390",
    order: 4,
  },
  {
    category: "KOORDINATOR_SEKTOR" as const,
    position: "SEKTOR V",
    name: "Pnt. Theo Sekewael",
    phone: "0821-1150-5554",
    order: 5,
  },
];

async function main() {
  for (const item of renunganSeed) {
    await prisma.renungan.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  await prisma.jadwal.deleteMany();
  await prisma.jadwal.createMany({ data: jadwalSeed });

  await prisma.gallery.deleteMany();
  await prisma.gallery.createMany({ data: gallerySeed });

  await prisma.organization.deleteMany();
  await prisma.organization.createMany({ data: organizationSeed });

  for (const item of wartaSeed) {
    await prisma.warta.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  console.log(
    `Seeded ${renunganSeed.length} renungan, ${jadwalSeed.length} jadwal, ${gallerySeed.length} gallery, ${organizationSeed.length} organization, ${wartaSeed.length} warta`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
