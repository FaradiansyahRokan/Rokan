const contentData = [
    {
        type: 'about',
        kicker: "Profil",
        title: "Tentang Saya",
        desc: "As the founder of Archipelago Dynamics, I am dedicated to bridging Indonesia's vast potential with the global market. Our journey began in international trade, exporting premium local commodities and importing cutting-edge technology. This experience revealed a critical need for digital efficiency, leading to the creation of our IT Solutions division, which now empowers businesses with transformative software and enterprise architecture. Today, we continue to innovate across sectors, driven by a core mission to build synergistic ventures that pioneer the future.",
        exp: "-Founder & Chief Visionary Officer, Archipelago Dynamics (2023 - Present)\n-Global Trade Analyst, Maersk Line (2021 - 2025)\n-Fullstack & DevOps Engineer(intern), Yayasan Bina Insan Taqwa\n-SCRATCH Trainer, IDNBS( IDN IT CAMP BATCH 2)\n-MicroBit Trainer, IDNBS( IDN IT CAMP BATCH 2)\n-UI/UX Trainer – Al Ashr Bina Mandiri (2023)\n-3rd Winner of National Coding Competition(AL-HAZEN ACADEMY)",
        skills:"-Business Strategy & Leadership Skills: Global Trade & Supply Chain Management, Enterprise Architecture & Digital Transformation, Venture Capital & Strategic Investment\n-Frontend: HTML, CSS, JS, PHP, Dart, Kotlin, Mobile/Web, Responsive, Design, UI/UX ,React, Lowcoder\n-Backend & Database: Node.js, NestJS, PHP, Laravel, Python, MySQL, PostgreSQL, Prisma\n-Web3: Solidity, Ethers.js\n-Cloud & DevOps: Linux, Docker, KVM, Networking, Firewall Configuration, CI/CD, Nginx, Apache, Git, GitHub Actions",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=Rokan+S.+F."
    },
    {
        type: 'project',
        kicker: "E-Commerce",
        title: "Peti Ngemil",
        desc: "Peti Ngemil is an e-commerce web platform built to support local MSME food vendors by providing them a digital storefront — for free. Designed and developed as a team project, it includes complete features for users and admins, making it a powerful, real-world solution for small business digitization.",
        features: "Role-based access (admin/customer)\nIntegrasi Midtrans & RajaOngkir\nCetak struk\nAdmin dashboard",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=Peti+Ngemil",
        tags: ["Laravel", "Node.js", "MySQL", "Blade", "TailwindCSS"]
    },
    {
        type: 'project',
        kicker: "Infrastruktur",
        title: "Distributed File Sync",
        desc: "This project implements a real-time, peer-to-peer file synchronization system for a school environment (covering elementary, junior high, and administration divisions). Built using Syncthing and Docker, the system allows all school computers to share and access documents like a shared cloud — but fully offline, within the local network.",
        features: "Real-time document sync across all devices, No internet required (fully local network), Easy deployment via Docker containers, Improves collaboration and access between departments",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=File+Sync",
        tags: ["Syncthing", "Docker", "Tailscale"]
    },
    {
        type: 'project',
        kicker: "Backend",
        title: "NestJS RESTful API",
        desc: "This project is a secure and scalable RESTful API built with NestJS, using PostgreSQL as the database and Prisma ORM for data access. Authentication is implemented using JWT tokens, and the API supports full CRUD functionality for managing user and resource data.",
        features: "Full CRUD operations (Create, Read, Update, Delete), User authentication with JWT, Role-based access control (optional), PostgreSQL database with Prisma ORM, Clean modular architecture using NestJS",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=NestJS+API",
        tags: ["NestJS", "PostgreSQL", "Prisma", "JWT", "Dotenv"]
    },
    {
        type: 'project',
        kicker: "Web3",
        title: "Decentralized To-Do List",
        desc: "This is a fully decentralized To-Do List application built using Web3 technologies. The frontend is developed with React and styled using Tailwind CSS, while the backend logic runs on a Solidity smart contract deployed to a local Ethereum network using Hardhat. Users can create and manage tasks that are stored entirely on the blockchain. Wallet authentication is handled through MetaMask, ensuring secure and user-specific task management.",
        features: "Add new tasks tied to the wallet address, Fetch and display tasks from the smart contract, Delete tasks securely (only by task creator), MetaMask integration for user authentication and transaction signing, Responsive and elegant user interface, Blockchain data persistence (survives page reloads, not server resets)",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=Web3+DApp",
        tags: ["React", "Solidity", "Ethers.js", "Hardhat", "MetaMask" , "TailwindCSS"]
    },
    {
        type: 'project',
        kicker: "Creative Studio",
        title: "Plantique",
        desc: "Plantique is a creative studio concept that merges art, web design, development, and lifestyle. Originally built as a web service hub for my team, the site delivers a visually engaging and responsive experience. Featuring dynamic animations with GSAP and JavaScript, Plantique showcases our aesthetic and technical direction.",
        features: "Interactive UI with GSAP-powered transitions, Fully responsive layout for mobile and desktop, Creative visual direction for modern web audiences",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=Plantique",
        tags: ["HTML5", "CSS3", "JavaScript", "GSAP"]
    },
    {
        type: 'project',
        kicker: "Edu Platform",
        title: "SkillForge",
        desc: "SkillForge is an educational platform designed to help individuals learn in-demand skills through online courses. It includes a website, course management system, and network integration. Built during a competitive event, SkillForge led our team to achieve 3rd place.",
        features: "Manajemen kursus\nForm handling\nResponsive UI",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=SkillForge",
        tags: ["Laravel", "Bootstrap", "Blade", "MySQL"]
    },
    {
        type: 'project',
        kicker: "Android",
        title: "AroundU App",
        desc: "AroundU is a modern Android app developed in Kotlin that fetches and displays the latest news from local Indonesian sources using the NewsAPI. The app provides an intuitive user experience with RecyclerView for listing articles and a bottom navigation bar for smooth page transitions like Home, Categories, and Settings.",
        features: "Real-time news fetching with NewsAPI, RecyclerView for efficient list rendering, Bottom Navigation Bar for multi-page UI, Responsive layout & clean MVVM structure, Built with Android Studio and Kotlin",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=AroundU",
        tags: ["Kotlin", "NewsAPI", "RecyclerView", "MVVM" , "Retrofit", "NewsAPI"]
    },
    {
        type: 'project',
        kicker: "Android",
        title: "Quranku App",
        desc: "Quranku is a modern Android application developed with Kotlin, designed to provide users with the full Al-Qur’an and enriched interactive features. Users can select verses or full surahs to be recited aloud (tilawah), choose from multiple reciters (syeikh), and view real-time adzan times based on their location.",
        features: "Full 114 surahs with verse-by-verse selection, Multiple reciters (Syeikh Mishary, Abdul Basit, etc.), Audio playback per ayah or per surah, Daily prayer (adzan) schedule with local time sync, Modern UI with Material Design, Lightweight and fully offline-ready (with optional audio download)",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=Quranku",
        tags: ["Kotlin", "Android Jetpack", "Retrofit" , "MediaPlayer" ]
    },
    {
        type: 'project',
        kicker: "Android",
        title: "Dzikirku",
        desc: "Dzikirku is a comprehensive Islamic Android app developed in Kotlin that combines daily dzikir and prayer collections with real-time adzan schedule and curated Islamic news. Built to support Muslims in their daily worship and spiritual routine, it offers a clean and responsive interface with intuitive features.",
        features: "Dzikir harian pagi dan petang, Kumpulan doa-doa sesuai kategori (perjalanan, kesehatan, dll.), Jadwal adzan harian berdasarkan lokasi pengguna, Islamic news feed from trusted sources, Reminder/notification for prayer times",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=Dzikirku",
        tags: ["Kotlin", "Jetpack", "Firebase", "Retrofit", "LocalDatabase" ]
    },
    {
        type: 'project',
        kicker: "NAS System",
        title: "Self-Hosted NAS System",
        desc: "A centralized file storage system (NAS) designed for school environments (SD, SMP, and administration), enabling all computers to access shared files via local network. The system leverages Docker for modularity, Portainer for visual container management, and ZimaOS for lightweight, container-based NAS operations.",
        features: "Centralized file access over LAN\nWeb-based file manager and sharing tools\nBackup, permission management, and file versioning\nAdmin-friendly UI via Portainer\nLightweight performance using ZimaOS",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=NAS+System",
        tags: ["Docker", "ZimaOS", "Portainer", "HTTP" , "Composer" , "Linux"]
    },
    {
        type: 'project',
        kicker: "Wardrobe App",
        title: "Wardrobe",
        desc: "WARDROBE is an omni-channel fashion marketplace that focuses on curated selections of local and indie brands. The platform provides a seamless shopping experience both online and offline, empowering local fashion businesses by giving them digital exposure.",
        features: "Multi-brand product catalog\nStore locator & offline integration\nModern e-commerce UI/UX\nResponsive design for all devices\nSupport for curated brand onboarding",
        image: "https://placehold.co/1200x800/000000/FFFFFF?text=NAS+System",
        tags: ["ReactJS", "Node.JS", "MongoDB", "Midtrans" , "AWS"]
    }
];

export default contentData;