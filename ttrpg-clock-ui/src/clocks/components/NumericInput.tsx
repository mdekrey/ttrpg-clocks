import React, { useEffect, useState } from "react";
import { ValueInput } from "./ValueInput";

export function NumericInput({
	value,
	setValue,
	...props
}: {
	value: number;
	setValue: (value: number) => void;
} & Omit<JSX.IntrinsicElements["input"], "value">) {
	const [innerValue, setInnerValue] = useState(`${value}`);
	useEffect(() => setInnerValue(`${value}`), [value, setInnerValue]);

	return (
		<ValueInput
			value={innerValue}
			setValue={maybeSetValue}
			onBlur={() => updateValue(innerValue)}
			type="number"
			{...props}
		/>
	);

	function maybeSetValue(e: string, ev: React.ChangeEvent<HTMLInputElement>) {
		setInnerValue(e);
		if (ev.target !== document.activeElement || `${Number(e)}` === e) {
			updateValue(e);
		}
	}

	function updateValue(innerValue: string) {
		setValue(Number(innerValue));
	}
}
