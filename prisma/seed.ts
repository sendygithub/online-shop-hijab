import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Cek apakah admin sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@hijabparadise.com" },
  });

  if (!existingAdmin) {
    // Buat akun admin
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.create({
      data: {
        email: "admin@hijabparadise.com",
        name: "Admin Hijab Paradise",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("Akun admin berhasil dibuat:");
    console.log("  Email: admin@hijabparadise.com");
    console.log("  Password: admin123");
  } else {
    console.log("Admin sudah terdaftar:", existingAdmin.email);
  }

  // Cek apakah sudah ada produk
  const existingProducts = await prisma.product.count();

  if (existingProducts > 0) {
    console.log(
      `Sudah ada ${existingProducts} produk di database. Lewati seeding produk.`,
    );
    return;
  }

  // Data dummy 20 produk
  const products = [
    {
      name: "Hijab Pashmina Ceruty Silk Premium",
      price: 85000,
      description:
        "Hijab pashmina berbahan ceruty silk premium yang lembut, ringan, dan tidak mudah kusut. Cocok untuk acara formal maupun casual sehari-hari. Tersedia dalam berbagai warna elegan.",
      category: "Pashmina",
      sizes: ["Free Size"],
      stock: 50,
      rating: 4.8,
      image: "/pashmina-floral-pattern.jpg",
      sold: 120,
    },
    {
      name: "Gamis Syar'i Dress Muslimah",
      price: 185000,
      description:
        "Gamis syar'i dengan potongan longgar dan nyaman. Bahan katun rayon yang adem dan menyerap keringat. Cocok untuk aktivitas sehari-hari maupun acara formal.",
      category: "Gamis",
      sizes: ["S", "M", "L", "XL"],
      stock: 35,
      rating: 4.7,
      image: "/islamic-dress-gamis-women.jpg",
      sold: 85,
    },
    {
      name: "Tunik Modern Motif Etnik",
      price: 135000,
      description:
        "Tunik modern dengan motif etnik yang unik dan elegan. Bahan viscose premium yang nyaman dipakai. Cocok dipadukan dengan celana kulot atau leggings.",
      category: "Tunik",
      sizes: ["M", "L", "XL"],
      stock: 28,
      rating: 4.6,
      image: "/modest-clothing-tunic-white.jpg",
      sold: 65,
    },
    {
      name: "Abaya Arabian Dress Hitam Elegan",
      price: 250000,
      description:
        "Abaya dress hitam elegan dengan potongan modern. Bahan crepe premium yang jatuh dan tidak menerawang. Dilengkapi dengan payet halus di bagian lengan.",
      category: "Abaya",
      sizes: ["M", "L", "XL", "XXL"],
      stock: 20,
      rating: 4.9,
      image: "/abaya-arabian-dress-black-elegant.jpg",
      sold: 45,
    },
    {
      name: "Hijab Segi Empat Voile Premium",
      price: 45000,
      description:
        "Hijab segi empat berbahan voile premium yang adem dan mudah dibentuk. Tidak licin saat dipakai. Cocok untuk daily wear dengan berbagai style hijab.",
      category: "Hijab",
      sizes: ["Free Size"],
      stock: 100,
      rating: 4.5,
      image: "/square-hijab-jilbab-islamic.jpg",
      sold: 200,
    },
    {
      name: "Hijab Modern Voile Pink Soft",
      price: 55000,
      description:
        "Hijab modern dengan warna pink soft yang cantik. Bahan voile premium yang ringan dan jatuh. Cocok untuk gaya hijab kekinian.",
      category: "Hijab",
      sizes: ["Free Size"],
      stock: 75,
      rating: 4.7,
      image: "/modern-hijab-voile-pink.jpg",
      sold: 150,
    },
    {
      name: "Inner Cap Hijab Aksesori",
      price: 25000,
      description:
        "Inner cap hijab yang nyaman dipakai di dalam hijab. Menyerap keringat dan menjaga rambut tetap rapi. Tersedia dalam warna netral.",
      category: "Aksesori",
      sizes: ["Free Size"],
      stock: 120,
      rating: 4.4,
      image: "/hijab-inner-cap-accessory.jpg",
      sold: 300,
    },
    {
      name: "Gamis Brokat Payet Mewah",
      price: 350000,
      description:
        "Gamis brokat dengan payet mewah yang cocok untuk acara spesial seperti kondangan atau wisuda. Bahan brokat berkualitas dengan lapisan dalam yang nyaman.",
      category: "Gamis",
      sizes: ["M", "L", "XL"],
      stock: 15,
      rating: 4.9,
      image: "/islamic-party-dress-embroidered.jpg",
      sold: 30,
    },
    {
      name: "Pashmina Instan Jersey",
      price: 65000,
      description:
        "Pashmina instan berbahan jersey yang elastis dan nyaman. Praktis dipakai tanpa perlu di-jabab. Cocok untuk hijabers aktif.",
      category: "Pashmina",
      sizes: ["Free Size"],
      stock: 60,
      rating: 4.6,
      image: "/pashmina-floral-pattern.jpg",
      sold: 180,
    },
    {
      name: "Tunik Batik Muslimah Modern",
      price: 155000,
      description:
        "Tunik batik dengan desain modern yang elegan. Bahan katun batik premium yang nyaman. Cocok untuk acara semi formal maupun casual.",
      category: "Tunik",
      sizes: ["M", "L", "XL"],
      stock: 25,
      rating: 4.5,
      image: "/modest-clothing-tunic-white.jpg",
      sold: 55,
    },
    {
      name: "Abaya Dubai Dress Abu-abu",
      price: 280000,
      description:
        "Abaya Dubai dress dengan warna abu-abu elegan. Bahan satin silk premium yang mewah. Cocok untuk acara formal dan pesta.",
      category: "Abaya",
      sizes: ["M", "L", "XL"],
      stock: 18,
      rating: 4.8,
      image: "/abaya-arabian-dress-black-elegant.jpg",
      sold: 40,
    },
    {
      name: "Hijab Bergo Instan Elastis",
      price: 35000,
      description:
        "Hijab bergo instan dengan bahan elastis yang nyaman. Tidak perlu jarum pentul, praktis langsung pakai. Cocok untuk daily wear.",
      category: "Hijab",
      sizes: ["Free Size"],
      stock: 90,
      rating: 4.3,
      image: "/square-hijab-jilbab-islamic.jpg",
      sold: 250,
    },
    {
      name: "Gamis Plisket Aksen Ruffle",
      price: 165000,
      description:
        "Gamis plisket dengan aksen ruffle yang manis. Bahan ceruty plisket yang tidak mudah hilang lipitannya. Cocok untuk acara santai maupun formal.",
      category: "Gamis",
      sizes: ["S", "M", "L", "XL"],
      stock: 30,
      rating: 4.6,
      image: "/islamic-dress-gamis-women.jpg",
      sold: 70,
    },
    {
      name: "Pashmina Silk Crinkle",
      price: 75000,
      description:
        "Pashmina silk crinkle dengan tekstur unik dan elegan. Bahan silk premium yang ringan dan berkilau. Cocok untuk acara spesial.",
      category: "Pashmina",
      sizes: ["Free Size"],
      stock: 45,
      rating: 4.7,
      image: "/pashmina-floral-pattern.jpg",
      sold: 95,
    },
    {
      name: "Tunik Linen Premium Natural",
      price: 145000,
      description:
        "Tunik linen premium dengan warna natural yang timeless. Bahan linen berkualitas tinggi yang adem dan nyaman. Cocok untuk gaya kasual elegan.",
      category: "Tunik",
      sizes: ["M", "L", "XL", "XXL"],
      stock: 22,
      rating: 4.4,
      image: "/modest-clothing-tunic-white.jpg",
      sold: 48,
    },
    {
      name: "Abaya Syar'i Lengan Lebar",
      price: 220000,
      description:
        "Abaya syar'i dengan potongan lengan lebar yang syar'i. Bahan katun rayon premium yang adem. Cocok untuk muslimah yang mengutamakan kesyariahan.",
      category: "Abaya",
      sizes: ["L", "XL", "XXL"],
      stock: 16,
      rating: 4.7,
      image: "/abaya-arabian-dress-black-elegant.jpg",
      sold: 35,
    },
    {
      name: "Hijab Sport Jersey",
      price: 30000,
      description:
        "Hijab sport berbahan jersey yang elastis dan menyerap keringat. Cocok untuk olahraga dan aktivitas outdoor. Tidak mudah bergeser saat dipakai.",
      category: "Hijab",
      sizes: ["Free Size"],
      stock: 80,
      rating: 4.5,
      image: "/modern-hijab-voile-pink.jpg",
      sold: 220,
    },
    {
      name: "Bros Hijab Mutiara Elegan",
      price: 20000,
      description:
        "Bros hijab dengan hiasan mutiara yang elegan. Mudah dipasang dan tidak merusak kain hijab. Cocok sebagai aksesori pelengkap hijab.",
      category: "Aksesori",
      sizes: ["Free Size"],
      stock: 150,
      rating: 4.3,
      image: "/hijab-inner-cap-accessory.jpg",
      sold: 350,
    },
    {
      name: "Gamis Katun Rayon Daily",
      price: 125000,
      description:
        "Gamis katun rayon untuk daily wear yang nyaman. Bahan adem dan menyerap keringat. Potongan longgar cocok untuk ibu hamil maupun menyusui.",
      category: "Gamis",
      sizes: ["M", "L", "XL", "XXL"],
      stock: 40,
      rating: 4.5,
      image: "/islamic-dress-gamis-women.jpg",
      sold: 90,
    },
    {
      name: "Pashmina Diamond Premium",
      price: 95000,
      description:
        "Pashmina diamond premium dengan motif anyaman diamond yang elegan. Bahan soft dan nyaman. Cocok untuk acara formal maupun semi formal.",
      category: "Pashmina",
      sizes: ["Free Size"],
      stock: 55,
      rating: 4.8,
      image: "/pashmina-floral-pattern.jpg",
      sold: 110,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(
    `\n✅ Berhasil menambahkan ${products.length} produk dummy ke database!`,
  );
  console.log("Produk-produk tersebut akan tampil di halaman utama.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
