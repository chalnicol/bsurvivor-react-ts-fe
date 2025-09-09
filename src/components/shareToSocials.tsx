import fbImage from "../assets/socials/fb.png";
import xImage from "../assets/socials/x.png";

interface ShareToSocialsProps {
	className?: string;
}

const ShareToSocials = ({ className }: ShareToSocialsProps) => {
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
		<div
			className={`inline-flex items-center space-x-3 bg-white border border-gray-400 shadow p-1 rounded-full ${className}`}
		>
			<img
				src={fbImage}
				alt="fb"
				className="h-7 aspect-square object-contain rounded-full cursor-pointer hover:opacity-80"
				onClick={handleShareToFacebook}
			/>
			<img
				src={xImage}
				alt="x"
				className="h-7 aspect-square object-contain rounded-full cursor-pointer hover:opacity-80"
				onClick={handleShareToX}
			/>
		</div>
	);
};

export default ShareToSocials;
