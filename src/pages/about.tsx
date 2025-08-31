import ContentBase from "../components/contentBase";
import EndOfPage from "../components/endOfPage";
import img from "../assets/about.jpg";
import { useState } from "react";
import apiClient from "../utils/axiosConfig";
import StatusMessage from "../components/statusMessage";
import Loader from "../components/loader";

const About = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [name, setName] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const leaveMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await apiClient.post("/leave-message", {
				email,
				message,
				name,
			});
			setSuccess("Message sent successfully");
			setEmail("");
			setMessage("");
			setName("");
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ContentBase className="p-4">
			<div className="border border-gray-400 bg-gray-100 p-4 mt-3 mb-6 rounded-lg shadow">
				{/* <h1 className="text-3xl font-bold mb-3">About Us Page</h1> */}
				<div className="h-30 overflow-hidden rounded-t flex items-center justify-center relative">
					<img
						src={img}
						alt="about"
						className="object-cover w-full mb-4"
					/>
					<div className="w-full h-full absolute bg-gray-900 opacity-50"></div>
					<div className="absolute z-10 text-white text-3xl font-bold">
						About Page
					</div>
				</div>
				<div className="bg-gray-800 text-white rounded-b px-6 py-6 pb-12">
					<p className="font-medium mb-5">
						Welcome to the ultimate hub for basketball fanatics and
						prediction pros! Our Bracket Challenge is designed for fans,
						to bring an extra layer of excitement to every thrilling
						moment of the NBA & PBA Playoffs. We believe in the power of
						friendly competition, the agony of a busted bracket, and the
						sheer joy of watching your dark horse pick defy the odds.
					</p>

					<h2 className="text-xl font-bold mb-2">Behind The Bracket</h2>
					<p className="font-medium">
						I'm Charlou Nicolas, the creator of this Basketball Survivor.
						This platform is the result of my lifelong obsession with
						basketball and a personal mission to build something truly
						special for fellow fans.
					</p>
					<p className="font-medium mt-2">
						I've been a die-hard basketball enthusiast for as long as I
						can remember. From the agony of a busted bracket to the thrill
						of an underdog victory, I understand the emotional
						rollercoaster of the playoffs. With a professional background
						in software development, I decided to combine my skills and
						passion to create a better, more engaging experience for
						everyone.
					</p>

					<h2 className="mt-6 text-xl font-bold mb-2">Our Mission</h2>
					<p className="font-medium">
						Our mission is to provide the most engaging and user-friendly
						bracket experience out there. We believe the NBA & PBA
						Playoffs are about more than just a championship—they're about
						community, competition, and shared moments of excitement.
					</p>
					<p className="font-medium mt-2">
						This platform is designed to be your ultimate hub for playoff
						predictions. It’s where you can test your knowledge, compete
						for bragging rights, and connect with other fans who love the
						game as much as you do.
					</p>

					<h2 className="mt-6 text-xl font-bold mb-2">
						What Makes This Platform Different?
					</h2>
					<p className="font-medium mb-1">
						We’ve focused on delivering an experience that is seamless,
						intuitive, and genuinely thrilling.
					</p>
					<ul className="list-disc pl-5 space-y-1">
						{/* <li>
							<strong>Real-time Updates :</strong> Track your bracket's
							progress in real-time, with live scores and standings that
							keep you on the edge of your seat.
						</li> */}
						<li>
							<strong>Intuitive Design :</strong> The platform is built
							to be clean and easy to use, so you can quickly fill out
							your bracket and get straight to the fun.
						</li>
						<li>
							<strong>A Fan-First Approach :</strong> Everything about
							this platform, from the features to the content, is
							designed to amplify the excitement of the playoffs and
							bring fans closer to the game.
						</li>
					</ul>

					<h2 className="mt-6 text-xl font-bold mb-2">
						Join the Community
					</h2>
					<p className="font-medium">
						Beyond just predictions, our Bracket Challenge is about
						community. It's where you can compete for bragging rights,
						share your insights (or commiserate over unexpected upsets!),
						and feel more connected to the game you love.
					</p>

					<hr className="my-6 border-gray-400" />
					{error && (
						<StatusMessage
							type="error"
							onClose={() => setError(null)}
							message={error}
						></StatusMessage>
					)}
					{success && (
						<StatusMessage
							type="success"
							onClose={() => setSuccess(null)}
							message={success}
						></StatusMessage>
					)}
					<h4 className="text-xl font-bold mb-2">Leave A Message</h4>
					<form onSubmit={leaveMessage} className="space-y-3">
						<input
							type="name"
							id="name"
							value={name}
							className="w-full px-3 py-2 text-white border autofill:bg-gray-800 placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-300 focus:border-gray-300"
							onChange={(e) => setName(e.target.value)}
							disabled={isLoading}
							placeholder="Name"
							required
						/>
						<input
							type="email"
							id="email"
							value={email}
							className="w-full px-3 py-2 text-white border fill:bg-gray-800 placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-300 focus:border-gray-300"
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
							placeholder="Email"
							required
						/>
						<textarea
							id="message"
							value={message}
							className="w-full px-3 py-2 text-white border h-36 bg-gray-800 placeholder-gray-400 border-gray-30 rounded-md h-26 focus:outline-none focus:ring-gray-300 focus:border-gray-300"
							onChange={(e) => setMessage(e.target.value)}
							disabled={isLoading}
							required
							placeholder="Message"
						></textarea>
						<button
							className={`px-3 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white font-semibold cursor-pointer`}
							disabled={isLoading}
						>
							{isLoading ? "SENDING..." : "SEND MESSAGE"}
						</button>
					</form>
				</div>
			</div>
			{isLoading && <Loader />}
			<EndOfPage />
		</ContentBase>
	);
};
export default About;
