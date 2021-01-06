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
					{isOwner ? (
						<>
							<AddClockButton addClock={addClock} />
							<p>
								Bookmark this page to ensure you can return to your clocks!
								<input
									type="text"
									readOnly
									value={`${window.location.href.split("?")[0]}?game=${gameId}&user=${gamerId}`}
									className="m-2 border border-black bg-gray-300"
									onFocus={ev => ev.target.setSelectionRange(0, ev.target.value.length)}
								/>
								(Visit within 30 days.)
							</p>
							<p>
								Share this link with your players:{" "}
								<input
									type="text"
									readOnly
									value={`${window.location.href.split("?")[0]}?game=${gameId}`}
									className="m-2 border border-black bg-gray-300"
									onFocus={ev => ev.target.setSelectionRange(0, ev.target.value.length)}
								/>
							</p>
						</>
					) : null}
				</div>
			)}
		</ClockGameProvider>
	);
};
