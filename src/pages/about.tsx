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
			<div className="border border-gray-400 bg-gray-100 px-4 md:px-6 pt-5 pb-6 mt-3 mb-6 rounded-lg shadow">
				{/* <h1 className="text-3xl font-bold mb-3">About Us Page</h1> */}
				<div className="h-30 overflow-hidden rounded-t flex items-center justify-center relative">
					<img
						src={img}
						alt="about"
						className="object-cover w-full mb-4"
					/>
					<div className="w-full h-full absolute bg-gray-900 opacity-50"></div>
					<div className="absolute z-10 text-white text-3xl font-bold">
						ABOUT US
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
							className="w-full px-3 py-2 text-white border  bg-gray-800 placeholder-gray-400 border-gray-30 rounded-md h-26 focus:outline-none focus:ring-gray-300 focus:border-gray-300"
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
