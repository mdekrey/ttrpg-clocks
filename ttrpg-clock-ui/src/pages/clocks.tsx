import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import { ClockGameProvider } from "../clocks/useClockGame";
import { Clocks } from "../clocks/Clocks";
import { AddClockButton } from "../clocks/AddClockButton";
import { useLocationParams } from "../utils/useLocationParams";

export default () => {
	const location = useLocationParams();
	const gamerId = useMemo(() => location["user"] || uuid(), [location]);
	const gameId = useMemo(() => location["game"] || uuid(), [location]);
	return (
		<ClockGameProvider gamerId={gamerId} gameId={gameId}>
			{({ gameState: { isOwner, clocks }, addClock, ...actions }) => (
				<div>
					<Clocks clocks={clocks} {...(isOwner ? actions : {})} />
					{isOwner ? <AddClockButton addClock={addClock} /> : null}
				</div>
			)}
		</ClockGameProvider>
	);
};
