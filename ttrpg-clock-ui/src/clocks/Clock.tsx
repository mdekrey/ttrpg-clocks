import { useMemo } from "react";
import { arc, DefaultArcObject, pie } from "d3-shape";
import { ClockGameState } from "./ClockGameState";

export function Clock({
	name,
	clock: { currentTicks, totalTicks },
}: {
	name: string;
	clock: ClockGameState["clocks"][0];
}) {
	const padding = 10;
	const radius = 70;
	const clockArc = useMemo(
		() => arc<any, Pick<DefaultArcObject, "startAngle" | "endAngle">>().innerRadius(0).outerRadius(radius),
		[radius]
	);
	const clockPie = useMemo(() => pie()(Array(totalTicks).fill(1)), [totalTicks]);

	return (
		<button className="border border-gray-700 rounded flex flex-row sm:flex-col p-2 sm:h-64 sm:w-48 text-left sm:text-center mb-2 mx-1 items-center sm:items-stretch shadow-xl">
			<span className="block text-lg">{name}</span>
			<span className="sr-only">
				{currentTicks} of {totalTicks}
			</span>
			<span className="flex-grow flex items-center justify-center">
				<svg width={radius * 2 + padding} height={radius * 2 + padding}>
					<title>Clock visualization</title>
					<g transform={`translate(${padding / 2 + radius} ${padding / 2 + radius})`}>
						{clockPie.map(piece => (
							<path
								key={piece.index}
								d={clockArc(piece as any) || undefined}
								fill="currentcolor"
								stroke="black"
								strokeWidth={2}
								className={piece.data < currentTicks ? "text-gray-700" : "text-gray-50"}
							/>
						))}
					</g>
				</svg>
			</span>
		</button>
	);
}
