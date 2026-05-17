// JavaScript Document

document.addEventListener("DOMContentLoaded", () => {

	const scripts = document.querySelectorAll("script[src]");

	scripts.forEach(script => {
		script.removeAttribute("src");
	});

	initNavigation();
	initContentSystem();
});

function initNavigation(){

	const header = document.createElement("header");

	const main = document.createElement("a");
	main.id = "main";
	main.href = "index.html";

	const mainImg = document.createElement("img");
	mainImg.src = "Images/Bostin Calling.png";

	const menu = document.createElement("div");
	menu.id = "menu";

	const me1 = document.createElement("div");
	me1.id = "me1";

	const me2 = document.createElement("div");
	me2.id = "me2";

	let list = null;

	function createList(){

		if(list) return;

		list = document.createElement("div");
		list.id = "list";

		const cover = document.createElement("div");
		cover.id = "cover";

		document.body.style.overflow = "hidden";

		cover.innerHTML = `
			<a class="link" href="blu_cel.html">
				<img class="icon" src="Images/blue_cel.svg" alt="">
				<p>Blue Cel</p>
				<img class="decor" src="Images/decor.png" alt="">
			</a>

			<a class="link" href="spectra phase.html">
				<img class="icon" src="Images/Spectra Phase.png" alt="">
				<p>Spectra Phase</p>
				<img class="decor" src="Images/decor.png" alt="">
			</a>

			<a class="link" href="senticlense.html">
				<img class="icon" src="senticlense_logo.png" alt="">
				<p>Senticlense</p>
				<img class="decor" src="Images/decor.png" alt="">
			</a>

			<a class="link" href="aoi.html">
				<img class="icon" src="Images/aoi.png" alt="">
				<p>Agents of Influence</p>
				<img class="decor" src="Images/decor.png" alt="">
			</a>

			<hr>

			<p id="establishment">
				THE ART OF JUSTIN WATKINS
			</p>
		`;

		list.appendChild(cover);
		document.body.appendChild(list);
	}

	function removeList(){

		list?.remove();
		list = null;

		document.body.style.overflow = "";
	}

	menu.addEventListener("click", e => {

		e.stopPropagation();

		const active = menu.id === "menu_active";

		if(!active){

			menu.id = "menu_active";
			me1.id = "me1_active";
			me2.id = "me2_active";

			createList();

		}else{

			menu.id = "menu";
			me1.id = "me1";
			me2.id = "me2";

			removeList();
		}
	});

	document.addEventListener("click", e => {

		if(!menu.contains(e.target)){

			menu.id = "menu";
			me1.id = "me1";
			me2.id = "me2";

			removeList();
		}
	});

	window.addEventListener("resize", () => {

		menu.id = "menu";
		me1.id = "me1";
		me2.id = "me2";

		removeList();
	});

	menu.append(me1, me2);
	main.appendChild(mainImg);
	header.append(main, menu);

	document.body.appendChild(header);
}

function initContentSystem(){

	const mobileQuery = window.matchMedia("(max-width: 45em)");

	const wraps = document.querySelectorAll(".con_wrap");
	const marks = document.querySelectorAll(".mark");
	const titles = document.querySelectorAll(".title");
	const descs = document.querySelectorAll(".desc");
	const navs = document.querySelectorAll(".nav");

	let activeIndex = 0;

	function applyState(){

		const isMobile = mobileQuery.matches;

		if(isMobile){

			wraps.forEach((el, i) => {
				el.classList.toggle("active", i === activeIndex);
			});

			marks.forEach((el, i) => {
				el.classList.toggle("active", i === activeIndex);
			});

			titles.forEach((el, i) => {
				el.classList.toggle("active", i === activeIndex);
			});

			descs.forEach((el, i) => {
				el.classList.toggle("active", i === activeIndex);
			});

		}else{

			wraps.forEach(el => el.classList.add("active"));
			marks.forEach(el => el.classList.remove("active"));
			titles.forEach(el => el.classList.add("active"));
			descs.forEach(el => el.classList.add("active"));
		}
	}

	navs.forEach((nav, index) => {

		nav.addEventListener("click", () => {

			if(!mobileQuery.matches) return;

			activeIndex = index;

			applyState();
		});
	});

	window.addEventListener("resize", applyState);

	applyState();
}