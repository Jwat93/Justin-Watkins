// JavaScript Document

document.addEventListener("DOMContentLoaded", () => {
    const descLogo = document.getElementById("desc_logo");

    function updateLogoSource() {
        if (window.matchMedia("(min-width: 35em)").matches) {
            descLogo.src = "images/aoi_text.png";
        } else {
            descLogo.src = "images/agent_short.png";
        }
    }

    updateLogoSource();

    window.addEventListener("resize", updateLogoSource);
});

document.addEventListener("DOMContentLoaded", () => {

	const apparel = document.getElementById("apparel");
	const appCover = document.getElementById("app_cover");
	const appTitle = document.getElementById("app_title");

	apparel.addEventListener("mouseenter", () => {

		if (document.getElementById("aoi_list")) return;

		appTitle.style.display = "none";

		appCover.id = "app_hover";

		const aoiList = document.createElement("div");
		aoiList.id = "aoi_list";

		const shirts = [
			"Files/aoi_shirt1.png",
			"Files/aoi_shirt2.png",
			"Files/aoi_shirt3.png"
		];

		shirts.forEach(src => {

			const aoiEl = document.createElement("div");
			aoiEl.className = "aoi_el";

			const img = document.createElement("img");
			img.className = "aoi_img";
			img.src = src;

			aoiEl.appendChild(img);

			aoiList.appendChild(aoiEl);
		});

		apparel.appendChild(aoiList);
	});

	apparel.addEventListener("mouseleave", () => {

		appTitle.style.display = "";

		appCover.id = "app_cover";

		const list = document.getElementById("aoi_list");

		if (list) {
			list.remove();
		}
	});
});