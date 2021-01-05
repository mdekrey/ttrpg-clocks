export type ClockGameState = {
	isOwner: boolean;
	clocks: Record<string, { currentTicks: number; totalTicks: number }>;
};
