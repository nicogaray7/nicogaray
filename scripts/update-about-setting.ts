import { prisma } from '../lib/prisma';

async function main() {
  const row = await prisma.siteSetting.findUnique({ where: { key: 'about' } });
  console.log('Current:', JSON.stringify(row?.value, null, 2));

  await prisma.siteSetting.upsert({
    where: { key: 'about' },
    create: {
      key: 'about',
      value: {
        title: { fr: 'Nico Garay', en: 'Nico Garay' },
        lede: {
          fr: "Photographe de voyage. Je traverse le monde lentement et j'écoute la lumière.",
          en: "Travel photographer. I move through the world slowly and listen to the light.",
        },
        body: {
          fr: "Je suis voyageur avant d'être photographe. Je capture les paysages et les sujets qui me touchent pour les immortaliser, pour garder quelque chose de vivant de chaque passage.\n\nMes images naissent d'un long silence. Je marche, je m'assois, j'attends. Je ne cherche pas le spectaculaire, je cherche le moment où un paysage commence à respirer.\n\nCette galerie rassemble une partie de ce travail. Les photographies y sont vendues en édition numérique pour un usage personnel, un tirage, un fond d'écran, un fragment du monde sur votre mur.",
          en: "I'm a traveller before I'm a photographer. I capture the landscapes and subjects that move me to immortalise them, to keep something alive from each journey.\n\nMy images are born of long silences. I walk, I sit, I wait. I'm not chasing the spectacular, I'm waiting for the moment a landscape begins to breathe.\n\nThis gallery gathers part of that work. The photographs are sold as digital editions for personal use, a print, a wallpaper, a fragment of the world on your wall.",
        },
      },
    },
    update: {
      value: {
        title: { fr: 'Nico Garay', en: 'Nico Garay' },
        lede: {
          fr: "Photographe de voyage. Je traverse le monde lentement et j'écoute la lumière.",
          en: "Travel photographer. I move through the world slowly and listen to the light.",
        },
        body: {
          fr: "Je suis voyageur avant d'être photographe. Je capture les paysages et les sujets qui me touchent pour les immortaliser, pour garder quelque chose de vivant de chaque passage.\n\nMes images naissent d'un long silence. Je marche, je m'assois, j'attends. Je ne cherche pas le spectaculaire, je cherche le moment où un paysage commence à respirer.\n\nCette galerie rassemble une partie de ce travail. Les photographies y sont vendues en édition numérique pour un usage personnel, un tirage, un fond d'écran, un fragment du monde sur votre mur.",
          en: "I'm a traveller before I'm a photographer. I capture the landscapes and subjects that move me to immortalise them, to keep something alive from each journey.\n\nMy images are born of long silences. I walk, I sit, I wait. I'm not chasing the spectacular, I'm waiting for the moment a landscape begins to breathe.\n\nThis gallery gathers part of that work. The photographs are sold as digital editions for personal use, a print, a wallpaper, a fragment of the world on your wall.",
        },
      },
    },
  });

  console.log('Updated successfully.');
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
