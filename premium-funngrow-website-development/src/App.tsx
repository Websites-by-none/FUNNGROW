import GlassCube from "./components/GlassCube";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Package,
  Share2,
  ShieldCheck,
  Smartphone,
  X,
  type LucideIcon,
} from "lucide-react";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.wishbanc.funngro";
const APP_STORE_URL = "https://apps.apple.com/in/app/funngro/id1579361075";
const OFFICIAL_FAQ_URL = "https://www.funngro.com/faq";
const OFFICIAL_TRUST_URL = "https://www.funngro.com/trust";
const OFFICIAL_BRANDS_URL = "https://www.funngro.com/for-brands";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "For Teenlancers", href: "#experience" },
  { label: "For Companies", href: "#companies" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#why-funngro" },
  { label: "Contact", href: "#contact" },
];

const officialBrandExamples = [
  { name: "ICICI", category: "BFSI" },
  { name: "Novio", category: "D2C" },
  { name: "Paytm", category: "FINTECH" },
  { name: "Toluna", category: "RESEARCH" },
  { name: "CarDekho", category: "MOBILITY" },
  { name: "Lifelong", category: "D2C" },
  { name: "Kotak", category: "BFSI" },
  { name: "LXME", category: "FINTECH" },
  { name: "Nielsen", category: "RESEARCH" },
  { name: "Mpokket", category: "FINTECH" },
];

const opportunities: Array<{
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  examples: string[];
  icon: LucideIcon;
  tone: string;
}> = [
  {
    id: "promotion",
    number: "01",
    title: "Brand promotion",
    eyebrow: "SPREAD THE WORD",
    description:
      "Help a brand show up in the places young people already pay attention to. Each brief explains the action and what to submit.",
    examples: ["Social posts", "Product discovery", "Peer recommendations"],
    icon: Megaphone,
    tone: "#D9F7A0",
  },
  {
    id: "content",
    number: "02",
    title: "Content creation",
    eyebrow: "MAKE SOMETHING",
    description:
      "Create reels, photos, reviews, posts or other user-generated content for real brand briefs. Your point of view is the point.",
    examples: ["Short-form video", "Photos and reviews", "Creator briefs"],
    icon: Camera,
    tone: "#D4F0E5",
  },
  {
    id: "referrals",
    number: "03",
    title: "Referrals",
    eyebrow: "GROW TOGETHER",
    description:
      "Share eligible projects with your network. When a campaign includes referrals, the rules explain what counts as a completed action.",
    examples: ["Share a project", "Invite your network", "Verified actions"],
    icon: Share2,
    tone: "#DCE8FF",
  },
  {
    id: "surveys",
    number: "04",
    title: "Surveys and feedback",
    eyebrow: "TELL BRANDS WHAT YOU THINK",
    description:
      "Answer surveys and share useful feedback that helps companies understand the people they are building for.",
    examples: ["Brand surveys", "Product feedback", "Research tasks"],
    icon: ClipboardList,
    tone: "#F8E9BD",
  },
  {
    id: "sampling",
    number: "05",
    title: "Product sampling",
    eyebrow: "TRY IT. REVIEW IT.",
    description:
      "Some campaigns invite Teenlancers to try a real product and share structured feedback. Availability and terms vary by project.",
    examples: ["Product trials", "First impressions", "Structured feedback"],
    icon: Package,
    tone: "#F7DFD5",
  },
  {
    id: "testing",
    number: "06",
    title: "App testing and micro-projects",
    eyebrow: "NOTICE THE DETAILS",
    description:
      "Explore small tasks, app tests and usability briefs. Share what worked, what felt confusing and what could be better.",
    examples: ["App testing", "Usability feedback", "Quick project tasks"],
    icon: Smartphone,
    tone: "#DAE9E9",
  },
];

const brandServices = [
  { number: "01", title: "Find the right cohort", detail: "Plan around the audience, city and age group a campaign is meant to reach." },
  { number: "02", title: "Choose the right format", detail: "Run promotion, sampling, creator, referral, survey or testing projects." },
  { number: "03", title: "Learn from real action", detail: "Give Teenlancers a clear brief and review submitted work against the campaign." },
];

