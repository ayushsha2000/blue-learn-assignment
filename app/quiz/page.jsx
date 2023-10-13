'use client';
import React, { useState, useEffect } from 'react';
import { quiz } from '../data.js';

const page = () => {
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [checked, setChecked] = useState(false);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState({
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        skips: 0,
    });

    const [timer, setTimer] = useState(10);
    const { questions } = quiz;
    const { question, answers, correctAnswer } = questions[activeQuestion];

    useEffect(() => {
        if (timer > 0 && checked === false && !showResult) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
                if (timer === 1) {

                    clearInterval(interval);
                    nextQuestion();
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [timer, checked, showResult]);
    useEffect(() => {
        setTimer(10);
    }, [activeQuestion]);


    const onAnswerSelected = (answer, idx) => {
        setChecked(true);
        setSelectedAnswerIndex(idx);

        if (answer === correctAnswer) {
            setSelectedAnswer(true);
            if (timer >= 3) {
                setResult((prev) => ({
                    ...prev,
                    score: prev.score + 5,
                    correctAnswers: prev.correctAnswers + 1,
                }));
            } else {
                setResult((prev) => ({
                    ...prev,
                    score: prev.score + 3,
                    correctAnswers: prev.correctAnswers + 1,
                }));
            }
        } else {
            setSelectedAnswer(false);
            setResult((prev) => ({
                ...prev,
                wrongAnswers: prev.wrongAnswers + 1,
            }));
        }
    };


    const nextQuestion = () => {
        setTimer(10);
        setSelectedAnswerIndex(null);

        if (activeQuestion !== questions.length - 1) {
            setActiveQuestion((prev) => prev + 1);
        } else {
            setActiveQuestion(0);
            setShowResult(true);
        }
        setChecked(false);
    };


    const skipQuestion = () => {
        if (result.skips < 2) {

            setResult((prev) => ({
                ...prev,
                skips: prev.skips + 1,
            }));
            nextQuestion();
        } else {

            setResult((prev) => ({
                ...prev,
                score: prev.score - 2,
                skips: prev.skips + 1,
            }));
            nextQuestion();
        }
    };

    return (
        <div className='container'>
            
            <div>
                
                {!showResult ? (
                    
                    <div className='quiz-container'>
                        <h2>
                    Question: {activeQuestion + 1}
                    <span>/{questions.length}</span>
                 </h2>
                        <h3>{questions[activeQuestion].question}</h3>
                        <p>Time Remaining: {timer} seconds</p>
                        {answers.map((answer, idx) => (
                            <li
                                key={idx}
                                onClick={() => onAnswerSelected(answer, idx)}
                                className={
                                    selectedAnswerIndex === idx ? 'li-selected' : 'li-hover'
                                }
                            >
                                <span>{answer}</span>
                            </li>
                        ))}
                        {checked ? (
                            <button onClick={nextQuestion} className='btn'>
                                {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        ) : (
                            <button onClick={nextQuestion} className='btn-disabled'>
                                {' '}
                                {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        )}
                        <button onClick={skipQuestion} className='btn'>
                            Skip
                        </button>
                    </div>
                ) : (
                    <div className='quiz-container'>
                         <h2>
                    Question: {questions.length}
                    <span>/{questions.length}</span>
                </h2>
                        <h3>Results</h3>
                        <h3>Overall {(result.score / (5 * questions.length)) * 100}%</h3>
                        <p>
                            Total Questions: <span>{questions.length}</span>
                        </p>
                        <p>
                            Total Score: <span>{result.score}</span>
                        </p>
                        <p>
                            Correct Answers: <span>{result.correctAnswers}</span>
                        </p>
                        <p>
                            Wrong Answers: <span>{result.wrongAnswers}</span>
                        </p>
                        <p>
                            Skips: <span>{result.skips}</span>
                        </p>
                        <button onClick={() => window.location.reload()}>Restart</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default page;