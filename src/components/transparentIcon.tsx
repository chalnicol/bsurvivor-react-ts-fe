import img from "../assets/logo/square_logo.png";

const TransparentIcon = ({ className }: { className: string }) => {
	return <img src={img} alt="icon" className={className} draggable="false" />;
};

export default TransparentIcon;
