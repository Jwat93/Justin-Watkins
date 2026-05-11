// JavaScript Document

// -----------------------------
// NAV
// -----------------------------

document.getElementById("upload").onclick = () => {
    up.style.display = "block";
    gal.style.display = "none";
    stry.style.display = "none";
};

document.getElementById("gallery").onclick = () => {
    up.style.display = "none";
    gal.style.display = "flex";
    stry.style.display = "none";
};

document.getElementById("storyboards").onclick = () => {
    up.style.display = "none";
    gal.style.display = "none";
    stry.style.display = "block";
};

// -----------------------------
// CORE
// -----------------------------

const upImg = document.getElementById("up_con");
const upWrap = document.getElementById("gal");

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/png, image/jpeg";
fileInput.multiple = true;
fileInput.style.display = "none";
document.body.appendChild(fileInput);

upImg.onclick = () => fileInput.click();

let activeEditor = null;

function safeParse(val) {
    try { return JSON.parse(val || "[]"); }
    catch { return []; }
}

function closeActiveEditor() {
    if (!activeEditor) return;
    activeEditor.remove();
    activeEditor = null;
}

document.addEventListener("click", (e) => {
    if (!activeEditor) return;
    if (!activeEditor.contains(e.target)) {
        const item = activeEditor.__item;
        activeEditor = null;
        renderLightbox(item);
    }
});

// -----------------------------
// GALLERY STATE
// -----------------------------

function updateGalleryState(gallery, emptyId, uploadSelector = null) {
    const hasItems = gallery.querySelector(".item");
    let placeholder = gallery.querySelector(`#${emptyId}`);
    let addBtn = uploadSelector ? gallery.querySelector(uploadSelector) : null;

    if (hasItems) {
        placeholder?.remove();
        if (addBtn) addBtn.style.display = "none";
        return;
    }

    if (addBtn) addBtn.style.display = "flex";

    if (!placeholder) {
        const p = document.createElement("p");
        p.id = emptyId;
        p.textContent = "NOTHING TO SEE HERE";
        gallery.appendChild(p);
    }
}

function updateImageCount() {
    const num = document.getElementById("img_num");
    if (!num) return;
    num.textContent = upWrap.querySelectorAll(".item").length;
}
		
function updateStoryCount() {
    const num = document.getElementById("story_num");
    const display = document.getElementById("display");
    if (!num || !display) return;

    num.textContent = display.querySelectorAll(".board").length;
}

function updateGalleryAlignment() {
    const hasItems = upWrap.querySelector(".item");
    upWrap.style.alignItems = hasItems ? "flex-start" : "center";
    upWrap.style.justifyContent = hasItems ? "flex-start" : "center";
}

// -----------------------------
// FILE UPLOAD
// -----------------------------

fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files);

    files.forEach(file => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();

        reader.onload = (e) => {

            const item = document.createElement("div");
            item.className = "item";
            item.dataset.tags = "[]";
            item.dataset.description = "";

            const remove = document.createElement("p");
            remove.className = "remove_item";
            remove.textContent = "X";

            const img = document.createElement("img");
            img.className = "content";
            img.src = e.target.result;

            const title = document.createElement("p");
            title.className = "title";
            title.textContent = file.name;

            const date = document.createElement("p");
            date.className = "date";
            date.textContent = new Date().toLocaleString();

            const wrap = document.createElement("div");
            wrap.className = "title_con";
            wrap.append(title, date);

            item.append(remove, img, wrap);

            remove.onclick = () => {
                item.remove();
                updateImageCount();
                updateGalleryState(upWrap, "no_gallery", "#upload_img");
                updateGalleryAlignment();
            };

            upWrap.prepend(item);

            updateImageCount();
            updateGalleryState(upWrap, "no_gallery", "#upload_img");
            updateGalleryAlignment();
        };

        reader.readAsDataURL(file);
    });

    fileInput.value = "";
});

// -----------------------------
// LIGHTBOX (FULL EDIT VERSION)
// -----------------------------

