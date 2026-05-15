// JavaScript Document

document.addEventListener("DOMContentLoaded", () => {
	const scripts = document.querySelectorAll("script[src]");

	scripts.forEach(script => {
		script.removeAttribute("src");
	});
});

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

function createList() {
    if (list) return;

    list = document.createElement("div");
    list.id = "list";

    const cover = document.createElement("div");
	cover.id = "cover";
	
	document.body.style.overflow = "hidden";

    cover.innerHTML = `
        <a class="link" href="blu_cel.html">
            <img class="icon" src="Images/blue_cel.svg" alt="Blu Cel">
            <p>Blue Cel</p>
            <img class="decor" src="Images/decor.png" alt="">
        </a>
		<a class="link" href="spectra phase.html">
            <img class="icon" src="Images/Spectra Phase.png" alt="Spectra Phase">
            <p>Spectra Phase</p>
            <img class="decor" src="Images/decor.png" alt="">
        </a>
        <a class="link" href="senticlense.html">
            <img class="icon" src="senticlense_logo.png" alt="Senticlense">
            <p>Senticlense</p>
            <img class="decor" src="Images/decor.png" alt="">
        </a>
        <a class="link" href="aoi.html">
            <img class="icon" src="Images/aoi.png" alt="Agents of Influence">
            <p>Agents of Influence</p>
            <img class="decor" src="Images/decor.png" alt="">
        </a>
    `;

    list.appendChild(cover);
    document.body.appendChild(list);
}

function removeList() {
    list?.remove();
    list = null;
	document.body.style.overflow = "";
}
	
const mobileQuery = window.matchMedia("(max-width: 45em)");

const cons = document.querySelectorAll("#con_img img");
const marks = document.querySelectorAll(".mark");
const titles = document.querySelectorAll(".title");
const descs = document.querySelectorAll(".desc");
const navs = document.querySelectorAll(".nav");

let activeIndex = 0;

function applyState() {

	const isMobile = mobileQuery.matches;

	if (isMobile) {

		cons.forEach((el, i) => {
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

	} else {

		/* IMPORTANT:
		   Do NOT try to manage visibility here.
		   CSS fully controls desktop state. */

		cons.forEach(el => el.classList.remove("active"));
		marks.forEach(el => el.classList.remove("active"));
		titles.forEach(el => el.classList.remove("active"));
		descs.forEach(el => el.classList.remove("active"));
	}
}

navs.forEach((nav, index) => {
	nav.addEventListener("click", () => {
		activeIndex = index;
		applyState();
	});
});

window.addEventListener("resize", applyState);

applyState();

menu.addEventListener("click", (e) => {
    e.stopPropagation();

    if (me1.id === "me1") {
        menu.id = "menu_active";
        me1.id = "me1_active";
        me2.id = "me2_active";

        createList();

    } else {
        menu.id = "menu";
        me1.id = "me1";
        me2.id = "me2";

        removeList();
    }
});

document.addEventListener("click", (e) => {

    if (!menu.contains(e.target)) {

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