import PhasesBoard from "../_components/PhasesBoard";

export default async function DesignPhasePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return <PhasesBoard phaseFilter="design" projectId={id} />;
}

