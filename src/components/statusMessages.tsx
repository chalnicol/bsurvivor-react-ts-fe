import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface StatusMessageProps {
	success?: string | null;
	error?: string | null;
}

const StatusMessage = ({ success, error }: StatusMessageProps) => {
	const [showMessage, setShowMessage] = useState<boolean>(false);

	useEffect(() => {
		let timerId: number | null = null;
		if (success || error) {
			setShowMessage(true);
			timerId = setTimeout(() => {
				setShowMessage(false);
			}, 3000);
		}
		return () => {
			if (timerId) {
				clearTimeout(timerId);
			}
			setShowMessage(false);
		};
	}, [success, error]);

	if (!showMessage) {
		return null;
	}

	return (
		<>
			{success && (
				<div className="w-full mt-2 relative flex justify-between items-center bg-green-600 text-white font-semibold px-3 py-2 rounded">
					<p>{success}</p>
					<button
						className="hover:bg-green-300 px-1 cursor-pointer"
						onClick={() => setShowMessage(false)}
					>
						<FontAwesomeIcon icon="xmark" />
					</button>
				</div>
			)}
			{error && (
				<div className="w-full mt-2 relative flex justify-between items-center bg-red-600 text-white font-semibold px-3 py-2 rounded">
					<p>{error}</p>
					<button
						className="hover:text-gray-100 px-1 cursor-pointer"
						onClick={() => setShowMessage(false)}
					>
						<FontAwesomeIcon icon="xmark" />
					</button>
				</div>
			)}
		</>
	);
};

export default StatusMessage;
