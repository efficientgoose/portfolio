export const availableCommands = [
  { cmd: "help", desc: "Show all available commands" },
  { cmd: "about", desc: "Learn about me" },
  { cmd: "skills", desc: "View my tech stack" },
  { cmd: "experience", desc: "See my work history" },
  { cmd: "projects", desc: "See my work" },
  { cmd: "resume", desc: "View my resume" },
  { cmd: "contact", desc: "Get in touch" },
  { cmd: "coffee", desc: "Brew some coffee" },
  { cmd: "whoami", desc: "Identity information" },
  { cmd: "sudo", desc: "Try sudo access" },
  { cmd: "clear", desc: "Clear terminal" },
  { cmd: "ls", desc: "List files" },
  { cmd: "ping", desc: "Check connection" },
  { cmd: "exit", desc: "Close terminal" },
];

export const commandResponses = {
  help: "Available commands: about | skills | experience | projects | resume | contact | coffee | whoami | sudo | clear | ls | ping | exit\n\nTip: Type / to see command menu with descriptions",
  about:
    "Backend Developer | Spring Boot Microservices Architect\nSpecializing in distributed systems and real-time data processing.",
  skills:
    "Expert: Java, Spring Boot, Docker, Microservices, REST APIs, Git\nAdvanced: Kafka, Spark, Cassandra, Kubernetes, Linux, CI/CD, AWS, PostgreSQL, JUnit\nIntermediate: ScyllaDB, MySQL, Maven, React, Redis, MongoDB, GraphQL, Jenkins, Gradle, Elasticsearch, RabbitMQ",
  experience:
    "Currently: Backend Developer at Tech Corp\nPreviously: Software Engineer at StartupXYZ (2021-2023)\nBuilding distributed systems since 2020",
  projects:
    "Status: Building next-gen distributed systems\nComing soon: Real-time data pipelines with Kafka & Spark",
  resume:
    "Opening resume...\n> Resume: /resume.pdf\n> Status: Available for download\nVisit: https://yourportfolio.com/resume.pdf",
  contact:
    "ajinkode@gmail.com | github.com/efficientgoose | linkedin.com/in/ajinkode",
  coffee:
    "> Initializing coffee.service...\n> [OK] Caffeine levels: OPTIMAL\n> [OK] Code quality: +47%",
  whoami:
    "ajinkya@backend ~ Backend Developer\nLocation: /home/distributed-systems\nStatus: Compiling reality",
  sudo: "Permission denied. Nice try though.",
  "sudo rm -rf /": "Access denied. Security protocols engaged.",
  clear: "CLEAR_TERMINAL",
  ls: "projects/ skills.json config/ docker-compose.yml kafka-streams/ README.md",
  ping: "PING 8.8.8.8: 12ms | Connection: STABLE",
  exit: "EXIT_TERMINAL",
};
