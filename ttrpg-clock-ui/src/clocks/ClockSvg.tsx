import { useMemo } from "react";
import { arc, DefaultArcObject, pie } from "d3-shape";

export function ClockSvg({
	radius,
	padding,
	currentTicks,
	totalTicks,
}: {
	radius: number;
	padding: number;
	currentTicks: number;
	totalTicks: number;
}) {
	const clockArc = useMemo(
		() => arc<any, Pick<DefaultArcObject, "startAngle" | "endAngle">>().innerRadius(0).outerRadius(radius),
		[radius]
	);
	const clockPie = useMemo(() => pie()(Array(totalTicks).fill(1)), [totalTicks]);

	return (
		<svg width={radius * 2 + padding} height={radius * 2 + padding}>
			<title>
				{currentTicks} of {totalTicks}
			</title>
			<g transform={`translate(${padding / 2 + radius} ${padding / 2 + radius})`}>
				{clockPie.map(piece => (
					<path
						key={piece.index}
						d={clockArc(piece)!}
						fill="currentcolor"
						stroke="black"
						strokeWidth={Math.min(padding, totalTicks <= 8 ? 2 : totalTicks <= 20 ? 1 : 0.5)}
						className={piece.index < currentTicks ? "text-gray-700" : "text-gray-50"}
					/>
				))}
			</g>
		</svg>
	);
}
