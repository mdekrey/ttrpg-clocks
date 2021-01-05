import { focusInput } from "../utils/focusInput";
import { Stateful } from "../utils/useLens";
import { FormSection } from "./components/FormSection";
import { NumericInput } from "./components/NumericInput";

type TickClock = number;

export function TickClockForm({
	formData,
	currentTicks,
	totalTicks,
}: {
	formData: Stateful<TickClock>;
	currentTicks: number;
	totalTicks: number;
}) {
	const [tickBy, setTickBy] = formData;
	return (
		<div className="flex flex-col">
			<FormSection
				label="Tick By"
				fields={id => (
					<NumericInput
						ref={focusInput}
						id={id}
						value={tickBy}
						setValue={setTickBy}
						min={-currentTicks}
						max={totalTicks - currentTicks}
					/>
				)}
			/>
		</div>
	);
}
