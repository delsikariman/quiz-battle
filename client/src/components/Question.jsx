import { useState, useEffect, useRef } from 'react';
import { getSocket } from '../hooks/useSocket';
import { useSocketEvent } from '../hooks/useSocket';

const QUESTION_TIME = 15;

export default function Question({ questionData, totalQuestions }) {
  const [selected, setSelected] = useState(null);       // index pilihan user
  const [result, setResult] = useState(null);           // { correct, points, correctAnswer, score }
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const timerRef = useRef(null);

  // Reset state tiap soal baru
  useEffect(() => {
    setSelected(null);
    setResult(null);
    setTimeLeft(QUESTION_TIME);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [questionData.index]);

  useSocketEvent('answer_result', (data) => {
    clearInterval(timerRef.current);
    setResult(data);
  });

  function handleSelect(idx) {
    if (selected !== null || result !== null) return;
    setSelected(idx);
    getSocket().emit('submit_answer', { answerIndex: idx, timeLeft });
  }

  function getButtonClass(idx) {
    // Setelah hasil keluar
    if (result) {
      if (idx === result.correctAnswer) return 'answer-btn answer-btn-reveal';
      if (idx === selected && !result.correct) return 'answer-btn answer-btn-wrong';
      return 'answer-btn answer-btn-disabled opacity-30';
    }
    // Setelah pilih tapi belum ada hasil
    if (selected === idx) return 'answer-btn border-indigo-500 bg-indigo-900/50';
    if (selected !== null) return 'answer-btn answer-btn-disabled';
    return 'answer-btn answer-btn-idle';
  }

  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft > 8 ? 'bg-green-500' : timeLeft > 4 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-2xl mx-auto w-full">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm font-medium">
          Soal {questionData.index + 1} / {totalQuestions}
        </span>
        <div className={`text-2xl font-black font-mono ${
          timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'
        }`}>
          {timeLeft}s
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <p className="text-xl font-semibold leading-relaxed">{questionData.question}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {questionData.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={getButtonClass(idx)}
            >
              <span className="inline-flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center
                               text-sm font-bold shrink-0">
                  {['A', 'B', 'C', 'D'][idx]}
                </span>
                {opt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div className={`mt-6 rounded-xl p-4 text-center font-bold text-lg animate-pop-in ${
          result.correct
            ? 'bg-green-900/60 border border-green-600 text-green-300'
            : 'bg-red-900/60 border border-red-600 text-red-300'
        }`}>
          {result.correct ? `✅ Benar! +${result.points} poin` : '❌ Salah!'}
          <p className="text-sm font-normal mt-1 text-gray-300">
            Total skor: <span className="font-bold text-white">{result.score}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Soal berikutnya sebentar lagi...</p>
        </div>
      )}
    </div>
  );
}
