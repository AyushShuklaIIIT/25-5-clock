import UpButton from "./Components/UpButton"
import DownButton from "./Components/DownButton"
import { useRef, useState, useEffect } from "react"

function App() {
  const [breakLength, setbreakLength] = useState(5);
  const [sessionLength, setsessionLength] = useState(25)
  const [isSession, setisSession] = useState(true);
  const [timeLeft, settimeLeft] = useState(25 * 60);
  const [isRunning, setisRunning] = useState(false);
  const timerRef = useRef(null);
  const audioRef = useRef();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const totalTime = isSession ? sessionLength * 60 : breakLength * 60;
    const pro = ((totalTime - timeLeft) / totalTime) * 100;
    setProgress(pro);
  }, [sessionLength, breakLength, timeLeft, isSession])
  

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        settimeLeft(prev => {
          if (prev === 0) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 1;
            audioRef.current.play();
            const newTime = isSession ? breakLength * 60 : sessionLength * 60;
            setisSession(!isSession);
            return newTime;
          }
          return prev - 1;
        })
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
    }
  }, [isRunning, isSession]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const reset = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    clearInterval(timerRef.current);
    setbreakLength(5);
    setsessionLength(25);
    settimeLeft(25 * 60);
    setisRunning(false);
    setisSession(true);
  }

  return (
    <div className="bg-white shadow-lg/50 w-fit grid grid-cols-2 p-6 rounded-4xl gap-4 justify-items-center items-center scale-85 md:scale-100">
      <h1 className="col-span-full text-5xl text-[#384b60] font-bold">25 + 5 Clock</h1>
      <div className="col-span-full relative text-[#384b60] p-5 outline outline-[#384b60]/25 rounded-4xl w-[90%] mt-4">
        <div className="absolute w-full h-full left-0 top-0 rounded-4xl bg-[#d2e4f3] z-0 border-4 border-[#384b60] transition-all duration-1000 ease-in-out" style={{
          clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0% 100%)`,
          pointerEvents: "none",
          }}></div>
        <h2 className="text-3xl text-center font-semibold mb-4 z-10 relative" id="timer-label">{isSession ? "Session" : "Break"}</h2>
        <p className="text-center relative z-10 text-8xl font-semibold" id="time-left">{formatTime(timeLeft)}</p>
        <audio src="/alarm.mp3" ref={audioRef} id="beep">
          <track kind="captions" srcLang="en" label="English captions" />
        </audio>
      </div>
      <button id="start_stop" className="text-3xl text-center font-semibold text-white bg-[#384b60] px-10 py-2 rounded-2xl cursor-pointer shadow-md/50 outline-none" onClick={() => setisRunning(!isRunning)}>{isRunning ? "Stop" : "Start"}</button>
      <button id="reset" className="text-3xl text-center font-semibold text-white bg-[#384b60] px-10 py-2 rounded-2xl cursor-pointer shadow-md/50 outline-none" onClick={reset}>Reset</button>
      <div id="break-label" className="text-md md:text-2xl p-4 text-[#384b60] font-bold md:font-semibold grid grid-cols-3 justify-items-center items-center gap-2 md:gap-y-4">
        <p className="col-span-full text-center">Break Length</p>
        <DownButton id="break-decrement" onClick={() => setbreakLength(Math.max(1, breakLength - 1))}></DownButton>
        <span id="break-length">{breakLength}</span>
        <UpButton id="break-increment" onClick={() => setbreakLength(Math.min(60, breakLength + 1))}></UpButton>
      </div>
      <div id="session-label" className="text-md md:text-2xl p-4 text-[#384b60] font-bold md:font-semibold grid grid-cols-3 justify-items-center items-center gap-2 md:gap-y-4">
        <p className="col-span-full text-center">Session Length</p>
        <DownButton id="session-decrement" onClick={() => {
          const newLen = Math.max(1, sessionLength - 1);
          setsessionLength(newLen)
          if (!isRunning && isSession) settimeLeft(newLen * 60);
        }}></DownButton>
        <span id="session-length">{sessionLength}</span>
        <UpButton id="session-increment" onClick={() => {
          const newLen = Math.min(60, sessionLength + 1);
          setsessionLength(newLen);
          if (!isRunning && isSession) settimeLeft(newLen * 60);
        }}></UpButton>
      </div>
    </div>
  )
}

export default App
