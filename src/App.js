import logo from "./logo.svg";
import data from "./data";
import produce from "immer";
import "./App.css";
import { useState } from "react";
import { useTimer } from "use-timer";
import Moment from "react-moment";
import Timer from "./Timer";

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState(data);
  const [showScore, setShowScore] = useState(false);
  const [showQuestionare, setShowQuestionare] = useState(false);
  const [score, setScore] = useState(0);
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 80,
    endTime: 0,
    timerType: "DECREMENTAL",
  });

  const handleAnswerButtonClick = (option, index) => {
    //console.log(index);
    const questionsNew = [...questions];
    const nextState = produce(questionsNew, (draftState) => {
      draftState[currentQuestion].answerOptions.map(
        (x) => (x.isSelected = false)
      );
      draftState[currentQuestion].answerOptions[index].isSelected = true;
    });
    setQuestions(nextState);
  };

  const handleNext = (current) => {
    if (isAnswerSelected(questions[currentQuestion])) {
      setCurrentQuestion(
        currentQuestion < questions.length - 1
          ? currentQuestion + 1
          : currentQuestion
      );
    }
  };
  const isAnswerSelected = (answers) => {
    //if any one is true return true;
    return answers.answerOptions.some((x) => x.isSelected === true);
  };

  const handleSubmitclick = () => {
    if (isAnswerSelected(questions[currentQuestion])) {
      setScore(calculateScore());
      setShowScore(true);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.map((d) =>
      d.answerOptions.map((a) => {
        if (a.isCorrect && a.isSelected) totalScore += d.score;
      })
    );
    return totalScore;
  };
  const handleTimerEnd = () => {
    setScore(calculateScore());
    setShowScore(true);
  };

  const handleStart = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
    setQuestions(data);
    setShowQuestionare(true);
    start({ endtime: 5 });
  };
  return (
    <div className="App">
      <p>
        Elapsed time:
        {/* <Moment format="HH:mm:ss">{time}</Moment>{" "} */}
      </p>

      {showQuestionare === false ? (
        <button onClick={() => handleStart()}>Start</button>
      ) : (
        <div>
          {showScore ? (
            <div className="score-section">
              You scored {score} out of{" "}
              {questions.reduce(
                (accumulator, current) => accumulator + current.score,
                0
              )}
              <button onClick={() => handleStart()}>Start Again</button>
            </div>
          ) : (
            <>
              <Timer
                initialMinute={questions.length - 3}
                initialSeconds={0}
                onTimerEnd={handleTimerEnd}
              />
              <div className="question-section">
                <div className="question-count">
                  <span>Question {currentQuestion + 1}</span>/{questions.length}
                </div>
                <div className="question-text">
                  {questions[currentQuestion].questionText}
                </div>
              </div>
              <div className="answer-section">
                {questions[currentQuestion].answerOptions.map(
                  (option, index) => (
                    <button
                      onClick={() => handleAnswerButtonClick(option, index)}
                      className={`button-style${
                        option.isSelected === true ? " button-hover" : ""
                      }`}
                      key={index}
                    >
                      {option.answerText}
                    </button>
                  )
                )}
              </div>
              <div>
                <button
                  onClick={() =>
                    setCurrentQuestion(
                      currentQuestion > 0
                        ? currentQuestion - 1
                        : currentQuestion
                    )
                  }
                >
                  Prev
                </button>
                {currentQuestion === questions.length - 1 ? (
                  <button onClick={() => handleSubmitclick()}>Submit</button>
                ) : (
                  <button onClick={() => handleNext()}>Next</button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
