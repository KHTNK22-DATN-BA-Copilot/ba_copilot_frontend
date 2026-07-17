"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import {
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  FileText,
  Loader2,
  Sparkles,
  Info,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getProjectById } from "@/actions/project.action";
import { toast } from "sonner";
import { useProjectMembership } from "@/context/ProjectMembershipContext";

import { DocumentPreviewModal } from "../../workflows/steps/shared/components/DocumentPreviewModal";
import type { DocumentListItem, GenerateWorkflowPayload, GenerationDocumentItem, StepName } from "../../workflows/steps/shared/types";
import { useWorkflowGeneration } from "../../workflows/steps/shared/hooks/useWorkflowGeneration";
import { regenerateDocument } from "../../workflows/steps/shared/api";
import { GenerationLoadingDialog } from "../../workflows/steps/shared/components/GenerationLoadingDialog";
import {
  getDependencyDisplay,
  getDocumentDisplayName,
  getRequiredDocs,
} from "../../workflows/steps/shared/documentDependencies";
import {
  GeneratedPhaseDocument,
  getGeneratedDocumentsByPhase,
  resolveGeneratedDocumentTypeId,
} from "./api";
import { findDocument, getPhases, getPhaseDocumentCount, getPhaseLeafDocuments } from "./phase-data";
import { DocumentStatus, PhaseId } from "./types";

interface PhasesBoardProps {
  phaseFilter?: PhaseId;
  projectId: string;
}

const ALL_PHASE_IDS: PhaseId[] = ["planning", "analysis", "design"];

