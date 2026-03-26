import React, { useState, useEffect } from "react";
import { BicepsFlexed, HandHelping } from "lucide-react";
import { Container } from 'react-bootstrap';



const OptionCard = ({ option, isSelected, onSelect, index }) => {
  // const emojis = ["🐾", "✨", "🌟", "🎯", "💫", "🎪", "🌈", "🎨"];

  return (
    <button
      onClick={() => onSelect(option.value)}
      className={`w-full p-4 rounded-xl transition-all duration-300 border-2 ${isSelected
          ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-400 shadow-lg transform scale-[1.02]"
          : "bg-white border-blue-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-1"
        } active:scale-95 group`}
    >
      <div className="flex items-start">
        <div className="text-left flex-1">
          <div className="flex items-center mb-1">
            <span
              className={`font-medium text-sm ${isSelected ? "text-blue-800" : "text-gray-900"
                }`}
            >
              {option.text}
            </span>
            {/* {isSelected && (
              <span className="ml-2 hidden lg:block text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full">
                SELECTED!
              </span>
            )} */}
          </div>
        </div>

        <div
          className={`flex-shrink-0 ml-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected
              ? "border-blue-500 bg-blue-500"
              : "border-gray-300 group-hover:border-blue-400"
            }`}
        >
          {isSelected && (
            <span className="text-white text-xs font-bold">✓</span>
          )}
        </div>
      </div>
    </button>
  );
};

// Fun Progress Bar
const ProgressBar = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="mb-6">

      {/* <div className="mb-10">
            <h2 className="text-xl text-center lg:text-4xl font-bold font-unbounded text-zinc-900 ">
              Pet <span className="text-blue-600">Personality</span>{" "}
              Profiler
            </h2>
          </div> */}

      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-blue-700">
          Personality Adventure
        </span>
        <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {Math.round(percentage)}% Complete
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="h-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 ease-out shadow-lg"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Progress Dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index <= current ? "bg-blue-500 shadow-md" : "bg-gray-300"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

// Results Component with Amber Theme
const ResultsCard = ({ result, onRestart }) => {

  return (
    <div className="space-y-0 animate-fadeIn">
      {/* Celebration Header */}
      {/* <div className="text-center">
       
        <h3 className="text-2xl font-bold text-blue-700  mb-2">
          {result.type}
        </h3>
        <p className="text-gray-700 font-medium">{result.description}</p>
      </div> */}



      <div className="grid grid-cols-2 items-end">
        {result.image.map((i, idx) => (
          <img key={idx} alt={result.name} width={400} className="w-full" height={400} src={i} />
        ))}
      </div>

      <a
        href={`/product?pet_personality=${result.name}`}
        className={`w-full p-2 lg:p-3 rounded-xl ${result.theme.bgLight} border-2 ${result.theme.border} flex flex-col justify-center items-center`}
      >
        {/* <div className="size-16 lg:size-24 bg-white rounded-full flex justify-center items-center">
              <img
                src={result.product}
                alt={result.name}
                width={200}
                height={200}
                className="size-14 lg:size-22"
              />
            </div> */}
        <h4 className={`font-medium text-center text-xl lg:text-3xl ${result.theme.color}`}>
          {" "}
          Your Pet is {
            result.name == "explorer" ? 'an' : 'a'
          } <span className={`font-bold uppercase ${result.theme.color}`}>
            {result.name}
          </span>
        </h4>

      </a>



      {/* Personality Badge */}
      <div className="bg-gradient-to-r my-5 from-blue-50 to-cyan-50 rounded-xl p-2 lg:p-5 border-2 border-blue-200">
        {/* <div className="flex items-center mb-3">
          <h4 className="font-bold text-lg text-center text-blue-900">
            Paw-some Personality Unlocked!
          </h4>
        </div> */}


        <div className="grid grid-cols-2 gap-3">

          <div className="p-2 rounded-md bg-white border border-blue-200">

            <div className="size-10 lg:size-16 bg-blue-50 border border-blue-300 mx-auto mb-4 text-blue-500 rounded-full flex justify-center items-center">
              <BicepsFlexed size={22} />
            </div>
            <h3 className="font-semibold text-blue-800 text-center">
              Your Pet’s Star Power:
            </h3>
            <p className="text-xs lg:text-sm mt-3 text-center">
              {
                result.power
              }
            </p>

          </div>

          <div className="p-2 rounded-md bg-slate-50 border border-slate-200">

            <div className="size-10 lg:size-16 bg-slate-600 text-white border border-slate-300 mx-auto mb-4 text-slate-500 rounded-full flex justify-center items-center">
              <HandHelping size={22} />
            </div>
            <h3 className="font-semibold text-slate-800 text-center">
              How to Help Them Shine:

            </h3>
            <p className="text-xs lg:text-sm mt-3 text-center">
              {
                result.howToHelp
              }
            </p>

          </div>

        </div>

      </div>



      {/* Action Buttons */}
      <div className="pt-4 space-y-3">
        <a
          href={`/product?pet_personality=${result.name}`}
          className={`w-full py-4 text-white font-bold rounded-xl ${result.theme.bg} transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2`}
        >
          {/* <span className="text-lg">🔄</span> */}
          Get Your {result.variation}  StarTag
        </a>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
        >
          {/* <span className="text-lg">🔄</span> */}
          Take Quiz Again
        </button>
      </div>
    </div>
  );
};

