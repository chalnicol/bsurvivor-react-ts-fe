import Conference from "../bracket/conference";
import NBAFinals from "../bracket/nbaFinals";
const NBABracket = () => {
	return (
		<div className="overflow-x-auto">
			<div className="flex gap-x-6 items-center min-w-4xl mb-3">
				<Conference league="NBA" conference="EAST" className="flex-1" />
				<NBAFinals />
				<Conference league="NBA" conference="WEST" className="flex-1" />
			</div>
		</div>
	);
};

export default NBABracket;
