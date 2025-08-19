import ContentBase from "../components/contentBase";
import EndOfPage from "../components/endOfPage";

const About = () => {
	return (
		<ContentBase className="p-4">
			<div className="border border-gray-400 bg-gray-100 px-4 md:px-6 pt-5 pb-6 mt-3 mb-6 rounded-lg shadow">
				<h1 className="text-3xl font-bold mb-3">About Page</h1>

				<div className="bg-gray-800 text-white rounded px-6 py-6 pb-12 mt-4">
					<p className="font-medium mb-5">
						Welcome to the ultimate hub for basketball fanatics and
						prediction pros! Our Bracket Challenge is designed by fans,
						for fans, to bring an extra layer of excitement to every
						thrilling moment of the NBA Playoffs. We believe in the power
						of friendly competition, the agony of a busted bracket, and
						the sheer joy of watching your dark horse pick defy the odds.
					</p>

					<h2 className="text-xl font-bold mb-2">Our Mission</h2>
					<p className="font-medium">
						Our mission is simple: to provide the most engaging,
						user-friendly, and thrilling bracket experience out there. We
						aim to connect fans, spark debate, and celebrate the shared
						passion for basketball.
					</p>
					<p className="font-medium mt-1">
						Whether you're a seasoned analyst with a meticulous strategy
						or just love picking your favorite teams, we've built this
						platform to enhance your playoff experience.
					</p>

					<h2 className="mt-6 text-xl font-bold mb-2">
						Who We Are / Our Team / The Organization Behind It
					</h2>
					<p className="font-medium">
						We are a passionate team of basketball enthusiasts, software
						developers, sports data analysts dedicated to enhancing your
						fan experience, building engaging platforms, delivering
						top-tier sports content.
					</p>
					<p className="font-medium mt-1">
						Our journey began with a simple idea to create the ultimate,
						free-to-play bracket challenge, to bring fans closer to the
						game. With a shared love for the sport and a commitment to
						innovation, we've poured our expertise into making this the
						best possible platform for you.
					</p>

					<h2 className="mt-6 text-xl font-bold mb-2">
						What Makes Us Different?
					</h2>
					<p className="font-medium">
						We focus on delivering a seamless and intuitive experience,
						allowing you to quickly fill out your bracket and track your
						progress in real-time. We understand the thrill of the chase,
						and our platform is built to amplify that excitement, keeping
						you updated on scores, standings, and who's still got a shot
						at bracket glory.
					</p>

					<h2 className="mt-6 text-xl font-bold mb-2">
						Join the Community
					</h2>
					<p className="font-medium">
						Beyond just predictions, our Bracket Challenge is about
						community. It's where you can compete for bragging rights,
						share your insights (or commiserate over unexpected upsets!),
						and feel more connected to the game you love.
					</p>
				</div>
			</div>
			<EndOfPage />
		</ContentBase>
	);
};
export default About;
