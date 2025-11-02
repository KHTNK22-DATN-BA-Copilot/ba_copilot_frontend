import { useState, useCallback } from 'react';
import { Diagram, SAMPLE_DIAGRAMS } from './constants';

export interface UseDiagramManagerReturn {
    diagrams: Diagram[];
    selectedDiagramId: number | null;
    selectedDiagram: Diagram | undefined;
    selectDiagram: (id: number) => void;
    deselectDiagram: () => void;
    addDiagram: (diagram: Diagram) => void;
    deleteDiagram: (id: number) => void;
    setDiagrams: (newDiagrams: Diagram[]) => void;
}

/**
 * Custom hook for managing diagram state and operations
 * Handles selection, adding, and deleting diagrams
 */
export function useDiagramManager(diagramList: Diagram[] = []): UseDiagramManagerReturn {
    const [diagrams, setDiagrams] = useState<Diagram[]>(diagramList);
    const [selectedDiagramId, setSelectedDiagramId] = useState<number | null>(null);

    const selectedDiagram = diagrams.find(d => d.id === selectedDiagramId);

    const selectDiagram = useCallback((id: number) => {
        setSelectedDiagramId(id);
    }, []);

    const deselectDiagram = useCallback(() => {
        setSelectedDiagramId(null);
    }, []);

    const addDiagram = useCallback((diagram: Diagram) => {
        setDiagrams(prev => [...prev, diagram]);
    }, []);

    const deleteDiagram = useCallback((id: number) => {
        setDiagrams(prev => prev.filter(d => d.id !== id));
        if (selectedDiagramId === id) {
            deselectDiagram();
        }
    }, [selectedDiagramId, deselectDiagram]);

    return {
        diagrams,
        setDiagrams,
        selectedDiagramId,
        selectedDiagram,
        selectDiagram,
        deselectDiagram,
        addDiagram,
        deleteDiagram,
    };
}
