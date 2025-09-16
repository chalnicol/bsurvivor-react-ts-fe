import { Link } from "react-router-dom";

interface FooterProps {
	className?: string;
}
const Footer = ({ className }: FooterProps) => {
	return (
		<footer className={`bg-gray-800 text-white text-sm ${className}`}>
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col md:flex-row items-center justify-center py-2 gap-x-3 space-y-1 md:space-y-0">
					<p>&copy; 2025 Basketball Survivor. All rights reserved.</p>
					<div className="space-x-3">
						<Link
							to="/terms-of-service"
							className="text-teal-400 hover:text-teal-300 underline"
						>
							Terms of Service
						</Link>
						<Link
							to="/privacy-policy"
							className="text-teal-400 hover:text-teal-300 underline"
						>
							Privacy Policy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
