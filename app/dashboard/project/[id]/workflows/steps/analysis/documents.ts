import { WorkflowDocument } from "../shared/types";

export const analysisDocuments: WorkflowDocument[] = [
  {
    id: "feasibility-study",
    name: "Feasibility Study Report",
    description: "Comprehensive analysis of technical, operational, and economic feasibility"
  },
  {
    id: "cost-benefit-analysis",
    name: "Cost-Benefit Analysis Document",
    description: "Detailed financial analysis comparing project costs against expected benefits"
  },
  {
    id: "risk-register",
    name: "Risk Register Document",
    description: "Identification and assessment of potential project risks and mitigation strategies"
  },
  {
    id: "compliance",
    name: "Compliance Document",
    description: "Legal, regulatory, and standards compliance requirements and verification"
  }
];

export const documentFiles: Record<string, string> = {
  "feasibility-study": "/api/workflows/template?file=Feasibility-Study-Template.md",
  "cost-benefit-analysis": "/api/workflows/template?file=cost-benefit-analysis-template.md",
  "risk-register": "/api/workflows/template?file=risk-register-template.md",
  "compliance": "/api/workflows/template?file=compliance-template.md",
};

export const getAllDocIds = (): string[] =>
  analysisDocuments.map((doc) => doc.id);
