import React, { useEffect, useRef } from "react";
import { Modal, ModalFooter, ModalContent, ModalButton, buttonStyles } from "./Modal";
import { randomShortString } from "./randomShortString";

type EditorModalProps<T> = {
	onRequestHide: () => void;
	show: boolean;
	setValueAndHide: (v: T) => void;
	value: T;
	children: (p: [T, React.Dispatch<React.SetStateAction<T>>]) => React.ReactNode;
	buttons?: null | React.ReactNode | ((p: [T, React.Dispatch<React.SetStateAction<T>>]) => React.ReactNode);
};

export function EditorModal<T>({ show, ...props }: EditorModalProps<T>) {
	const key = useMemoOnLatch(randomShortString(), show);
	return <EditorModalInner key={key} show={show} {...props} />;
}

function EditorModalInner<T>({
	onRequestHide,
	show,
	setValueAndHide,
	value: initial,
	children,
	buttons = null,
}: EditorModalProps<T>) {
	const state = React.useState(initial);

	return (
		<Modal onRequestHide={onRequestHide} show={show}>
			<form
				onSubmit={e => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<ModalContent>{children(state)}</ModalContent>
				<ModalFooter>
					<ModalButton
						type="submit"
						className={buttonStyles.green}
						onClick={e => {
							e.preventDefault();
							e.stopPropagation();
							setValueAndHide(state[0]);
						}}
					>
						OK
					</ModalButton>
					<ModalButton onClick={onRequestHide}>Cancel</ModalButton>
					{typeof buttons === "function" ? buttons(state) : buttons}
				</ModalFooter>
			</form>
		</Modal>
	);
}

/** Updates result when latch goes from false to true */
function useMemoOnLatch<T>(next: T, latch: boolean) {
	// Ref for storing previous value
	const previousRef = useRef<T>(next);
	const previous = previousRef.current;
	const latchRef = useRef<boolean>(latch);
	const prevLatch = latchRef.current;

	// If the old latch value was false and the new is true, we're changing.
	const isLatchChange = !prevLatch && latch;

	// We only update if latch change so that this hook continues to return
	// the same old value if compare keeps returning true.
	useEffect(() => {
		if (isLatchChange) {
			previousRef.current = next;
		}
	});

	// Finally, if it didn't change, return the previous value
	return isLatchChange ? next : previous;
}
