import { WorkflowDocument } from "../shared/types";

export const designDocuments: WorkflowDocument[] = [
  {
    id: "srs",
    name: "Software Requirement Specification",
    description: "Comprehensive documentation of functional and non-functional requirements"
  },
  {
    id: "hld",
    name: "HLD (High-Level Design)",
    description: "System-level architecture and design decisions",
    subItems: [
      { id: "hld-arch", name: "System Architecture Diagram" },
      { id: "hld-cloud", name: "Cloud Infrastructure (AWS/Azure) Setup" },
      { id: "hld-tech", name: "Tech Stack Selection" }
    ]
  },
  {
    id: "lld",
    name: "LLD (Low-Level Design)",
    description: "Detailed component-level design and implementation specifications",
    subItems: [
      { id: "lld-arch", name: "Architecture Diagrams" },
      { id: "lld-db", name: "Database Schemas" },
      { id: "lld-api", name: "API Specifications" },
      { id: "lld-pseudo", name: "Pseudocode" }
    ]
  },
  {
    id: "uiux",
    name: "UI/UX Design Kit",
    description: "Visual design assets and interactive prototypes",
    noPreview: true,
    subItems: [
      { id: "uiux-wireframe", name: "Wireframes", noPreview: true },
      { id: "uiux-mockup", name: "Mockups", noPreview: true },
      { id: "uiux-prototype", name: "Prototypes", noPreview: true }
    ]
  },
  {
    id: "rtm",
    name: "RTM (Requirements Traceability Matrix)",
    description: "Mapping of requirements to design, implementation, and test cases"
  }
];

export const documentFiles: Record<string, string> = {
  "srs": "/api/workflows/template?file=srs-template.md",
  "hld-arch": "/api/workflows/template?file=hld-arc.md",
  "hld-cloud": "/api/workflows/template?file=hld-cloud.md",
  "hld-tech": "/api/workflows/template?file=hld-tech.md",
  "lld-arch": "/api/workflows/template?file=lld-arch.md",
  "lld-db": "/api/workflows/template?file=lld-db.md",
  "lld-api": "/api/workflows/template?file=lld-api.md",
  "lld-pseudo": "/api/workflows/template?file=lld-pseudo.md",
  "uiux-wireframe": "/api/workflows/template?file=uiux-wireframe-guide.md",
  "uiux-mockup": "/api/workflows/template?file=uiux-mockup-guide.md",
  "uiux-prototype": "/api/workflows/template?file=uiux-prototype-guide.md",
  "rtm": "/api/workflows/template?file=rtm.md",
};

export const getAllDocIds = (): string[] =>
  designDocuments.flatMap((doc) =>
    doc.subItems ? doc.subItems.map((sub) => sub.id) : [doc.id]
  );
