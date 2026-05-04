import { useState, useEffect, useRef } from "react";
import Login from "./Login";

const TEACHER_PASSWORD = "teacher123";
const TIME_PER_Q = 86;

const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

const questions = [
  { category: "Linux Basics", source: "Linux Basics for Hackers", question: "What does the pwd command stand for?", options: ["Print Working Directory", "Password Directory", "Primary Working Drive", "Print Windows Data"], correct: 0 },
  { category: "Linux Basics", source: "The Linux Command Line", question: "Which command lists ALL files including hidden ones with full details?", options: ["ls", "ls -l", "ls -la", "ls -h"], correct: 2 },
  { category: "Linux Basics", source: "Linux Basics for Hackers", question: "In Linux, hidden files always start with which character?", options: ["_", "#", ".", "~"], correct: 2 },
  { category: "Linux Basics", source: "The Linux Command Line", question: "Which command creates a new empty file instantly?", options: ["mkdir", "touch", "create", "new"], correct: 1 },
  { category: "Linux Basics", source: "Linux Basics for Hackers", question: "What does 'cd ..' do in Linux?", options: ["Goes to root /", "Goes back one directory", "Deletes current folder", "Creates new folder"], correct: 1 },
  { category: "Linux Basics", source: "The Linux Command Line", question: "Which command permanently removes a file in Linux?", options: ["del", "remove", "rm", "trash"], correct: 2 },
  { category: "Linux Basics", source: "Linux Basics for Hackers", question: "What does 'cp file1 file2' do?", options: ["Moves file1 to file2", "Copies file1 to file2", "Compares file1 and file2", "Compresses file1"], correct: 1 },
  { category: "Linux Basics", source: "The Linux Command Line", question: "Which command reads and displays the contents of a file?", options: ["show", "cat", "read", "view"], correct: 1 },
  { category: "Linux Basics", source: "Linux Basics for Hackers", question: "What does 'mv oldname newname' do?", options: ["Copies the file", "Deletes the file", "Renames or moves the file", "Makes a new version"], correct: 2 },
  { category: "Linux Basics", source: "The Linux Command Line", question: "Which command shows who is currently logged in as user?", options: ["id", "whoami", "hostname", "user"], correct: 1 },
  { category: "Linux File System", source: "Linux Basics for Hackers", question: "What does '/' represent in Linux?", options: ["Home directory", "Root - top of the entire file system", "Trash folder", "System32 equivalent"], correct: 1 },
  { category: "Linux File System", source: "The Linux Command Line", question: "Which directory stores personal files for each user?", options: ["/etc", "/usr", "/home", "/var"], correct: 2 },
  { category: "Linux File System", source: "Linux Basics for Hackers", question: "Which directory holds system-wide configuration files?", options: ["/home", "/etc", "/tmp", "/bin"], correct: 1 },
  { category: "Linux File System", source: "The Linux Command Line", question: "The /tmp directory is used for what purpose?", options: ["Permanent user files", "System backups", "Temporary files cleared on reboot", "Hidden system files"], correct: 2 },
  { category: "Linux File System", source: "Linux Basics for Hackers", question: "Which directory holds essential user command binaries like ls and cp?", options: ["/etc", "/var", "/sbin", "/bin"], correct: 3 },
  { category: "Linux File System", source: "The Linux Command Line", question: "What does 'cd ~' do?", options: ["Go to /root", "Go to your personal home directory", "Go to /tmp", "Go to /etc"], correct: 1 },
  { category: "Linux File System", source: "Linux Basics for Hackers", question: "System log files in Linux are usually stored in which directory?", options: ["/bin/logs", "/home/logs", "/var/log", "/etc/log"], correct: 2 },
  { category: "Linux File System", source: "Penetration Testing - Weidman", question: "Which directory contains administrator-only system binaries like fdisk?", options: ["/bin", "/sbin", "/usr", "/opt"], correct: 1 },
  { category: "System Commands", source: "Linux Basics for Hackers", question: "Which command shows detailed Linux kernel and system information?", options: ["sysinfo", "uname -a", "info -s", "system --all"], correct: 1 },
  { category: "System Commands", source: "The Linux Command Line", question: "What does the 'man' command do in Linux?", options: ["Shows logged-in users", "Opens manual/help page for any command", "Manages system memory", "Monitors networks"], correct: 1 },
  { category: "System Commands", source: "Linux Basics for Hackers", question: "Which command displays network interface configuration and IP address?", options: ["netstat", "ipconfig", "ifconfig", "netinfo"], correct: 2 },
  { category: "System Commands", source: "The Linux Command Line", question: "What does the 'grep' command do?", options: ["Copies files", "Searches for text patterns inside files", "Compresses files", "Creates directories"], correct: 1 },
  { category: "System Commands", source: "Linux Basics for Hackers", question: "Which command shows all currently running processes in Linux?", options: ["ls -p", "run --list", "ps aux", "process -all"], correct: 2 },
  { category: "System Commands", source: "The Linux Command Line", question: "What does 'chmod 777 file' do to a file?", options: ["Deletes the file", "Gives everyone full read/write/execute permission", "Hides the file", "Encrypts the file"], correct: 1 },
  { category: "System Commands", source: "Linux Basics for Hackers", question: "Which command shows disk usage of files and directories?", options: ["disk -u", "df -h", "du -h", "size --all"], correct: 2 },
  { category: "Cybersecurity", source: "CompTIA Security+ Guide", question: "A hacker who attacks systems WITH permission to find weaknesses is called?", options: ["Black Hat", "Grey Hat", "White Hat / Ethical Hacker", "Cracker"], correct: 2 },
  { category: "Cybersecurity", source: "Penetration Testing - Weidman", question: "What is the main goal of a Penetration Test?", options: ["To destroy the target system", "To find and report vulnerabilities before real attackers do", "To install antivirus", "To monitor network traffic passively"], correct: 1 },
  { category: "Cybersecurity", source: "Hacking: Art of Exploitation", question: "What does 'exploit' mean in the context of hacking?", options: ["To delete files remotely", "To take advantage of a vulnerability to gain unauthorized access", "To encrypt sensitive data", "To monitor network packets"], correct: 1 },
  { category: "Cybersecurity", source: "CompTIA Security+ Guide", question: "What is a vulnerability in cybersecurity terms?", options: ["A type of antivirus software", "A weakness in a system that can be exploited by an attacker", "A strong firewall rule", "A complex password policy"], correct: 1 },
  { category: "Cybersecurity", source: "Hacking: Art of Exploitation", question: "What does 'social engineering' mean in hacking?", options: ["Writing exploit code", "Tricking people psychologically into giving sensitive information", "Building social media platforms", "Engineering secure network protocols"], correct: 1 },
  { category: "Networking", source: "Linux Basics for Hackers", question: "What is an IP address used for?", options: ["Storing passwords", "Uniquely identifying each device on a network", "Speeding up internet", "Encrypting web traffic"], correct: 1 },
  { category: "Networking", source: "CompTIA Security+ Guide", question: "Which port number is associated with standard HTTP web traffic?", options: ["443", "22", "80", "21"], correct: 2 },
  { category: "Networking", source: "Linux Basics for Hackers", question: "What is the main function of DNS?", options: ["Assigns dynamic IP addresses", "Translates domain names like google.com into IP addresses", "Encrypts all web traffic", "Manages user passwords"], correct: 1 },
  { category: "Networking", source: "CompTIA Security+ Guide", question: "Why is HTTPS more secure than HTTP?", options: ["It loads faster", "It encrypts data between browser and server using SSL/TLS", "It uses a different DNS", "It blocks all tracking cookies"], correct: 1 },
  { category: "Networking", source: "Linux Basics for Hackers", question: "Which port number is used for SSH (Secure Shell) by default?", options: ["21", "80", "443", "22"], correct: 3 },
  { category: "Networking", source: "Hacking: Art of Exploitation", question: "What does the 'nmap' tool do in cybersecurity?", options: ["Creates decorative network maps", "Scans networks to discover open ports and running services", "Downloads files from the internet", "Encrypts all outgoing traffic"], correct: 1 },
];

