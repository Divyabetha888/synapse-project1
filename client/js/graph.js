const saved = localStorage.getItem("graphData");

if (!saved) {
    alert("No graph data found!");
    window.location.href = "upload.html";
    throw new Error("graphData missing");
}

const graph = JSON.parse(saved);
document.getElementById("conceptCount").textContent =
graph.concepts.length;

const nodes = [];
const edges = [];

graph.concepts.forEach(concept => {

    nodes.push({
        id: concept.id,
        label: concept.name,
        shape: "dot",
        size: 22,

        color: {
            background: "#22c7c7",
            border: "#ffffff",
            highlight: {
                background: "#5ef2f2",
                border: "#ffffff"
            }
        },

        font: {
            color: "#ffffff",
            size: 18,
            face: "Poppins"
        }

    });

});

graph.concepts.forEach(concept => {

    concept.related.forEach(relatedId => {

        edges.push({
            from: concept.id,
            to: relatedId
        });

    });

});

const container = document.getElementById("network");

const data = {

    nodes: new vis.DataSet(nodes),

    edges: new vis.DataSet(edges)

};

const options = {

    physics: {

        barnesHut: {

            gravitationalConstant: -4500,

            springLength: 180,

            springConstant: 0.04,

            damping: 0.15

        },

        stabilization: true

    },

    interaction: {

        hover: true,

        navigationButtons: true,

        keyboard: true

    },

    nodes: {

        borderWidth: 2,

        shadow: true

    },

    edges: {

        width: 2,

        color: "#22c7c7",

        smooth: {

            type: "dynamic"

        }

    }

};

const network = new vis.Network(container, data, options);

network.once("stabilizationIterationsDone", () => {

    network.fit({

        animation: true

    });

});

network.on("click", function (params) {

    if (params.nodes.length === 0) return;

    const id = params.nodes[0];

    const concept = graph.concepts.find(c => c.id === id);

    document.getElementById("infoPanel").innerHTML = `

        <h2>${concept.name}</h2>

        <p>${concept.summary}</p>

        <h3>Related Concepts</h3>

        <ul>

        ${concept.related.map(id => {

            const related = graph.concepts.find(c => c.id === id);

            return `<li>${related ? related.name : id}</li>`;

        }).join("")}

        </ul>

        <button id="flashcardBtn">

        Generate Flashcards

        </button>

        <button id="quizBtn">

        Generate Quiz

        </button>

    `;

});

document.getElementById("searchBtn").onclick = () => {

    const search = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    const concept = graph.concepts.find(c =>
        c.name.toLowerCase().includes(search)
    );

    if (!concept) {

        alert("Concept not found");

        return;

    }

    network.selectNodes([concept.id]);

    network.focus(concept.id, {

        scale: 1.8,

        animation: {

            duration: 1000

        }

    });

};

document.addEventListener("click", function (e) {

    if (e.target.id === "flashcardBtn") {

        window.location.href = "flashcards.html";

    }

    if (e.target.id === "quizBtn") {

        window.location.href = "quiz.html";

    }

});