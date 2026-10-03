import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ConfettiCanvas, ConfettiRef } from './components/ConfettiCanvas';
import { StartScreen } from './components/StartScreen';
import { HeaderNav } from './components/HeaderNav';
import { PrizeLadder } from './components/PrizeLadder';
import { QuestionArena } from './components/QuestionArena';
import { FeedbackModal } from './components/FeedbackModal';
import { AudienceModal } from './components/AudienceModal';
import { AiHintModal } from './components/AiHintModal';
import { TeacherEditorModal } from './components/TeacherEditorModal';
import { NewGameModal } from './components/NewGameModal';
import { VictoryModal } from './components/VictoryModal';
import { RestartConfirmModal } from './components/RestartConfirmModal';
import {
  ORIGINAL_QUESTIONS,
  BACKUP_QUESTIONS,
  TEN_SELECTED_INDICES,
  REWARDS_10,
  REWARDS_15,
  PRAISE_LIST,
  ENCOURAGEMENT_LIST
} from './data/questions';
import {
  Question,
  OptionKey,
  GameMode,
  LifelinesState,
  ExternalWebsiteConfig
} from './types/game';
import { SFX } from './utils/audio';
import { readQuestionImmediately, stopSpeaking } from './utils/speech';

const TIMER_DURATION = 30;

