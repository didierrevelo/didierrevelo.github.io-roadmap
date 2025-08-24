import type { LucideIcon } from 'lucide-react';

export interface Task {
  id: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ResourceCardData {
  title: string;
  icon: string;
  items: string[];
}

export interface Week {
  id:string;
  title: string;
  description?: string;
  quizTopic?: string;
  tasks: Task[];
  resources?: ResourceCardData[];
}

export interface Phase {
  id: string;
  title: string;
  weeks: Week[];
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  gradient: string;
  structure?: string;
  tips?: string[];
  resources?: ResourceCardData[];
}

export type Section = Guide | {
  id: string;
  title: string;
  gradient: string;
  phases: Phase[];
};

const englishPlanContent: Guide = {
  id: 'english-plan',
  title: '🇬🇧 Plan de Inglés: De Cero a Bilingüe Técnico en 6 Meses',
  gradient: 'bg-gradient-to-br from-blue-500 to-sky-600',
  description: 'Este plan está diseñado para la inmersión total y la fluidez conversacional, enfocado en el contexto de ciberseguridad. Olvídate de apps, enfócate en la práctica real.',
  resources: [
    {
      title: 'Listening & Comprensión Activa',
      icon: 'Headphones',
      items: [
        'Podcasts: Darknet Diaries, Security Now, Risky Business.',
        'Canales de YouTube: NetworkChuck, The Cyber Mentor, IppSec, John Hammond (verlos sin subtítulos).',
        'Series y Películas: Mr. Robot, Black Mirror, WarGames (en inglés con subtítulos en inglés).',
        'Técnica: Escucha un podcast por 10 minutos, luego intenta resumir en voz alta lo que entendiste.',
      ],
    },
    {
      title: 'Speaking & Fluidez Práctica',
      icon: 'Mic',
      items: [
        'Shadowing: Escoge un video de 5 min de NetworkChuck. Repite en voz alta todo lo que dice, imitando su entonación y velocidad.',
        'Think in English: Narra tus acciones diarias en tu mente, en inglés. "Now I\'m opening my Kali VM to start the new lab".',
        'Plataformas de Conversación: Usa Cambly o italki para hablar con nativos. Enfócate en temas técnicos.',
        'Comunidades: Participa activamente en los canales de voz de Discord de HTB o TryHackMe.',
      ],
    },
    {
      title: 'Reading & Vocabulario Técnico',
      icon: 'BookOpen',
      items: [
        'Documentación: Lee la documentación oficial de herramientas como Nmap, Metasploit, Burp Suite.',
        'Artículos: Sigue blogs como Krebs on Security, The Hacker News, y Bleeping Computer.',
        'Libros: "The Cuckoo\'s Egg", "Ghost in the Wires", "Sandworm" (lectura recreativa pero útil).',
        'Técnica: Crea tu propio diccionario de términos técnicos en Notion o Anki con definiciones y ejemplos.',
      ],
    },
     {
      title: 'Herramientas de Apoyo',
      icon: 'Settings',
      items: [
        'Diccionario: WordReference para contexto y sinónimos.',
        'Gramática: Grammarly (versión gratuita) para corregir tus write-ups y correos.',
        'Pronunciación: YouGlish, busca una palabra y te muestra videos de YouTube donde se pronuncia.',
        'Traductor: DeepL para frases complejas, pero úsalo con moderación. El objetivo es pensar en inglés.',
      ],
    },
  ],
};


const writeupGuideContent: Guide = {
    id: 'writeup-guide',
    title: '📝 Guía Completa: Cómo Hacer Write-ups Profesionales',
    gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    description: 'Los write-ups son tu carta de presentación en ciberseguridad. Te enseño la estructura exacta que usan los profesionales:',
    structure: `
  # [Nombre de la Máquina/CTF] - Write-up
  
  ## 📋 Información General
  - **Plataforma**: Hack The Box / TryHackMe
  - **Dificultad**: Easy/Medium/Hard
  - **OS**: Linux/Windows
  - **Fecha**: DD/MM/YYYY
  - **Tiempo empleado**: X horas
  
  ## 🎯 Resumen Ejecutivo
  Breve descripción de la máquina y vector de ataque principal (2-3 líneas)
  
  ## 🔍 Reconocimiento (Reconnaissance)
  
  ### Nmap Scan
  \`\`\`bash
  nmap -sC -sV -oA initial 10.10.10.X
  \`\`\`
  ### Puertos Abiertos
  - Puerto 22: SSH
  - Puerto 80: HTTP Apache 2.4.41
  - Puerto 443: HTTPS
  
  ## 🕷️ Enumeración (Enumeration)
  
  ### Web Enumeration
  \`\`\`bash
  gobuster dir -u http://10.10.10.X -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
  \`\`\`
  
  ### Findings
  - /admin: Panel de administración
  - /backup: Archivos de respaldo
  - /uploads: Directorio de uploads
  
  ## 🎯 Explotación (Exploitation)
  
  ### Initial Foothold
  Descripción detallada del vector de entrada:
  
  1. **Vulnerabilidad encontrada**: CVE-XXXX-XXXX
  2. **Exploit utilizado**: 
  \`\`\`bash
  searchsploit apache 2.4.41
  \`\`\`
  
  3. **Payload**:
  \`\`\`bash
  curl -X POST "http://target/upload.php" -F "file=@shell.php"
  \`\`\`
  
  ### Privilege Escalation
  \`\`\`bash
  # Enumeración de privilegios
  sudo -l
  find / -perm -u=s -type f 2>/dev/null
  \`\`\`
  
  ## 🏁 Post-Explotación
  
  ### Flags Obtenidas
  - **User flag**: \`user_flag_here\`
  - **Root flag**: \`root_flag_here\`
  
  ### Persistencia (si aplica)
  \`\`\`bash
  # Crear backdoor
  echo "attacker_key" >> /root/.ssh/authorized_keys
  \`\`\`
  
  ## 🔧 Herramientas Utilizadas
  - Nmap
  - Gobuster
  - Burp Suite
  - Metasploit
  - LinEnum
  
  ## 📚 Lecciones Aprendidas
  - Siempre enumerar uploads directories
  - Validar input sanitization
  - Revisar configuraciones por defecto
  
  ## 🛡️ Remediación
  1. Actualizar Apache a la última versión
  2. Implementar input validation
  3. Configurar WAF
  4. Principio de menor privilegio
  
  ## 📸 Screenshots
  [Incluir capturas clave del proceso]
  
  ## 🔗 Referencias
  - [CVE Database](https://cve.mitre.org/)
  - [OWASP Top 10](https://owasp.org/www-project-top-ten/)
  `,
  tips: [
    'Sé detallado pero conciso: Explica cada paso sin ser verboso',
    'Incluye código funcional: Todos los comandos deben ser ejecutables',
    'Screenshots selectivos: Solo las capturas más importantes',
    'Explica el "por qué": No solo el "cómo"',
    'Sección de remediación: Demuestra conocimiento defensivo',
    'Publica en Medium/GitHub: Construye tu marca personal',
  ]
};

const writeupImproverGuide: Guide = {
    id: 'writeup-improver',
    title: '🤖 AI-Powered Write-up Improver',
    gradient: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    description: 'Paste your write-up below and get AI-powered suggestions for improving completeness, clarity, and actionable insights for remediation.',
};

export const roadmapData: Section[] = [
  {
    id: 'roadmap',
    title: '🚀 Cybersecurity Roadmap 2025',
    gradient: 'bg-gradient-to-br from-violet-600 to-indigo-600',
    phases: [
      {
        id: 'phase1',
        title: 'Phase 1: Immediate Income (Weeks 1-4)',
        weeks: [
          {
            id: 'week1',
            title: 'Week 1: Setup and First Earnings',
            quizTopic: 'Freelancing, LinkedIn Optimization, and Hacking Lab Setup',
            description: 'Lay the groundwork for your freelance career and start your practical cybersecurity training.',
            tasks: [
              { id: 't1_1', content: 'Create compelling freelance profiles on Workana, Upwork, and Freelancer. Focus your bio on "Security Code Review" and "Secure Development Practices". Showcase your developer background as a strength.', priority: 'high' },
              { id: 't1_2', content: 'Optimize your LinkedIn profile. Change your headline to "Security-Focused Software Developer". Write a summary explaining your transition and skills. Ask for recommendations from past colleagues.', priority: 'high' },
              { id: 't1_3', content: 'Actively apply to 10 projects. Search for keywords like "API security testing," "code review," "vulnerability assessment," and "WordPress security." Tailor each proposal.', priority: 'medium' },
              { id: 't1_4', content: 'Set up your hacking lab: Install Kali Linux in a VM (VirtualBox/VMware). Configure the Hack The Box VPN. Complete the starting point lab to ensure connectivity.', priority: 'medium' },
              { id: 't1_5', content: 'Begin your technical English immersion. Watch one NetworkChuck video daily. Take notes on new vocabulary related to cybersecurity.', priority: 'low' },
            ],
            resources: [
              {
                title: 'Foundational Knowledge',
                icon: 'BookOpen',
                items: [
                  'Book: "The Millionaire Fastlane" (for business mindset)',
                  'Article: "How to Start a Freelance Business" (HubSpot)',
                  'Tool: Notion for organizing applications and notes.',
                ],
              },
            ],
          },
          {
            id: 'week2',
            title: 'Week 2: First Projects and HTB Basics',
            quizTopic: 'Hack The Box Methodology, Networking Fundamentals, and Nmap',
            description: 'Gain practical experience with your first paid project and begin your journey on Hack The Box.',
            tasks: [
                { id: 't2_1', content: 'Land and complete your first freelance project. Over-deliver on quality and communication. Upon completion, politely ask for a positive review or testimonial.', priority: 'high' },
                { id: 't2_2', content: 'Complete the "Introduction to Networking" module on HTB Academy. This is a crucial free resource to solidify your fundamentals.', priority: 'high' },
                { id: 't2_3', content: 'Solve the "Legacy" machine (Windows, Easy). Document every step of your process: reconnaissance, enumeration, exploitation, and privilege escalation. This will be your first write-up.', priority: 'medium' },
                { id: 't2_4', content: 'Create a dedicated "security-learning" repository on GitHub. Push your notes, custom scripts, and link to your write-ups. This will become part of your portfolio.', priority: 'medium' },
                { id: 't2_5', content: 'Engage with the community. Go to the HTB forums or Discord and make 3 meaningful comments in English on other people\'s questions or solutions.', priority: 'low' },
            ],
             resources: [
              {
                title: 'Core Skills',
                icon: 'Swords',
                items: [
                  'Guide: "Nmap Cheat Sheet" (StationX)',
                  'Video: "How to Get Your First Box on Hack The Box" (IppSec)',
                  'Tool: Obsidian.md to create your "Second Brain" for notes.',
                ],
              },
            ],
          },
          {
            id: 'week3',
            title: 'Week 3: Scaling Freelance + Web Security',
            quizTopic: 'OWASP Top 10, Burp Suite Basics, and Web Enumeration',
            description: 'Increase your freelance income while diving into web application security, a natural fit for your developer skills.',
            tasks: [
                { id: 't3_1', content: 'Set a freelance income goal of $500 USD for the month. Apply to 15 more projects, refining your proposals based on what you\'ve learned.', priority: 'high' },
                { id: 't3_2', content: 'Deep dive into the "Web Attacks" module in HTB Academy. Your developer experience is a major advantage here. Take detailed notes.', priority: 'high' },
                { id: 't3_3', content: 'Study the OWASP Top 10 vulnerabilities. For each one, try to find a code example in your past projects or create a small, vulnerable app to understand it practically.', priority: 'medium' },
                { id: 't3_4', content: 'Publish your second write-up for the "Blue" machine (a classic Windows SMB vulnerability). Compare your methodology with other public write-ups.', priority: 'medium' },
                { id: 't3_5', content: 'Network strategically. Find and connect with 10 cybersecurity professionals from Colombia on LinkedIn. Send a personalized connection request.', priority: 'low' },
            ],
            resources: [
              {
                title: 'Web Security Essentials',
                icon: 'BookOpen',
                items: [
                  'Reference: "OWASP Top 10" (Official Site)',
                  'Book: "The Web Application Hacker\'s Handbook" (A must-read)',
                  'Tool: "Burp Suite Community Edition". Install and configure it.',
                ],
              },
            ],
          },
          {
            id: 'week4',
            title: 'Week 4: Consolidation and Specialization',
            quizTopic: 'Career Specializations, Portfolio Building, and Personal Branding',
            description: 'Review your progress, solidify your knowledge, and start thinking about your long-term career path.',
            tasks: [
                { id: 't4_1', content: 'Review your finances. Did you hit your $500-800 USD goal? Analyze what worked and create a plan to increase your rates or efficiency for Month 2.', priority: 'high' },
                { id: 't4_2', content: 'Consolidate your HTB progress. Ensure you have completed at least 5 easy machines and have 2 high-quality write-ups published on Medium or your GitHub blog.', priority: 'high' },
                { id: 't4_3', content: 'Research career specializations. Read about the day-to-day work of an AppSec Engineer, Pentester, and SOC Analyst. Decide on a primary focus area.', priority: 'medium' },
                { id: 't4_4', content: 'Build your portfolio. Create a simple portfolio page using GitHub Pages. Link your LinkedIn, GitHub, and your write-ups.', priority: 'medium' },
                { id: 't4_5', content: 'Start building your personal brand. Write your first article on Medium about your journey, titled something like "From Developer to Cybersecurity: My First 30 Days".', priority: 'low' },
            ],
            resources: [
              {
                title: 'Building Your Brand',
                icon: 'Trophy',
                items: [
                  'Platform: Medium for publishing your write-ups.',
                  'Guide: "How to Build a Personal Brand" (Neil Patel)',
                  'Inspiration: Daniel Miessler\'s blog for content ideas.',
                ],
              },
            ],
          }
        ],
      },
      {
        id: 'phase2',
        title: 'Phase 2: Building Skills (Weeks 5-12)',
        weeks: [
          {
            id: 'month2',
            title: 'Month 2: Web Application Security (Weeks 5-8)',
            quizTopic: 'Advanced Web Attacks, PortSwigger Academy, SQL Injection, and XSS',
            description: 'Deep dive into web vulnerabilities, leveraging your development background for a strong AppSec foundation.',
            tasks: [
                { id: 't5_1', content: 'Scale your freelance work. Target $1000 USD this month by specializing in "security code review" and "API pentesting" services.', priority: 'high' },
                { id: 't5_2', content: 'Maintain a consistent HTB streak. Solve 1 new machine every 2 days. Aim for a total of 15 machines solved by the end of the month.', priority: 'high' },
                { id: 't5_3', content: 'Publish 4 detailed write-ups this month (1 per week). Focus on web-based machines to build your AppSec portfolio.', priority: 'medium' },
                { id: 't5_4', content: 'Master Burp Suite Pro. Go through the PortSwigger Web Security Academy labs on Scanner, Repeater, and Intruder. This is a key professional skill.', priority: 'medium' },
                { id: 't5_5', content: 'Build your reputation. Actively help 5 people on the HTB Discord/forums with their questions. Become a known, helpful member of the community.', priority: 'low' },
            ],
             resources: [
                { title: 'Web Pentesting Arsenal', icon: 'Swords', items: ['Academy: PortSwigger Web Security Academy (Free and essential)', 'Book: "Real-World Bug Hunting: A Field Guide to Web Hacking"', 'Tool: "OWASP ZAP" (Open-source alternative to Burp Suite)'] },
                { title: 'Deeper Learning', icon: 'BookOpen', items: ['HTB Academy: "SQL Injection Fundamentals"', 'HTB Academy: "Cross-Site Scripting (XSS)"', 'HTB Academy: "File Upload Attacks"', 'Complete 8-10 web-focused machines on HTB'] },
            ],
          },
          {
            id: 'month3',
            title: 'Month 3: Network Security & Pentesting (Weeks 9-12)',
            quizTopic: 'Active Directory Pentesting, Metasploit Framework, and eJPT Preparation',
            description: 'Expand from web to network-level attacks, including the critical area of Active Directory.',
            tasks: [
                { id: 't6_1', content: 'Complete the "Pentesting Fundamentals" and "Network Enumeration with Nmap" modules on HTB Academy.', priority: 'high' },
                { id: 't6_2', content: 'Tackle Active Directory. Complete 3 AD-focused machines on HTB. Suggested path: Forest, Sauna, Blackfield.', priority: 'high' },
                { id: 't6_3', content: 'Learn Metasploit Framework. Complete the HTB Academy module "Using Metasploit" and use it on at least two machines.', priority: 'medium' },
                { id: 't6_4', content: 'Evolve your freelance services. Start offering basic "external network penetration testing" for small businesses.', priority: 'medium' },
                { id: 't6_5', content: 'Start studying for the eJPT (eLearnSecurity Junior Penetration Tester) certification. Review the INE course material.', priority: 'low' },
            ],
            resources: [
              { title: 'Pentesting Core', icon: 'Swords', items: ['Book: "Penetration Testing: A Hands-On Introduction to Hacking"', 'Guide: "The Hacker Playbook 3"', 'Community: Offensive Security forums to learn from the best.'] },
              { title: 'Active Directory Attack', icon: 'Trophy', items: ['Resource: "IppSec.rocks" to search for techniques in IppSec videos.', 'Guide: "PayloadsAllTheThings - Active Directory" (GitHub)', 'Lab: Set up your own AD lab at home using VMWare.'] },
            ],
          }
        ],
      },
       {
        id: 'phase3',
        title: 'Phase 3: Portfolio & Networking (Weeks 13-20)',
        weeks: [
            {
                id: 'month4',
                title: 'Month 4: Incident Response & Blue Team (Weeks 13-16)',
                quizTopic: 'Incident Response Process, SIEM analysis with ELK Stack, and Defensive Mindset',
                description: 'Understand the defensive side of security to become a more effective attacker and well-rounded professional.',
                tasks: [
                    { id: 't7_1', content: 'Learn the fundamentals of defense. Complete the HTB Academy "Incident Handling Process" module.', priority: 'high' },
                    { id: 't7_2', content: 'Get hands-on with a SIEM. Set up a home ELK Stack (Elasticsearch, Logstash, Kibana) and ingest logs from your Kali and target VMs.', priority: 'high' },
                    { id: 't7_3', content: 'Build your professional website. Create a polished portfolio page showing your projects, skills, write-ups, and a contact form.', priority: 'medium' },
                    { id: 't7_4', content: 'Aim for public speaking. Prepare a talk proposal for the DragonJAR conference on "From Developer to Security Professional: A Practical Guide" and submit it.', priority: 'medium' },
                    { id: 't7_5', content: 'Increase your freelance value. Target $1500 USD by offering basic incident response services like log analysis or malware triage.', priority: 'low' },
                ],
                resources: [
                  { title: 'Blue Team Mindset', icon: 'BookOpen', items: ['Book: "The Cuckoo\'s Egg" (A true story of early DFIR)', 'Tool: "Splunk Free" or "ELK Stack" for log analysis.', 'Platform: "LetsDefend.io" to practice incident response.'] },
                ],
            },
            {
                id: 'month5',
                title: 'Month 5: Cloud Security & Modern Threats (Weeks 17-20)',
                quizTopic: 'AWS Cloud Security, Container Security with Docker & Kubernetes',
                description: 'Focus on high-demand, modern skills in cloud and container security.',
                tasks: [
                    { id: 't8_1', content: 'Learn AWS fundamentals. Complete the "Introduction to Cloud Computing" module in HTB Academy and the AWS Skills Builder "Cloud Essentials" learning path.', priority: 'high' },
                    { id: 't8_2', content: 'Understand container security. Learn Docker security best practices and the basics of Kubernetes architecture and its common misconfigurations.', priority: 'high' },
                    { id: 't8_3', content: 'Level up your hacking skills. Complete 5 medium-difficulty machines on Hack The Box, focusing on diverse attack vectors.', priority: 'medium' },
                    { id: 't8_4', content: 'Attend a conference. Virtually attend the 8.8 conference in Chile. Take notes and connect with speakers on social media.', priority: 'medium' },
                    { id: 't8_5', content: 'Get certified. Schedule and take the eJPT or CompTIA Security+ exam to validate your knowledge.', priority: 'low' },
                ],
                resources: [
                  { title: 'Cloud & Container Security', icon: 'Swords', items: ['Certification: "AWS Certified Cloud Practitioner" (a good start)', 'Game: "Flaws.cloud" and "Flaws2.cloud" to learn common AWS mistakes.', 'Guide: "OWASP Kubernetes Top Ten".'] },
                ],
            }
        ]
      },
      {
        id: 'phase4',
        title: 'Phase 4: Job Hunting & Career Launch (Weeks 21-24)',
        weeks: [
            {
                id: 'month6',
                title: 'Month 6: Full-Time Security Professional (Weeks 21-24)',
                quizTopic: 'Resume Optimization, Interview Skills, and Salary Negotiation',
                description: 'Transition from freelancing and studying to landing your first full-time role in cybersecurity.',
                tasks: [
                    { id: 't9_1', content: 'Optimize your resume. Tailor your CV for cybersecurity roles. Use the STAR method (Situation, Task, Action, Result) to describe your freelance projects and HTB experience.', priority: 'high' },
                    { id: 't9_2', content: 'Begin aggressive job applications. Apply to 50 roles for SOC Analyst, Jr. Pentester, and AppSec Engineer. Track applications in a spreadsheet.', priority: 'high' },
                    { id: 't9_3', content: 'Prepare for interviews. Practice explaining your top 3 write-ups in detail. Prepare answers for common behavioral questions. Do mock technical interviews.', priority: 'medium' },
                    { id: 't9_4', content: 'Prepare for salary negotiation. Research cybersecurity salaries in Colombia (Bogotá, Medellín). Have a target number and a walk-away number ready. Prepare arguments based on your skills and experience.', priority: 'medium' },
                    { id: 't9_5', content: 'Maintain a safety net. Continue part-time freelancing ($500-1000/month) until you have signed a full-time contract.', priority: 'low' },
                ],
                resources: [
                  { title: 'Career Launch Kit', icon: 'Trophy', items: ['Salary Guide: "Robert Half Technology Salary Guide"', 'Platform: "Hired" or "Wellfound" for companies to apply to you.', 'Book: "Cracking the Coding Interview" (many concepts apply to security interviews).'] },
                ],
            }
        ]
      }
    ],
  },
  englishPlanContent,
  writeupGuideContent,
  writeupImproverGuide,
];
