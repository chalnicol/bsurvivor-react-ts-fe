const Hero = () => {
	return (
		<div className="h-60 md:h-100  overflow-hidden">
			<img
				src={"/images/hero_image.jpg"}
				alt=""
				className=" w-full h-full object-cover object-[50%_48%] rounded-b-lg"
			/>
		</div>
	);
};

export default Hero;
