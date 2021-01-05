import { createContext, ReactNode, useContext, useMemo } from "react";
import { Observable, combineLatest } from "rxjs";
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
				map(hub =>
					combineLatest([
						ajax({
							url: "getGameState",
							method: "GET",
							headers,
						}).pipe(map(response => response.response)),

						new Observable<[string, ClockGameState]>(observer => {
							const next = (gameId: string, v: string) => observer.next([gameId, JSON.parse(v)]);
							hub.on("NewPublicState", next);
							return () => hub.off("NewPublicState", next);
						}).pipe(
							filter(([incomingGameId, gameState]) => gameId === incomingGameId),
							map(([_, gameState]) => gameState)
						),
					]).pipe(map(([isOwner, gameState]) => ({ ...gameState, isOwner })))
				),
				switchAll(),
				shareReplay(1)
			),
			addClock: (clockName: string, totalTicks: number) =>
				ajax({ url: "addClock", headers, method: "POST", body: { clockName, totalTicks } })
					.pipe(map(() => {}))
					.toPromise(),
			removeClock: (clockName: string) =>
				ajax({ url: "removeClock", headers, method: "POST", body: { clockName } })
					.pipe(map(() => {}))
					.toPromise(),
			tickClock: (clockName: string, tickCount: number) =>
				ajax({ url: "tickClock", headers, method: "POST", body: { clockName, tickCount } })
					.pipe(map(() => {}))
					.toPromise(),
			renameClock: (oldClockName: string, newClockName: string) =>
				ajax({ url: "renameClock", headers, method: "POST", body: { oldClockName, newClockName } })
					.pipe(map(() => {}))
					.toPromise(),
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
	const gameState = useRx(gameState$, { isOwner: false, clocks: {} });
	const clockGame = useMemo(
		(): ClockGame =>
			gameState.isOwner
				? { addClock, removeClock, tickClock, renameClock, gameState }
				: {
						addClock: () => Promise.resolve(),
						removeClock: () => Promise.resolve(),
						tickClock: () => Promise.resolve(),
						renameClock: () => Promise.resolve(),
						gameState,
				  },
		[addClock, removeClock, tickClock, renameClock, gameState]
	);
	return (
		<ClockGameContext.Provider value={clockGame}>
			{typeof children === "function" ? children(clockGame) : children || null}
		</ClockGameContext.Provider>
	);
};

export const useClockGame = () => useContext(ClockGameContext);
