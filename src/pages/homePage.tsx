import BracketChallengeActiveList from "../components/homepage/bracketChallengesActiveList";
import Hero from "../components/hero";
import SurvivorList from "../components/homepage/survivorList";
import ContentBase from "../components/ContentBase";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HomePage = () => {
	return (
		<ContentBase className="px-4">
			<Hero />
			<div className="border border-gray-400 shadow px-4 pt-4 md:px-6 md:pt-6 rounded-lg mb-12 mt-6">
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
					<SurvivorList />
				</div>
			</div>
		</ContentBase>
	);
};
export default HomePage;
