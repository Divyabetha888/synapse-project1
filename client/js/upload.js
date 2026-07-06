const browseBtn = document.getElementById("browseBtn");
const pdfInput = document.getElementById("pdfInput");
const fileName = document.getElementById("fileName");

browseBtn.addEventListener("click", () => {
    pdfInput.click();
});

pdfInput.addEventListener("change", async () => {

    const file = pdfInput.files[0];

    if (!file) return;

    fileName.innerHTML = "📄 Uploading PDF...";

    const formData = new FormData();
    formData.append("pdf", file);

    try {

        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData
        });

        fileName.innerHTML = "📖 Reading PDF...";

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const text = await response.text();

console.log("RAW RESPONSE:");
console.log(text);

const data = JSON.parse(text);

console.log("PARSED DATA:");
console.log(data);

        fileName.innerHTML = "🧠 Building Knowledge Graph...";

        if (!data.success) {
            throw new Error(data.message || "AI generation failed.");
        }

        localStorage.removeItem("graphData");

        localStorage.setItem(
            "graphData",
            JSON.stringify(data.graph)
        );

        const saved = localStorage.getItem("graphData");

        if (!saved) {
            throw new Error("graphData was not saved.");
        }

fileName.innerHTML = "✅ Knowledge Graph Ready!";

console.log("Before redirect");

window.location.href = "graph.html";

console.log("After redirect");

    } catch (err) {

        console.error(err);

        fileName.innerHTML = "❌ Upload Failed";

        alert(err.message);

    }

});