const catColors = {
  "Linux Basics": { c: "#00ff88", bg: "rgba(0,255,136,0.08)", b: "rgba(0,255,136,0.25)" },
  "Linux File System": { c: "#00ccff", bg: "rgba(0,204,255,0.08)", b: "rgba(0,204,255,0.25)" },
  "System Commands": { c: "#ff9900", bg: "rgba(255,153,0,0.08)", b: "rgba(255,153,0,0.25)" },
  Cybersecurity: { c: "#ff4488", bg: "rgba(255,68,136,0.08)", b: "rgba(255,68,136,0.25)" },
  Networking: { c: "#aa88ff", bg: "rgba(170,136,255,0.08)", b: "rgba(170,136,255,0.25)" },
};

async function getStoredValue(key) {
  if (window.storage?.get) {
    const result = await window.storage.get(key, true);
    return result?.value ?? null;
  }
  return window.localStorage.getItem(key);
}

async function setStoredValue(key, value) {
  if (window.storage?.set) {
    await window.storage.set(key, value, true);
    return;
  }
  window.localStorage.setItem(key, value);
}

async function removeStoredValue(key) {
  if (window.storage?.delete) {
    await window.storage.delete(key, true);
    return;
  }
  window.localStorage.removeItem(key);
}

async function loadResults() {
  try {
    const value = await getStoredValue("quiz_results_v2");
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

async function saveResults(arr) {
  try {
    await setStoredValue("quiz_results_v2", JSON.stringify(arr));
  } catch {}
}

async function hasTaken(username) {
  try {
    const value = await getStoredValue("taken_v2_" + username.toLowerCase());
    return !!value;
  } catch {
    return false;
  }
}

async function markTaken(username) {
  try {
    await setStoredValue("taken_v2_" + username.toLowerCase(), "1");
  } catch {}
}

async function loadCustomQuestions() {
  try {
    const value = await getStoredValue("custom_questions_v1");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

async function saveCustomQuestions(data) {
  try {
    await setStoredValue("custom_questions_v1", JSON.stringify(data));
  } catch {}
}

async function clearCustomQuestions() {
  try {
    await removeStoredValue("custom_questions_v1");
  } catch {}
}

async function loadAccounts() {
  try {
    const value = await getStoredValue("student_accounts_v2");
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

async function saveAccounts(arr) {
  try {
    await setStoredValue("student_accounts_v2", JSON.stringify(arr));
  } catch {}
}

async function findAccount(username) {
  const accounts = await loadAccounts();
  return accounts.find((acc) => acc.username.toLowerCase() === username.toLowerCase());
}

async function registerAccount(username, password, id) {
  const normalized = username.trim();
  const accounts = await loadAccounts();
  if (accounts.some((acc) => acc.username.toLowerCase() === normalized.toLowerCase())) return false;
  accounts.push({ username: normalized, password, id });
  await saveAccounts(accounts);
  return true;
}

function CircleTimer({ seconds, total }) {
  const pct = total > 0 ? seconds / total : 0;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const stroke = pct > 0.5 ? "#00ff88" : pct > 0.25 ? "#ffcc00" : "#ff4444";

  return (
    <div style={{ position: "relative", width: 70, height: 70, flexShrink: 0 }}>
      <svg width="70" height="70" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="35"
          cy="35"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.5s" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: stroke, fontSize: "15px", fontWeight: "900" }}>
        {seconds}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [studentSuccess, setStudentSuccess] = useState("");
  const [checkingUser, setCheckingUser] = useState(false);
  const [registeringStudent, setRegisteringStudent] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [questionDone, setQuestionDone] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);
  const [submittedToTeacher, setSubmittedToTeacher] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const timerRef = useRef(null);
  const [teacherInput, setTeacherInput] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [teacherResults, setTeacherResults] = useState([]);
  const [studentAccounts, setStudentAccounts] = useState([]);
  const [loadingTeacher, setLoadingTeacher] = useState(false);
  const [teacherAuthed, setTeacherAuthed] = useState(false);
  const [showQuizUpload, setShowQuizUpload] = useState(false);
  const [customQuestions, setCustomQuestions] = useState(null);
  const [quizTimePerQ, setQuizTimePerQ] = useState(TIME_PER_Q);
  const [uploadedQuestions, setUploadedQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ question: "", option1: "", option2: "", option3: "", option4: "", correct: 0, category: "Linux Basics", source: "Custom" });

  const allQuestions = customQuestions?.questions?.length ? customQuestions.questions : questions;
  const q = allQuestions[current] || allQuestions[0];
  const col = catColors[q?.category] || catColors["Linux Basics"];
  const score = answers.filter((a) => a.correct).length;
  const pct = Math.round((score / allQuestions.length) * 100);
  const grade =
    pct >= 90 ? { g: "A+", c: "#00ff88", msg: "Outstanding!" } :
    pct >= 75 ? { g: "A", c: "#00ccff", msg: "Excellent Work!" } :
    pct >= 60 ? { g: "B", c: "#ffcc00", msg: "Good Job!" } :
    pct >= 40 ? { g: "C", c: "#ff9900", msg: "Keep Studying!" } :
    { g: "F", c: "#ff4444", msg: "Re-read Chapter 1!" };

  useEffect(() => {
    const loadCustom = async () => {
      const customQ = await loadCustomQuestions();
      if (customQ?.questions?.length) {
        setCustomQuestions(customQ);
        setQuizTimePerQ(customQ.timePerQ || TIME_PER_Q);
      }
    };
    loadCustom();
  }, []);

  useEffect(() => {
    if (page !== "quiz" || questionDone) return undefined;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          autoSkip();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [page, current, questionDone]);

  async function teacherLogin() {
    if (teacherInput !== TEACHER_PASSWORD) {
      setTeacherError("Wrong password!");
      return;
    }
    setLoadingTeacher(true);
    const r = await loadResults();
    const accounts = await loadAccounts();
    const customQ = await loadCustomQuestions();
    setTeacherResults(r);
    setStudentAccounts(accounts);
    setCustomQuestions(customQ);
    setUploadedQuestions(customQ?.questions || []);
    setLoadingTeacher(false);
    setTeacherAuthed(true);
  }

  function handleAddQuestion() {
    if (!newQuestion.question.trim() || !newQuestion.option1.trim() || !newQuestion.option2.trim() || !newQuestion.option3.trim() || !newQuestion.option4.trim()) {
      alert("All fields are required!");
      return;
    }

    const customQuestion = {
      category: newQuestion.category.trim() || "Custom",
      source: newQuestion.source.trim() || "Custom",
      question: newQuestion.question.trim(),
      options: [newQuestion.option1, newQuestion.option2, newQuestion.option3, newQuestion.option4],
      correct: parseInt(newQuestion.correct, 10),
    };

    setUploadedQuestions((existing) => [...existing, customQuestion]);
    setNewQuestion({ question: "", option1: "", option2: "", option3: "", option4: "", correct: 0, category: "Linux Basics", source: "Custom" });
  }

  function handleRemoveQuestion(idx) {
    setUploadedQuestions((existing) => existing.filter((_, i) => i !== idx));
  }

  async function handleSaveQuiz() {
    if (uploadedQuestions.length === 0) {
      alert("Please add at least one question!");
      return;
    }

    const data = {
      questions: uploadedQuestions,
      timePerQ: parseInt(quizTimePerQ, 10) || TIME_PER_Q,
      createdAt: new Date().toISOString(),
    };
    await saveCustomQuestions(data);
    setCustomQuestions(data);
    setQuizTimePerQ(data.timePerQ);
    alert("Quiz saved successfully!");
    setShowQuizUpload(false);
  }

  async function handleResetQuiz() {
    if (!window.confirm("Are you sure you want to delete the custom quiz and reset to default questions?")) return;
    await clearCustomQuestions();
    setUploadedQuestions([]);
    setCustomQuestions(null);
    setQuizTimePerQ(TIME_PER_Q);
    setCurrent(0);
    setShowQuizUpload(false);
  }

  function autoSkip() {
    setQuestionDone(true);
    setAnswers((a) => [...a, { selected: null, correct: false, skipped: true }]);
  }

  function handleSkip() {
    if (questionDone) return;
    clearInterval(timerRef.current);
    autoSkip();
  }

  function handleAnswer(idx) {
    if (questionDone) return;
    clearInterval(timerRef.current);
    setAnswers((a) => [...a, { selected: idx, correct: idx === allQuestions[current].correct, skipped: false }]);
    setQuestionDone(true);
  }

  async function handleStudentLogin(name, password) {
    const candidate = name.trim();
    if (!candidate || !password) {
      setUsernameError("Enter student username and password.");
      setStudentSuccess("");
      return;
    }

    setCheckingUser(true);
    const account = await findAccount(candidate);
    setCheckingUser(false);

    if (!account) {
      setUsernameError("Student not registered yet. Use Register Student.");
      setStudentSuccess("");
      return;
    }
    if (account.password !== password) {
      setUsernameError("Incorrect password.");
      setStudentSuccess("");
      return;
    }
    if (await hasTaken(candidate)) {
      setUsernameError("You already took this quiz. No retakes allowed!");
      setStudentSuccess("");
      return;
    }

    startQuiz(candidate);
  }

  async function handleStudentRegister(name, password) {
    const candidate = name.trim();
    if (!candidate || !password) {
      setUsernameError("Student username and password are required.");
      setStudentSuccess("");
      return;
    }

    setRegisteringStudent(true);
    const id = generateId();
    const registered = await registerAccount(candidate, password, id);
    setRegisteringStudent(false);

    if (!registered) {
      setUsernameError("This student is already registered.");
      setStudentSuccess("");
      return;
    }

    setStudentAccounts(await loadAccounts());
    setStudentSuccess(`Student ${candidate} registered with ID: ${id}. Quiz started.`);
    startQuiz(candidate);
  }

  function startQuiz(candidate) {
    setUsername(candidate);
    setUsernameError("");
    setCurrent(0);
    setAnswers([]);
    setTimeLeft(quizTimePerQ || TIME_PER_Q);
    setQuestionDone(false);
    setPendingResult(null);
    setSubmittedToTeacher(false);
    setSubmissionMessage("");
    setPage("quiz");
  }

  function handleNext() {
    if (current + 1 < allQuestions.length) {
      setCurrent((c) => c + 1);
      setTimeLeft(quizTimePerQ || TIME_PER_Q);
      setQuestionDone(false);
      return;
    }

    const finalScore = answers.filter((a) => a.correct).length;
    const skipped = answers.filter((a) => a.skipped).length;
    const result = {
      username,
      score: finalScore,
      total: allQuestions.length,
      skipped,
      wrong: allQuestions.length - finalScore - skipped,
      pct: Math.round((finalScore / allQuestions.length) * 100),
      date: new Date().toLocaleString(),
      answers: answers.map((a, i) => ({
        q: allQuestions[i].question,
        category: allQuestions[i].category,
        source: allQuestions[i].source,
        selected: a.selected !== null ? allQuestions[i].options[a.selected] : "Skipped",
        correct: allQuestions[i].options[allQuestions[i].correct],
        isCorrect: a.correct,
        skipped: a.skipped,
      })),
    };
    setPendingResult(result);
    setSubmittedToTeacher(false);
    setSubmissionMessage("");
    setPage("result");
  }

  async function submitToTeacher() {
    if (!pendingResult || submittedToTeacher) return;
    setSubmitLoading(true);
    const all = await loadResults();
    all.push(pendingResult);
    await saveResults(all);
    await markTaken(username);
    if (teacherAuthed) {
      setTeacherResults(await loadResults());
      setStudentAccounts(await loadAccounts());
    }
    setSubmitLoading(false);
    setSubmittedToTeacher(true);
    setSubmissionMessage("Result submitted to teacher.");
  }

  function goHome() {
    setPage("login");
    setUsernameError("");
    setStudentSuccess("");
    setTeacherInput("");
    setTeacherError("");
    setTeacherAuthed(false);
  }

  async function handleWhatsAppShare() {
    const message = `I scored ${pct}% on the Cyber Mock Quiz! Username: ${username}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    try {
      await navigator.clipboard.writeText(message);
    } catch {}
  }

  const BG = () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        backgroundImage: `radial-gradient(circle at 15% 15%, rgba(0,255,136,0.04) 0%, transparent 50%),
          radial-gradient(circle at 85% 85%, rgba(0,150,255,0.04) 0%, transparent 50%),
          linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,
        backgroundSize: "100% 100%,100% 100%,35px 35px,35px 35px",
      }}
    />
  );

  const Card = ({ children, style = {} }) => (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "clamp(24px,6vw,44px)", backdropFilter: "blur(20px)", ...style }}>
      {children}
    </div>
  );

  const GreenBtn = ({ onClick, children, style = {}, disabled = false }) => (
    <button disabled={disabled} onClick={onClick} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#00ff88,#00cc66)", border: "none", borderRadius: "12px", color: "#000", fontWeight: "900", fontSize: "14px", cursor: disabled ? "not-allowed" : "pointer", letterSpacing: "2px", fontFamily: "inherit", opacity: disabled ? 0.6 : 1, ...style }}>
      {children}
    </button>
  );

  const HomeBtn = ({ style = {} }) => (
    <button onClick={goHome} style={{ width: "100%", padding: "13px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", fontWeight: "700", fontSize: "13px", cursor: "pointer", letterSpacing: "1px", fontFamily: "inherit", marginTop: "10px", ...style }}>
      Back to Home
    </button>
  );

  if (page === "login") return (
    <div style={{ minHeight: "100vh", background: "#07070f", fontFamily: "'JetBrains Mono','Courier New',monospace", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative" }}>
      <BG />
      <div style={{ width: "100%", maxWidth: "480px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "50px", marginBottom: "10px" }}>Shield</div>
          <h1 style={{ color: "#fff", fontSize: "clamp(20px,5vw,28px)", margin: "0 0 6px", fontWeight: "900" }}>Linux & Cyber Quiz</h1>
          <p style={{ color: "#fff", fontSize: "12px", margin: "0 0 4px" }}>{questions.length} Questions | {quizTimePerQ} sec each | No Retakes</p>
          <p style={{ color: "#8aa08a", fontSize: "10px", margin: 0 }}>Linux Basics for Hackers | The Linux Command Line | Hacking: Art of Exploitation | CompTIA Security+ | Penetration Testing</p>
        </div>
        <Card>
          <p style={{ color: "#00ff88", fontSize: "11px", letterSpacing: "2px", margin: "0 0 14px" }}>STUDENT LOGIN OR REGISTER</p>
          <Login onLogin={handleStudentLogin} onRegister={handleStudentRegister} error={usernameError} success={studentSuccess} loading={checkingUser} registerLoading={registeringStudent} />
          <div style={{ marginTop: "16px", padding: "14px", background: "rgba(255,60,60,0.05)", border: "1px solid rgba(255,60,60,0.12)", borderRadius: "10px" }}>
            <p style={{ color: "#ff6666", fontSize: "10px", letterSpacing: "1px", margin: "0 0 8px" }}>RULES</p>
            {[
              `${quizTimePerQ} seconds per question - auto-skips on timeout`,
              "Skip button available on every question",
              "No retakes - one attempt only",
              "Submit results to the teacher after finishing",
            ].map((r, i) => (
              <p key={i} style={{ color: "#fff", fontSize: "12px", margin: "4px 0" }}>- {r}</p>
            ))}
          </div>
          <button onClick={() => setPage("teacher")} style={{ width: "100%", marginTop: "14px", padding: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", color: "#fff", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px" }}>
            TEACHER LOGIN
          </button>
        </Card>
      </div>
    </div>
  );

  if (page === "quiz") return (
    <div style={{ minHeight: "100vh", background: "#07070f", fontFamily: "'JetBrains Mono','Courier New',monospace", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative" }}>
      <BG />
      <div style={{ width: "100%", maxWidth: "700px", position: "relative", zIndex: 1 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ color: "#00ff88", fontSize: "11px", letterSpacing: "2px" }}>{username}</div>
              <div style={{ color: "#fff", fontSize: "10px", marginTop: "2px" }}>{current + 1} of {allQuestions.length}</div>
            </div>
            <CircleTimer seconds={timeLeft} total={quizTimePerQ || TIME_PER_Q} />
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#00ff88", fontSize: "12px" }}>Correct {score}</div>
              <div style={{ color: "#ff4444", fontSize: "12px" }}>Wrong {answers.filter((a) => !a.correct && !a.skipped).length}</div>
              <div style={{ color: "#ff9900", fontSize: "12px" }}>Skipped {answers.filter((a) => a.skipped).length}</div>
            </div>
          </div>

          <div style={{ height: "3px", background: "rgba(255,255,255,0.04)", borderRadius: "2px", marginBottom: "18px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((current + 1) / allQuestions.length) * 100}%`, background: `linear-gradient(90deg,${col.c},#00ccff)`, transition: "width 0.5s ease" }} />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
            <span style={{ background: col.bg, border: `1px solid ${col.b}`, borderRadius: "6px", padding: "3px 10px", fontSize: "10px", color: col.c, letterSpacing: "1px" }}>{q.category}</span>
            <span style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "3px 10px", fontSize: "10px", color: "#aaa" }}>{q.source}</span>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "20px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: col.bg, border: `1px solid ${col.b}`, display: "flex", alignItems: "center", justifyContent: "center", color: col.c, fontSize: "13px", fontWeight: "bold", flexShrink: 0 }}>{String(current + 1).padStart(2, "0")}</div>
            <p style={{ color: "#fff", fontSize: "clamp(14px,3vw,17px)", margin: 0, lineHeight: 1.7, fontWeight: "600" }}>{q.question}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            {q.options.map((opt, idx) => {
              let bg = "rgba(255,255,255,0.03)";
              let border = "1px solid rgba(255,255,255,0.06)";
              let color = "#ddd";
              let icon = String.fromCharCode(65 + idx);
              let iconBg = "rgba(255,255,255,0.05)";
              let iconColor = "#fff";
              const ans = answers[current];

              if (ans) {
                if (idx === q.correct) {
                  bg = "rgba(0,255,136,0.1)";
                  border = "1px solid #00ff88";
                  color = "#00ff88";
                  icon = "OK";
                  iconBg = "#00ff88";
                  iconColor = "#000";
                } else if (idx === ans.selected) {
                  bg = "rgba(255,60,60,0.1)";
                  border = "1px solid #ff3c3c";
                  color = "#ff6666";
                  icon = "X";
                  iconBg = "#ff3c3c";
                  iconColor = "#fff";
                } else {
                  color = "#777";
                }
              }

              return (
                <button key={idx} onClick={() => handleAnswer(idx)} style={{ background: bg, border, borderRadius: "12px", padding: "14px 18px", textAlign: "left", cursor: questionDone ? "default" : "pointer", color, fontSize: "clamp(12px,2.5vw,14px)", lineHeight: 1.5, transition: "all 0.2s", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold", flexShrink: 0 }}>{icon}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {!questionDone && (
              <button onClick={handleSkip} style={{ flex: 1, padding: "13px", background: "rgba(255,153,0,0.08)", border: "1px solid rgba(255,153,0,0.25)", borderRadius: "12px", color: "#ff9900", fontWeight: "700", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px" }}>
                SKIP
              </button>
            )}
            {questionDone && <GreenBtn onClick={handleNext}>{current + 1 < allQuestions.length ? "NEXT QUESTION" : "FINISH QUIZ"}</GreenBtn>}
          </div>
        </Card>
      </div>
    </div>
  );

  if (page === "result") return (
    <div style={{ minHeight: "100vh", background: "#07070f", fontFamily: "'JetBrains Mono','Courier New',monospace", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative" }}>
      <BG />
      <div style={{ width: "100%", maxWidth: "660px", position: "relative", zIndex: 1 }}>
        <Card>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "clamp(52px,14vw,80px)", fontWeight: "900", color: grade.c, lineHeight: 1, textShadow: `0 0 50px ${grade.c}50`, marginBottom: "8px" }}>{grade.g}</div>
            <p style={{ color: "#fff", fontSize: "clamp(14px,4vw,18px)", margin: "0 0 4px", fontWeight: "700" }}>{grade.msg}</p>
            <p style={{ color: "#fff", fontSize: "12px", margin: 0 }}>
              {submittedToTeacher ? "Results submitted to teacher" : "Press Submit to send your result to the teacher."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "24px" }}>
            {[
              { label: "Correct", v: score, c: "#00ff88" },
              { label: "Wrong", v: answers.filter((a) => !a.correct && !a.skipped).length, c: "#ff4444" },
              { label: "Skipped", v: answers.filter((a) => a.skipped).length, c: "#ff9900" },
              { label: "Score", v: pct + "%", c: grade.c },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 6px", textAlign: "center" }}>
                <div style={{ color: s.c, fontSize: "clamp(18px,5vw,26px)", fontWeight: "900" }}>{s.v}</div>
                <div style={{ color: "#fff", fontSize: "10px", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <p style={{ color: "#fff", fontSize: "10px", letterSpacing: "2px", marginBottom: "10px" }}>ANSWER REVIEW</p>
          <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {answers.map((a, i) => (
              <div key={i} style={{ background: a.skipped ? "rgba(255,153,0,0.05)" : a.correct ? "rgba(0,255,136,0.05)" : "rgba(255,60,60,0.05)", border: `1px solid ${a.skipped ? "rgba(255,153,0,0.12)" : a.correct ? "rgba(0,255,136,0.12)" : "rgba(255,60,60,0.12)"}`, borderRadius: "10px", padding: "12px 14px" }}>
                <p style={{ color: "#fff", fontSize: "10px", margin: "0 0 3px" }}>Q{i + 1} - {allQuestions[i].category} - {allQuestions[i].source}</p>
                <p style={{ color: "#fff", fontSize: "12px", margin: 0, lineHeight: 1.5 }}>{allQuestions[i].question}</p>
                {!a.correct && !a.skipped && <p style={{ color: "#00ff88", fontSize: "11px", margin: "6px 0 0" }}>Answer: {allQuestions[i].options[allQuestions[i].correct]}</p>}
                {a.skipped && <p style={{ color: "#ff9900", fontSize: "11px", margin: "6px 0 0" }}>Answer: {allQuestions[i].options[allQuestions[i].correct]}</p>}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={submitToTeacher} disabled={submittedToTeacher || submitLoading} style={{ flex: "1 1 220px", padding: "14px", borderRadius: "12px", border: "none", background: submittedToTeacher ? "#4fbd88" : "linear-gradient(135deg,#00ff88,#00cc66)", color: "#000", fontWeight: "900", cursor: submittedToTeacher ? "default" : "pointer", fontFamily: "inherit" }}>
                {submitLoading ? "SUBMITTING..." : submittedToTeacher ? "SUBMITTED" : "SUBMIT TO TEACHER"}
              </button>
              <button onClick={handleWhatsAppShare} style={{ flex: "1 1 220px", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#25d366,#128c7e)", color: "#fff", fontWeight: "900", cursor: "pointer", fontFamily: "inherit" }}>
                WhatsApp
              </button>
            </div>
            <HomeBtn style={{ marginTop: 0 }} />
            {submissionMessage && <p style={{ color: "#00ff88", fontSize: "12px", margin: "0" }}>{submissionMessage}</p>}
          </div>
        </Card>
      </div>
    </div>
  );

  if (page === "teacher") return (
    <div style={{ minHeight: "100vh", background: "#07070f", fontFamily: "'JetBrains Mono','Courier New',monospace", padding: "20px", position: "relative" }}>
      <BG />
      <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ color: "#00ccff", fontSize: "10px", letterSpacing: "3px", marginBottom: "4px" }}>TEACHER DASHBOARD</div>
            <h2 style={{ color: "#fff", margin: 0, fontSize: "clamp(18px,4vw,24px)", fontWeight: "900" }}>Student Results</h2>
          </div>
          <button onClick={goHome} style={{ padding: "10px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>Home</button>
        </div>

        {!teacherAuthed ? (
          <Card style={{ maxWidth: "400px", margin: "0 auto" }}>
            <p style={{ color: "#00ccff", fontSize: "11px", letterSpacing: "2px", margin: "0 0 16px" }}>TEACHER PASSWORD</p>
            <input
              value={teacherInput}
              type="password"
              onChange={(e) => { setTeacherInput(e.target.value); setTeacherError(""); }}
              onKeyDown={(e) => e.key === "Enter" && teacherLogin()}
              placeholder="Teacher password"
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: "8px" }}
            />
            {teacherError && <p style={{ color: "#ff4444", fontSize: "12px", margin: "0 0 10px" }}>{teacherError}</p>}
            <button onClick={teacherLogin} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#0088cc,#005fa8)", border: "none", borderRadius: "12px", color: "#fff", fontWeight: "900", fontSize: "14px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "2px", marginTop: "10px" }}>
              {loadingTeacher ? "LOADING..." : "TEACHER LOGIN"}
            </button>
            <HomeBtn />
          </Card>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "12px", marginBottom: "24px" }}>
              {[
                { label: "Total Students", v: teacherResults.length, c: "#00ccff" },
                { label: "Registered", v: studentAccounts.length, c: "#00ff88" },
                { label: "Avg Score", v: teacherResults.length ? Math.round(teacherResults.reduce((a, r) => a + r.pct, 0) / teacherResults.length) + "%" : "-", c: "#00ff88" },
                { label: "Top Score", v: teacherResults.length ? Math.max(...teacherResults.map((r) => r.pct)) + "%" : "-", c: "#ffcc00" },
                { label: "Lowest", v: teacherResults.length ? Math.min(...teacherResults.map((r) => r.pct)) + "%" : "-", c: "#ff4444" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "18px 14px", textAlign: "center" }}>
                  <div style={{ color: s.c, fontSize: "clamp(20px,5vw,28px)", fontWeight: "900" }}>{s.v}</div>
                  <div style={{ color: "#fff", fontSize: "11px", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {studentAccounts.length > 0 && (
              <Card style={{ marginBottom: "24px" }}>
                <p style={{ color: "#00ccff", fontSize: "11px", letterSpacing: "2px", margin: "0 0 14px" }}>STUDENT ACCOUNTS</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px" }}>
                  {studentAccounts.map((account, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px" }}>
                      <p style={{ color: "#fff", margin: 0, fontWeight: "700", fontSize: "13px" }}>{account.username}</p>
                      <p style={{ color: "#fff", margin: "6px 0 0", fontSize: "12px" }}>ID: {account.id}</p>
                      <p style={{ color: "#fff", margin: "2px 0 0", fontSize: "12px" }}>Password: {account.password}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", gap: "12px" }}>
                <p style={{ color: "#00ccff", fontSize: "11px", letterSpacing: "2px", margin: 0 }}>MANAGE QUIZ</p>
                <button onClick={() => setShowQuizUpload(!showQuizUpload)} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#00ff88", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>
                  {showQuizUpload ? "CANCEL" : "EDIT"}
                </button>
              </div>
              <p style={{ color: "#fff", fontSize: "12px", margin: "0 0 10px" }}>{customQuestions ? `Custom Quiz Active (${customQuestions.questions.length} questions, ${customQuestions.timePerQ}s per Q)` : "Using Default Questions"}</p>

              {showQuizUpload && (
                <div style={{ background: "rgba(0,255,200,0.05)", border: "1px solid rgba(0,255,200,0.1)", borderRadius: "12px", padding: "16px", marginTop: "14px" }}>
                  <p style={{ color: "#00ff88", fontSize: "11px", letterSpacing: "1px", margin: "0 0 12px" }}>ADD NEW QUESTIONS</p>
                  <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
                    {[
                      ["Question", "question"],
                      ["Option 1", "option1"],
                      ["Option 2", "option2"],
                      ["Option 3", "option3"],
                      ["Option 4", "option4"],
                      ["Category", "category"],
                      ["Source", "source"],
                    ].map(([placeholder, key]) => (
                      <input key={key} type="text" placeholder={placeholder} value={newQuestion[key]} onChange={(e) => setNewQuestion({ ...newQuestion, [key]: e.target.value })} style={{ padding: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "12px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                    ))}
                    <select value={newQuestion.correct} onChange={(e) => setNewQuestion({ ...newQuestion, correct: e.target.value })} style={{ padding: "10px", background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: "12px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}>
                      <option value={0}>Correct Answer: Option 1</option>
                      <option value={1}>Correct Answer: Option 2</option>
                      <option value={2}>Correct Answer: Option 3</option>
                      <option value={3}>Correct Answer: Option 4</option>
                    </select>
                  </div>

                  <button onClick={handleAddQuestion} style={{ width: "100%", padding: "10px", background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: "8px", color: "#00ff88", fontWeight: "700", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", marginBottom: "12px" }}>ADD QUESTION</button>

                  {uploadedQuestions.length > 0 && (
                    <>
                      <p style={{ color: "#00ff88", fontSize: "11px", letterSpacing: "1px", margin: "16px 0 10px" }}>QUESTIONS ({uploadedQuestions.length})</p>
                      <div style={{ maxHeight: "250px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                        {uploadedQuestions.map((questionItem, i) => (
                          <div key={`${questionItem.question}-${i}`} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                            <div style={{ flex: 1, fontSize: "11px" }}>
                              <p style={{ color: "#fff", margin: "0 0 4px", fontWeight: "700" }}>Q{i + 1}: {questionItem.question.substring(0, 50)}...</p>
                              <p style={{ color: "#888", margin: 0, fontSize: "10px" }}>{questionItem.category} | {questionItem.source}</p>
                            </div>
                            <button onClick={() => handleRemoveQuestion(i)} style={{ padding: "4px 8px", background: "rgba(255,60,60,0.2)", border: "1px solid rgba(255,60,60,0.3)", borderRadius: "6px", color: "#ff6666", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Remove</button>
                          </div>
                        ))}
                      </div>

                      <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fff", fontSize: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                        Time per Question (seconds):
                        <input type="number" min="10" max="300" value={quizTimePerQ} onChange={(e) => setQuizTimePerQ(e.target.value)} style={{ width: "80px", padding: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontSize: "12px", fontFamily: "inherit", outline: "none" }} />
                      </label>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button onClick={handleSaveQuiz} style={{ flex: "1 1 180px", padding: "10px", background: "linear-gradient(135deg,#00ff88,#00cc66)", border: "none", borderRadius: "8px", color: "#000", fontWeight: "700", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>SAVE QUIZ</button>
                        <button onClick={handleResetQuiz} style={{ flex: "1 1 180px", padding: "10px", background: "rgba(255,60,60,0.15)", border: "1px solid rgba(255,60,60,0.3)", borderRadius: "8px", color: "#ff6666", fontWeight: "700", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>RESET TO DEFAULT</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>

            {teacherResults.length === 0 ? (
              <Card style={{ textAlign: "center" }}>
                <p style={{ color: "#fff", fontSize: "14px", margin: "0 0 16px" }}>No students have taken the quiz yet.</p>
                <HomeBtn />
              </Card>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[...teacherResults].sort((a, b) => b.pct - a.pct).map((r, i) => {
                  const resultGrade = r.pct >= 90 ? { g: "A+", c: "#00ff88" } : r.pct >= 75 ? { g: "A", c: "#00ccff" } : r.pct >= 60 ? { g: "B", c: "#ffcc00" } : r.pct >= 40 ? { g: "C", c: "#ff9900" } : { g: "F", c: "#ff4444" };
                  return (
                    <div key={`${r.username}-${r.date}-${i}`} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${resultGrade.c}15`, border: `1px solid ${resultGrade.c}40`, display: "flex", alignItems: "center", justifyContent: "center", color: resultGrade.c, fontWeight: "900", fontSize: "14px" }}>{resultGrade.g}</div>
                          <div>
                            <p style={{ color: "#fff", margin: 0, fontWeight: "700", fontSize: "14px" }}>{r.username}</p>
                            <p style={{ color: "#fff", margin: "2px 0 0", fontSize: "10px" }}>{r.date}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                          {[
                            { label: "Score", v: r.pct + "%", c: resultGrade.c },
                            { label: "Correct", v: r.score + "/" + r.total, c: "#00ff88" },
                            { label: "Wrong", v: r.wrong, c: "#ff4444" },
                            { label: "Skipped", v: r.skipped, c: "#ff9900" },
                          ].map((s, j) => (
                            <div key={j} style={{ textAlign: "center" }}>
                              <div style={{ color: s.c, fontWeight: "900", fontSize: "16px" }}>{s.v}</div>
                              <div style={{ color: "#fff", fontSize: "10px" }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "6px" }}>
                        {r.answers.map((a, j) => (
                          <div key={j} style={{ background: a.skipped ? "rgba(255,153,0,0.05)" : a.isCorrect ? "rgba(0,255,136,0.05)" : "rgba(255,60,60,0.05)", border: `1px solid ${a.skipped ? "rgba(255,153,0,0.1)" : a.isCorrect ? "rgba(0,255,136,0.1)" : "rgba(255,60,60,0.1)"}`, borderRadius: "8px", padding: "8px 10px" }}>
                            <p style={{ color: "#fff", fontSize: "9px", margin: "0 0 2px" }}>Q{j + 1} - {a.category}</p>
                            <p style={{ color: "#fff", fontSize: "9px", margin: "0 0 3px" }}>{a.source}</p>
                            <p style={{ color: a.skipped ? "#ff9900" : a.isCorrect ? "#00ff88" : "#ff6666", fontSize: "11px", margin: 0, fontWeight: "700" }}>
                              {a.skipped ? "Skipped" : a.isCorrect ? "Correct" : `Wrong: ${a.selected}`}
                            </p>
                            {!a.isCorrect && !a.skipped && <p style={{ color: "#fff", fontSize: "10px", margin: "2px 0 0" }}>Answer: {a.correct}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <HomeBtn />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return null;
}