const faqItems = [
  {
    question: "Who can join FUNNGROW?",
    answer:
      "The official FAQ says young Indians between 14 and 25 can join. Sign-up uses OTP verification and takes about two minutes. If you are under 18, review the current terms and privacy guidance with a parent or guardian.",
  },
  {
    question: "What kinds of projects are available?",
    answer:
      "Project types include brand promotion, referrals, product sampling, surveys, app testing, ideation and content creation such as reviews, photos or video. The mix changes, and each campaign has its own eligibility and instructions.",
  },
  {
    question: "How do payments work?",
    answer:
      "After your submitted work is reviewed and approved, earnings are added to your FUNNGROW wallet. The platform lists UPI and bank transfer as payout options. Review the individual project for its verification and payout details.",
  },
  {
    question: "Is there a joining fee?",
    answer:
      "No. FUNNGROW's official site says there is no registration or joining fee. You should never pay a security deposit or a fee to access a campaign.",
  },
  {
    question: "How do I get started?",
    answer:
      "Download the app, sign up with OTP, browse campaigns that fit you, and read the full brief before starting. Complete the work as instructed, submit the requested proof, and wait for review.",
  },
  {
    question: "Is FUNNGROW safe?",
    answer:
      "FUNNGROW describes OTP account verification, brand identity checks and a review of campaign briefs before they go live. For a concern, contact the safety team at teenlancer@funngro.com and read the current Trust & Safety information.",
  },
];

// These are screenshots served by FUNNGROW's official website, not recreated app UI.
const appScreens = [
  {
    number: "01",
    label: "Discover",
    title: "Find the work that fits you.",
    description: "A look at the app home, with brand tasks and project categories in view.",
    image: "/images/screen-home-DvfQ0qPp.webp",
    alt: "Official FUNNGROW app home screen showing today's tasks and project categories",
  },
  {
    number: "02",
    label: "Progress",
    title: "See your growth path.",
    description: "The app explains how completing tasks can open different levels of work.",
    image: "/images/screen-journey-BJkQ-t9o.webp",
    alt: "Official FUNNGROW app screen showing starter, growth and pro task tiers",
  },
  {
    number: "03",
    label: "Take part",
    title: "Keep each brief clear.",
    description: "A daily task view shows project actions and completion progress.",
    image: "/images/screen-reward-xa-KPYrd.webp",
    alt: "Official FUNNGROW app screen showing daily tasks and completion progress",
  },
  {
    number: "04",
    label: "Level up",
    title: "Build a track record.",
    description: "The app's tier view makes its progression system easy to understand.",
    image: "/images/screen-tier-DYEG0bT7.webp",
    alt: "Official FUNNGROW app screen showing Bronze, Silver, Gold and Platinum tiers",
  },
  {
    number: "05",
    label: "Wallet",
    title: "Keep your work in view.",
    description: "The wallet screen shows balances, withdrawals and transaction history.",
    image: "/images/screen-wallet-CJr6gtJh.webp",
    alt: "Official FUNNGROW app wallet screen showing earnings and transactions",
  },
];

const growthStages = [
  { number: "01", title: "Start small", text: "Try simple surveys, practice tasks and short campaign briefs." },
  { number: "02", title: "Build skills", text: "Learn by doing: communication, research, content and follow-through." },
  { number: "03", title: "Grow your work", text: "A stronger track record can make you ready to apply for larger briefs." },
  { number: "04", title: "Take the lead", text: "Some Teenlancers go on to help peers or support campaign work." },
];

const benefits = [
  {
    number: "01",
    title: "Real briefs, from real brands",
    text: "Explore company projects with clear actions and campaign-specific requirements.",
  },
  {
    number: "02",
    title: "Practice that adds up",
    text: "Use projects to build confidence, communication and digital skills by doing.",
  },
  {
    number: "03",
    title: "Room to find your lane",
    text: "Discover flexible project types, from quick feedback tasks to creator work.",
  },
  {
    number: "04",
    title: "A next step when you are ready",
    text: "Quality work can help you take on more responsibility over time. Nothing is guaranteed; every campaign has its own criteria.",
  },
];

