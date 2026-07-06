const graph = JSON.parse(localStorage.getItem("graphData"));

let current = 0;
let score = 0;

const question = document.getElementById("question");
const options = document.getElementById("options");
const progress = document.getElementById("progress");

const quiz = graph.concepts.map(concept => {

    const wrong = graph.concepts
        .filter(c => c.id !== concept.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(c => c.summary);

    const answers = [
        concept.summary,
        ...wrong
    ].sort(() => Math.random() - 0.5);

    return {

        question: `What is "${concept.name}"?`,
        correct: concept.summary,
        answers

    };

});

function loadQuestion() {

    if (current >= quiz.length) {

        document.querySelector(".question-card").innerHTML = `

        <h1>🎉 Quiz Completed!</h1>

        <h2>Your Score</h2>

        <h1>${score} / ${quiz.length}</h1>

        <br>

        <button onclick="location.href='graph.html'">
        Back to Graph
        </button>

        `;

        return;

    }

    question.innerHTML = quiz[current].question;

    progress.innerHTML =
    `Question ${current+1} of ${quiz.length}`;

    options.innerHTML = "";

    quiz[current].answers.forEach(answer => {

        const btn = document.createElement("button");

        btn.innerHTML = answer;

        btn.onclick = () => {

            if(answer===quiz[current].correct){

                score++;

                btn.style.background="green";

            }

            else{

                btn.style.background="red";

            }

            Array.from(options.children).forEach(button=>{

                button.disabled=true;

                if(button.innerHTML===quiz[current].correct){

                    button.style.background="green";

                }

            });

            setTimeout(()=>{

                current++;

                loadQuestion();

            },1200);

        };

        options.appendChild(btn);

    });

}

loadQuestion();