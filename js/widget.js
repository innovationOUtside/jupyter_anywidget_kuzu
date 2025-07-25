import "./widget.css";

function render({ model, el }) {
	let btn = document.createElement("button");
	btn.innerHTML = `countX is ${model.get("value")}`;
	btn.addEventListener("click", () => {
		model.set("value", model.get("value") + 1);
		model.save_changes();
	});
	model.on("change:value", () => {
		btn.innerHTML = `count is ${model.get("value")}`;
	});
	el.classList.add("jupyter_anywidget_kuzu");
	el.appendChild(btn);
}

export default { render };
