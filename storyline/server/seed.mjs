import { drizzle } from "drizzle-orm/mysql2";
import { entries } from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const sampleEntries = [
  {
    userId: 1,
    title: "Margaret's First Meeting with James",
    content:
      "Margaret sat in the coffee shop, her hands trembling as she waited. James was late—fifteen minutes now. She'd rehearsed this conversation a thousand times in her head, but nothing could prepare her for the reality of seeing him again after five years. The espresso machine hissed. A child laughed at a nearby table. Everything felt too loud, too bright, too real.",
    category: "Character",
    section: "Chapter 3",
    tags: JSON.stringify(["Margaret", "James", "reunion", "tension"]),
    wordCount: 68,
  },
  {
    userId: 1,
    title: "The Hidden Letter",
    content:
      "In the attic, beneath the floorboards, Margaret discovered a letter written in her grandmother's hand. The ink had faded to brown, the paper yellowed with age. Her heart stopped as she read the first line: 'If you're reading this, then I'm gone, and the truth must finally come out.' What truth? What had her grandmother been hiding all these years?",
    category: "Plot",
    section: "Chapter 7",
    tags: JSON.stringify(["mystery", "family secret", "grandmother"]),
    wordCount: 72,
  },
  {
    userId: 1,
    title: "The Manor on the Hill",
    content:
      "The Ashworth Manor loomed against the gray sky, its Gothic spires piercing the clouds like accusing fingers. Ivy crawled up the stone walls, choking the windows. The gardens had gone wild—roses twisted with thorns, fountains choked with algae. It was beautiful and terrible, a monument to decay. Margaret felt it watching her as she approached the iron gates.",
    category: "Setting",
    section: "Chapter 1",
    tags: JSON.stringify(["atmosphere", "gothic", "manor"]),
    wordCount: 74,
  },
  {
    userId: 1,
    title: "Margaret Confronts Her Past",
    content:
      '"You knew," Margaret said, her voice steady despite the rage burning in her chest. "You knew the whole time and you never told me." Her mother looked away, unable to meet her eyes. "It wasn\'t my place." "Wasn\'t your place? It was my life! My identity! How could you keep this from me?" The silence between them felt like a chasm, impossibly wide.',
    category: "Dialogue",
    section: "Chapter 5",
    tags: JSON.stringify(["confrontation", "mother", "secrets"]),
    wordCount: 75,
  },
  {
    userId: 1,
    title: "The Cost of Ambition",
    content:
      "What does it mean to sacrifice everything for one dream? Margaret had given up marriage, children, a normal life—all for her art, her writing, her need to be remembered. But now, at sixty, she wondered if the words on the page were worth the emptiness in her heart. The theme echoed through her novel: ambition as both salvation and damnation.",
    category: "Theme",
    section: "Throughout",
    tags: JSON.stringify(["ambition", "sacrifice", "legacy"]),
    wordCount: 69,
  },
  {
    userId: 1,
    title: "Historical Context: The 1920s",
    content:
      "The Jazz Age was a time of radical change for women. Margaret's character should reflect this—the tension between old-world propriety and new-world freedom. Research shows that women in this era were beginning to vote, work, smoke in public, and challenge traditional gender roles. This context will deepen Margaret's internal conflict and make her choices more historically resonant.",
    category: "Research",
    section: "Background",
    tags: JSON.stringify(["history", "1920s", "women", "social change"]),
    wordCount: 73,
  },
];

async function seed() {
  try {
    console.log("Seeding database with sample entries...");
    
    for (const entry of sampleEntries) {
      await db.insert(entries).values(entry);
      console.log(`✓ Created entry: "${entry.title}"`);
    }
    
    console.log("\n✅ Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
