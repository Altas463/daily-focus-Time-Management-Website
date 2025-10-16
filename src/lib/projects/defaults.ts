import { Persona, ProjectAccent, ProjectTaskStatus } from "@prisma/client";

export type DefaultProjectTask = {
  label: string;
  status: ProjectTaskStatus;
  context?: string;
};

export type DefaultProject = {
  name: string;
  stage: string;
  dueDate?: string;
  progress: number;
  focus?: string;
  notes?: string;
  accent: ProjectAccent;
  priority?: number;
  tasks: DefaultProjectTask[];
};

export type DefaultLane = {
  persona: Persona;
  title: string;
  description?: string;
  intent?: string;
  ordering?: number;
  projects: DefaultProject[];
};

export const personaOptions: Array<{
  key: Persona;
  label: string;
  blurb: string;
}> = [
  {
    key: Persona.STUDENT,
    label: "Students",
    blurb: "Keep coursework, group deliverables, and portfolio prep in view.",
  },
  {
    key: Persona.FREELANCER,
    label: "Freelancers",
    blurb: "Track retainers, proposals, and client feedback loops together.",
  },
  {
    key: Persona.DEVELOPER,
    label: "Developers",
    blurb: "Map sprints, refactors, and adoption rollouts without leaving focus mode.",
  },
];

