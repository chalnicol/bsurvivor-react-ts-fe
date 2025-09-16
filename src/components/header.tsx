import img from "../assets/about.jpg";

interface HeaderProps {
	title: string;
}
const Header = ({ title }: HeaderProps) => {
	return (
		<div className="h-30 overflow-hidden rounded-t flex items-center justify-center relative">
			<img src={img} alt="about" className="object-cover w-full mb-4" />
			<div className="w-full h-full absolute bg-gray-900 opacity-50"></div>
			<div className="absolute z-10 text-white text-3xl font-bold">
				{title}
			</div>
		</div>
	);
};
export default Header;
