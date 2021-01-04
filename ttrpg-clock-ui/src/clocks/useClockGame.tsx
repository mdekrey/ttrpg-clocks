import { createContext, ReactNode, useContext, useMemo } from "react";
import { Observable, Subscription } from "rxjs";
import { filter, map, shareReplay, switchAll } from "rxjs/operators";
import { useRx } from "../utils/useRx";
import { useSignalRConnection } from "../utils/useSignalRConnection";
import { ClockGameState } from "./ClockGameState";

function useClockGameInternal(gamerId: string, gameId: string) {
	const { connection, ajax } = useSignalRConnection(gamerId);
	return useMemo(() => {
		const headers = { "x-game-id": gameId, "Content-Type": "application/json" };
		return {
			gameState: connection.pipe(
				map(
					hub =>
						new Observable<[string, ClockGameState]>(observer => {
							const next = (gameId: string, v: string) => observer.next([gameId, JSON.parse(v)]);
							hub.on("NewPublicState", next);
							const subscription = new Subscription();
							subscription.add(
								ajax({
									url: "getGameState",
									method: "GET",
									headers,
								}).subscribe()
							);
							subscription.add(() => hub.off("NewPublicState", next));
							return subscription;
						})
				),
				switchAll(),
				filter(([incomingGameId, gameState]) => gameId === incomingGameId),
				map(([_, gameState]) => gameState),
				shareReplay(1)
			),
			addClock: (clockName: string, totalTicks: number) =>
				ajax({ url: "addClock", headers, method: "POST", body: { clockName, totalTicks } }),
			removeClock: (clockName: string) => ajax({ url: "addClock", headers, method: "POST", body: { clockName } }),
			tickClock: (clockName: string, tickCount: number) =>
				ajax({ url: "addClock", headers, method: "POST", body: { clockName, tickCount } }),
			renameClock: (oldClockName: string, newClockName: number) =>
				ajax({ url: "addClock", headers, method: "POST", body: { oldClockName, newClockName } }),
		};
	}, [connection, ajax]);
}

export type ClockGame = Omit<ReturnType<typeof useClockGameInternal>, "gameState"> & { gameState: ClockGameState };

const ClockGameContext = createContext<ClockGame>(null as any);

export const ClockGameProvider = ({
	gamerId,
	gameId,
	children,
}: {
	gamerId: string;
	gameId: string;
	children?: ReactNode | ((game: ClockGame) => ReactNode);
}) => {
	const { gameState: gameState$, addClock, removeClock, tickClock, renameClock } = useClockGameInternal(
		gamerId,
		gameId
	);
	const gameState = useRx(gameState$, { clocks: {} });
	const clockGame = useMemo(() => ({ addClock, removeClock, tickClock, renameClock, gameState }), [
		addClock,
		removeClock,
		tickClock,
		renameClock,
		gameState,
	]);
	return (
		<ClockGameContext.Provider value={clockGame}>
			{typeof children === "function" ? children(clockGame) : children || null}
		</ClockGameContext.Provider>
	);
};

export const useClockGame = () => useContext(ClockGameContext);