export default function PhasesBoard({ phaseFilter, projectId }: PhasesBoardProps) {
  const { role } = useProjectMembership();
  const isViewer = role === "Viewer";
  const filteredPhases = useMemo(() => getPhases(phaseFilter), [phaseFilter]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<GeneratedPhaseDocument | null>(null);
  const [previewPhaseId, setPreviewPhaseId] = useState<PhaseId | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [generatingDocumentItem, setGeneratingDocumentItem] = useState<GenerationDocumentItem | null>(null);
  const [regeneratingDocId, setRegeneratingDocId] = useState<string | null>(null);

  const fetchPhaseDocs = async ([pId, pFilter]: [string, PhaseId]) => {
    return getGeneratedDocumentsByPhase(pFilter, pId);
  };

  const { data: planningDocs = [], isLoading: loadingPlanning, mutate: mutatePlanning } = useSWR(
    projectId ? [projectId, "planning"] : null,
    fetchPhaseDocs,
    { revalidateOnFocus: false }
  );

  const { data: analysisDocs = [], isLoading: loadingAnalysis, mutate: mutateAnalysis } = useSWR(
    projectId ? [projectId, "analysis"] : null,
    fetchPhaseDocs,
    { revalidateOnFocus: false }
  );

  const { data: designDocs = [], isLoading: loadingDesign, mutate: mutateDesign } = useSWR(
    projectId ? [projectId, "design"] : null,
    fetchPhaseDocs,
    { revalidateOnFocus: false }
  );

  const generatedByPhase = useMemo(() => {
    return {
      planning: planningDocs,
      analysis: analysisDocs,
      design: designDocs,
    };
  }, [planningDocs, analysisDocs, designDocs]);

  const isSyncingDocuments = loadingPlanning || loadingAnalysis || loadingDesign;

  useEffect(() => {
    if (refreshTrigger > 0) {
      mutatePlanning();
      mutateAnalysis();
      mutateDesign();
    }
  }, [refreshTrigger, mutatePlanning, mutateAnalysis, mutateDesign]);

  const { generateDocuments, isGenerating, error: wsError, cancelGeneration, documentStatuses } = useWorkflowGeneration(
    undefined,
    () => setRefreshTrigger((t) => t + 1),
  );

  const title =
    phaseFilter && filteredPhases[0]
      ? `${filteredPhases[0].name} Phase`
      : "Project Phases";

  const subtitle =
    phaseFilter && filteredPhases[0]
      ? filteredPhases[0].description
      : "Generate documents for each phase of your project using AI";

  const summaryBadge =
    phaseFilter && filteredPhases[0]
      ? `${getPhaseDocumentCount(filteredPhases[0])} Documents`
      : `${filteredPhases.length} Phases`;

  const selectedEntry = selectedDocument ? findDocument(selectedDocument) : null;

  const generatedDocumentIndex = useMemo(() => {
    const index: Partial<Record<PhaseId, Record<string, GeneratedPhaseDocument>>> = {};

    Object.entries(generatedByPhase).forEach(([phaseKey, documents]) => {
      if (!documents || documents.length === 0) {
        return;
      }

      index[phaseKey as PhaseId] = documents.reduce((map, document) => {
        const normalizedId = resolveGeneratedDocumentTypeId(document);
        if (normalizedId) {
          map[normalizedId] = document;
        }
        return map;
      }, {} as Record<string, GeneratedPhaseDocument>);
    });

    return index;
  }, [generatedByPhase]);

  const getMatchedGeneratedDocument = (phaseId: PhaseId, documentId: string) => {
    return generatedDocumentIndex[phaseId]?.[documentId.toLowerCase()];
  };

  const getGeneratedDocumentsOfId = (phaseId: PhaseId, documentId: string) => {
    const docs = generatedByPhase[phaseId] || [];
    return docs.filter(
      (doc) => resolveGeneratedDocumentTypeId(doc) === documentId.toLowerCase()
    );
  };

  const availableDocumentIds = useMemo(() => {
    const ids = new Set<string>();

    Object.values(generatedByPhase).forEach((documents) => {
      documents?.forEach((document) => {
        const normalizedId = resolveGeneratedDocumentTypeId(document);
        if (normalizedId) {
          ids.add(normalizedId);
        }
      });
    });

    return ids;
  }, [generatedByPhase]);

  const getPhaseDocumentStatus = (
    phaseId: PhaseId,
    documentId: string,
    fallbackStatus: DocumentStatus
  ): DocumentStatus => {
    const generatedDoc = getMatchedGeneratedDocument(phaseId, documentId);
    if (generatedDoc) {
      return "available";
    }

    return fallbackStatus;
  };

  const wsErrorRef = useRef(wsError);
  useEffect(() => {
    wsErrorRef.current = wsError;
  }, [wsError]);

  useEffect(() => {
    if (wsError) {
      toast.error(wsError);
    }
  }, [wsError]);

  const selectedDependencyInfo = useMemo(() => {
    if (!selectedEntry) {
      return null;
    }

    const dependencyDisplay = getDependencyDisplay(selectedEntry.document.id);
    const missingRequired = getRequiredDocs(selectedEntry.document.id)
      .filter((requiredId) => !availableDocumentIds.has(requiredId.toLowerCase()))
      .map(getDocumentDisplayName);

    return {
      ...dependencyDisplay,
      missingRequired,
    };
  }, [selectedEntry, availableDocumentIds]);

  const hasMissingRequiredDependencies =
    (selectedDependencyInfo?.missingRequired.length ?? 0) > 0;

  const selectedHasGeneratedDocs = useMemo(() => {
    if (!selectedEntry) return false;
    return getGeneratedDocumentsOfId(selectedEntry.phase.id, selectedEntry.document.id).length > 0;
  }, [selectedEntry, generatedByPhase]);

  const handleGenerate = async () => {
    if (!selectedEntry) return;

    const isAlreadyAvailable = Boolean(
      getMatchedGeneratedDocument(selectedEntry.phase.id, selectedEntry.document.id)
    );
    if (isAlreadyAvailable) return;

    if (hasMissingRequiredDependencies) {
      toast.error(
        `Missing required documents: ${selectedDependencyInfo?.missingRequired.join(", ")}`
      );
      return;
    }

    try {
      const project = await getProjectById(projectId);

      setGeneratingDocumentItem({ id: selectedEntry.document.id, name: selectedEntry.document.name });

      const payload: GenerateWorkflowPayload = {
        project_name: project ? project.name : "Project",
        description: additionalInstructions || (project ? project.description : "No description provided"),
        documents: [{ type: selectedEntry.document.id }],
      };

      const started = await generateDocuments(payload, projectId, selectedEntry.phase.id as StepName);
      if (started) {
        toast.success("Document generation started");
        setAdditionalInstructions("");
      } else {
        setGeneratingDocumentItem(null);
        toast.error("Failed to start generation");
      }
    } catch {
      setGeneratingDocumentItem(null);
      toast.error("An error occurred while generating");
    }
  };

  const handleGenerateClick = (e: React.MouseEvent) => {
    if (isViewer) {
      e.preventDefault();
      e.stopPropagation();
      toast.error("You do not have permission to generate documents. Your role is Viewer.");
      return;
    }
    handleGenerate();
  };

  const handleOpenPreview = (document: GeneratedPhaseDocument, phaseId: PhaseId) => {
    setPreviewDocument(document);
    setPreviewPhaseId(phaseId);
    setIsPreviewOpen(true);
  };

  const refreshPreviewDocument = async (phaseId: PhaseId, documentId: string, previousContent?: string) => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    let lastFoundDoc: GeneratedPhaseDocument | null = null;

    // Regeneration can be eventually consistent, so retry for a short period.
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const latestDocs = await getGeneratedDocumentsByPhase(phaseId, projectId);
      const updatedDoc = latestDocs.find((doc) => doc.document_id === documentId);
      if (updatedDoc) {
        lastFoundDoc = updatedDoc;

        if (!previousContent || updatedDoc.content !== previousContent) {
          setPreviewDocument(updatedDoc);
          return;
        }
      }

      await sleep(1000);
    }

    if (lastFoundDoc) {
      setPreviewDocument(lastFoundDoc);
    }
  };

  const handleRegenerateFromModal = async (documentId: string, description?: string) => {
    if (!previewPhaseId) return;
    setRegeneratingDocId(documentId);

    toast.info("Regenerating document...", {
      duration: 2000,
    });

    try {
      const previousContent =
        previewDocument?.document_id === documentId ? previewDocument.content : undefined;
      const data = await regenerateDocument(
        previewPhaseId as StepName,
        projectId,
        documentId,
        description
      );

      if (data.status !== "error") {
        toast.success("Document regenerated successfully");
        // Update previewDocument immediately so the modal preview refreshes without closing.
        if (data.result?.content) {
          setPreviewDocument((prev) =>
            prev ? { ...prev, content: data.result.content } : prev
          );
        } else {
          await refreshPreviewDocument(previewPhaseId, documentId, previousContent);
        }

        // Mutate SWR for the specific phase to update the board state as well
        if (previewPhaseId === "planning") {
          mutatePlanning();
        } else if (previewPhaseId === "analysis") {
          mutateAnalysis();
        } else if (previewPhaseId === "design") {
          mutateDesign();
        }
      } else {
        throw data;
      }
    } catch (error: any) {
      if (error?.statusCode === 403) {
        toast.error("Your role in this project may have changed to Viewer. You no longer have permission for this action.");
      } else {
        console.error("Error regenerating document:", error);
        const errorMessage = error instanceof Error ? error.message : (error?.message || "Failed to regenerate document");
        toast.error(errorMessage);
      }
    } finally {
      setRegeneratingDocId(null);
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    if (status === "available") {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }

    if (status === "in-progress") {
      return <Clock className="h-4 w-4 text-orange-600" />;
    }

    return <Circle className="h-4 w-4 text-gray-400 dark:text-gray-500" />;
  };

  const formatLastGenerated = (timestamp?: string) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="flex-shrink-0 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            </div>

            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
            >
              {summaryBadge}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 overflow-hidden">
        {isSyncingDocuments ? (
          <Card className="h-full flex flex-col items-center justify-center">
            <CardContent className="flex items-center gap-3 py-10 text-gray-700 dark:text-gray-300">
              <Loader2 className="h-5 w-5 animate-spin" />
              <div>
                <p className="text-sm font-medium">Syncing project documents...</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Please wait while we load the latest document states.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 h-full min-h-0">
            <div className="space-y-4 lg:col-span-2 flex flex-col h-full min-h-0 overflow-y-auto pr-1">
              {filteredPhases.map((phase) => {
                const phaseDocuments = getPhaseLeafDocuments(phase);
                const availableCount = phaseDocuments.filter((doc) =>
                  Boolean(getMatchedGeneratedDocument(phase.id, doc.id))
                ).length;
                const totalCount = phaseDocuments.length;
                const completionPercent =
                  totalCount > 0 ? (availableCount / totalCount) * 100 : 0;

                return (
                  <Card 
                    key={phase.id} 
                    className={cn(
                      "flex flex-col overflow-hidden",
                      filteredPhases.length === 1 ? "h-full min-h-0" : "max-h-[350px] min-h-[250px] flex-shrink-0"
                    )}
                  >
                    <CardHeader
                      className="flex-shrink-0 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-1 items-start gap-3">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{phase.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {phase.description}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="min-w-32 text-right">
                          <div className="min-w-32 ml-auto text-right">
                            <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                              {availableCount}/{totalCount} available
                            </div>

                            <div className="ml-auto h-2 w-28 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className="h-full bg-blue-600 transition-all dark:bg-blue-500"
                                style={{ width: `${completionPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 min-h-0 overflow-y-auto pt-0 pb-6 px-6 overscroll-contain">
                      <div className="space-y-2">
                        {phaseDocuments.map((doc) => {
                          const matchedGeneratedDoc = getMatchedGeneratedDocument(
                            phase.id,
                            doc.id
                          );
                          const allGeneratedDocs = getGeneratedDocumentsOfId(
                            phase.id,
                            doc.id
                          );
                          const hasMultipleFiles = allGeneratedDocs.length > 1;
                          const isGenerated = Boolean(matchedGeneratedDoc);
                          const dependencyDisplay = getDependencyDisplay(doc.id);
                          const missingRequired = getRequiredDocs(doc.id)
                            .filter((requiredId) => !availableDocumentIds.has(requiredId.toLowerCase()))
                            .map(getDocumentDisplayName);
                          const displayStatus = getPhaseDocumentStatus(
                            phase.id,
                            doc.id,
                            doc.status
                          );

                          return (
                            <div
                              key={doc.id}
                              role="button"
                              tabIndex={0}
                              className={cn(
                                "flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500",
                                selectedDocument === doc.id
                                  ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                                  : isGenerated
                                    ? "border-emerald-300 bg-emerald-50/70 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30"
                                    : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800/60"
                              )}
                              onClick={() => setSelectedDocument(doc.id)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  setSelectedDocument(doc.id);
                                }
                              }}
                            >
                              <div className="flex flex-1 items-center gap-3">
                                {getStatusIcon(displayStatus)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {doc.name}
                                    </p>
                                    {(!isGenerated && (dependencyDisplay.required.length > 0 || dependencyDisplay.recommended.length > 0 || missingRequired.length > 0)) && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-xs">
                                          <div className="space-y-1.5 text-xs">
                                            {dependencyDisplay.required.length > 0 && (
                                              <div>
                                                <p className="font-medium text-amber-300">Required:</p>
                                                <p className="text-gray-100">{dependencyDisplay.required.join(", ")}</p>
                                              </div>
                                            )}
                                            {dependencyDisplay.recommended.length > 0 && (
                                              <div>
                                                <p className="font-medium text-sky-300">Recommended:</p>
                                                <p className="text-gray-100">{dependencyDisplay.recommended.join(", ")}</p>
                                              </div>
                                            )}
                                            {missingRequired.length > 0 && (
                                              <div>
                                                <p className="font-medium text-red-300">Missing:</p>
                                                <p className="text-gray-100">{missingRequired.join(", ")}</p>
                                              </div>
                                            )}
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
                                  {/* {doc.parentName && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Group: {doc.parentName}
                                  </p>
                                )} */}
                                  {matchedGeneratedDoc?.updated_at && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Last updated: {formatLastGenerated(
                                        matchedGeneratedDoc?.updated_at
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {matchedGeneratedDoc && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    disabled={hasMultipleFiles}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleOpenPreview(matchedGeneratedDoc, phase.id);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                    View
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="lg:col-span-1 h-full min-h-0">
              <div className="h-full min-h-0">
                {selectedEntry ? (
                  <Card className="flex flex-col h-full min-h-0 overflow-hidden">
                    <CardHeader className="flex-shrink-0">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-5 w-5" />
                        Generate Document
                      </CardTitle>
                      <CardDescription>
                        Use AI to generate this document based on your project data.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 min-h-0 overflow-y-auto space-y-4 pb-6 overscroll-contain">
                       {(() => {
                        const allSelectedGeneratedDocs = getGeneratedDocumentsOfId(
                          selectedEntry.phase.id,
                          selectedEntry.document.id
                        );
                        const hasGeneratedFiles = allSelectedGeneratedDocs.length > 0;

                        return (
                          <div className="space-y-4">
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {selectedEntry.document.name}
                              </p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Phase: {selectedEntry.phase.name}
                              </p>
                              {selectedEntry.parentDocument && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  Group: {selectedEntry.parentDocument.name}
                                </p>
                              )}
                              {!hasGeneratedFiles && selectedDependencyInfo?.required.length ? (
                                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                                  Required: {selectedDependencyInfo.required.join(", ")}
                                </p>
                              ) : null}
                              {!hasGeneratedFiles && selectedDependencyInfo?.recommended.length ? (
                                <p className="mt-1 text-xs text-sky-700 dark:text-sky-300">
                                  Recommended: {selectedDependencyInfo.recommended.join(", ")}
                                </p>
                              ) : null}
                              {hasGeneratedFiles && (
                                <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                  {allSelectedGeneratedDocs.length > 1
                                    ? `${allSelectedGeneratedDocs.length} files generated and available`
                                    : "Generated and available"}
                                </p>
                              )}
                              {selectedDependencyInfo?.missingRequired.length ? (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                  Missing: {selectedDependencyInfo.missingRequired.join(", ")}
                                </p>
                              ) : null}
                            </div>

                            {hasGeneratedFiles && (
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                  Generated Files
                                </label>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                  {allSelectedGeneratedDocs.map((doc, idx) => (
                                    <div
                                      key={doc.document_id}
                                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition-all hover:bg-gray-50/50"
                                    >
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                          {doc.project_name || selectedEntry.document.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          File {idx + 1} • {doc.updated_at
                                            ? new Date(doc.updated_at).toLocaleString()
                                            : "N/A"}
                                        </p>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5"
                                        onClick={() =>
                                          handleOpenPreview(doc, selectedEntry.phase.id)
                                        }
                                      >
                                        <Eye className="h-4 w-4" />
                                        View
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {!selectedHasGeneratedDocs && (
                        <>
                          <div className="space-y-2">
                            <label
                              htmlFor="phase-ai-instructions"
                              className="text-sm font-medium text-gray-800 dark:text-gray-200"
                            >
                              Additional Instructions (Optional)
                            </label>
                            <Textarea
                              id="phase-ai-instructions"
                              className="min-h-28"
                              placeholder="Add specific requirements or guidelines for generating this document..."
                              value={additionalInstructions}
                              onChange={(e) => setAdditionalInstructions(e.target.value)}
                              disabled={isGenerating}
                            />
                          </div>

                          {isViewer ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className="w-full gap-2 opacity-50 cursor-not-allowed pointer-events-auto hover:bg-primary hover:text-primary-foreground"
                                  onClick={handleGenerateClick}
                                >
                                  <Sparkles className="h-4 w-4" />
                                  Generate
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                You do not have permission to generate documents. Your role is Viewer.
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Button
                              className="w-full gap-2"
                              onClick={handleGenerate}
                              disabled={
                                isGenerating ||
                                isSyncingDocuments ||
                                hasMissingRequiredDependencies ||
                                Boolean(
                                  getMatchedGeneratedDocument(
                                    selectedEntry.phase.id,
                                    selectedEntry.document.id
                                  )
                                )
                              }
                            >
                              {isGenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Sparkles className="h-4 w-4" />
                              )}
                              {isGenerating ? "Generating..." : "Generate"}
                            </Button>
                          )}

                          {hasMissingRequiredDependencies && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              Complete required documents before generating this one.
                            </p>
                          )}

                          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                            Generation typically takes 30-60 seconds.
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex flex-col items-center justify-center">
                    <CardContent className="pt-6 text-center">
                      <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select a document to generate.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={previewDocument as unknown as DocumentListItem}
        projectId={projectId}
        stepName={(previewPhaseId ?? "planning") as StepName}
        onRegenerateSuccess={() => {
          if (previewPhaseId === "planning") {
            mutatePlanning();
          } else if (previewPhaseId === "analysis") {
            mutateAnalysis();
          } else if (previewPhaseId === "design") {
            mutateDesign();
          }
        }}
        isRegenerating={regeneratingDocId === previewDocument?.document_id}
        onRegenerate={handleRegenerateFromModal}
      />

      <GenerationLoadingDialog
        isOpen={isGenerating}
        documents={generatingDocumentItem ? [generatingDocumentItem] : []}
        statuses={documentStatuses}
        onCancel={cancelGeneration}
      />
    </div>
  );
}
