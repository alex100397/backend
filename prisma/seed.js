import { PrismaClient } from "../src/generated/prisma/index.js";
import dotenv from "dotenv";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Starting seeding...");

    // 1. Ensure we have at least one user to be the creator
    let user = await prisma.user.findFirst();
    
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: "Admin User",
                email: "admin@example.com",
                password: "password123", // In a real app, this should be hashed
            }
        });
        console.log("Created admin user for seeding");
    }

    const creatorId = user.id;

    const movies = [    
        {
            title: 'Godzilla Minus One',
            description: 'In post-WWII Japan, a traumatized kamikaze pilot and a group of survivors must band together to fight a new threat: Godzilla.',
            releaseDate: new Date('2023-11-03'),
            genres: ['Action', 'Drama', 'Sci-Fi'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/gzlRbaWFdp29u1v7bN6lH2tS20n.jpg',
            createdBy: creatorId
        },
        {
            title: 'The Fall Guy',
            description: 'A stuntman in Hollywood finds himself caught in a real-life conspiracy while working on a movie set.',
            releaseDate: new Date('2024-05-03'),
            genres: ['Action', 'Comedy', 'Romance'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/tJr9tbp7rVsP9r30vN4vWlF676k.jpg',
            createdBy: creatorId
        },
        {
            title: 'Furiosa: A Mad Max Saga',
            description: 'In a post-apocalyptic wasteland, a young woman is torn from her home and must lead a rebellion against a ruthless warlord.',
            releaseDate: new Date('2024-05-24'),
            genres: ['Action', 'Adventure', 'Sci-Fi'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/i0Yy7bW0wP4U7K2364lY76N6o6k.jpg',
            createdBy: creatorId
        },
        {
            title: 'Inside Out 2',
            description: 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!',
            releaseDate: new Date('2024-06-14'),
            genres: ['Animation', 'Comedy', 'Family'],
            posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLv1oYhiYq.jpg',
            createdBy: creatorId
        },
    ];

    console.log("Seeding movies...");
    for (const movie of movies) {
        const existing = await prisma.movie.findFirst({
            where: { title: movie.title }
        });
        if (!existing) {
            await prisma.movie.create({ data: movie });
            console.log(`Created movie: ${movie.title}`);
        } else {
            console.log(`Movie already exists: ${movie.title}`);
        }
    }

    console.log("Seeding completed successfully");
}

main()
    .catch((e) => {
        console.error("Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });