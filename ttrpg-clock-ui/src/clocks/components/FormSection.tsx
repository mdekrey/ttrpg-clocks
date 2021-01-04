import React from "react";
import { randomShortString } from "../../utils/randomShortString";

export function FormSection({
	label,
	fields,
	className,
}: {
	label: React.ReactChild;
	fields: React.ReactChild | ((labelId: string) => React.ReactChild);
	className?: string;
}) {
	const labelId = React.useMemo(() => randomShortString() + randomShortString(), []);
	return (
		<>
			<label htmlFor={labelId} className={className}>
				{label}
			</label>
			{typeof fields === "function" ? fields(labelId) : fields}
		</>
	);
}
