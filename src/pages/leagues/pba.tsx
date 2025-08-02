import ContentBase from "../../components/ContentBase";

const PBAPage = () => {
	return (
		<ContentBase className="py-7 px-4">
			<div className="max-w-3xl mx-auto p-4 text-center">
				<h1 className="text-4xl font-bold mb-4">PBA Survivor</h1>
				<h6 className="text-justify text-sm">
					Welcome to the PBA Survivor! Make your picks wisely and outlast
					the competition. Choose your teams, make your predictions, and
					aim to be the last survivor in the league!
				</h6>
			</div>
			<div className="h-60 bg-gray-500 rounded"></div>
		</ContentBase>
	);
};
export default PBAPage;
