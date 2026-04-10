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
  "feasibility-study": "/mock/analysis/feasibility_study_template.md",
  "cost-benefit-analysis": "/mock/analysis/cost_benefit_analysis_template.md",
  "risk-register": "/mock/analysis/risk_register_template.md",
  "compliance": "/mock/analysis/compliance_template.md",
};

export const getAllDocIds = (): string[] =>
  analysisDocuments.map((doc) => doc.id);
