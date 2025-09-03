import img from "../assets/bsurvivor.png";

const Icon = ({ className }: { className: string }) => {
	return <img src={img} alt="icon" className={className} />;
};

export default Icon;
