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
    subItems: [
      { id: "uiux-wireframe", name: "Wireframes" },
      { id: "uiux-mockup", name: "Mockups" },
      { id: "uiux-prototype", name: "Prototypes" }
    ]
  },
  {
    id: "rtm",
    name: "RTM (Requirements Traceability Matrix)",
    description: "Mapping of requirements to design, implementation, and test cases"
  }
];

export const documentFiles: Record<string, string> = {
  "srs": "/mock/design/srs_template.md",
  "hld-arch": "/mock/design/hld/architecture_template.md",
  "hld-cloud": "/mock/design/hld/cloud_infrastructure_template.md",
  "hld-tech": "/mock/design/hld/tech_stack_template.md",
  "lld-arch": "/mock/design/lld/architecture_diagrams_template.md",
  "lld-db": "/mock/design/lld/database_schemas_template.md",
  "lld-api": "/mock/design/lld/api_specifications_template.md",
  "lld-pseudo": "/mock/design/lld/pseudocode_template.md",
  "uiux-wireframe": "/mock/design/uiux/wireframes_template.md",
  "uiux-mockup": "/mock/design/uiux/mockups_template.md",
  "uiux-prototype": "/mock/design/uiux/prototypes_template.md",
  "rtm": "/mock/design/rtm_template.md",
};

export const getAllDocIds = (): string[] =>
  designDocuments.flatMap((doc) =>
    doc.subItems ? doc.subItems.map((sub) => sub.id) : [doc.id]
  );
