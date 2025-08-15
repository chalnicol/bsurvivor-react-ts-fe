import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface EndOfPageProps {
	prompt?: string;
	className?: string;
}

const EndOfPage = ({ prompt, className }: EndOfPageProps) => {
	return (
		<div className={`my-4 text-gray-400 select-none ${className}`}>
			<p className="font-bold flex gap-x-2 items-center justify-center">
				<FontAwesomeIcon icon="star" size="xs" className="text-gray-400" />
				<FontAwesomeIcon icon="star" size="xs" className="text-gray-400" />
				{prompt || "END OF PAGE"}
				<FontAwesomeIcon icon="star" size="xs" className="text-gray-400" />
				<FontAwesomeIcon icon="star" size="xs" className="text-gray-400" />
			</p>
		</div>
	);
};

export default EndOfPage;