const trustSafeguards = [
  { number: "01", title: "Verified sign-up", text: "FUNNGROW says accounts are checked through OTP verification at sign-up." },
  { number: "02", title: "Campaign review", text: "Brand identity and campaign briefs are reviewed before a project goes live." },
  { number: "03", title: "A human support inbox", text: "For a task or safety concern, email teenlancer@funngro.com." },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/fun.n.gro", text: "IG" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/funngro/", text: "in" },
  { label: "YouTube", href: "https://www.youtube.com/@funngro_India", text: "YT" },
  { label: "X", href: "https://x.com/funngroofficial", text: "X" },
];

const pageLinkGroups = [
  {
    title: "Explore",
    links: [
      { label: "For Teenlancers", href: "#experience" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Inside the app", href: "#inside-the-app" },
      { label: "Frequently asked questions", href: "#faq" },
    ],
  },
  {
    title: "For companies",
    links: [
      { label: "Campaign formats", href: "#companies" },
      { label: "Work with FUNNGROW", href: "mailto:hello@funngro.com?subject=FUNNGROW%20campaign%20enquiry" },
      { label: "Official company page", href: OFFICIAL_BRANDS_URL, external: true },
      { label: "Trust & safety", href: OFFICIAL_TRUST_URL, external: true },
    ],
  },
];

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}


function BrandLockup({ hero = false }: { hero?: boolean }) {
  return (
    <a
      className={`brand-lockup${hero ? " brand-lockup--hero" : ""}`}
      href="#home"
      aria-label="FUNNGROW home"
    >
      <img
        src={`${import.meta.env.BASE_URL}images/funngro-icon.png`}
        width="42"
        height="42"
        alt=""
        aria-hidden="true"
      />
      <span>FUNNGROW</span>
    </a>
  );
}


function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav-shell">
        <BrandLockup />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
        </nav>
        <div className="nav-actions">
          <a className="nav-join" href={PLAY_STORE_URL} target="_blank" rel="noreferrer">
            <span>Get started</span><ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={reducedMotion ? false : { opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, height: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.26, ease: "easeOut" }}
          >
            {navLinks.map((link, index) => (
              <a href={link.href} key={link.href} onClick={closeMenu} style={{ transitionDelay: `${index * 25}ms` }}>
                <span className="mobile-nav-number">0{index + 1}</span>
                <span>{link.label}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ))}
            <a className="mobile-nav-join" href={PLAY_STORE_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>
              Join FUNNGROW <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  centered = false,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={`section-heading${centered ? " is-centered" : ""}${light ? " on-dark" : ""}`}>
      <p className="section-eyebrow"><span aria-hidden="true" />{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="section-lead">{text}</p>}
    </Reveal>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 86]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);
  const heroMotion = reducedMotion ? {} : { y: imageY, scale: imageScale };

  return (
    <section className="hero-section" id="home" ref={heroRef}>
      <motion.div className="hero-photo" style={heroMotion} aria-hidden="true">
        <img   
          src={`${import.meta.env.BASE_URL}images/creators.webp`} 
          alt=""   
          fetchPriority="high" 
          />
      </motion.div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
      <GlassCube />
      <div className="container hero-container">
        <motion.div
          className="hero-copy"
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}>
            <BrandLockup hero />
          </motion.div>
          <motion.h1 variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}>
            <span>Your talent.</span>
            <span>Your opportunity.</span>
            <em>Your growth.</em>
          </motion.h1>
          <motion.p className="hero-description" variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}>
            Connect with real brands, explore exciting projects, build practical skills and turn your creativity into real-world experience.
          </motion.p>
          <motion.div className="hero-actions" variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}>
            <a className="button button--lime" href="#experience">
              Explore opportunities <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="button button--outline-light" href="#companies">
              For companies <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

