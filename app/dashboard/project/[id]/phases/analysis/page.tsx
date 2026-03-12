import PhasesBoard from "../_components/PhasesBoard";

export default async function AnalysisPhasePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return <PhasesBoard phaseFilter="analysis" projectId={id} />;
}

