import { useState } from "react";
import { EditorModal } from "../utils/EditorModal";
import { createLensByKey, Stateful, useLens } from "../utils/useLens";
import { FormSection } from "./components/FormSection";
import { ValueInput } from "./components/ValueInput";
import { NumericInput } from "./components/NumericInput";
import { ClockGame } from "./useClockGame";
import { focusInput } from "../utils/focusInput";

type AddClock = {
	clockName: string;
	totalTicks: number;
};

const addClockParams: AddClock = { clockName: "", totalTicks: 6 };

export const AddClockButton = ({ addClock }: Pick<ClockGame, "addClock">) => {
	const [showAddClock, setShowAddClock] = useState(false);
	return (
		<>
			<button className="button" onClick={() => setShowAddClock(true)}>
				Add Clock
			</button>
			<EditorModal
				show={showAddClock}
				onRequestHide={() => setShowAddClock(false)}
				setValueAndHide={value => {
					addClock(value.clockName, value.totalTicks);
					setShowAddClock(false);
				}}
				value={addClockParams}
			>
				{modalData => <AddClockForm formData={modalData} />}
			</EditorModal>
		</>
	);
};

const clockNameLens = createLensByKey<AddClock>()("clockName");
const totalTicksLens = createLensByKey<AddClock>()("totalTicks");
function AddClockForm({ formData }: { formData: Stateful<AddClock> }) {
	const [clockName, setClockName] = useLens(formData, clockNameLens);
	const [totalTicks, setTotalTicks] = useLens(formData, totalTicksLens);
	return (
		<div className="flex flex-col">
			<FormSection
				label="Clock Name"
				fields={id => <ValueInput ref={focusInput} id={id} value={clockName} setValue={setClockName} />}
			/>
			<FormSection
				label="Total Ticks"
				fields={id => <NumericInput id={id} value={totalTicks} setValue={setTotalTicks} />}
			/>
		</div>
	);
}