function renderLightbox(item) {
    document.getElementById("img_light")?.remove();

    const titleText = item.querySelector(".title")?.textContent || "";
    const dateText = item.querySelector(".date")?.textContent || "";
    const imgSrc = item.querySelector(".content")?.src || "";
    const tags = safeParse(item.dataset.tags);
    const desc = item.dataset.description || "";

    const imgLight = document.createElement("div");
    imgLight.id = "img_light";

    const imgBack = document.createElement("div");
    imgBack.id = "img_back";

    const imgCon = document.createElement("div");
    imgCon.id = "img_con";

    const exit = document.createElement("p");
    exit.id = "img_exit";
    exit.textContent = "X";

    const close = () => imgLight.remove();
    exit.onclick = close;
    imgBack.onclick = close;

    const imgWrap = document.createElement("div");
    imgWrap.id = "display_wrap";

    const img = document.createElement("img");
    img.id = "display_img";
    img.src = imgSrc;

    imgWrap.appendChild(img);

    const title = document.createElement("p");
    title.id = "display_title";
    title.textContent = titleText;

    title.onclick = (e) => {
        e.stopPropagation();
        closeActiveEditor();
        renderLightbox(item);

        requestAnimationFrame(() => {
            const wrap = document.createElement("div");
            wrap.id = "title_input_wrap";
            wrap.__item = item;

            const input = document.createElement("input");
            input.id = "title_input";
            input.maxLength = "48";
            input.value = titleText;

            const btn = document.createElement("button");
            btn.id = "title_submit";
            btn.textContent = "SUBMIT TITLE";

            const save = () => {
                const val = input.value.trim();
                if (val) item.querySelector(".title").textContent = val;
                closeActiveEditor();
                renderLightbox(item);
            };

            input.addEventListener("keydown", e => {
                if (e.key === "Enter") save();
            });

            btn.onclick = (e) => {
                e.stopPropagation();
                save();
            };

            wrap.append(input, btn);
            document.getElementById("display_title").replaceWith(wrap);

            activeEditor = wrap;
            input.focus();
        });
    };

    const date = document.createElement("p");
    date.id = "display_date";
    date.textContent = dateText;

    const tagLink = document.createElement("p");
    tagLink.id = "display_tags";
    tagLink.textContent = "Tags +";

    const tagSec = document.createElement("div");
    tagSec.id = "tag_sec";

    tags.forEach(t => {
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.textContent = t;

        const x = document.createElement("p");
        x.className = "remove";
        x.textContent = "X";

        x.onclick = (ev) => {
            ev.stopPropagation();
            const updated = safeParse(item.dataset.tags).filter(v => v !== t);
            item.dataset.tags = JSON.stringify(updated);
            renderLightbox(item);
        };

        tag.appendChild(x);
        tagSec.appendChild(tag);
    });

    tagLink.onclick = (e) => {
        e.stopPropagation();
        closeActiveEditor();
        renderLightbox(item);

        requestAnimationFrame(() => {
            const wrap = document.createElement("div");
            wrap.id = "input_wrap";
            wrap.__item = item;

            const input = document.createElement("input");
            input.id = "tag_input";
            input.maxLength = "36";

            const btn = document.createElement("button");
            btn.id = "tag_submit";
            btn.textContent = "ADD TAG";

            btn.onclick = () => {
                const val = input.value.trim();
                if (!val) return;

                const arr = safeParse(item.dataset.tags);
                if (!arr.includes(val)) arr.push(val);

                item.dataset.tags = JSON.stringify(arr);
                renderLightbox(item);
            };

            wrap.append(input, btn);
            document.getElementById("display_tags").replaceWith(wrap);

            activeEditor = wrap;
            input.focus();
        });
    };

    const descLink = document.createElement("p");
    descLink.id = "display_desc";
    descLink.textContent = "Description +";

    const descText = document.createElement("p");
    descText.id = "desc_text";
    descText.textContent = desc;

    descLink.onclick = (e) => {
        e.stopPropagation();
        closeActiveEditor();
        renderLightbox(item);

        requestAnimationFrame(() => {
            const wrap = document.createElement("div");
            wrap.id = "desc_input_wrap";
            wrap.__item = item;

            const textarea = document.createElement("textarea");
            textarea.id = "desc_input";
            textarea.value = desc;
            textarea.maxLength = "250";

            const btn = document.createElement("button");
            btn.id = "desc_submit";
            btn.textContent = "SAVE";

            btn.onclick = () => {
                item.dataset.description = textarea.value.trim();
                renderLightbox(item);
            };

            wrap.append(textarea, btn);
            document.getElementById("display_desc").replaceWith(wrap);

            document.getElementById("desc_text")?.remove();

            activeEditor = wrap;
            textarea.focus();
        });
    };

    imgCon.append(exit, imgWrap, title, date, tagLink);

    if (tags.length) imgCon.appendChild(tagSec);

    imgCon.append(descLink);

    if (desc) imgCon.appendChild(descText);

    imgLight.append(imgBack, imgCon);
    document.body.appendChild(imgLight);
}