function OpportunitySection() {
  const [activeIndex, setActiveIndex] = useState(1);
  const reducedMotion = useReducedMotion();
  const activeOpportunity = opportunities[activeIndex];
  const ActiveIcon = activeOpportunity.icon;

  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <SectionHeading
          eyebrow="The FUNNGROW experience"
          title={<>Good work starts with <em>what you bring.</em></>}
          text="Pick a project that matches your interests, follow the brief and learn by doing. The right next step can look different for everyone."
        />
        <div className="experience-explorer">
          <div className="opportunity-list" aria-label="Explore project categories">
            {opportunities.map((opportunity, index) => (
              <button
                className={`opportunity-tab${activeIndex === index ? " is-active" : ""}`}
                key={opportunity.id}
                type="button"
                aria-pressed={activeIndex === index}
                onClick={() => setActiveIndex(index)}
              >
                <span className="opportunity-tab-number">{opportunity.number}</span>
                <span className="opportunity-tab-name">{opportunity.title}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div
            className="opportunity-detail"
            style={{ "--opportunity-tone": activeOpportunity.tone } as CSSProperties}
            aria-live="polite"
          >
            <span className="opportunity-graphic-ring" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="opportunity-detail-content"
                key={activeOpportunity.id}
                initial={reducedMotion ? false : { opacity: 0, y: 18, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -10, filter: "blur(3px)" }}
                transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
              >
                <div className="opportunity-icon-wrap"><ActiveIcon size={32} strokeWidth={1.7} aria-hidden="true" /></div>
                <p className="opportunity-detail-eyebrow">{activeOpportunity.eyebrow}</p>
                <h3>{activeOpportunity.title}</h3>
                <p className="opportunity-description">{activeOpportunity.description}</p>
                <ul className="opportunity-example-list">
                  {activeOpportunity.examples.map((example) => (
                    <li key={example}><Check size={15} aria-hidden="true" />{example}</li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
            <span className="opportunity-detail-number" aria-hidden="true">{activeOpportunity.number}</span>
          </div>
        </div>
        <p className="fine-print experience-note">Available work, eligibility and payment terms are set out in each campaign.</p>
      </div>
    </section>
  );
}

function BrandWallSection() {
  const renderBrand = (brand: (typeof officialBrandExamples)[number], index: number) => (
    <span className="brand-wordmark" key={`${brand.name}-${index}`}>
      <span className="brand-category">{brand.category}</span>
      <span className="brand-name">{brand.name}</span>
    </span>
  );

  return (
    <section className="brand-wall-section" aria-labelledby="brand-wall-title">
      <div className="container brand-wall-heading">
        <Reveal>
          <p className="section-eyebrow"><span aria-hidden="true" />Real brands, real opportunities</p>
          <h2 id="brand-wall-title">A world of brands.<br /><em>One first step.</em></h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="brand-wall-description">See the kinds of companies and campaigns Teenlancers can explore through the platform.</p>
        </Reveal>
      </div>

      <div className="brand-marquee" aria-hidden="true">
        <div className="brand-marquee-track">{[...officialBrandExamples, ...officialBrandExamples].map(renderBrand)}</div>
      </div>
      <div className="brand-marquee brand-marquee--reverse" aria-hidden="true">
        <div className="brand-marquee-track">{[...officialBrandExamples].reverse().concat([...officialBrandExamples].reverse()).map(renderBrand)}</div>
      </div>

      <div className="container brand-wall-foot">
        <p>Campaign names shown on FUNNGROW's official site. Availability varies by project.</p>
        <a href="https://www.funngro.com/" target="_blank" rel="noreferrer">
          View the official site <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
      <ul className="visually-hidden" aria-label="Campaign examples shown on the official FUNNGROW site">
        {officialBrandExamples.map((brand) => <li key={brand.name}>{brand.name}, {brand.category}</li>)}
      </ul>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Download and sign up.",
      text: "Get the FUNNGROW app and create your account with OTP verification. The official FAQ says sign-up takes about two minutes.",
    },
    {
      number: "02",
      title: "Find a campaign that fits.",
      text: "Explore available projects and choose one that suits your interests, eligibility and schedule. Read the whole brief first.",
    },
    {
      number: "03",
      title: "Do the work. Get it reviewed.",
      text: "Follow the campaign instructions, submit the requested proof and, once approved, receive eligible earnings through the app.",
    },
  ];

  return (
    <section className="section how-section" id="how-it-works">
      <div className="container">
        <SectionHeading
          eyebrow="How it works"
          title={<>Three steps from curious to <em>doing.</em></>}
          text="A clear brief, a real project and room to learn as you go."
        />
        <ol className="steps-list">
          {steps.map((step, index) => (
            <li className="step-item" key={step.number}>
              <Reveal delay={index * 0.12}>
                <span className="step-marker" aria-hidden="true"><span>{step.number}</span></span>
                <p className="step-kicker">STEP {step.number}</p>
                <h3>{step.title}</h3>
                <p className="step-copy">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="fine-print how-note">Campaign review and payout timing depend on the work and its terms.</p>
      </div>
    </section>
  );
}

function GrowthSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="section growth-section" id="growth">
      <div className="container">
        <SectionHeading
          eyebrow="The growth journey"
          title={<>Start with a task.<br /><em>See where it can lead.</em></>}
          text="Small projects can become a way to build skills, confidence and a body of work. Progress depends on your choices, quality and what is available."
          light
        />
        <div className="growth-map">
          <svg className="growth-curve" viewBox="0 0 1000 168" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d="M8 142 C124 142 205 124 332 112 C450 101 548 83 666 66 C782 50 883 39 992 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reducedMotion ? false : { pathLength: 0 }}
              whileInView={reducedMotion ? undefined : { pathLength: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
            {[8, 332, 666, 992].map((cx, index) => {
              const cy = [142, 112, 66, 14][index];
              return <circle key={cx} cx={cx} cy={cy} r="6" fill="#D6FF75" />;
            })}
          </svg>
          <div className="growth-stages">
            {growthStages.map((stage, index) => (
              <Reveal className="growth-stage" delay={index * 0.1} key={stage.number}>
                <p className="growth-stage-number">{stage.number} <span>/ 04</span></p>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <p className="fine-print growth-disclaimer">Higher-responsibility work may become available, but no project, earning or progression is guaranteed.</p>
      </div>
    </section>
  );
}

function AppShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const activeScreen = appScreens[activeIndex];

  return (
    <section className="section app-section" id="inside-the-app">
      <div className="container app-showcase-grid">
        <div className="app-showcase-copy">
          <SectionHeading
            eyebrow="Inside the app"
            title={<>The work. The progress.<br /><em>All in your hands.</em></>}
            text="Explore genuine FUNNGROW app screens, from finding tasks to seeing your growth and wallet."
          />
          <div className="app-screen-detail" aria-live="polite">
            <p className="app-screen-index">{activeScreen.number} <span>/ 05</span></p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeScreen.number}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <h3>{activeScreen.title}</h3>
                <p>{activeScreen.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="app-screen-tabs" role="group" aria-label="Choose a FUNNGROW app screen">
            {appScreens.map((screen, index) => (
              <button
                key={screen.number}
                type="button"
                aria-pressed={activeIndex === index}
                onClick={() => setActiveIndex(index)}
              >
                <span>{screen.number}</span><span>{screen.label}</span>
              </button>
            ))}
          </div>
          <div className="app-download-links">
            <a href={PLAY_STORE_URL} target="_blank" rel="noreferrer">Google Play <ArrowUpRight size={14} aria-hidden="true" /></a>
            <a href={APP_STORE_URL} target="_blank" rel="noreferrer">App Store <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
          <p className="fine-print app-source-note">Official app screens from FUNNGROW. Features may change as the app is updated.</p>
        </div>

        <div className="phone-stage">
          <div className="phone-orbit phone-orbit--outer" aria-hidden="true" />
          <div className="phone-orbit phone-orbit--inner" aria-hidden="true" />
          <motion.div className="phone-device" whileHover={reducedMotion ? undefined : { y: -7, rotate: 0.5 }} transition={{ duration: 0.32 }}>
            <div className="phone-screen" role="img" aria-label={activeScreen.alt}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeScreen.image}
                  src={`${import.meta.env.BASE_URL}${activeScreen.image.replace(/^\/+/, "")}`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  initial={reducedMotion ? false : { opacity: 0, scale: 1.025 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                />
              </AnimatePresence>
            </div>
            <div className="phone-hardware" aria-hidden="true"><span /></div>
          </motion.div>
          <p className="phone-caption">FUNNGROW APP <span>SCREEN {activeScreen.number}</span></p>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="section why-section" id="why-funngro">
      <div className="container why-grid">
        <div className="why-intro">
          <SectionHeading
            eyebrow="Why FUNNGROW"
            title={<>Experience that pays in <em>more than money.</em></>}
            text="The first project can be a first step toward confidence, capability and a better sense of what you want to do next."
          />
          <a className="text-link" href={OFFICIAL_FAQ_URL} target="_blank" rel="noreferrer">
            Read more on the official FAQ <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="benefit-list">
          {benefits.map((benefit, index) => (
            <Reveal className="benefit-row" delay={index * 0.08} key={benefit.number}>
              <span className="benefit-number">{benefit.number}</span>
              <div><h3>{benefit.title}</h3><p>{benefit.text}</p></div>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => String(Math.round(latest)));

  useEffect(() => {
    if (!isInView) return;
    if (reducedMotion) {
      count.set(value);
      return;
    }
    const animation = animate(count, value, { duration: 1.25, ease: "easeOut" });
    return () => animation.stop();
  }, [count, isInView, reducedMotion, value]);

  return (
    <span className="count-up" ref={ref}>
      <motion.span aria-hidden="true">{rounded}</motion.span>
      <span className="visually-hidden">{value}</span>{suffix}
    </span>
  );
}

function CompaniesSection() {
  return (
    <section className="section companies-section" id="companies">
      <div className="company-glow" aria-hidden="true" />
      <div className="container companies-grid">
        <div className="companies-copy">
          <Reveal>
            <p className="section-eyebrow"><span aria-hidden="true" />For companies</p>
            <h2>Meet the next generation <em>where they are.</em></h2>
            <p className="companies-lead">
              FUNNGROW helps companies connect with young audiences through real Teenlancers and campaigns built for action, feedback and creator-led work.
            </p>
            <div className="company-proof">
              <CountUp value={70} suffix=" lakh+" />
              <p>young Indians earning on the platform. FUNNGROW's official site also lists 5,000+ brands, 1,000+ live projects and 12+ work categories.</p>
            </div>
            <div className="company-cta-row">
              <a className="button button--lime" href="mailto:hello@funngro.com?subject=FUNNGROW%20campaign%20enquiry">
                Work with us <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a className="company-secondary-link" href={OFFICIAL_BRANDS_URL} target="_blank" rel="noreferrer">
                Explore for brands <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>

        <div className="company-services">
          <p className="company-services-label">A campaign can start with...</p>
          {brandServices.map((service, index) => (
            <Reveal className="company-service-row" key={service.number} delay={index * 0.1}>
              <span>{service.number}</span>
              <div><h3>{service.title}</h3><p>{service.detail}</p></div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Reveal>
          ))}
          <p className="company-service-footnote">Brand identity and campaign briefs are reviewed before projects go live.</p>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="section trust-section" id="trust">
      <div className="container trust-grid">
        <div className="trust-intro">
          <Reveal>
            <div className="trust-icon" aria-hidden="true"><ShieldCheck size={31} strokeWidth={1.5} /></div>
            <p className="section-eyebrow"><span aria-hidden="true" />Trust and safety</p>
            <h2>Good opportunities need <em>good guardrails.</em></h2>
            <p className="trust-lead">FUNNGROW describes account verification, reviewed campaigns and a real support channel. Take a moment to read every project brief before you begin.</p>
            <a className="text-link" href={OFFICIAL_TRUST_URL} target="_blank" rel="noreferrer">
              Read the official Trust & Safety page <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
        <div className="trust-list">
          {trustSafeguards.map((item, index) => (
            <Reveal className="trust-row" key={item.number} delay={index * 0.08}>
              <span className="trust-row-number">{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
              <Check size={18} aria-hidden="true" />
            </Reveal>
          ))}
          <div className="parent-note">
            <p>Under 18?</p>
            <span>FUNNGROW's privacy guidance says a parent or guardian should review a minor's account use and the data they share.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reducedMotion = useReducedMotion();

  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-grid">
        <div className="faq-intro">
          <SectionHeading
            eyebrow="Questions, answered"
            title={<>Good to know <em>before you start.</em></>}
            text="A few of the things young people and parents ask most."
          />
          <a className="text-link" href={OFFICIAL_FAQ_URL} target="_blank" rel="noreferrer">
            Visit the official FAQ <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;
            return (
              <div className={`faq-item${isOpen ? " is-open" : ""}`} key={item.question}>
                <button
                  className="faq-question"
                  id={`faq-question-${index}`}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="faq-question-number">0{index + 1}</span>
                  <span>{item.question}</span>
                  <ChevronDown size={19} aria-hidden="true" />
                </button>
                <div id={answerId} className="faq-answer-slot" aria-hidden={!isOpen}>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq-answer"
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.26, ease: "easeOut" }}
                      >
                        <p>{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="final-cta-section" id="join">
      <div className="final-cta-orbit" aria-hidden="true" />
      <div className="container final-cta-content">
        <Reveal>
          <p className="section-eyebrow"><span aria-hidden="true" />MAKE YOUR NEXT MOVE</p>
          <h2>Your next opportunity <em>starts here.</em></h2>
          <div className="final-cta-actions">
            <a className="button button--dark" href="#experience">
              Explore FUNNGROW <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="button button--outline-dark" href={PLAY_STORE_URL} target="_blank" rel="noreferrer">
              Join as a Teenlancer <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a className="final-company-link" href="#companies">For companies <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-main">
        <div className="footer-brand-column">
          <BrandLockup />
          <p>Real projects. Real brands. A first step toward what you can do next.</p>
          <div className="social-links" aria-label="FUNNGROW social channels">
            {socials.map((social) => (
              <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} key={social.label}>
                <span aria-hidden="true">{social.text}</span>
              </a>
            ))}
          </div>
        </div>

        {pageLinkGroups.map((group) => (
          <div className="footer-link-group" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((link) => (
              <a href={link.href} key={link.label} target={"external" in link ? "_blank" : undefined} rel={"external" in link ? "noreferrer" : undefined}>
                {link.label}{"external" in link && <ExternalLink size={12} aria-hidden="true" />}
              </a>
            ))}
          </div>
        ))}

        <div className="footer-contact-group">
          <h2>Get in touch</h2>
          <a className="footer-email" href="mailto:hello@funngro.com"><Mail size={14} aria-hidden="true" />hello@funngro.com</a>
          <a href="mailto:teenlancer@funngro.com">teenlancer@funngro.com</a>
          <p className="footer-address"><MapPin size={14} aria-hidden="true" />2105 Wing F, Fantacy Land, CTS No 1, Opp. Majas Depot, Jogeshwari East, JV Link Road, Mumbai, Maharashtra 400060, India</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Wishbanc Technologies Private Limited. All rights reserved.</p>
        <div>
          <a href="https://www.funngro.com/privacy-policy" target="_blank" rel="noreferrer">Privacy</a>
          <a href="https://www.funngro.com/terms-and-conditions" target="_blank" rel="noreferrer">Terms</a>
          <a href={OFFICIAL_TRUST_URL} target="_blank" rel="noreferrer">Trust & Safety</a>
        </div>
        <a className="footer-top-link" href="#home" aria-label="Back to top"><ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <OpportunitySection />
        <BrandWallSection />
        <HowItWorksSection />
        <GrowthSection />
        <AppShowcaseSection />
        <WhySection />
        <CompaniesSection />
        <TrustSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </MotionConfig>
  );
}
