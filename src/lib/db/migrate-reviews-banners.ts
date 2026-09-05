import "dotenv/config";
import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5433/swasthyokor";

const sql = postgres(connectionString, { max: 1 });

async function main() {
  console.log(
    "Migrating product_reviews, hero_banners, and compare_at_price...",
  );

  // 1. Add compare_at_price to product_variants if not exists
  await sql`
    ALTER TABLE product_variants 
    ADD COLUMN IF NOT EXISTS compare_at_price REAL;
  `;

  // 2. Create product_reviews table
  await sql`
    CREATE TABLE IF NOT EXISTS product_reviews (
      id VARCHAR(255) PRIMARY KEY,
      product_id VARCHAR(255) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
      user_name VARCHAR(255) NOT NULL,
      user_avatar TEXT,
      rating INTEGER NOT NULL DEFAULT 5,
      comment TEXT NOT NULL,
      approved BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS product_reviews_product_idx ON product_reviews(product_id);`;
  await sql`CREATE INDEX IF NOT EXISTS product_reviews_user_idx ON product_reviews(user_id);`;

  // 3. Create hero_banners table
  await sql`
    CREATE TABLE IF NOT EXISTS hero_banners (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      highlight VARCHAR(255) NOT NULL,
      subtitle TEXT NOT NULL,
      link TEXT NOT NULL DEFAULT '/search',
      accent_color VARCHAR(50) NOT NULL DEFAULT 'text-amber-400',
      image TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `;

  // Seed sample real hero banners if empty
  const existingBanners = await sql`SELECT id FROM hero_banners`;
  if (existingBanners.length === 0) {
    const banners = [
      {
        id: "banner-1",
        title: "১০০% খাঁটি সুন্দরবন মধু ও",
        highlight: "গাওয়া ঘি",
        subtitle:
          "প্রকৃতির নিখাদ দান, কোনো কৃত্রিম মিষ্টি বা প্রিজারভেটিভ ছাড়া সরাসরি সুন্দরবন ও খামার থেকে সংগৃহীত।",
        link: "/search?q=মধু",
        accent_color: "text-amber-400",
        image:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1600&auto=format&fit=crop&q=85",
        position: 0,
      },
      {
        id: "banner-2",
        title: "ঘানি ভাঙা সরিষার তেল ও",
        highlight: "কালোজিরা তেল",
        subtitle:
          "কাঠের ঘানিতে ভাঙা প্রাকৃতিক ঝাঁঝ ও খাঁটি পুষ্টিতে ভরপুর স্বাস্থ্যকর রান্নার শ্রেষ্ঠ উপাদান।",
        link: "/search?q=তেল",
        accent_color: "text-emerald-400",
        image:
          "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1600&auto=format&fit=crop&q=85",
        position: 1,
      },
      {
        id: "banner-3",
        title: "প্রিমিয়াম অর্গানিক চিয়া সিড ও",
        highlight: "সুপারফুড সংগ্রহ",
        subtitle: "প্রতিদিনের সুস্থতা ও রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে খাঁটি সুপারফুডের সমাহার।",
        link: "/search/superfoods-wellness",
        accent_color: "text-teal-400",
        image:
          "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=1600&auto=format&fit=crop&q=85",
        position: 2,
      },
      {
        id: "banner-4",
        title: "সেরা বাছাইকৃত ড্রাই ফ্রুটস ও",
        highlight: "পুষ্টিকর বাদাম",
        subtitle: "আমন্ড, কাজু, পেস্তা, আখরোট ও প্রিমিয়াম কিশমিশের সেরা স্বাস্থ্যকর স্ন্যাক্স।",
        link: "/search?q=বাদাম",
        accent_color: "text-amber-300",
        image:
          "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&auto=format&fit=crop&q=85",
        position: 3,
      },
    ];

    for (const b of banners) {
      await sql`
        INSERT INTO hero_banners (id, title, highlight, subtitle, link, accent_color, image, position, active)
        VALUES (${b.id}, ${b.title}, ${b.highlight}, ${b.subtitle}, ${b.link}, ${b.accent_color}, ${b.image}, ${b.position}, true)
      `;
    }
    console.log("Hero banners seeded into database.");
  }

  console.log("Migration finished successfully!");
  await sql.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