// -----------------------------
// CLICK HANDLING
// -----------------------------

upWrap.addEventListener("click", (e) => {

    if (e.target.closest("#upload_img") || e.target.closest(".empty_img")) {
        fileInput.click();
        return;
    }

    const item = e.target.closest(".item");
    if (!item || e.target.closest(".remove_item")) return;

    renderLightbox(item);
});

const storyCon = document.getElementById("story_con");

function updateBoardEmptyState() {
    const display = document.getElementById("display");
    if (!display) return;

    const hasBoard = !!display.querySelector(".board");
    let empty = document.getElementById("no_story");

    if (hasBoard) {
        empty?.remove();
		display.style.justifyContent = "space-between";
		display.style.alignItems = "flex-start";
    } else {
        if (!empty) {
            empty = document.createElement("p");
            empty.id = "no_story";
            empty.textContent = "NO TALES TO TELL";
			display.style.justifyContent = "center";
			display.style.alignItems = "center";
            display.appendChild(empty);
        }
    }
}

storyCon.onclick = () => {
    document.getElementById("edit_light")?.remove();

    const light = document.createElement("div");
    light.id = "edit_light";

    const back = document.createElement("div");
    back.id = "edit_back";

    const con = document.createElement("div");
    con.id = "edit_con";

    const exit = document.createElement("p");
    exit.id = "exit_edit";
    exit.textContent = "X";

    const editTitle = document.createElement("p");
    editTitle.id = "edit_title";
    editTitle.textContent = "Create A New Storyboard";

    const editDivide = document.createElement("hr");
    editDivide.id = "edit_divide";

    const close = () => light.remove();
    exit.onclick = close;
    back.onclick = close;

    const gallery = document.createElement("div");
    gallery.id = "edit_gallery";

    // -----------------------------
    // CLONE ITEMS SAFELY WITH INDEX
    // -----------------------------
    const sourceItems = document.querySelectorAll("#gal .item");

    sourceItems.forEach((item) => {
        if (!item.dataset.index) {
            item.dataset.index = crypto.randomUUID();
        }

        const clone = item.cloneNode(true);
        clone.querySelector(".remove_item")?.remove();
        clone.dataset.index = item.dataset.index;

        gallery.appendChild(clone);
    });

    updateGalleryState(gallery, "empty_gallery");

    const getItems = () => Array.from(gallery.querySelectorAll(".item"));

function updateUI() {
    const selected = gallery.querySelectorAll(".item.selected");
    const existing = document.getElementById("create_story");
    const hasItems = gallery.querySelector(".item");

    // -----------------------------
    // LAYOUT RULE (BASED ON ITEMS EXISTING)
    // -----------------------------
    if (hasItems) {
        gallery.style.justifyContent = "flex-start";
        gallery.style.alignItems = "flex-start";
    } else {
        gallery.style.justifyContent = "center";
        gallery.style.alignItems = "center";
    }

    // -----------------------------
    // UI RULE (BASED ON SELECTION)
    // -----------------------------
    if (selected.length) {
        if (!existing) {
            const btn = document.createElement("a");
            btn.id = "create_story";
            btn.textContent = "CREATE STORY";
            btn.onclick = createStoryHandler;
            con.appendChild(btn);
        }
    } else {
        existing?.remove();
    }
}

    // -----------------------------
    // SELECTION SYSTEM
    // -----------------------------
    gallery.addEventListener("click", (e) => {
        const item = e.target.closest(".item");
        if (!item) return;

        const items = getItems();
        const index = items.indexOf(item);

        if (!e.shiftKey) {
            item.classList.toggle("selected");
            updateUI();
            return;
        }

        const selectedIndexes = items
            .map((el, i) => el.classList.contains("selected") ? i : -1)
            .filter(i => i !== -1);

        if (!selectedIndexes.length) {
            item.classList.add("selected");
            updateUI();
            return;
        }

        const min = Math.min(...selectedIndexes);
        const max = Math.max(...selectedIndexes);

        let start = Math.min(min, index);
        let end = Math.max(max, index);

        items.forEach(i => i.classList.remove("selected"));

        for (let i = start; i <= end; i++) {
            items[i]?.classList.add("selected");
        }

        updateUI();
    });

    // -----------------------------
    // CREATE STORY (FIXED SCOPE)
    // -----------------------------
    function createStoryHandler() {
        const display = document.getElementById("display");
        if (!display) return;

        document.getElementById("edit_light")?.remove();

        const selected = getItems().filter(i => i.classList.contains("selected"));
        if (!selected.length) return;

        const ids = selected.map(i => i.dataset.index);

        const board = document.createElement("div");
        board.className = "board";

        const exitBoard = document.createElement("p");
        exitBoard.className = "exit_board";
        exitBoard.textContent = "X";

        const anchorImg = document.createElement("img");
        anchorImg.className = "board_anchor";
        anchorImg.src = selected[0].querySelector(".content")?.src || "";

        const createdDate = new Date().toLocaleString();
        const titleText = "Storyboard";

        board.dataset.items = JSON.stringify(ids);
        board.dataset.date = createdDate;
        board.dataset.title = titleText;

        const boardInfo = document.createElement("div");
        boardInfo.className = "board_info";

        const infoTitle = document.createElement("p");
        infoTitle.className = "info_title";
        infoTitle.textContent = titleText;

        const infoDate = document.createElement("p");
        infoDate.className = "info_date";
        infoDate.textContent = createdDate;

        boardInfo.append(infoTitle, infoDate);

        board.append(exitBoard, boardInfo);
        board.prepend(anchorImg);
        display.appendChild(board);
		
		updateStoryCount();

		board.addEventListener("click", (e) => {
		if (e.target.closest(".exit_board")) return;
		
		const ids = safeParse(board.dataset.items);
		
		const realItems = ids.map(id =>
		document.querySelector(`#gal .item[data-index="${id}"]`)
		).filter(Boolean);
		
		if (!realItems.length) return;
		
		const sb = {
		title: board.dataset.title || "Storyboard",
		date: board.dataset.date || "",
			cover: realItems[0].querySelector(".content")?.src || "",
				panels: realItems.map(i => ({
				src: i.querySelector(".content")?.src || ""
			}))
			};
				
				const lightbox = document.getElementById("board_light");
				if (lightbox) {
				lightbox.__activeBoard = board;
			}
				
				openStoryboardPlayer(sb, board);
		});

        exitBoard.onclick = (e) => {
            e.stopPropagation();
            board.remove();
			updateStoryCount();
            updateBoardEmptyState();
        };

        updateBoardEmptyState();
        selected.forEach(i => i.classList.remove("selected"));
				
		
    }

    con.append(exit, editTitle, editDivide, gallery);
    light.append(back, con);
    document.body.appendChild(light);

    updateUI();
};