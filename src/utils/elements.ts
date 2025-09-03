export const isElementInViewport = (el: HTMLDivElement) => {
	if (!el) return false;
	const rect = el.getBoundingClientRect();
	const viewportHeight =
		window.innerHeight || document.documentElement.clientHeight;
	const viewportWidth =
		window.innerWidth || document.documentElement.clientWidth;

	// Check if the element is either above, below, to the left, or to the right of the viewport.
	const isOutOfView =
		rect.top >= viewportHeight ||
		rect.left >= viewportWidth ||
		rect.bottom <= 0 ||
		rect.right <= 0;

	// The element is in the viewport if it's NOT out of view.
	return !isOutOfView;
};
