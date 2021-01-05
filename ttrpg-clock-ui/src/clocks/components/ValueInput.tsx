import React from "react";

export const ValueInput = React.forwardRef<
	HTMLInputElement,
	{
		setValue: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
	} & JSX.IntrinsicElements["input"]
>(({ value, setValue, className, ...props }, ref) => {
	if (process.env.NODE_ENV === "development" && !props.id) {
		console.warn("no id provided");
	}
	return (
		<input
			ref={ref}
			type="text"
			value={value}
			onChange={e => setValue(e.currentTarget.value, e)}
			className={`bg-white text-black border-pink border-2 ${className || ""}`}
			{...props}
		/>
	);
});
