const questions = [
  {
    question: "Java est un langage de programmation...",
    options: ["Interprété uniquement", "Orienté objet et fortement typé", "Bas niveau", "Non portable"],
    correct: 1
  },
  {
    question: "Java a été présenté officiellement en...",
    options: ["1990", "1993", "1995", "2000"],
    correct: 2
  },
  {
    question: "Le slogan de Java est...",
    options: ["Code once, crash everywhere", "Write once, run everywhere", "Compile once, run once", "One code fits all"],
    correct: 1
  },
  {
    question: "Quelle entreprise a racheté Sun Microsystems en 2009 ?",
    options: ["Microsoft", "IBM", "Oracle", "Google"],
    correct: 2
  },
  {
    question: "Le fichier source Java a pour extension...",
    options: [".class", ".java", ".javac", ".exe"],
    correct: 1
  },
  {
    question: "Le compilateur Java transforme le code en...",
    options: ["Langage C", "Fichier .jar", "Bytecode", "Fichier exécutable"],
    correct: 2
  },
  {
    question: "La machine virtuelle de Java s'appelle...",
    options: ["JVM", "JRE", "JDK", "JSE"],
    correct: 0
  },
  {
    question: "Le mot-clé pour déclarer une constante en Java est...",
    options: ["static", "const", "final", "constant"],
    correct: 2
  },
  {
    question: "Quel type n'existe pas parmi les types primitifs ?",
    options: ["int", "float", "String", "boolean"],
    correct: 2
  },
  {
    question: "Le type wrapper pour int est...",
    options: ["Integer", "Int", "Num", "Number"],
    correct: 0
  },
  {
    question: "Pour lire une saisie au clavier, on utilise la classe...",
    options: ["Input", "Scanner", "Reader", "Console"],
    correct: 1
  },
  {
    question: "Quel mot-clé déclare une variable avec typage dynamique ?",
    options: ["let", "var", "auto", "dynamic"],
    correct: 1
  },
  {
    question: "L'opérateur == permet de...",
    options: ["Affecter une valeur", "Comparer l’égalité", "Tester la différence", "Concaténer deux chaînes"],
    correct: 1
  },
  {
    question: "Quelle boucle s'exécute au moins une fois ?",
    options: ["while", "for", "do...while", "switch"],
    correct: 2
  },
  {
    question: "Quelle méthode affiche un texte dans la console ?",
    options: ["System.out.print()", "console.log()", "print()", "display()"],
    correct: 0
  },
  {
    question: "Quel opérateur permet la concaténation de chaînes ?",
    options: ["&", "+", "concat()", "#"],
    correct: 1
  },
  {
    question: "Pour générer une documentation, on utilise la commande...",
    options: ["javac", "java", "javadoc", "jar"],
    correct: 2
  },
  {
    question: "Un tableau en Java...",
    options: ["Peut changer de taille", "Est dynamique", "A une taille fixe", "Peut contenir plusieurs types"],
    correct: 2
  },
  {
    question: "Quelle est la bonne déclaration d’un tableau d’entiers ?",
    options: ["int tab = [5,3];", "int[] tab = new int[2];", "int tab = new int();", "tab int[] = 5,3;"],
    correct: 1
  },
  {
    question: "La méthode public static void main(String[] args) est...",
    options: ["La méthode principale du programme", "Une boucle", "Un constructeur", "Une exception"],
    correct: 0
  }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(index);
    optionsEl.appendChild(btn);
  });
  nextBtn.style.display = "none";
}

function selectAnswer(index) {
  const correct = questions[currentQuestion].correct;
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.style.background = "#2ecc71"; // vert
    else if (i === index) btn.style.background = "#e74c3c"; // rouge
  });
  if (index === correct) score++;
  nextBtn.style.display = "block";
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
};

function showResult() {
  questionEl.textContent = `Tu as obtenu ${score} / ${questions.length} 🎉`;
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";
}

showQuestion();
