import prisma from "../db.js";
import { HashPassword } from "../authentication.js";

async function main() {
    const admin = await prisma.user.create({
        data: {
            username: "Admin Károly",
            password: HashPassword("1234"),
            role: "ADMIN"
        }
    });

    const judge = await prisma.user.create({
        data: {
            username: "Zsűri Jenő",
            password: HashPassword("1234"),
            role: "JUDGE"
        }
    });

    const competition = await prisma.competition.create({
        data: {
            name: "Félévi verseny",
            description: "Iskola-szintű verseny 7. osztályos tanulóknak",
            grade: 7,
            startDate: new Date(2023, 10, 12),
            endDate: new Date(2023, 10, 16)
        }
    });

    const teacher1 = await prisma.user.create({
        data: {
            username: "Tanár Ferenc",
            password: HashPassword("1234"),
            role: "TEACHER",
            tasks: {
                create: [
                    { "word1": "Hegy", "word2": "Túra", "word3": "Zöld", "word4": "Pihenő", "grade": 5 },
                    { "word1": "Fény", "word2": "Csillag", "word3": "Éjszaka", "word4": "Univerzum", "grade": 7, competitions: { connect: { id: competition.id } } },
                    { "word1": "Gitár", "word2": "Zene", "word3": "Ritmikus", "word4": "Szonáta", "grade": 7, competitions: { connect: { id: competition.id } } },
                    { "word1": "Víz", "word2": "Tenger", "word3": "Hullám", "word4": "Homokos", "grade": 5 },
                    { "word1": "Futás", "word2": "Sport", "word3": "Verseny", "word4": "Egészség", "grade": 7, competitions: { connect: { id: competition.id } } },
                    { "word1": "Művészet", "word2": "Kép", "word3": "Kreativitás", "word4": "Galéria", "grade": 7, competitions: { connect: { id: competition.id } } },
                    { "word1": "Egyetem", "word2": "Tanulás", "word3": "Tudomány", "word4": "Diploma", "grade": 7, competitions: { connect: { id: competition.id } } },
                    { "word1": "Globális", "word2": "Felmelegedés", "word3": "Klíma", "word4": "Katasztrófa", "grade": 8 },
                    { "word1": "Robot", "word2": "Mesterséges", "word3": "Intelligencia", "word4": "Automatizált", "grade": 8 },
                    { "word1": "Virág", "word2": "Kert", "word3": "Szép", "word4": "Illatos", "grade": 6 },
                    { "word1": "Egér", "word2": "Számítógép", "word3": "Periféria", "word4": "Kattintás", "grade": 7, competitions: { connect: { id: competition.id } } },
                    { "word1": "Társasjáték", "word2": "Stratégia", "word3": "Kockázat", "word4": "Szórakozás", "grade": 8 },
                    { "word1": "Utazás", "word2": "Kaland", "word3": "Turizmus", "word4": "Exotikus", "grade": 8 },
                    { "word1": "Nyár", "word2": "Meleg", "word3": "Pihenés", "word4": "Vakáció", "grade": 6 }
                ]
            }
        }
    });

    const teacher2 = await prisma.user.create({
        data: {
            username: "Tanár Katalin",
            password: HashPassword("1234"),
            role: "TEACHER",
            tasks: {
                create: [
                    { "word1": "Álom", "word2": "Alvás", "word3": "Pihentető", "word4": "Ébredés", "grade": 6 },
                    { "word1": "Számok", "word2": "Matematika", "word3": "Kalkuláció", "word4": "Grafikon", "grade": 7, competitions: { connect: { id: competition.id } } },
                    { "word1": "Étel", "word2": "Főzés", "word3": "Recept", "word4": "Kóstolás", "grade": 7, competitions: { connect: { id: competition.id } } },
                    { "word1": "Energia", "word2": "Fenntartható", "word3": "Zöld", "word4": "Megújuló", "grade": 8 },
                    { "word1": "Víz", "word2": "Ivás", "word3": "Egészség", "word4": "Hidratálás", "grade": 8 },
                    { "word1": "Kutya", "word2": "Háziállat", "word3": "Játék", "word4": "Sétáltatás", "grade": 7, competitions: { connect: { id: competition.id } } },
                ]
            }
        }
    });

    const group1 = await prisma.group.create({
        data: {
            name: "Kék csapat",
            description: "A 7.B osztály csapata",
            users: {
                create: [
                    { username: "Kovács Eszter", password: HashPassword("1234"), role: "STUDENT", grade: 7, class: "B" },
                    { username: "Tóth Gábor", password: HashPassword("1234"), role: "STUDENT", grade: 7, class: "B" },
                    { username: "Horváth Petra", password: HashPassword("1234"), role: "STUDENT", grade: 7, class: "B" },
                ]
            },
            competition: {
                connect: {
                    id: competition.id
                }
            }
        }
    });

    const group2 = await prisma.group.create({
        data: {
            name: "Piros csapat",
            description: "A 7.A és C osztály csapata",
            users: {
                create: [
                    { username: "Németh Bence", password: HashPassword("1234"), role: "STUDENT", grade: 7, class: "A" },
                    { username: "Molnár András", password: HashPassword("1234"), role: "STUDENT", grade: 7, class: "A" },
                    { username: "Szabó Dóra", password: HashPassword("1234"), role: "STUDENT", grade: 7, class: "C" },
                ]
            },
            competition: {
                connect: {
                    id: competition.id
                }
            }
        }

    })
    const setting = await prisma.settings.create({
        data: {
            title: "Online vetélkedő",
            desc: "Online vetélkedő felső tagozatosoknak"
        }
    })

    const intro = await prisma.intro.create({
        data: {
            text: "Üdv ebben a szókirakó játékban! Az alábbi gombra kattintva elkezdheted a játékot."
        }
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
