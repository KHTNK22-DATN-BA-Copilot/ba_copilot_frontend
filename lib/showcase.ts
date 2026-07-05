import fs from 'fs';
import path from 'path';

export interface ShowcaseDocument {
  id: string;
  name: string;
  content: string;
  phase: 'Input' | 'Planning' | 'Analysis' | 'Design';
}

export interface ShowcaseData {
  input: ShowcaseDocument | null;
  planning: ShowcaseDocument[];
  analysis: ShowcaseDocument[];
  design: ShowcaseDocument[];
}

const PHASE_MAP: Record<string, 'Planning' | 'Analysis' | 'Design'> = {
  'stakeholder-register.md': 'Planning',
  'high-level-requirements.md': 'Planning',
  'requirements-management-plan.md': 'Planning',
  'business-case.md': 'Planning',
  'scope-statement.md': 'Planning',
  'product-roadmap.md': 'Planning',

  'feasibility-study.md': 'Analysis',
  'cost-benefit-analysis.md': 'Analysis',
  'risk-register.md': 'Analysis',
  'compliance.md': 'Analysis',

  'srs.md': 'Design',
  'hld-arch.md': 'Design',
  'hld-cloud.md': 'Design',
  'hld-tech.md': 'Design',
  'lld-api.md': 'Design',
  'lld-arch.md': 'Design',
  'lld-db.md': 'Design',
  'lld-pseudo.md': 'Design',
  'uiux-wireframe.md': 'Design',
  'uiux-mockup.md': 'Design',
  'uiux-prototype.md': 'Design',
  'rtm.md': 'Design',
};

const FILE_DISPLAY_NAMES: Record<string, string> = {
  'stakeholder-register.md': 'Stakeholder Register',
  'high-level-requirements.md': 'High-Level Requirements',
  'requirements-management-plan.md': 'Req. Management Plan',
  'business-case.md': 'Business Case',
  'scope-statement.md': 'Scope Statement',
  'product-roadmap.md': 'Product Roadmap',

  'feasibility-study.md': 'Feasibility Study',
  'cost-benefit-analysis.md': 'Cost-Benefit Analysis',
  'risk-register.md': 'Risk Register',
  'compliance.md': 'Compliance',

  'srs.md': 'Software Requirements Spec',
  'hld-arch.md': 'HLD - Architecture',
  'hld-cloud.md': 'HLD - Cloud',
  'hld-tech.md': 'HLD - Tech Stack',
  'lld-api.md': 'LLD - API',
  'lld-arch.md': 'LLD - Architecture',
  'lld-db.md': 'LLD - Database',
  'lld-pseudo.md': 'LLD - Pseudocode',
  'uiux-wireframe.md': 'UI/UX - Wireframe',
  'uiux-mockup.md': 'UI/UX - Mockup',
  'uiux-prototype.md': 'UI/UX - Prototype',
  'rtm.md': 'Requirement Traceability',
};

export function getShowcaseData(): ShowcaseData {
  const showcaseDir = path.join(process.cwd(), 'showcase');
  const files = fs.readdirSync(showcaseDir);

  const data: ShowcaseData = {
    input: null,
    planning: [],
    analysis: [],
    design: [],
  };

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const content = fs.readFileSync(path.join(showcaseDir, file), 'utf-8');
    const phase = PHASE_MAP[file];
    
    if (phase) {
      const doc: ShowcaseDocument = {
        id: file,
        name: FILE_DISPLAY_NAMES[file] || file,
        content,
        phase,
      };
      
      if (phase === 'Planning') data.planning.push(doc);
      else if (phase === 'Analysis') data.analysis.push(doc);
      else if (phase === 'Design') data.design.push(doc);
    } else {
      // If it's not in our predefined output list, treat it as the input file
      data.input = {
        id: file,
        name: file.replace('.md', ''),
        content,
        phase: 'Input',
      };
    }
  }
  
  // Optional: sort the arrays based on the predefined order
  const orderArray = Object.keys(PHASE_MAP);
  const sortByOrder = (a: ShowcaseDocument, b: ShowcaseDocument) => {
    return orderArray.indexOf(a.id) - orderArray.indexOf(b.id);
  };
  
  data.planning.sort(sortByOrder);
  data.analysis.sort(sortByOrder);
  data.design.sort(sortByOrder);

  return data;
}