const AnxietyTest = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fun & Playful Questions
  const questions = [
    {
      question:
        "When your pet meets a new dog or cat, how do they usually react?",
      emoji: "👋",
      options: [
        {
          // value: "social",
          value: "maverick",
          text: "Aggressive and territorial",
        },
        {
          // value: "cautious",
          value: "explorer",
          text: "Curious and ready to play",
        },
        {
          // value: "shy",
          value: "diva",
          text: "A little sassy or dramatic",
        },
        {
          // value: "confident",
          value: "guardian",
          text: "Calm and friendly",
        },
      ],
    },
    {
      question: " How does your pet behave when guests come home?",
      emoji: "🎮",
      options: [
        {
          // value: "energetic",
          value: "guardian",
          text: "Observes politely and stays relaxed",
        },
        {
          // value: "intellectual",
          value: "diva",
          text: "Makes an entrance like a celebrity and wants all their attention",
        },
        {
          // value: "relaxed",
          value: "maverick",
          text: "Explores their bags, shoes, and everything new",
        },
        {
          // value: "adventurous",
          value: "explorer",
          text: "Runs to greet them and charm everyone",
        },
      ],
    },
    {
      question: "What is your pet’s attitude toward food?",
      emoji: "🍴",
      options: [
        {
          // value: "confident",
          value: "diva",
          text: "Extremely picky and prefers “premium service” ",
        },
        {
          value: "maverick",
          text: "Guards their bowl or likes unusual treats",
        },
        {
          value: "guardian",
          text: "Waits patiently and behaves like a trained angel",
        },
        {
          value: "explorer",
          text: "Eats anything and everything like a foodie explorer",
        },
      ],
    },
    {
      question: "On walks or outdoor time, what describes your pet best?",
      emoji: "🐈",
      options: [
        {
          value: "diva",
          text: "Wants to be carried or prefers short, stylish strolls",
        },
        {
          value: "maverick",
          text: "Charges ahead, tries new paths, or pulls to lead the way",
        },
        {
          value: "explorer",
          text: "Loves long walks, sniffing every corner, exploring new routes",
        },
        {
          value: "guardian",
          text: "Sticks by your side calmly and enjoys slow paced walks",
        },
      ],
    },
    {
      question:
        "How does your pet respond to new experiences (like a new toy, groomer, or environment)?",
      emoji: "😃",
      options: [
        {
          value: "maverick",
          text: "Jumps right in brave and fearless",
        },
        {
          value: "diva",
          text: "Acts dramatic or needs some pampering first",
        },
        {
          value: "guardian",
          text: "Calm, adaptable, and relaxed",
        },
        {
          value: "explorer",
          text: "Excited and curious, ready to investigate ",
        },
      ],
    },
    {
      question: "When your pet misbehaves and you scold them, what do they do?",
      emoji: "🔪",
      options: [
        {
          value: "diva",
          text: "Gets offended like royalty ",
        },
        {
          value: "explorer",
          text: "Turns it into a game or distracts you",
        },
        {
          value: "maverick",
          text: "Stares back like “I’d do it again”",
        },
        {
          value: "guardian",
          text: "Slowly looks guilty and apologizes in their quiet way ",
        },
      ],
    },
    {
      question: "How does your pet react when you’re busy or on a call?",
      emoji: "👾",
      options: [
        {
          value: "diva",
          text: "Climbs onto your lap or demands to be noticed",
        },
        {
          value: "explorer",
          text: "Brings toys or asks for attention",
        },
        {
          value: "maverick",
          text: "Wanders off and entertains themselves",
        },
        {
          value: "guardian",
          text: "Sleeps nearby peacefully ",
        },
      ],
    },
  ];

  const personalities = {
    maverick: {
      name: "maverick",
      variation: "Maverick Red",
      theme: {
        color: `text-red-800`,
        bg: `bg-red-500`,
        bgLight: `bg-red-50`,
        border: `border-red-200`,
      },
      product: "/img/products/red.png",
      image: [
        "/img/personality/maverick/dog.jpeg",
        "/img/personality/maverick/cat.jpeg",
      ],
      power:
        "Your pet is bold, fearless, and loves being in charge. They have a strong personality, protective instincts, and prefer leading the adventure rather than following it.",
      howToHelp:
        "Stay calm, set clear rules, and give them something to do. Training, games, and structured activities help keep their powerful energy happy and balanced.",
    },
    guardian: {
      name: "guardian",
      variation: "Guardian Green",
      theme: {
        color: `text-[#645824]`,
        bg: `bg-[#645824]`,
        bgLight: `bg-[##DEC28C]`,
        border: `border-[#645824]`,
      },
      product: "/img/products/yellow.png",
      image: [
        "/img/personality/guardian/dog.jpeg",
        "/img/personality/guardian/cat.jpeg",
      ],
      power:
        "Your pet is gentle, loyal, and naturally comforting. They love peaceful vibes, emotional connection, and being close to their favourite humans.",
      howToHelp:
        "Keep routines steady, offer lots of praise, and include them in family time. They thrive on calm, consistency, and feeling safe.",
    },
    explorer: {
      name: "explorer",
      variation: "Explorer Blue",
      theme: {
        color: `text-blue-800`,
        bg: `bg-blue-500`,
        bgLight: `bg-blue-50`,
        border: `border-blue-200`,
      },

      product: "/img/products/blue.png",
      image: [
        "/img/personality/adventurer/dog.jpeg",
        "/img/personality/adventurer/cat.jpeg",
      ],
      power:
        "Your pet is curious, energetic, and always ready to discover something new. Every walk is an adventure and every smell is a discovery.",
      howToHelp:
        "Give them plenty of exercise, new experiences, and room to explore safely. A busy Explorer is a happy Explorer.",
    },
    diva: {
      name: "diva",
      variation: "Diva Pink",
      theme: {
        color: `text-pink-800`,
        bg: `bg-pink-500`,
        bgLight: `bg-pink-50`,
        border: `border-pink-200`,
      },
      product: "/img/products/pink.png",
      image: [
        "/img/personality/diva/dog.jpeg",
        "/img/personality/diva/cat.jpeg",
      ],
      power:
        "Your pet loves attention, affection, and being the center of the universe. They’re expressive, charming, and fully aware of their cuteness.",
      howToHelp:
        "Shower them with love, set gentle boundaries, and enjoy the drama. A little pampering keeps a Diva shining.",
    },
  };

  // Personality Types with fun descriptions
  // const personalityTypes = {
  //   maverick: {
  //     type: "MAVERICK 🔥",
  //     name: "MAVERICK",
  //     link: "maverick",
  //     image: [
  //       "/img/personality/maverick/dog.jpeg",
  //       "/img/personality/maverick/cat.jpeg",
  //     ],
  //     description:
  //       "Mavericks are bold, fearless, and intense. They lead, protect, and don’t back down easily. This pet thrives on challenge and control and has a strong sense of territory and independence.",
  //     traits: [
  //       "Ultimate socialite",
  //       "Zoomies expert",
  //       "Crowd pleaser",
  //       "Attention magnet",
  //       "Adventure seeker",
  //     ],
  //     mindset: "Human mindset: Respect first, affection second.",
  //     recommendations: [
  //       "Set clear boundaries and stay consistent",
  //       "Channel energy into structured play, training, and tasks",
  //       "Avoid harsh reactions — firm but calm leadership works best",
  //       "Give them a “job” so they don’t invent one",
  //     ],
  //   },
  //   guardian: {
  //     type: "GUARDIAN 🌌",
  //     name: "GUARDIAN",
  //     link: "guardian",
  //     image: [
  //       "/img/personality/guardian/dog.jpeg",
  //       "/img/personality/guardian/cat.jpeg",
  //     ],
  //     description:
  //       "Guardians are steady, affectionate, and emotionally intelligent. They are easy to live with, deeply loyal, and sensitive to their humans’ moods. They’re the peacekeepers of the pet world.",
  //     traits: [
  //       "Strategic thinker",
  //       "Puzzle master",
  //       "Routine lover",
  //       "Selectively social",
  //       "Patient observer",
  //     ],
  //     mindset: "Human mindset: Protect their calm — it’s their superpower.",
  //     recommendations: [
  //       "Maintain routine and predictability",
  //       "Use gentle reinforcement and praise",
  //       "Include them in family time — they love being close",
  //       "Avoid loud chaos or sudden changes when possible",
  //     ],
  //   },
  //   explorer: {
  //     type: "ADVENTURER 🌿",
  //     name: "ADVENTURER",
  //     link: "adventurer",
  //     image: [
  //       "/img/personality/adventurer/dog.jpeg",
  //       "/img/personality/adventurer/cat.jpeg",
  //     ],
  //     description:
  //       "Adventurers are curious, energetic, and driven by discovery. The world is their playground — every smell, sound, and corner matters. They learn by doing, not sitting still.",
  //     traits: [
  //       "Gentle soul",
  //       "Cuddle expert",
  //       "Trust builder",
  //       "Comfort connoisseur",
  //       "Soft-spoken companion",
  //     ],
  //     mindset: "Human mindset: Let them roam (safely), not stagnate.",
  //     recommendations: [
  //       "Provide daily physical and mental stimulation",
  //       "Vary routes, toys, and experiences",
  //       "Allow safe independence without over-restriction",
  //       "Expect mess — exploration is their love language",
  //     ],
  //   },
  //   diva: {
  //     type: "DIVA 🌸",
  //     name: "DIVA",
  //     link: "diva",
  //     image: [
  //       "/img/personality/diva/dog.jpeg",
  //       "/img/personality/diva/cat.jpeg",
  //     ],
  //     description:
  //       "Divas live for love, comfort, and attention. They are emotionally expressive, socially confident, and often spoiled — but deeply bonded. They don’t just want affection, they expect it.",
  //     traits: [
  //       "Natural leader",
  //       "Schedule master",
  //       "Confidence king/queen",
  //       "Clear communicator",
  //       "Protective friend",
  //     ],
  //     mindset: "Human mindset: Indulge with intention, not guilt.",

  //     recommendations: [
  //       "Give attention before they demand it",
  //       "Set gentle boundaries without ignoring them",
  //       "Reward good behaviour — they respond to appreciation",
  //       "Accept the drama… it comes with unmatched affection",
  //     ],
  //   },
  //   default: {
  //     type: "The Perfect Mix 🎭",
  //     description:
  //       "A little bit of everything! Adaptable, loving, and always surprising.",
  //     traits: [
  //       "Adaptable adventurer",
  //       "Playful spirit",
  //       "Loving companion",
  //       "Curious explorer",
  //       "Loyal friend",
  //     ],
  //     recommendations: [
  //       "Mix of social and solo time",
  //       "Variety of toys and games",
  //       "Regular exercise and brain games",
  //       "Flexible but reliable routine",
  //     ],
  //   },
  // };

  const handleOptionSelect = (value) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);

    // Fun click feedback
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        calculateResult(newAnswers);
      }
      setIsAnimating(false);
    }, 200);
  };

  const calculateResult = (answers) => {
    const answerValues = Object.values(answers);
    // console.log("answers", answerValues);

    const counts = {};

    answerValues.forEach((answer) => {
      counts[answer] = (counts[answer] || 0) + 1;
    });

    const sortedAnswers = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);

    let resultKey = "default";

    // console.log("sort answers", sortedAnswers);

    if (sortedAnswers[0] == "diva") {
      resultKey = "diva";
    } else if (sortedAnswers[0] == "maverick") {
      resultKey = "maverick";
    } else if (sortedAnswers[0] == "guardian") {
      resultKey = "guardian";
    } else if (sortedAnswers[0] == "explorer") {
      resultKey = "explorer";
    }

    setResult(personalities[resultKey]);

    setTimeout(() => {
      setShowResults(true);
      if (window.innerWidth < 768) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 400);
  };

  const handleRestart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(0);
      setAnswers({});
      setShowResults(false);
      setResult(null);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (currentStep > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.4s ease-out;
      }
      .animate-bounceIn {
        animation: bounceIn 0.5s ease-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return (
    <div className="anxiety-test-page py-5 mt-5">
      <Container>
        <h2 className="text-center mb-4">Anxiety Test</h2>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 text-center">
            {/* Blank slate block ready for the actual test implementation */}
            <p className="text-muted">Anxiety Test content will go here.</p>
          </div>
        </div>
        <div className="min-h-screen flex justify-center items-center bg-linear-to-b from-blue-50 to-cyan-50">
        <div className="container mx-auto px-0 lg:py-8">
          <div className="flex flex-col-reverse lg:flex-row items-start gap-6 lg:gap-8">
            {/* Quiz Section */}
            <div className="lg:w-7/12 xl:w-3/5 mx-auto">
              <div className="max-w-3xl mx-auto">
                {/* Main Quiz Card */}
                <div
                  className={`bg-white rounded-2xl shadow-2xl p-4 md:p-6 lg:p-8 transition-all duration-300 ${isAnimating ? "opacity-90" : "opacity-100"
                    }`}
                >
                  {!showResults ? (
                    <div className="animate-bounceIn">
                      {/* Progress */}
                      <ProgressBar
                        current={currentStep}
                        total={questions.length}
                      />

                      {/* Question */}
                      <div className="mb-6 md:mb-8">
                        <div className="flex items-center mb-4">
                          {/* <div className="min-w-10 min-h-10 rounded-full bg-slate-100  flex items-center justify-center mr-3">
                          <span className="text-white text-xl">
                            {questions[currentStep].emoji}
                          </span>
                        </div> */}
                          <h2 className="text-md md:text-lg lg:text-xl font-medium text-gray-900">
                            {questions[currentStep].question}
                          </h2>
                        </div>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6">
                        {questions[currentStep].options.map((option, index) => (
                          <OptionCard
                            key={index}
                            option={option}
                            index={index}
                            isSelected={answers[currentStep] === option.value}
                            onSelect={handleOptionSelect}
                          />
                        ))}
                      </div>

                      {/* Navigation */}
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-blue-100">
                        <button
                          onClick={handlePrev}
                          disabled={currentStep === 0 || isAnimating}
                          className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 ${currentStep === 0
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-700 hover:bg-blue-100 active:bg-blue-200"
                            }`}
                        >
                          ← Go Back
                        </button>

                        <div className="text-center">
                          <div className="text-sm text-blue-600 font-medium mb-1">
                            {answers[currentStep]
                              ? "🎯 Option Selected!"
                              : "Choose option"}
                          </div>
                          <div className="flex items-center justify-center space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-1 rounded-full ${i < currentStep + 1
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                    : "bg-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (
                              currentStep === questions.length - 1 &&
                              answers[currentStep]
                            ) {
                              calculateResult(answers);
                            } else if (answers[currentStep]) {
                              handleOptionSelect(answers[currentStep]);
                            }
                          }}
                          disabled={!answers[currentStep] || isAnimating}
                          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${!answers[currentStep]
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl active:scale-95"
                            }`}
                        >
                          {currentStep === questions.length - 1
                            ? "🎉 Reveal Results!"
                            : "Next Step →"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ResultsCard result={result} onRestart={handleRestart} />
                  )}
                </div>

                {/* Mobile Tips */}
                {!showResults && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border-2 border-blue-300 shadow-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-md">
                        <span className="text-white text-lg">💡</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900 mb-1">
                          Quick Tip for Best Results:
                        </p>
                        <p className="text-sm text-blue-800">
                          Think about what your pet does MOST of the time, not
                          that one funny thing they did that one time!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-5/12 xl:w-2/5 mt-2 px-2 lg:mt-0 hidden ">
              <div className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-md">
                {/* Fun Header */}
                <div className="text-center mb-8 lg:mb-10">
                  <h1 className="text-md md:text-lg lg:text-3xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                      What's Your Pet's Paw-sonality?
                    </span>
                  </h1>
                  <p className="text-gray-700 text-xs lg:text-lg font-medium">
                    Uncover the secret character of your furry friend!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 lg:gap-4">
                  <a
                    href={"/product?pet_personality=maverick"}
                    className={`w-full p-2 lg:p-3 rounded-xl bg-red-100 border-2 border-red-300 flex flex-col justify-center items-center ${result?.type && result.type !== "MAVERICK 🔥" ? "opacity-60 grayscale-75 scale-90 pointer-events-none" : "opacity-100"} ${result?.type === "MAVERICK 🔥" ? "animate-move" : ""}`}
                  >
                    <div className="size-10 lg:size-16 bg-white rounded-full flex justify-center items-center">
                      <img
                        src={"/img/icon/flames.png"}
                        alt="maverick"
                        width={40}
                        height={40}
                        className="size-8 lg:size-12"
                      />
                    </div>
                    <h4 className="font-bold mt-3 text-red-800">MAVERICK</h4>
                    <p className="text-xs text-red-800 text-center">
                      Mavericks are bold, fearless, and intense. They lead,
                      protect, and don’t back down easily. This pet thrives on
                      challenge and control and has a strong sense of territory
                      and independence.
                    </p>
                  </a>

                  <a
                    href={"/product?pet_personality=diva"}
                    className={`w-full p-2 lg:p-3 rounded-xl bg-pink-50 border-2 border-pink-300 flex flex-col justify-center items-center ${result?.type && result.type !== "DIVA 🌸" ? "opacity-60 grayscale-75 scale-90 pointer-events-none" : "opacity-100"} ${result?.type === "DIVA 🌸" ? "animate-move" : ""}`}
                  >
                    <div className="size-10 lg:size-16 bg-white rounded-full flex justify-center items-center">
                      <img
                        src={"/img/icon/pink-cosmos.png"}
                        alt="diva"
                        width={40}
                        height={40}
                        className="size-8 lg:size-12"
                      />
                    </div>
                    <h4 className="font-bold mt-3 text-rose-600">DIVA</h4>
                    <p className="text-xs text-rose-800 text-center">
                      Divas live for love, comfort, and attention. They are
                      emotionally expressive, socially confident, and often
                      spoiled — but deeply bonded. They don’t just want affection,
                      they expect it.
                    </p>
                  </a>

                  <a
                    href={"/product?pet_personality=guardian"}
                    className={`w-full p-2 lg:p-3 rounded-xl bg-blue-50 border-2 border-blue-300 flex flex-col justify-center items-center ${result?.type && result.type !== "GUARDIAN 🌌" ? "opacity-60 grayscale-75 scale-90 pointer-events-none" : "opacity-100"} ${result?.type === "GUARDIAN 🌌" ? "animate-move" : ""}`}
                  >
                    <div className="size-10 lg:size-16 bg-white rounded-full flex justify-center items-center">
                      <img
                        src={"/img/icon/wings.png"}
                        alt="GUARDIAN"
                        width={40}
                        height={40}
                        className="size-8 lg:size-12"
                      />
                    </div>
                    <h4 className="font-bold mt-3 text-blue-600">GUARDIAN</h4>
                    <p className="text-xs text-blue-900 text-center">
                      Guardians are steady, affectionate, and emotionally
                      intelligent. They are easy to live with, deeply loyal, and
                      sensitive to their humans’ moods. They’re the peacekeepers
                      of the pet world.
                    </p>
                  </a>

                  <a
                    href={"/product?pet_personality=explorer"}
                    className={`w-full p-2 lg:p-3 rounded-xl bg-lime-50 border-2 border-lime-300 flex flex-col justify-center items-center ${result?.type && result.type !== "ADVENTURER 🌿" ? "opacity-60 grayscale-75 scale-90 pointer-events-none" : "opacity-100"} ${result?.type === "ADVENTURER 🌿" ? "animate-move" : ""} `}
                  >
                    <div className="size-10 lg:size-16 bg-white rounded-full flex justify-center items-center">
                      <img
                        src={"/img/icon/compass.png"}
                        alt="maverick"
                        width={40}
                        height={40}
                        className="size-8 lg:size-12"
                      />
                    </div>
                    <h4 className="font-bold mt-3 text-lime-600">ADVENTURER</h4>
                    <p className="text-xs text-lime-900 text-center">
                      Adventurers are curious, energetic, and driven by discovery.
                      The world is their playground — every smell, sound, and
                      corner matters. They learn by doing, not sitting still.
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Container>
    </div>
  );
};

export default AnxietyTest;
