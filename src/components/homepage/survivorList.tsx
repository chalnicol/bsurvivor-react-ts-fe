import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const SurvivorList = () => {
	return (
		<div>
			<h2 className="text-lg font-bold mb-2">
				<FontAwesomeIcon icon="caret-right" /> Survivors
			</h2>
			<div className="md:flex gap-x-4 space-y-2 mb-4">
				{/* nba */}
				<div className="flex-1">
					<div className="px-2 py-1 bg-red-600 text-white flex items-center">
						<p className="font-semibold flex-1">NBA (19)</p>
						<Link
							to="/nba"
							className="text-xs font-semibold border hover:bg-red-600 py-0.5 px-3 rounded"
						>
							View All
						</Link>
					</div>
					<div className="text-sm">
						<p className="p-1 odd:bg-gray-200 even:bg-gray-50">
							chalnicol
						</p>
						<p className="p-1 odd:bg-gray-200 even:bg-gray-50">
							chalnicol
						</p>
						<p className="p-1 odd:bg-gray-200 even:bg-gray-50">
							chalnicol
						</p>
					</div>
				</div>
				{/* pba */}
				<div className="flex-1">
					<div className="px-2 py-1 bg-blue-800 text-white flex items-center">
						<p className="font-semibold flex-1">PBA (29)</p>
						<Link
							to="/pba"
							className="text-xs font-semibold border hover:bg-blue-800 py-0.5 px-3 rounded"
						>
							View All
						</Link>
					</div>
					<div className="text-sm">
						<p className="p-1 odd:bg-gray-200 even:bg-gray-100">
							chalnicol
						</p>
						<p className="p-1 odd:bg-gray-200 even:bg-gray-100">
							chalnicol
						</p>
						<p className="p-1 odd:bg-gray-200 even:bg-gray-100">
							chalnicol
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SurvivorList;
