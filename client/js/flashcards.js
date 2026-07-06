const graph = JSON.parse(localStorage.getItem("graphData"));

let index = 0;
let flipped = false;

const card = document.getElementById("card");

function showCard(){

const concept = graph.concepts[index];

if(flipped){

card.innerHTML=concept.summary;

}else{

card.innerHTML=`<b>${concept.name}</b>`;

}

}

showCard();

card.onclick=()=>{

flipped=!flipped;

showCard();

};

document.getElementById("next").onclick=()=>{

index++;

if(index>=graph.concepts.length){

index=0;

}

flipped=false;

showCard();

};

document.getElementById("prev").onclick=()=>{

index--;

if(index<0){

index=graph.concepts.length-1;

}

flipped=false;

showCard();

};