import "dotenv/config";
import postgres from "postgres";
import { BLOG_POSTS } from "../content/blog-data";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5433/swasthyokor";

const sql = postgres(connectionString, { max: 1 });

async function main() {
  console.log("Creating blogs table in PostgreSQL if not exists...");
  await sql`
    CREATE TABLE IF NOT EXISTS blogs (
      id VARCHAR(255) PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100) NOT NULL DEFAULT 'মধু ও পুষ্টি',
      read_time VARCHAR(50) NOT NULL DEFAULT '৫ মিনিট',
      author VARCHAR(100) NOT NULL DEFAULT 'স্বাস্থ্যকর নিউট্রিশন টিম',
      cover_image TEXT NOT NULL,
      in_article_image_url TEXT,
      in_article_image_caption TEXT,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
      related_product_handles JSONB NOT NULL DEFAULT '[]'::jsonb,
      published BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs(slug);`;

  console.log("Seeding initial blogs into PostgreSQL database...");
  for (const post of BLOG_POSTS) {
    const existing = await sql`SELECT id FROM blogs WHERE slug = ${post.slug}`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO blogs (
          id, slug, title, description, content, category, read_time, author,
          cover_image, in_article_image_url, in_article_image_caption, tags, faqs,
          related_product_handles, published, created_at, updated_at
        ) VALUES (
          ${`blog_${crypto.randomUUID().slice(0, 8)}`},
          ${post.slug},
          ${post.title},
          ${post.description},
          ${post.content},
          ${post.category},
          ${post.readTime},
          ${post.author},
          ${post.coverImage},
          ${post.inArticleImage?.url || null},
          ${post.inArticleImage?.caption || null},
          ${JSON.stringify(post.tags)},
          ${JSON.stringify(post.faqs)},
          ${JSON.stringify(post.relatedProducts?.map((p) => p.handle) || [])},
          true,
          ${new Date(post.publishedAt)},
          ${new Date(post.updatedAt)}
        )
      `;
    }
  }

  console.log("Blogs table created and seeded successfully in DB!");
  await sql.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
