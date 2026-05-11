// JavaScript Document

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = "senticlense_logo.png?v=" + Date.now();

  document.head.appendChild(link);
});

document.addEventListener("DOMContentLoaded", () => {
	const input = document.getElementById("create");
	const output = document.getElementById("responses");

	function consolidateAlpha(str) {
		const A = "a".charCodeAt(0);
		return [...str].map(c => c.charCodeAt(0) - A + 1).join(".");
	}

	function charCombinations(str, maxLen = str.length) {
		const clean = str.replace(/[^a-z]/g, "");
		const combos = [];

		for (let len = 1; len <= maxLen; len++) {
			for (let i = 0; i + len <= clean.length; i++) {
				combos.push({
					text: clean.slice(i, i + len),
					position: i + 1
				});
			}
		}
		return combos;
	}
	
	function wordCombinations(tokens) {
		const combos = [];
		let order = 1;

		for (let len = 1; len <= tokens.length; len++) {
			for (let i = 0; i + len <= tokens.length; i++) {
				combos.push({
					text: tokens.slice(i, i + len).join("-"),
					position: i + 1,
					order: order++
				});
			}
		}
		return combos;
	}
	
	function consolidatePatterns(list) {
		const map = {};
		list.forEach(p => {
			if (!map[p.text]) {
				map[p.text] = {
					count: 0,
					positions: [],
					orders: []
				};
			}
			map[p.text].count++;
			map[p.text].positions.push(p.position);

			if (p.order !== undefined) {
				map[p.text].orders.push(p.order);
			}
		});
		return map;
	}

	input.addEventListener("input", () => {
		if (!input.value.trim()) {
			output.textContent = "";
			return;
		}

		const tokens = input.value
			.toLowerCase()
			.split(/\s+/)
			.filter(Boolean);

		const sentence = tokens.join(" ");

		const charPatterns = consolidatePatterns(
			charCombinations(sentence)
		);

		const wordPatterns = consolidatePatterns(
			wordCombinations(tokens)
		);

		output.innerHTML = `
			<h3>Raw Sentence</h3>
			<p id="res_title">${sentence}</p>
			<hr>

			<h4>Character Pattern Recognition</h4>
			<hr id="divide">
			<div id="report">
				${Object.entries(charPatterns).map(
					([k, v]) =>
						`<div class="report">
							<a class="submit">${k}</a>
							<hr>
							<div class="rep_sec">
								<p>count</p> 
								<p class="stat">${v.count}</p>
							</div>
							<div class="port_sec">
								<div class="rep_sec">
									<div class="lab">
										<p>Positions</p> 
										<p>(${v.positions.join()})</p>
									</div>
									<div class="lab">
										<p>Character Order</p> 
										<p class="lab_num">${consolidateAlpha(k)}</p>
									</div>
								</div>
							</div>
						</div>`
				).join("")}
			</div>

			<hr>

			<h4>Word Pattern Recognition</h4>
			<hr id="divide">
			<div id="words">
				${Object.entries(wordPatterns).map(
					([k, v]) =>
						`<div class="report">
							<a class="submit">${k}</a>
							<hr>
							<div class="rep_sec">
								<p>count</p> 
								<p class="stat">${v.count}</p>
							</div>
							<div class="port_sec">
								<div class="rep_sec">
									<div class="lab">
										<p>Positions</p> 
										<p>(${v.positions.join()})</p>
									</div>
									<div class="lab">
										<p>Word Order</p> 
										<p class="lab_num">${v.orders.join()}</p>
									</div>
								</div>
							</div>
						</div>`
				).join("")}
			</div>
		`;
	});
});