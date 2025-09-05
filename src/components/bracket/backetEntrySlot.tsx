import { Link } from "react-router-dom";
import type { BracketChallengeEntryInfo } from "../../data/adminData";
import Detail from "../detail";
import { displayLocalDate } from "../../utils/dateTime";

interface BracketEntrySlotProps {
	entry: BracketChallengeEntryInfo;
}
const BracketEntrySlot = ({ entry }: BracketEntrySlotProps) => {
	const getStatusBgColorClass = (status: string) => {
		switch (status) {
			case "won":
				return "bg-gree-600";
			case "eliminated":
				return "bg-red-600";
			case "active":
				return "bg-blue-600";
			default:
				return "bg-gray-600";
		}
	};

	return (
		<Link to={`/bracket-challenge-entries/${entry.slug}`} key={entry.id}>
			<div className="sm:grid md:grid-cols-2 xl:grid-cols-3 px-4 py-3 space-y-1 border hover:bg-gray-700 mb-1 text-sm bg-gray-800 text-white rounded">
				<Detail label="Entry Name">{entry.name}</Detail>
				<Detail label="League">{entry.bracket_challenge.league}</Detail>
				<Detail label="Bracket Challenge">
					{entry.bracket_challenge.name}
				</Detail>

				<Detail label="Date Submitted">
					{displayLocalDate(entry.created_at)}
				</Detail>
				<Detail label="Status">
					<span
						className={`${getStatusBgColorClass(
							entry.status
						)} text-white font-bold px-3 rounded text-xs select-none`}
					>
						{entry.status.toLocaleUpperCase()}
					</span>
				</Detail>
			</div>
		</Link>
	);
};

export default BracketEntrySlot;
