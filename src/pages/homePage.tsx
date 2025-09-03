import BracketChallengeActiveList from "../components/homepage/bracketChallengesActiveList";
import Hero from "../components/hero";
import TopEntries from "../components/homepage/topEntries";
import ContentBase from "../components/contentBase";
import { useAuth } from "../context/auth/AuthProvider";
import LoadAuth from "../components/auth/loadAuth";
import EndOfPage from "../components/endOfPage";

const HomePage = () => {
	const { authLoading } = useAuth();

	if (authLoading) {
		return <LoadAuth />;
	}

	// return <LoadAuth />;

	return (
		<ContentBase className="py-0 px-4">
			<Hero />
			<div className="border border-gray-400 bg-gray-100 shadow px-4 pt-4 md:px-6 md:pt-6 rounded-lg mt-4">
				<h1 className="text-4xl font-bold">
					Welcome to Basketball Survivor!
				</h1>
				<p className="text-justify mt-2">
					Ready to put your prediction skills to the test? Welcome to
					Basketball Survivor! Choose wisely across different leagues, make
					those winning picks, and outplay the competition to be the last
					survivor. Make your predictions count!
				</p>

				<div className="space-y-8 my-8">
					<BracketChallengeActiveList />
					<TopEntries />
				</div>
			</div>

			<EndOfPage className="my-6" />
		</ContentBase>
	);
};
export default HomePage;
