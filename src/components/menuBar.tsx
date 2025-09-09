import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { TabInfo } from "../data/adminData";
import gsap from "gsap";

interface MenuBarProps<T extends string | number> {
	activeTab: T;
	tabs: TabInfo<T>[];
	onClick: (tab: T) => void;
	isLoading: boolean;
	className?: string;
	tabsCount?: Record<T, number> | null;
}

const MenuBar = <T extends string | number>({
	activeTab,
	tabs,
	isLoading,
	className,
	tabsCount,
	onClick,
}: MenuBarProps<T>) => {
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [tabTitle, setTabTitle] = useState<string>("");
	const menuRef = useRef<HTMLDivElement>(null);
	const parentMenuRef = useOutsideClick<HTMLDivElement>(() => {
		// 2. Callback function: close the dropdown when an outside click occurs
		setShowMenu(false);
	});

	const getLabel = (tab: TabInfo<T>): string => {
		if (tabsCount && tabsCount[tab.tab] > 0) {
			return `${tab.label} (${tabsCount[tab.tab]})`;
		}
		return tab.label;
	};

	const handleMenuClick = (tab: T) => {
		onClick(tab);
		setShowMenu(false);
	};

	useEffect(() => {
		const tab = tabs.find((tab) => tab.tab == activeTab);
		if (tab) {
			setTabTitle(getLabel(tab));
		}
	}, [activeTab, getLabel]);

	useEffect(() => {
		if (showMenu && menuRef.current) {
			gsap.fromTo(
				menuRef.current,
				{ scale: 0 },
				{
					scale: 1,
					duration: 0.4,
					ease: "elastic.out(1, 0.6)",
					transformOrigin: "top left",
				}
			);
		}
		return () => {
			if (menuRef.current) {
				gsap.killTweensOf(menuRef.current);
			}
		};
	}, [showMenu]);

	useEffect(() => {
		const handleResize = () => {
			setShowMenu(false);
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div ref={parentMenuRef} className={`inline-block ${className}`}>
			<div className="flex items-center relative space-x-0.5">
				<button
					className="w-7 aspect-square rounded-full cursor-pointer hover:bg-gray-600"
					onClick={() => setShowMenu((prev) => !prev)}
				>
					<FontAwesomeIcon icon="bars" />
				</button>
				<span className="font-semibold text-sm">{tabTitle}</span>
			</div>
			{showMenu && (
				<div
					ref={menuRef}
					className="absolute z-10 w-44 border border-gray-500 shadow rounded overflow-hidden"
				>
					{tabs.map((t) => (
						<button
							key={t.id}
							className={`py-1.5 px-3 text-left text-sm w-full font-semibold ${
								t.tab == activeTab
									? "bg-gray-800/90 text-amber-400"
									: "bg-gray-600/90 hover:bg-gray-500/90 cursor-pointer"
							}`}
							onClick={() => handleMenuClick(t.tab)}
							disabled={isLoading || t.tab == activeTab}
						>
							{t.type == "link" ? (
								<>
									<span>{t.label}</span>
									<FontAwesomeIcon
										icon="external-link"
										size="sm"
										className="ms-2"
									/>
								</>
							) : (
								<span>{getLabel(t)}</span>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default MenuBar;
