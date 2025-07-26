import { type MetaInfo } from "../data/adminData";

interface PaginationProps {
	meta: MetaInfo | null;
	className?: string;
	onPageChange: (page: number) => void;
}

const Pagination = ({ meta, className, onPageChange }: PaginationProps) => {
	const handlePageChange = (page: number) => {
		onPageChange(page);
	};

	const getLabel = (index: number, label: string): string => {
		if (meta === null) return "";
		if (index == 0) return "previous";
		if (index > meta.last_page) return "next";
		return label;
	};

	const getPageNumberFromUrl = (url: string | null): number | null => {
		if (!url) return null;
		try {
			const urlObj = new URL(url);
			const pageParam = urlObj.searchParams.get("page");
			return pageParam ? parseInt(pageParam, 10) : null;
		} catch (e) {
			console.error("Error parsing URL for page number:", url, e);
			return null;
		}
	};

	if (!meta) return null;

	if (meta.total === 0) return null;

	return (
		<div className={`${className}`}>
			<div className="flex gap-x-0.5 flex-wrap">
				{meta.links.map((link, index) => (
					<button
						key={index + 1}
						className={`px-2 py-0.5  ${
							link.active ? "bg-red-500 text-white" : ""
						} ${
							link.url && !link.active
								? "bg-gray-700 hover:bg-gray-600 text-white cursor-pointer"
								: "bg-gray-200 text-gray-600"
						}`}
						onClick={() => {
							if (!link.url) return;
							handlePageChange(getPageNumberFromUrl(link.url) || 1);
						}}
						disabled={!link.url || link.active}
					>
						{getLabel(index, link.label)}
					</button>
				))}
			</div>
			<p className="text-xs mt-1.5 font-medium">
				Showing {meta.from} to {meta.to} of {meta.total} entries on page{" "}
				{meta.current_page}
			</p>
		</div>
	);
};
export default Pagination;
