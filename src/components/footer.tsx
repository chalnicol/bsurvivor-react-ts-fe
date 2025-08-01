import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer>
			<div className="bg-gray-800 text-white">
				<div className="max-w-7xl mx-auto">
					<div className="flex justify-center py-2 gap-x-3">
						<p>&copy; 2023 Basketball Survivor. All rights reserved.</p>
						<div className="space-x-3">
							<Link
								to="/terms-of-service"
								className="text-red-400 underline"
							>
								Terms of Service
							</Link>
							<Link
								to="/privacy-policy"
								className="text-red-400 underline"
							>
								Privacy Policy
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
