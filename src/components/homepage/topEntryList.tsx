import type { BracketChallengeInfo } from "../../data/adminData";
// import { useAdmin } from "../../context/admin/AdminProvider";
import { Link } from "react-router-dom";
import StatusPills from "../statusPills";
import Detail from "../detail";
import { useAuth } from "../../context/auth/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface topEntryListProps {
	bracketChallenge: BracketChallengeInfo;
}

const TopEntryList = ({ bracketChallenge }: topEntryListProps) => {
	const { user, isAuthenticated } = useAuth();

	return (
		<div className="overflow-hidden border border-gray-500 rounded">
			<div className="min-w-[350px]">
				<div
					className={`px-3 py-2 text-white flex items-center gap-x-2 shadow ${
						bracketChallenge.league == "NBA"
							? "bg-red-600"
							: "bg-blue-700"
					}`}
				>
					<p className="text-xs py-0.5 text-white bg-black/30 px-2">
						Bracket Challenge{" "}
					</p>
					<Link
						to={`/bracket-challenges/${bracketChallenge.slug}`}
						className="text-white text-xs border-b font-semibold hover:text-gray-300"
					>
						{bracketChallenge.name}
						<FontAwesomeIcon
							icon="external-link"
							size="sm"
							className="ms-2"
						/>
					</Link>
				</div>
				<div className="px-6 pt-4 pb-6 bg-gray-800 ">
					{bracketChallenge.entries.length > 0 ? (
						<>
							<p className="text-gray-700 text-sm font-bold text-white mb-2">
								TOP SUBMITTED ENTRIES
							</p>

							{bracketChallenge.entries.map((entry, index) => (
								<Link
									to={`/bracket-challenge-entries/${entry.slug}`}
									key={entry.id}
									className=" text-sm text-white border-t border-gray-500 last:border-b block flex items-center justify-center gap-x-3 hover:bg-gray-700"
								>
									<div className="flex-none w-10 text-2xl font-bold ps-2">
										{index + 1 < 10 ? `0${index + 1}` : index + 1}
									</div>
									<div className="flex-1 sm:grid md:grid-cols-2 lg:grid-cols-3 px-1 py-2 space-y-1">
										<Detail label="User">
											<span
												className={`${
													isAuthenticated &&
													user &&
													user.id == entry.user.id &&
													"text-yellow-400 font-semibold"
												}`}
											>
												{entry.user.username}
											</span>
										</Detail>
										<Detail label="Correct Picks Count">
											{entry.correct_predictions_count}
										</Detail>
										<Detail label="Status">
											<StatusPills status={entry.status} />
										</Detail>
									</div>
								</Link>
							))}
						</>
					) : (
						<>
							<p className="text-white px-2 py-1">
								No entries submittted for this challenge.
							</p>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default TopEntryList;