export const defaultLanes: DefaultLane[] = [
  {
    persona: Persona.STUDENT,
    title: "Coursework",
    description: "Assignments and labs for this term.",
    intent: "Ship on time and stay eligibility-ready.",
    ordering: 0,
    projects: [
      {
        name: "Capstone Research Sprint",
        stage: "Analysis draft",
        dueDate: "2025-05-26",
        progress: 55,
        focus: "Outline findings with advisor feedback integrated.",
        notes: "Request a desk review before week 8 to avoid rework.",
        accent: ProjectAccent.EMERALD,
        priority: 3,
        tasks: [
          { label: "Synthesize survey responses", status: ProjectTaskStatus.IN_PROGRESS },
          { label: "Draft methodology slide deck", status: ProjectTaskStatus.TODO, context: "Need references" },
          { label: "Book advisor sync", status: ProjectTaskStatus.DONE },
        ],
      },
      {
        name: "Machine Learning Lab 05",
        stage: "Model tuning",
        dueDate: "2025-05-17",
        progress: 35,
        focus: "Clean notebook + compare ROC curves with baseline.",
        notes: "TA said to prioritise interpretability notes over accuracy.",
        accent: ProjectAccent.BLUE,
        priority: 2,
        tasks: [
          { label: "Refine feature scaling", status: ProjectTaskStatus.IN_PROGRESS },
          { label: "Write evaluation summary", status: ProjectTaskStatus.TODO },
          { label: "Peer review session", status: ProjectTaskStatus.REVIEW, context: "Friday study group" },
        ],
      },
    ],
  },
  {
    persona: Persona.STUDENT,
    title: "Portfolio & recruiting",
    description: "Keep signals active for upcoming internship interviews.",
    intent: "Stay visible to recruiters while you study.",
    ordering: 1,
    projects: [
      {
        name: "UX portfolio refresh",
        stage: "Case study draft",
        dueDate: "2025-05-22",
        progress: 45,
        focus: "Update outcomes for productivity assistant case study.",
        notes: "Need to capture metrics from last beta test round.",
        accent: ProjectAccent.PURPLE,
        priority: 2,
        tasks: [
          { label: "Rewrite problem framing", status: ProjectTaskStatus.IN_PROGRESS },
          { label: "Collect testimonial quotes", status: ProjectTaskStatus.TODO },
          { label: "Polish motion demo", status: ProjectTaskStatus.REVIEW },
        ],
      },
    ],
  },
  {
    persona: Persona.FREELANCER,
    title: "Client retainers",
    description: "Active client deliverables and success check-ins.",
    intent: "Keep high-value accounts healthy.",
    ordering: 0,
    projects: [
      {
        name: "Brand refresh – Lumen Health",
        stage: "Feedback incorporation",
        dueDate: "2025-05-19",
        progress: 60,
        focus: "Roll v2 typography and hero layout updates.",
        notes: "Client offsite Thursday; send preview before then.",
        accent: ProjectAccent.AMBER,
        priority: 3,
        tasks: [
          { label: "Refine header animation", status: ProjectTaskStatus.IN_PROGRESS },
          { label: "Prep client walkthrough deck", status: ProjectTaskStatus.TODO },
          { label: "QA responsive states", status: ProjectTaskStatus.REVIEW },
        ],
      },
      {
        name: "Content system – Byte & Co",
        stage: "Copy alignment",
        dueDate: "2025-05-28",
        progress: 30,
        focus: "Align voice/tone examples for long-form blog partner.",
        notes: "Waiting on their SEO lead for keyword handoff.",
        accent: ProjectAccent.ROSE,
        priority: 1,
        tasks: [
          { label: "Audit existing blog posts", status: ProjectTaskStatus.DONE },
          { label: "Draft voice chart", status: ProjectTaskStatus.IN_PROGRESS },
          { label: "Schedule review", status: ProjectTaskStatus.TODO },
        ],
      },
    ],
  },
  {
    persona: Persona.FREELANCER,
    title: "Pipeline",
    description: "Leads, proposals, and onboarding steps.",
    intent: "Stay responsive to new opportunities without burning out.",
    ordering: 1,
    projects: [
      {
        name: "Motion package – Slate Studios",
        stage: "Proposal draft",
        dueDate: "2025-05-20",
        progress: 20,
        focus: "Map deliverables with two scope options.",
        notes: "They asked for lightweight retainer add-on.",
        accent: ProjectAccent.BLUE,
        priority: 2,
        tasks: [
          { label: "Outline scope tiers", status: ProjectTaskStatus.IN_PROGRESS },
          { label: "Estimate production hours", status: ProjectTaskStatus.TODO },
          { label: "Send intro email", status: ProjectTaskStatus.DONE },
        ],
      },
    ],
  },
  {
    persona: Persona.DEVELOPER,
    title: "Current sprint",
    description: "Tickets on deck for this iteration.",
    intent: "Unblock core product surfaces.",
    ordering: 0,
    projects: [
      {
        name: "Focus sessions – analytics beta",
        stage: "QA pass",
        dueDate: "2025-05-23",
        progress: 70,
        focus: "Validate instrumentation + release notes.",
        notes: "Need sign-off from analytics lead.",
        accent: ProjectAccent.EMERALD,
        priority: 3,
        tasks: [
          { label: "Update Prisma schema", status: ProjectTaskStatus.IN_PROGRESS },
          { label: "Write integration tests", status: ProjectTaskStatus.TODO },
          { label: "Demo to PM", status: ProjectTaskStatus.REVIEW },
        ],
      },
      {
        name: "Mobile parity – focus timer",
        stage: "Implementation",
        dueDate: "2025-05-30",
        progress: 40,
        focus: "Hook local push notifications + fallback states.",
        notes: "Need to review Android 14 alarms policy.",
        accent: ProjectAccent.PURPLE,
        priority: 2,
        tasks: [
          { label: "Draft expo config", status: ProjectTaskStatus.TODO },
          { label: "Implement timer hook", status: ProjectTaskStatus.IN_PROGRESS },
          { label: "QA battery saver modes", status: ProjectTaskStatus.TODO },
        ],
      },
    ],
  },
  {
    persona: Persona.DEVELOPER,
    title: "Tech debt",
    description: "Earmarked cleanups and refactors.",
    intent: "Protect velocity for future work.",
    ordering: 1,
    projects: [
      {
        name: "Notification service refactor",
        stage: "Planning",
        dueDate: "2025-06-05",
        progress: 15,
        focus: "Capture edge cases for retry behaviour.",
        notes: "Consider queues before larger adoption.",
        accent: ProjectAccent.AMBER,
        priority: 1,
        tasks: [
          { label: "Document failure matrix", status: ProjectTaskStatus.IN_PROGRESS },
          { label: "Review vendor options", status: ProjectTaskStatus.TODO },
          { label: "Draft RFC", status: ProjectTaskStatus.TODO },
        ],
      },
    ],
  },
];
