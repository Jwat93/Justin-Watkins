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

    cover.innerHTML = `
        <a class="link" href="blue_cel.html">
            <img class="icon" src="Images/blue_cel.svg" alt="Blu Cel">
            <p>Blue Cel</p>
            <img class="decor" src="images/decor.png" alt="">
        </a>

        <a class="link" href="spectra phase.html">
            <img class="icon" src="Images/aoi.png" alt="Agents of Influence">
            <p>Spectra Phase</p>
            <img class="decor" src="images/decor.png" alt="">
        </a>

        <a class="link" href="senticlense.html">
            <img class="icon" src="senticlense_logo.png" alt="Senticlense">
            <p>Senticlense</p>
            <img class="decor" src="images/decor.png" alt="">
        </a>

        <a class="link" href="aoi.html">
            <img class="icon" src="images/aoi.png" alt="Agents of Influence">
            <p>Agents of Influence</p>
            <img class="decor" src="images/decor.png" alt="">
        </a>
    `;

    list.appendChild(cover);
    document.body.appendChild(list);
}

// -----------------------------
// LIST REMOVE (SAFE)
// -----------------------------
function removeList() {
    list?.remove();
    list = null;
}

// -----------------------------
// MENU TOGGLE
// -----------------------------
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

// -----------------------------
// CLICK OUTSIDE CLOSE
// -----------------------------
document.addEventListener("click", (e) => {

    if (!menu.contains(e.target)) {

        menu.id = "menu";
        me1.id = "me1";
        me2.id = "me2";

        removeList();
    }
});

// -----------------------------
// RESIZE RESET
// -----------------------------
window.addEventListener("resize", () => {

    menu.id = "menu";
    me1.id = "me1";
    me2.id = "me2";

    removeList();
});

// -----------------------------
// BUILD DOM
// -----------------------------
menu.append(me1, me2);
main.appendChild(mainImg);
header.append(main, menu);
document.body.appendChild(header);