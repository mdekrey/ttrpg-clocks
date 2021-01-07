import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { ClockGameProvider } from "../clocks/useClockGame";
import { Clocks } from "../clocks/Clocks";
import { AddClockButton } from "../clocks/AddClockButton";
import { useLocationParams } from "../utils/useLocationParams";
import Info from "../clocks/info.svg";
import { Modal, ModalButton, ModalContent, ModalFooter } from "../utils/Modal";
import styles from "./clocks.module.css";
import { isSSR } from "../utils/isSSR";

export default () => {
	const location = useLocationParams();
	const gamerId = useMemo(() => location["user"] || uuid(), [location]);
	const gameId = useMemo(() => location["game"] || uuid(), [location]);
	const [showInfo, setShowInfo] = useState(false);
	return (
		<ClockGameProvider gamerId={gamerId} gameId={gameId}>
			{({ gameState: { isOwner, clocks }, addClock, ...actions }) => (
				<div className={styles.clocksContainer}>
					<div className={styles.clocks}>
						<Clocks clocks={clocks} {...(isOwner ? actions : {})} />
					</div>
					{isOwner ? (
						<div className={styles.buttonRow}>
							<AddClockButton addClock={addClock} />
							<button className="button" onClick={() => setShowInfo(true)}>
								<span className="sr-only">Information</span>
								<Info style={{ width: "1.5rem", height: "1.5rem" }} />
							</button>
						</div>
					) : null}

					{isSSR() ? null : (
						<Modal onRequestHide={() => setShowInfo(false)} show={showInfo}>
							<ModalContent>
								<p>
									Bookmark this page to ensure you can return to your clocks!
									<input
										type="text"
										readOnly
										value={`${window.location.href.split("?")[0]}?game=${gameId}&user=${gamerId}`}
										className="m-2 border border-white bg-gray-700 text-white"
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
										className="m-2 border border-white bg-gray-700 text-white"
										onFocus={ev => ev.target.setSelectionRange(0, ev.target.value.length)}
									/>
								</p>
							</ModalContent>
							<ModalFooter>
								<ModalButton onClick={() => setShowInfo(false)}>OK</ModalButton>
							</ModalFooter>
						</Modal>
					)}
				</div>
			)}
		</ClockGameProvider>
	);
};
