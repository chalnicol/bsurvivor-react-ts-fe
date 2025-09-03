import fbImage from "../assets/socials/fb.png";
import xImage from "../assets/socials/x.png";

const ShareToSocials = () => {
	const handleShareToX = () => {
		const text = encodeURIComponent(
			"Check out my bracket predictions! #BracketChallenge"
		);
		const url = encodeURIComponent(window.location.href);
		window.open(
			`https://x.com/intent/tweet?text=${text}&url=${url}`,
			"_blank"
		);
	};

	const handleShareToFacebook = () => {
		const url = encodeURIComponent(window.location.href);
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${url}`,
			"_blank"
		);
	};

	return (
		<div className="flex items-center justify-end space-x-1 py-2">
			<span className="font-bold">SHARE</span>
			<img
				src={fbImage}
				alt="fb"
				className="h-8 object-contain shadow border border-gray-400 rounded p-1 cursor-pointer hover:bg-gray-200"
				onClick={handleShareToFacebook}
			/>
			<img
				src={xImage}
				alt="x"
				className="h-8 object-contain shadow border border-gray-400 rounded p-1 cursor-pointer hover:bg-gray-200"
				onClick={handleShareToX}
			/>
		</div>
	);
};

export default ShareToSocials;
