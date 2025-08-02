import AdminThumbs from "../../components/adminThumbnails";
import { apiClient } from "../../utils/api";
import {
	type TotalsInfo,
	type ResourcesResponseInfo,
} from "../../data/adminData";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import ContentBase from "../../components/ContentBase";

const AdminDashboard = () => {
	const [totals, setTotals] = useState<TotalsInfo | null>(null);
	// const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchResourcesTotals = async () => {
		try {
			setTotals(null);
			// setIsLoading(true);
			const response = await apiClient.get<ResourcesResponseInfo>(
				"/admin/totals"
			);
			setTotals(response.data.totals);
		} catch (error) {
			console.log(error);
		} finally {
			// setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchResourcesTotals();
	}, []);

	return (
		<ContentBase className="py-7 px-4">
			<h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
			<p className="text-sm">Welcome to the admin dashboard!</p>
			{totals ? (
				<div className="md:grid grid-cols-2 xl:grid-cols-3 space-y-3 md:space-y-0 mt-6 gap-3">
					{/* users */}
					<AdminThumbs
						resource="users"
						total={totals.userTotal}
						description="View and manage users."
						bgColor="green"
					/>

					{/* challenges */}
					<AdminThumbs
						resource="bracket-challenges"
						total={totals.bracketChallengeTotal}
						description="View and manage bracket challenges."
						bgColor="orange"
						withAddBtn={true}
					/>

					{/* leagues */}
					<AdminThumbs
						resource="leagues"
						total={totals.leagueTotal}
						description="View and manage basketball leagues."
						bgColor="yellow"
						withAddBtn={true}
					/>

					{/* teams */}
					<AdminThumbs
						resource="teams"
						total={totals.teamTotal}
						description="View and manage basketball teams."
						bgColor="blue"
						withAddBtn={true}
					/>

					<AdminThumbs
						resource="bracket-challenge-entries"
						total={0}
						description="View and manage basketball teams."
						bgColor="cyan"
						withAddBtn={true}
					/>
				</div>
			) : (
				<div className="mt-6 flex border border-gray-300 text-gray-400 rounded bg-gray-100 shadow justify-center items-center h-42">
					<p className="font-semibold">Loading admin resources..</p>
				</div>
			)}
			{!totals && <Loader />}
		</ContentBase>
	);
};

export default AdminDashboard;
