import Conference from "../bracket/conference";
import PBAFinals from "../bracket/pbaFinals";

const PBABracket = () => {
	return (
		<div className="overflow-x-auto">
			<div className="flex items-center sm:justify-center gap-x-6 mb-3">
				<Conference league="PBA" className="max-w-lg flex-none" />
				<PBAFinals className="max-w-44 flex-none" />
			</div>
		</div>
	);
};

export default PBABracket;
