export type ClockGameState = {
	clocks: Record<string, { currentTicks: number; totalTicks: number }>;
};
