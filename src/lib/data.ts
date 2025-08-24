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
  id: string;
  title: string;
  description?: string;
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
            tasks: [
              { id: 't1_1', content: 'Create freelance profiles: Workana, Upwork, Freelancer (focus on security code review)', priority: 'high' },
              { id: 't1_2', content: 'Optimize LinkedIn: Add "Security-focused Developer" in headline', priority: 'high' },
              { id: 't1_3', content: 'Apply to 10 projects: API security testing, code review, vulnerability assessment', priority: 'medium' },
              { id: 't1_4', content: 'Setup Hack The Box: Configure VPN, Kali VM, take notes on the first lab', priority: 'medium' },
              { id: 't1_5', content: 'Technical English: 1 hour daily watching NetworkChuck videos (cybersecurity + English)', priority: 'low' },
            ],
          },
          {
            id: 'week2',
            title: 'Week 2: First Projects and HTB Basics',
            tasks: [
                { id: 't2_1', content: 'Complete first freelance project: Deliver with quality, ask for a testimonial', priority: 'high' },
                { id: 't2_2', content: 'HTB Academy: Complete "Introduction to Networking" (free)', priority: 'high' },
                { id: 't2_3', content: 'First write-up: Solve "Legacy" machine (Windows easy) and document', priority: 'medium' },
                { id: 't2_4', content: 'GitHub Security: Create "security-learning" repo with your scripts and notes', priority: 'medium' },
                { id: 't2_5', content: 'English: Participate in HTB forums in English, make 3 technical comments', priority: 'low' },
            ]
          },
          {
            id: 'week3',
            title: 'Week 3: Scaling Freelance + Web Security',
            tasks: [
                { id: 't3_1', content: 'Freelance goal: $500 USD this month - apply to 15 more projects', priority: 'high' },
                { id: 't3_2', content: 'HTB Academy: "Web Attacks" module - leverage your web experience', priority: 'high' },
                { id: 't3_3', content: 'OWASP Top 10: Study and create practical examples with your projects', priority: 'medium' },
                { id: 't3_4', content: 'Write-up #2: "Blue" machine (Windows SMB vulnerability)', priority: 'medium' },
                { id: 't3_5', content: 'Networking: Connect with 10 Colombian security professionals on LinkedIn', priority: 'low' },
            ]
          },
          {
            id: 'week4',
            title: 'Week 4: Consolidation and Specialization',
            tasks: [
                { id: 't4_1', content: 'Financial review: Goal $500-800 USD reached, plan for month 2', priority: 'high' },
                { id: 't4_2', content: 'HTB machines: Complete 5 easy machines, 2 write-ups published', priority: 'high' },
                { id: 't4_3', content: 'Specialization: Decide between AppSec, Pentesting, or SOC Analyst', priority: 'medium' },
                { id: 't4_4', content: 'Portfolio update: Add cybersecurity section to your GitHub Pages', priority: 'medium' },
                { id: 't4_5', content: 'Content creation: First Medium article "Developer to Cybersecurity transition"', priority: 'low' },
            ]
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
            description: 'Deep dive into web vulnerabilities, leveraging your development background for a strong AppSec foundation.',
            resources: [
                { title: 'Immersive English', icon: 'Languages', items: ['Watch all HTB machines with English audio', 'Follow IppSec on YouTube (HTB walkthroughs)', 'Read tool documentation in English', 'Participate in HTB Discord (#general channel)'] },
                { title: 'Web Security Focus', icon: 'Swords', items: ['HTB Academy: "SQL Injection Fundamentals"', 'HTB Academy: "Cross-Site Scripting (XSS)"', 'HTB Academy: "File Upload Attacks"', 'Complete 8-10 web-focused machines'] },
            ],
            tasks: [
                { id: 't5_1', content: 'Freelance scale: Target $1000 USD - specialize in security code review', priority: 'high' },
                { id: 't5_2', content: 'HTB streak: 1 new machine every 2 days, total 15 machines', priority: 'high' },
                { id: 't5_3', content: 'Monthly write-ups: 4 detailed write-ups published on Medium', priority: 'medium' },
                { id: 't5_4', content: 'Burp Suite Pro: Master scanner, repeater, intruder for web audits', priority: 'medium' },
                { id: 't5_5', content: 'Community: Help 5 people on HTB Discord, build reputation', priority: 'low' },
            ],
          },
          {
            id: 'month3',
            title: 'Month 3: Network Security & Pentesting (Weeks 9-12)',
            tasks: [
                { id: 't6_1', content: 'HTB Academy: "Pentesting Fundamentals" + "Network Enumeration with Nmap"', priority: 'high' },
                { id: 't6_2', content: 'Active Directory: Complete 3 AD-focused machines (Forest, Sauna, Blackfield)', priority: 'high' },
                { id: 't6_3', content: 'Metasploit mastery: Complete HTB Academy module "Using Metasploit"', priority: 'medium' },
                { id: 't6_4', content: 'Freelance evolution: Offer basic "penetration testing" services', priority: 'medium' },
                { id: 't6_5', content: 'Certification prep: Start preparation for eJPT (eLearnSecurity Junior Penetration Tester)', priority: 'low' },
            ]
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
                tasks: [
                    { id: 't7_1', content: 'Blue Team skills: HTB Academy "Incident Handling Process"', priority: 'high' },
                    { id: 't7_2', content: 'SIEM basics: Set up ELK Stack at home, ingest logs from HTB machines', priority: 'high' },
                    { id: 't7_3', content: 'Portfolio website: Create professional page showing write-ups and projects', priority: 'medium' },
                    { id: 't7_4', content: 'Conference prep: Apply as a speaker for DragonJAR with a talk on "Developer to Security"', priority: 'medium' },
                    { id: 't7_5', content: 'Premium freelance: Target $1500 USD offering basic incident response', priority: 'low' },
                ]
            },
            {
                id: 'month5',
                title: 'Month 5: Cloud Security & Modern Threats (Weeks 17-20)',
                tasks: [
                    { id: 't8_1', content: 'AWS Security: Complete "Introduction to Cloud Computing" module in HTB Academy', priority: 'high' },
                    { id: 't8_2', content: 'Container Security: Learn Docker security, Kubernetes basics', priority: 'high' },
                    { id: 't8_3', content: 'Advanced HTB: Complete 5 medium difficulty machines', priority: 'medium' },
                    { id: 't8_4', content: 'Industry networking: Attend 8.8 conference (Chile) virtually', priority: 'medium' },
                    { id: 't8_5', content: 'Certification: Take the eJPT or Security+ exam', priority: 'low' },
                ]
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
                tasks: [
                    { id: 't9_1', content: 'Resume optimization: CV focused on cybersecurity with metrics and achievements', priority: 'high' },
                    { id: 't9_2', content: 'Job applications: 50 applications to SOC Analyst, Jr. Pentester, AppSec Engineer', priority: 'high' },
                    { id: 't9_3', content: 'Interview prep: Practice technical interviews, explain write-ups', priority: 'medium' },
                    { id: 't9_4', content: 'Salary negotiation: Research cybersecurity salaries in Colombia, prepare arguments', priority: 'medium' },
                    { id: 't9_5', content: 'Backup plan: Maintain freelance as secondary income ($500-1000/month)', priority: 'low' },
                ]
            }
        ]
      }
    ],
  },
  englishPlanContent,
  writeupGuideContent,
  writeupImproverGuide,
];
    