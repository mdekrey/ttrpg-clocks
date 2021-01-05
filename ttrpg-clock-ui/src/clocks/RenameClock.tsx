import { focusInput } from "../utils/focusInput";
import { Stateful } from "../utils/useLens";
import { FormSection } from "./components/FormSection";
import { ValueInput } from "./components/ValueInput";

type RenameClock = string;

export function RenameClockForm({ formData }: { formData: Stateful<RenameClock> }) {
	const [clockName, setClockName] = formData;
	return (
		<div className="flex flex-col">
			<FormSection
				label="Clock Name"
				fields={id => <ValueInput ref={focusInput} id={id} value={clockName} setValue={setClockName} />}
			/>
		</div>
	);
}
