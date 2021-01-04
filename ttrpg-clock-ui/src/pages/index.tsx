import { useMemo } from "react";
import { v4 as uuid } from "uuid";

export default () => {
	const gameId = useMemo(uuid, []);
	const gamerId = useMemo(uuid, []);

	return (
		<div className="flex flex-col h-screen text-center justify-items-center">
			<div className="flex-grow"></div>
			<h1>TTRP Clock Tracker</h1>
			<p>
				Use a URL sent to you by your GM (or saved from before) or{" "}
				<a
					href={`/clocks?game=${gameId}&user=${gamerId}`}
					className="bg-gray-300 border border-gray-800 rounded p-1 shadow"
				>
					Start new Clocks
				</a>
				.
			</p>
			<div className="flex-grow"></div>
			<div className="flex-grow"></div>
		</div>
	);
};
