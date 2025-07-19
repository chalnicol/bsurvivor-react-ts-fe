import { Link } from "react-router-dom";

const BracketEntries = () => {
	return (
		<div className="py-7 min-h-[calc(100dvh-57px)]">
			<div>
				<h1 className="font-bold text-lg">Bracket Challenges Entries</h1>

				<div className="w-full lg:grid grid-cols-2 gap-x-4 space-y-4 mt-3">
					{/* nba */}
					<div className="overflow-hidden border rounded p-3 shadow-lg h-full">
						<h3 className="font-bold text-lg">NBA</h3>
						<hr className="border-0 border-b border-gray-400 my-2" />
						<div>
							<div className="flex gap-x-2 items-center even:bg-gray-200 py-1 px-2">
								<p className="flex-2 font-medium">NBA 2025</p>
								<div className="flex-1 font-semibold text-sm">
									<p className="text-white px-3 bg-amber-400 rounded w-20 text-xs py-0.5 font-bold text-center">
										LIVE
									</p>
								</div>
								<Link
									to="/nba"
									className="bg-gray-600 block hover:bg-gray-500 p-1 w-18 text-xs font-semibold text-white rounded text-center"
								>
									VIEW
								</Link>
							</div>
							<div className="flex gap-x-2 items-center even:bg-gray-200 py-1 px-2">
								<p className="flex-2 font-medium">NBA 2024</p>
								<div className="flex-1 font-semibold text-sm">
									<p className="text-white px-3 bg-red-500 rounded w-20 text-xs py-0.5 font-bold text-center">
										FAIL
									</p>
								</div>
								<Link
									to="/nba"
									className="bg-gray-600 hover:bg-gray-500 p-1 w-18 text-xs font-semibold text-white rounded text-center"
								>
									VIEW
								</Link>
							</div>
							<div className="flex gap-x-2 items-center even:bg-gray-200 py-1 px-2">
								<p className="flex-2 font-medium">NBA 2023</p>
								<div className="flex-1 font-semibold text-sm">
									<p className="text-white px-3 bg-green-500 rounded w-20 text-xs py-0.5 font-bold text-center">
										SUCCESS
									</p>
								</div>
								<Link
									to="/nba"
									className="bg-gray-600 hover:bg-gray-500 p-1 w-18 text-xs font-semibold text-white rounded text-center"
								>
									VIEW
								</Link>
							</div>
						</div>
					</div>
					{/* pba */}
					<div className="overflow-hidden border rounded p-3 shadow-lg h-full">
						<h3 className="font-bold text-lg">PBA</h3>
						<hr className="border-0 border-b border-gray-400 my-2" />
						<div>
							<div className="flex gap-x-2 items-center even:bg-gray-200 py-1 px-2">
								<p className="flex-2 font-medium">
									PBA GOVERNOR'S CUP 2025
								</p>
								<div className="flex-1 font-semibold text-sm">
									<p className="text-white px-3 bg-amber-400 rounded w-20 text-xs py-0.5 font-bold text-center">
										LIVE
									</p>
								</div>
								<Link
									to="/pba"
									className="bg-gray-600 hover:bg-gray-500 p-1 w-18 text-xs font-semibold text-white rounded text-center"
								>
									VIEW
								</Link>
							</div>
							<div className="flex gap-x-2 items-center even:bg-gray-200 py-1 px-2">
								<p className="flex-2 font-medium">
									PBA ALL-FILIPINO CUP 2025
								</p>
								<div className="flex-1 font-semibold text-sm">
									<p className="text-white px-3 bg-green-500 rounded w-20 text-xs py-0.5 font-bold text-center">
										SUCCESS
									</p>
								</div>
								<Link
									to="/pba"
									className="bg-gray-600 hover:bg-gray-500 p-1 w-18 text-xs font-semibold text-white rounded text-center"
								>
									VIEW
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BracketEntries;
