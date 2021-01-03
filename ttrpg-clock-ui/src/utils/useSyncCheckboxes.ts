import produce, { Draft } from "immer";
import { useEffect, useCallback, useState } from "react";
import { sumCheckboxes } from "./sumCheckboxes";

function createCheckboxArray(checkedCount: number, limit: number) {
	return [...Array(checkedCount).fill(true), ...Array(limit - checkedCount).fill(false)];
}

export function useSyncCheckboxes(checkedCount: number, setCount: (count: number) => void, limit: number) {
	const [individualCheckboxes, setCheckboxes] = useState<boolean[]>(createCheckboxArray(checkedCount, limit));
	useEffect(() => {
		setCheckboxes(old => {
			if (sumCheckboxes(old) === checkedCount) return old;
			return createCheckboxArray(checkedCount, limit);
		});
	}, [checkedCount, setCheckboxes, limit]);

	const checkboxSetter = useCallback(
		function checkboxSetter(index: number) {
			return (checked: boolean) => {
				setCheckboxes(
					produce((individualXp: Draft<boolean[]>) => {
						individualXp[index] = checked;
						const count = sumCheckboxes(individualXp);
						if (count !== checkedCount) {
							setCount(count);
						}
					})
				);
			};
		},
		[checkedCount, setCheckboxes, setCount]
	);

	return [individualCheckboxes, checkboxSetter] as const;
}