export default function App() {
  const confettiRef = useRef<ConfettiRef>(null);

  // Game state
  const [screen, setScreen] = useState<'start' | 'gameplay'>('start');
  const [currentMode, setCurrentMode] = useState<GameMode>(10);
  const [questions, setQuestions] = useState<Question[]>(() =>
    TEN_SELECTED_INDICES.map((idx) => JSON.parse(JSON.stringify(ORIGINAL_QUESTIONS[idx])))
  );
  const [backupQuestions, setBackupQuestions] = useState<Question[]>(() =>
    JSON.parse(JSON.stringify(BACKUP_QUESTIONS))
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // External website info
  const [externalWebsite, setExternalWebsite] = useState<ExternalWebsiteConfig>({
    url: 'https://tongdai111.vn',
    title: 'Tổng Đài 111 (Bảo Vệ Trẻ Em)'
  });

  // Scoring & Stats
  const [totalScore, setTotalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Question interaction state
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<OptionKey[]>([]);
  const [revealedAnswer, setRevealedAnswer] = useState<{
    isCorrect: boolean;
    correctAnswer: OptionKey;
  } | null>(null);
  const [instructionText, setInstructionText] = useState(
    'Người chơi chọn 01 đáp án đúng rồi bấm [CHỐT ĐÁP ÁN].'
  );

  // Audio & Speech
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRead, setAutoRead] = useState(true); // Tự động đọc câu hỏi bằng Giọng Nữ Miền Nam
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [timerPaused, setTimerPaused] = useState(false);

  // Lifelines
  const [lifelinesUsed, setLifelinesUsed] = useState<LifelinesState>({
    '5050': false,
    audience: false,
    ai: false,
    switch: false
  });
  const [audiencePollData, setAudiencePollData] = useState<Record<OptionKey, number>>({
    A: 25,
    B: 25,
    C: 25,
    D: 25
  });

  // Modals
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAudienceOpen, setIsAudienceOpen] = useState(false);
  const [isAiHintOpen, setIsAiHintOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNewGameOpen, setIsNewGameOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isRestartConfirmOpen, setIsRestartConfirmOpen] = useState(false);
  const [praiseOrEncouragement, setPraiseOrEncouragement] = useState('');

  const rewards = currentMode === 10 ? REWARDS_10 : REWARDS_15;
  const currentQuestion = questions[currentIndex] || questions[0];

  // Mode switcher
  const handleSwitchMode = (mode: GameMode) => {
    setCurrentMode(mode);
    if (mode === 10) {
      setQuestions(TEN_SELECTED_INDICES.map((idx) => JSON.parse(JSON.stringify(ORIGINAL_QUESTIONS[idx]))));
    } else {
      setQuestions(JSON.parse(JSON.stringify(ORIGINAL_QUESTIONS)));
    }
  };

  // Reset to question - Tự động đọc bằng Giọng Nữ Miền Nam nếu autoRead bật
  const loadQuestion = useCallback((index: number, shouldAutoRead = autoRead) => {
    stopSpeaking();
    setIsSpeaking(false);

    if (index >= questions.length) {
      setIsVictoryOpen(true);
      confettiRef.current?.trigger(260);
      SFX.correct(soundEnabled);
      return;
    }

    setCurrentIndex(index);
    setSelectedOption(null);
    setIsLocked(false);
    setIsEvaluating(false);
    setEliminatedOptions([]);
    setRevealedAnswer(null);
    setInstructionText('Người chơi chọn 01 đáp án đúng rồi bấm [CHỐT ĐÁP ÁN].');
    setTimeLeft(TIMER_DURATION);
    setTimerPaused(false);

    const q = questions[index];
    if (q && shouldAutoRead) {
      setInstructionText('🎙️ Giọng Nữ Miền Nam đang đọc câu hỏi. Em có thể bấm chọn đáp án ngay mà không cần chờ!');
      readQuestionImmediately(q.question, q.options, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          setInstructionText('Đã đọc xong câu hỏi. Chọn 01 đáp án rồi bấm [CHỐT ĐÁP ÁN].');
        },
        onError: () => {
          setIsSpeaking(false);
          setInstructionText('Người chơi chọn 01 đáp án đúng rồi bấm [CHỐT ĐÁP ÁN].');
        }
      });
    }
  }, [questions, soundEnabled, autoRead]);

  // Start game
  const handleStartGame = () => {
    setScreen('gameplay');
    loadQuestion(0, autoRead);
  };

  // Restart game
  const handleRestart = () => {
    stopSpeaking();
    setIsVictoryOpen(false);
    setIsFeedbackOpen(false);
    setIsRestartConfirmOpen(false);
    setTotalScore(0);
    setCorrectCount(0);
    setLifelinesUsed({
      '5050': false,
      audience: false,
      ai: false,
      switch: false
    });
    setBackupQuestions(JSON.parse(JSON.stringify(BACKUP_QUESTIONS)));
    loadQuestion(0, autoRead);
  };

  // Timer interval effect - KHÔNG PHẢI CHỜ: Đồng hồ chạy tự nhiên, học sinh chọn đáp án bất kỳ lúc nào
  useEffect(() => {
    if (screen !== 'gameplay' || isLocked || isEvaluating || timerPaused || isFeedbackOpen) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          SFX.wrong(soundEnabled);
          setInstructionText('HẾT THỜI GIAN QUY ĐỊNH! Hãy cùng thảo luận đáp án an toàn.');
          return 0;
        }
        if (prev <= 6 && prev > 1) {
          SFX.tick(soundEnabled);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, isLocked, isEvaluating, timerPaused, isFeedbackOpen, soundEnabled]);

  // Option selection - KHÔNG PHẢI CHỜ: Dừng giọng đọc ngay khi chọn để phản hồi tức thì
  const handleSelectOption = (letter: OptionKey) => {
    if (isLocked || isEvaluating) return;
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    setSelectedOption(letter);
    SFX.select(soundEnabled);
    setInstructionText(`Đã chọn đáp án [ ${letter} ]. Học sinh phát biểu lý do rồi bấm [CHỐT ĐÁP ÁN]!`);
  };

  // Clear choice
  const handleClearOption = () => {
    if (isLocked || isEvaluating) return;
    setSelectedOption(null);
    setInstructionText('Người chơi chọn 01 đáp án đúng rồi bấm [CHỐT ĐÁP ÁN].');
  };

  // Lock answer action
  const handleLockAnswer = () => {
    if (!selectedOption || isLocked || isEvaluating) return;
    stopSpeaking();
    setIsSpeaking(false);

    setIsLocked(true);
    setIsEvaluating(true);
    setTimerPaused(true);
    SFX.tensionDrone(soundEnabled);
    setInstructionText(`ĐÃ CHỐT ĐÁP ÁN ${selectedOption}! HỒI HỘP CHỜ KẾT QUẢ TỪ TRƯỜNG QUAY...`);

    setTimeout(() => {
      const q = questions[currentIndex];
      const isCorrect = selectedOption === q.answer;

      setRevealedAnswer({
        isCorrect,
        correctAnswer: q.answer
      });

      if (isCorrect) {
        SFX.correct(soundEnabled);
        confettiRef.current?.trigger(120);
        setTotalScore((prev) => prev + 100);
        setCorrectCount((prev) => prev + 1);
        setPraiseOrEncouragement(PRAISE_LIST[Math.floor(Math.random() * PRAISE_LIST.length)]);
        setInstructionText('CHÍNH XÁC! +100 ĐIỂM! PHÁO HOA RỰC RỠ CHÚC MỪNG BẠN!');

        setTimeout(() => {
          setIsFeedbackOpen(true);
        }, 1200);
      } else {
        SFX.wrong(soundEnabled);
        setPraiseOrEncouragement(ENCOURAGEMENT_LIST[Math.floor(Math.random() * ENCOURAGEMENT_LIST.length)]);
        setInstructionText('CHƯA CHÍNH XÁC! CÙNG HỌC BÀI HỌC VÀ TIẾP TỤC CÂU KẾ TIẾP!');

        setTimeout(() => {
          setIsFeedbackOpen(true);
        }, 1400);
      }
    }, 2200);
  };

  // Proceed to next question from feedback modal
  const handleProceedNext = () => {
    setIsFeedbackOpen(false);
    loadQuestion(currentIndex + 1);
  };

  // Lifelines
  const handleUseLifeline = (type: keyof LifelinesState) => {
    if (lifelinesUsed[type] || isLocked || isEvaluating) return;
    const q = questions[currentIndex];
    SFX.lifeline(soundEnabled);

    setLifelinesUsed((prev) => ({ ...prev, [type]: true }));

    if (type === '5050') {
      const wrong = (['A', 'B', 'C', 'D'] as OptionKey[]).filter((opt) => opt !== q.answer);
      wrong.sort(() => Math.random() - 0.5);
      setEliminatedOptions(wrong.slice(0, 2));
    } else if (type === 'audience') {
      const correctPercent = Math.floor(Math.random() * 20) + 65;
      let remaining = 100 - correctPercent;
      const wrong = (['A', 'B', 'C', 'D'] as OptionKey[]).filter((opt) => opt !== q.answer);
      const r1 = Math.floor(Math.random() * (remaining - 4)) + 1;
      remaining -= r1;
      const r2 = Math.floor(Math.random() * (remaining - 2)) + 1;
      const r3 = remaining - r2;

      setAudiencePollData({
        [q.answer]: correctPercent,
        [wrong[0]]: r1,
        [wrong[1]]: r2,
        [wrong[2]]: r3
      } as Record<OptionKey, number>);
      setIsAudienceOpen(true);
    } else if (type === 'ai') {
      setIsAiHintOpen(true);
    } else if (type === 'switch') {
      if (backupQuestions.length > 0) {
        const replacement = backupQuestions[0];
        setBackupQuestions((prev) => prev.slice(1));
        setQuestions((prev) => {
          const copy = [...prev];
          copy[currentIndex] = replacement;
          return copy;
        });
        loadQuestion(currentIndex);
      }
    }
  };

  // Speech synthesis toggle - GIỌNG NỮ MIỀN NAM & ĐỌC KHÔNG PHẢI CHỜ
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setInstructionText('Đã dừng giọng đọc. Học sinh tiếp tục chọn đáp án!');
      return;
    }

    const q = questions[currentIndex];
    setInstructionText('🎙️ Giọng Nữ Miền Nam đang đọc câu hỏi. Em có thể bấm chọn đáp án ngay mà không cần chờ!');
    
    readQuestionImmediately(q.question, q.options, {
      onStart: () => {
        setIsSpeaking(true);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setInstructionText('Đã đọc xong câu hỏi. Chọn 01 đáp án rồi bấm [CHỐT ĐÁP ÁN].');
      },
      onError: () => {
        setIsSpeaking(false);
        setInstructionText('Người chơi chọn 01 đáp án đúng rồi bấm [CHỐT ĐÁP ÁN].');
      }
    });
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectOption(key as OptionKey);
      } else if (e.key === 'Enter') {
        if (isFeedbackOpen) {
          handleProceedNext();
        } else if (!isLocked && selectedOption) {
          handleLockAnswer();
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        setTimerPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFeedbackOpen, isLocked, selectedOption]);

  // Save questions from Teacher Editor
  const handleSaveQuestions = (updatedQuestions: Question[], updatedWebsite: ExternalWebsiteConfig) => {
    setQuestions(updatedQuestions);
    setExternalWebsite(updatedWebsite);
  };

  // Restore originals
  const handleRestoreOriginals = () => {
    if (currentMode === 10) {
      setQuestions(TEN_SELECTED_INDICES.map((idx) => JSON.parse(JSON.stringify(ORIGINAL_QUESTIONS[idx]))));
    } else {
      setQuestions(JSON.parse(JSON.stringify(ORIGINAL_QUESTIONS)));
    }
  };

  // Import questions from source
  const handleImportQuestions = (imported: Question[]) => {
    setQuestions(imported);
    setCurrentIndex(0);
    handleRestart();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between studio-grid relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* Ambient Light Blobs & Beams */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="spotlight-left" />
        <div className="spotlight-right" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-40 right-10 w-[600px] h-[400px] bg-indigo-700/15 blur-[140px] rounded-full" />
      </div>

      {/* Confetti & Fireworks Canvas */}
      <ConfettiCanvas ref={confettiRef} />

      {/* SCREEN 1: WELCOME / INTRO */}
      {screen === 'start' && (
        <StartScreen
          currentMode={currentMode}
          onSwitchMode={handleSwitchMode}
          onStartGame={handleStartGame}
          externalWebsite={externalWebsite}
          onOpenEditor={() => setIsEditorOpen(true)}
        />
      )}

      {/* SCREEN 2: IN-GAME TELEVISION ARENA */}
      {screen === 'gameplay' && (
        <div className="relative z-20 flex-1 flex flex-col justify-between w-full">
          {/* Header Navigation */}
          <HeaderNav
            currentMode={currentMode}
            onGoHomeOrRestart={() => setIsRestartConfirmOpen(true)}
            externalWebsite={externalWebsite}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            autoRead={autoRead}
            onToggleAutoRead={() => setAutoRead((prev) => !prev)}
            isSpeaking={isSpeaking}
            onToggleSpeech={handleToggleSpeech}
            onOpenEditor={() => setIsEditorOpen(true)}
            onOpenNewGame={() => setIsNewGameOpen(true)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />

          {/* Main Arena: 2 Columns */}
          <main className="flex-1 max-w-[1550px] w-full mx-auto p-3 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Column: Question + 4 Options (8-9 Cols) */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between gap-4">
              <QuestionArena
                question={currentQuestion}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                currentReward={rewards[currentIndex] || ''}
                totalScore={totalScore}
                timeLeft={timeLeft}
                timerDuration={TIMER_DURATION}
                timerPaused={timerPaused}
                onToggleTimerPause={() => setTimerPaused((prev) => !prev)}
                lifelinesUsed={lifelinesUsed}
                onUseLifeline={handleUseLifeline}
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
                onClearOption={handleClearOption}
                onLockAnswer={handleLockAnswer}
                isLocked={isLocked}
                isEvaluating={isEvaluating}
                eliminatedOptions={eliminatedOptions}
                revealedAnswer={revealedAnswer}
                instructionText={instructionText}
                isSpeaking={isSpeaking}
                onToggleSpeech={handleToggleSpeech}
              />
            </div>

            {/* Right Column: Prize Ladder (3-4 Cols) */}
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col">
              <PrizeLadder
                totalQuestions={questions.length}
                currentIndex={currentIndex}
                rewards={rewards}
              />
            </div>
          </main>
        </div>
      )}

      {/* MODALS */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        isCorrect={revealedAnswer?.isCorrect ?? false}
        question={currentQuestion}
        praiseOrEncouragement={praiseOrEncouragement}
        isLastQuestion={currentIndex === questions.length - 1}
        autoReadFeedback={autoRead}
        onProceed={handleProceedNext}
      />

      <AudienceModal
        isOpen={isAudienceOpen}
        onClose={() => setIsAudienceOpen(false)}
        pollData={audiencePollData}
      />

      <AiHintModal
        isOpen={isAiHintOpen}
        onClose={() => setIsAiHintOpen(false)}
        hint={currentQuestion.aiHint}
      />

      <TeacherEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        questions={questions}
        onSaveQuestions={handleSaveQuestions}
        onRestoreOriginals={handleRestoreOriginals}
        externalWebsite={externalWebsite}
      />

      <NewGameModal
        isOpen={isNewGameOpen}
        onClose={() => setIsNewGameOpen(false)}
        onImportQuestions={handleImportQuestions}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        totalScore={totalScore}
        correctCount={correctCount}
        totalQuestions={questions.length}
        onRestart={handleRestart}
        onClose={() => setIsVictoryOpen(false)}
      />

      <RestartConfirmModal
        isOpen={isRestartConfirmOpen}
        onClose={() => setIsRestartConfirmOpen(false)}
        onConfirm={handleRestart}
      />

    </div>
  );
}
