"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  FileText,
  Loader2,
  Sparkles,
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
import { cn } from "@/lib/utils";
import { getProjectById } from "@/actions/project.action";
import { toast } from "sonner";

import { DocumentPreviewModal } from "../../workflows/_components/steps/shared/components/DocumentPreviewModal";
import type { DocumentListItem, GenerateWorkflowPayload, GenerationDocumentItem, StepName } from "../../workflows/_components/steps/shared/types";
import { useWorkflowGeneration } from "../../workflows/_components/steps/shared/hooks/useWorkflowGeneration";
import { GenerationLoadingDialog } from "../../workflows/_components/steps/shared/components/GenerationLoadingDialog";
import {
  GeneratedPhaseDocument,
  getGeneratedDocumentsByPhase,
  resolveGeneratedDocumentTypeId,
} from "./api";
import { findDocument, getPhases } from "./phase-data";
import { DocumentStatus, PhaseId } from "./types";

interface PhasesBoardProps {
  phaseFilter?: PhaseId;
  projectId: string;
}

export default function PhasesBoard({ phaseFilter, projectId }: PhasesBoardProps) {
  const filteredPhases = useMemo(() => getPhases(phaseFilter), [phaseFilter]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [generatedByPhase, setGeneratedByPhase] = useState<
    Partial<Record<PhaseId, GeneratedPhaseDocument[]>>
  >({});
  const [previewDocument, setPreviewDocument] = useState<GeneratedPhaseDocument | null>(null);
  const [previewPhaseId, setPreviewPhaseId] = useState<PhaseId | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [generatingDocumentItem, setGeneratingDocumentItem] = useState<GenerationDocumentItem | null>(null);

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
      ? `${filteredPhases[0].documents.length} Documents`
      : `${filteredPhases.length} Phases`;

  const selectedEntry = selectedDocument ? findDocument(selectedDocument) : null;

  useEffect(() => {
    let isMounted = true;

    const fetchGeneratedDocuments = async () => {
      const phaseIds = Array.from(new Set(filteredPhases.map((phase) => phase.id)));

      const results = await Promise.all(
        phaseIds.map(async (phaseId) => {
          const documents = await getGeneratedDocumentsByPhase(phaseId, projectId);
          return [phaseId, documents] as const;
        })
      );

      if (!isMounted) {
        return;
      }

      setGeneratedByPhase(
        results.reduce((acc, [phaseId, documents]) => {
          acc[phaseId] = documents;
          return acc;
        }, {} as Partial<Record<PhaseId, GeneratedPhaseDocument[]>>)
      );
    };

    fetchGeneratedDocuments();

    return () => {
      isMounted = false;
    };
  }, [filteredPhases, projectId, refreshTrigger]);

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

  const handleGenerate = async () => {
    if (!selectedEntry) return;

    const isAlreadyAvailable = Boolean(
      getMatchedGeneratedDocument(selectedEntry.phase.id, selectedEntry.document.id)
    );
    if (isAlreadyAvailable) return;

    try {
      const project = await getProjectById(projectId);

      setGeneratingDocumentItem({ id: selectedEntry.document.id, name: selectedEntry.document.name });

      const payload: GenerateWorkflowPayload = {
        project_name: project.name ?? projectId,
        description: additionalInstructions || `Generate ${selectedEntry.document.name} for the project`,
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

  const handleOpenPreview = (document: GeneratedPhaseDocument, phaseId: PhaseId) => {
    setPreviewDocument(document);
    setPreviewPhaseId(phaseId);
    setIsPreviewOpen(true);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {filteredPhases.map((phase) => {
              const availableCount = phase.documents.filter((doc) =>
                Boolean(getMatchedGeneratedDocument(phase.id, doc.id))
              ).length;
              const totalCount = phase.documents.length;
              const completionPercent =
                totalCount > 0 ? (availableCount / totalCount) * 100 : 0;

              return (
                <Card key={phase.id} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
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
                        <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                          {availableCount}/{totalCount} available
                        </div>
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full bg-blue-600 transition-all dark:bg-blue-500"
                            style={{ width: `${completionPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {phase.documents.map((doc) => {
                          const matchedGeneratedDoc = getMatchedGeneratedDocument(
                            phase.id,
                            doc.id
                          );
                          const displayStatus = getPhaseDocumentStatus(
                            phase.id,
                            doc.id,
                            doc.status
                          );

                          return (
                            <button
                              key={doc.id}
                              type="button"
                              className={cn(
                                "flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 text-left transition-all",
                                selectedDocument === doc.id
                                  ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                                  : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800/60"
                              )}
                              onClick={() => setSelectedDocument(doc.id)}
                            >
                              <div className="flex flex-1 items-center gap-3">
                                {getStatusIcon(displayStatus)}
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {doc.name}
                                  </p>
                                  {doc.lastGenerated && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Last generated: {doc.lastGenerated}
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
                            </button>
                          );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {selectedEntry ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FileText className="h-5 w-5" />
                      Generate Document
                    </CardTitle>
                    <CardDescription>
                      Use AI to generate this document based on your project data.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {selectedEntry.document.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Phase: {selectedEntry.phase.name}
                      </p>
                    </div>

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

                    <Button
                      className="w-full gap-2"
                      onClick={handleGenerate}
                      disabled={
                        isGenerating ||
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

                    {selectedEntry &&
                      getMatchedGeneratedDocument(
                        selectedEntry.phase.id,
                        selectedEntry.document.id
                      ) && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => {
                            const generatedDoc = getMatchedGeneratedDocument(
                              selectedEntry.phase.id,
                              selectedEntry.document.id
                            );
                            if (generatedDoc) {
                              handleOpenPreview(generatedDoc, selectedEntry.phase.id);
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View Latest Generated Document
                        </Button>
                      )}

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                      Generation typically takes 30-60 seconds.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
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
      </div>

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={previewDocument as unknown as DocumentListItem}
        projectId={projectId}
        stepName={(previewPhaseId ?? "planning") as StepName}
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
