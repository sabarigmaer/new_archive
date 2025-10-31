import { PrismaClient } from "@prisma/client";
import axios from "axios";
import {JSDOM} from "jsdom";

const prisma = new PrismaClient();

const PAGE = "https://lucioushentai.com/minami-shiunji-and-family-erotic-encounter-chronicles/"
async function main() {
    const page = await axios.get(PAGE)
    const { window: { document} } = new JSDOM(page.data)
    const title = document.querySelector('.page-title')?.textContent as string;
    const links: string[] = []
    document.querySelector('.real-content')?.querySelectorAll('img').forEach((i) => links.push(i.src))
    const gallery = await prisma.gallery.create({
    data: {
      title,
      description:PAGE,
    coverImage: links[links.length-1]
        ,   parentId: null,
    },
  });
  await prisma.file.createMany({
    data: links.map((url) => ({
      name: url.split("/").pop() || "unknown",
      url,
      galleryId: gallery.id,
    })),
  });
  console.log(
    `✅ Inserted gallery "${gallery.title}" with ${links.length} files`,
    gallery.id
  );
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });