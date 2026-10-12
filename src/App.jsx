import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const initialCourses = [
  { id: 1, title: "Java Programming", category: "Programming", level: "Beginner", progress: 75, icon: "💻" },
  { id: 2, title: "Web Development", category: "Development", level: "Intermediate", progress: 45, icon: "🌐" },
  { id: 3, title: "Database Management", category: "Database", level: "Beginner", progress: 90, icon: "🗄️" },
  { id: 4, title: "Machine Learning", category: "Artificial Intelligence", level: "Intermediate", progress: 25, icon: "🤖" },
];

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizMessage, setQuizMessage] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "",
  });

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  async function handleAuth(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "register" : "login";

      const response = await fetch(
        `${API_BASE_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isRegister
              ? form
              : { email: form.email, password: form.password }
          ),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Request failed (${response.status})`
        );
      }

      const data = await response.json();

      setUser(data);
      setPage(data.role === "TEACHER" ? "teacher" : "dashboard");
      setMessage("");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
      });
    } catch (error) {
      setMessage(
        error.message.includes("Failed to fetch")
          ? "Cannot connect to the server. Start your Spring Boot backend on port 8080."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
    setUser(null);
    setPage("login");
    setIsRegister(false);
    setMessage("");
    setForm({
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
    });
    setQuizAnswer("");
    setQuizMessage("");
    setQuizCompleted(false);
    setShowCourseForm(false);
  }

  function addCourse(event) {
    event.preventDefault();

    if (!newCourse.title.trim()) return;

    const course = {
      id: Date.now(),
      title: newCourse.title.trim(),
      category: newCourse.category.trim() || "General",
      level: "Beginner",
      progress: 0,
      icon: "📘",
    };

    setCourses((previous) => [...previous, course]);
    setNewCourse({ title: "", category: "" });
    setShowCourseForm(false);
  }

  const visibleCourses = courses.filter((course) =>
    `${course.title} ${course.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const firstName =
    user?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Learner";

  const pageTitles = {
    dashboard: "Dashboard",
    courses: "Explore Courses",
    quiz: "Practice Quiz",
    progress: "My Learning Progress",
  };

  if (page === "login") {
    return (
      <div className="auth-page">
        <section className="auth-decoration">
          <div className="brand">
            <span className="brand-icon">E</span>
            <span>EduAdapt</span>
          </div>

          <div className="hero-copy">
            <span className="eyebrow">YOUR LEARNING JOURNEY STARTS HERE</span>

            <h1>Learning that adapts to you.</h1>

            <p>
              Discover new skills, practice what you learn, and monitor
              your progress in one simple learning space.
            </p>

            <div className="hero-stats">
              <div>
                <strong>Learn</strong>
                <span>At your pace</span>
              </div>
              <div>
                <strong>Practice</strong>
                <span>Every day</span>
              </div>
              <div>
                <strong>Improve</strong>
                <span>Step by step</span>
              </div>
            </div>
          </div>

          <div className="decoration-circle circle-one" />
          <div className="decoration-circle circle-two" />

          <p className="branding-footer">
            Personalized learning. Meaningful progress.
          </p>
        </section>

        <section className="auth-panel">
          <form className="auth-form" onSubmit={handleAuth}>
            <div className="form-heading">
              <span className="form-label">
                {isRegister ? "GET STARTED" : "WELCOME BACK"}
              </span>

              <h2>
                {isRegister ? "Create your account" : "Sign in to EduAdapt"}
              </h2>

              <p>
                {isRegister
                  ? "Enter your details to begin your learning journey."
                  : "Enter your details to continue where you left off."}
              </p>
            </div>

            {isRegister && (
              <div className="form-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={updateForm}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={updateForm}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={updateForm}
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                required
              />
            </div>

            {isRegister && (
              <div className="form-field">
                <label htmlFor="role">Account type</label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={updateForm}
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                </select>
              </div>
            )}

            {message && (
              <div className="error-message" role="alert">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="primary-button auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isRegister
                ? "Create account"
                : "Sign in"}
              {!loading && <span aria-hidden="true"> →</span>}
            </button>

            <div className="auth-switch">
              <span>
                {isRegister
                  ? "Already have an account?"
                  : "New to EduAdapt?"}
              </span>

              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setIsRegister((previous) => !previous);
                  setMessage("");
                }}
              >
                {isRegister ? "Sign in" : "Create account"}
              </button>
            </div>

            <div className="auth-footer">
              © 2026 EduAdapt · Learn without limits
            </div>
          </form>
        </section>
      </div>
    );
  }

  if (user?.role === "TEACHER") {
    return <TeacherPortal user={user} onLogout={logout} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <span className="brand-icon">E</span>
          <span>EduAdapt</span>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <button
            className={`nav-item ${page === "dashboard" ? "active" : ""}`}
            onClick={() => setPage("dashboard")}
          >
            <span className="nav-icon">▦</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${page === "courses" ? "active" : ""}`}
            onClick={() => setPage("courses")}
          >
            <span className="nav-icon">▤</span>
            <span>My Courses</span>
          </button>

          <button
            className={`nav-item ${page === "quiz" ? "active" : ""}`}
            onClick={() => setPage("quiz")}
          >
            <span className="nav-icon">✓</span>
            <span>Practice Quiz</span>
          </button>

          <button
            className={`nav-item ${page === "progress" ? "active" : ""}`}
            onClick={() => setPage("progress")}
          >
            <span className="nav-icon">↗</span>
            <span>My Progress</span>
          </button>

          {user?.role === "TEACHER" && (
            <button
              className="nav-item"
              onClick={() => {
                setPage("courses");
                setShowCourseForm(true);
              }}
            >
              <span className="nav-icon">＋</span>
              <span>Create Course</span>
            </button>
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">✦</span>
            <strong>Keep learning!</strong>
            <p>Small steps lead to big achievements.</p>
          </div>

          <button className="nav-item logout-button" onClick={logout}>
            <span className="nav-icon">↪</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-heading">
            <p className="topbar-caption">YOUR PERSONAL LEARNING SPACE</p>
            <h2>{pageTitles[page] || "Dashboard"}</h2>
          </div>

          <div className="profile">
            <div className="avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-info">
              <strong>{user?.name || firstName}</strong>
              <span>{user?.role || "STUDENT"}</span>
            </div>
          </div>
        </header>

        {page === "dashboard" && (
          <>
            <section className="welcome-banner">
              <div className="welcome-copy">
                <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
                <h1>Welcome back, {firstName}!</h1>
                <p>Build your knowledge, one lesson at a time.</p>
                <button
                  className="banner-button"
                  onClick={() => setPage("courses")}
                >
                  Explore courses <span>→</span>
                </button>
              </div>

              <div className="banner-art" aria-hidden="true">
                📚
              </div>
            </section>

            <section className="stats-grid">
              <Stat
                icon="📘"
                label="Available courses"
                value={courses.length}
              />
              <Stat icon="🎯" label="Average progress" value="59%" />
              <Stat
                icon="🏆"
                label="Quizzes completed"
                value={quizCompleted ? 1 : 0}
              />
              <Stat icon="🔥" label="Learning streak" value="3 days" />
            </section>

            <section className="section-heading">
              <div>
                <h3>Continue learning</h3>
                <p>Pick up where you left off.</p>
              </div>

              <button
                className="link-button"
                onClick={() => setPage("courses")}
              >
                View all courses →
              </button>
            </section>

            <div className="course-grid">
              {courses.slice(0, 3).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onOpen={() => setPage("progress")}
                />
              ))}
            </div>

            <section className="tip-banner">
              <span className="tip-icon">✦</span>
              <div>
                <strong>Your personalized learning tip</strong>
                <p>
                  Practice a little every day. Review challenging topics
                  and track your improvement.
                </p>
              </div>
            </section>
          </>
        )}

        {page === "courses" && (
          <>
            <section className="section-heading courses-heading">
              <div>
                <h3>Find your next skill</h3>
                <p>Explore courses and build practical knowledge.</p>
              </div>

              {user?.role === "TEACHER" && (
                <button
                  className="primary-button compact"
                  onClick={() => setShowCourseForm((previous) => !previous)}
                >
                  {showCourseForm ? "Cancel" : "+ Add course"}
                </button>
              )}
            </section>

            {showCourseForm && user?.role === "TEACHER" && (
              <form className="course-form" onSubmit={addCourse}>
                <div className="form-field">
                  <label htmlFor="course-title">Course title</label>
                  <input
                    id="course-title"
                    placeholder="e.g. Python Programming"
                    value={newCourse.title}
                    onChange={(event) =>
                      setNewCourse({
                        ...newCourse,
                        title: event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="course-category">Category</label>
                  <input
                    id="course-category"
                    placeholder="e.g. Programming"
                    value={newCourse.category}
                    onChange={(event) =>
                      setNewCourse({
                        ...newCourse,
                        category: event.target.value,
                      })
                    }
                  />
                </div>

                <button type="submit" className="primary-button compact">
                  Save course
                </button>
              </form>
            )}

            <div className="course-toolbar">
              <label className="search-box">
                <span>⌕</span>
                <input
                  aria-label="Search courses"
                  placeholder="Search by course or category..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <span className="results-count">
                {visibleCourses.length} courses
              </span>
            </div>

            {visibleCourses.length > 0 ? (
              <div className="course-grid">
                {visibleCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onOpen={() => setPage("progress")}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>🔎</span>
                <h3>No courses found</h3>
                <p>Try a different search term.</p>
              </div>
            )}

            <p className="demo-note">
              Demo note: course information is currently stored in frontend
              state and is not saved to the database.
            </p>
          </>
        )}

        {page === "quiz" && (
          <section className="quiz-card">
            <div className="quiz-header">
              <div>
                <span className="eyebrow">QUICK KNOWLEDGE CHECK</span>
                <h2>JavaScript Basics</h2>
                <p>Question 1 of 1 · Beginner</p>
              </div>
              <span className="quiz-symbol">✓</span>
            </div>

            <div className="quiz-question">
              <span>QUESTION 01</span>
              <h3>
                Which keyword declares a variable that can be reassigned
                in JavaScript?
              </h3>
            </div>

            <div className="quiz-options">
              {["const", "let", "static", "final"].map((answer) => (
                <label
                  key={answer}
                  className={`quiz-option ${
                    quizAnswer === answer ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz"
                    value={answer}
                    checked={quizAnswer === answer}
                    onChange={() => {
                      setQuizAnswer(answer);
                      setQuizMessage("");
                      setQuizCompleted(false);
                    }}
                  />
                  <span>{answer}</span>
                </label>
              ))}
            </div>

            <button
              className="primary-button quiz-submit"
              disabled={!quizAnswer}
              onClick={() => {
                setQuizMessage(
                  quizAnswer === "let"
                    ? "Correct! Great work. 🎉"
                    : "Not quite. The correct answer is let."
                );
                setQuizCompleted(true);
              }}
            >
              Check answer
            </button>

            {quizMessage && (
              <p
                className={`quiz-feedback ${
                  quizAnswer === "let" ? "success" : "incorrect"
                }`}
                role="status"
              >
                {quizMessage}
              </p>
            )}
          </section>
        )}

        {page === "progress" && (
          <>
            <section className="welcome-banner progress-banner">
              <div className="welcome-copy">
                <span className="eyebrow">YOUR GROWTH</span>
                <h1>Every step counts.</h1>
                <p>Keep practicing to strengthen your skills.</p>
              </div>

              <div className="banner-art" aria-hidden="true">
                📈
              </div>
            </section>

            <section className="section-heading">
              <div>
                <h3>Course progress</h3>
                <p>Your current learning overview.</p>
              </div>
            </section>

            <div className="progress-list">
              {courses.map((course) => (
                <div className="progress-row" key={course.id}>
                  <span className="course-icon">{course.icon}</span>

                  <div className="progress-details">
                    <strong>{course.title}</strong>
                    <span>{course.category}</span>

                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-label={`${course.title} progress`}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={course.progress}
                    >
                      <div
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <strong className="progress-percentage">
                    {course.progress}%
                  </strong>
                </div>
              ))}
            </div>

            <p className="demo-note">
              Demo note: progress values are sample values and are not
              currently saved to the database.
            </p>
          </>
        )}

        <footer className="page-footer">
          <span>EduAdapt</span>
          <span>Intelligent Adaptive Learning Management System</span>
        </footer>
      </main>
    </div>
  );
}

function TeacherPortal({ user, onLogout }) {
  const [view, setView] = useState("overview");
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState("Intermediate");
  const [aiCount, setAiCount] = useState(5);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [questionForm, setQuestionForm] = useState({ course: "Web Development", prompt: "", answer: "", difficulty: "Intermediate" });
  const [examForm, setExamForm] = useState({ title: "", course: "Web Development", date: "", file: null });
  const name = user?.name || user?.email?.split("@")[0] || "Teacher";
  const title = { overview: "Teacher dashboard", questions: "Question bank", exams: "Exams & assessments" }[view];

  async function apiRequest(path, options = {}) {
      const response = await fetch(`${API_BASE_URL}${path}`, { credentials: "include", ...options });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Could not save your changes.");
    return result;
  }

  useEffect(() => {
    async function loadTeacherData() {
      if (!user?.id) {
        setNotice("Please sign in again to load your saved teacher data.");
        setDataLoading(false);
        return;
      }
      setDataLoading(true);
      try {
        const [savedQuestions, savedExams] = await Promise.all([
          apiRequest(`/api/teacher/questions?teacherId=${user.id}`),
          apiRequest(`/api/teacher/exams?teacherId=${user.id}`),
        ]);
        setQuestions(savedQuestions);
        setExams(savedExams);
      } catch (error) {
        setNotice(error.message.includes("Failed to fetch") ? "Cannot reach the backend while loading your saved work." : error.message);
      } finally {
        setDataLoading(false);
      }
    }
    loadTeacherData();
  }, [user?.id]);

  async function addQuestion(event) {
    event.preventDefault();
    try {
      const savedQuestion = await apiRequest("/api/teacher/questions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: user.id, ...questionForm }),
      });
      setQuestions((items) => [savedQuestion, ...items]);
      setQuestionForm({ ...questionForm, prompt: "", answer: "" });
      setNotice("Question saved to your account.");
    } catch (error) { setNotice(error.message); }
  }

  async function uploadQuestionFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("teacherId", user.id);
    formData.append("course", questionForm.course);
    formData.append("file", file);
    try {
      const savedFile = await apiRequest("/api/teacher/questions/upload", { method: "POST", body: formData });
      setQuestions((items) => [savedFile, ...items]);
      setNotice(`${file.name} uploaded and saved to your account.`);
    } catch (error) { setNotice(error.message); }
    finally { event.target.value = ""; }
  }

  async function generateAIQuestions(event) {
    event.preventDefault();
    setAiLoading(true);
    setAiError("");
    setAiQuestions([]);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/questions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, course: questionForm.course, count: Number(aiCount), difficulty: aiDifficulty }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not generate questions.");
      setAiQuestions(result.questions || []);
    } catch (error) {
      setAiError(error.message.includes("Failed to fetch") ? "Cannot reach the backend. Check that the app is running." : error.message);
    } finally {
      setAiLoading(false);
    }
  }

  async function addAIQuestions() {
    try {
      const savedQuestions = await apiRequest("/api/teacher/questions/batch", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: user.id, course: questionForm.course, difficulty: aiDifficulty, questions: aiQuestions }),
      });
      setQuestions((items) => [...savedQuestions, ...items]);
      setNotice(`${savedQuestions.length} AI questions saved to your account.`);
      setAiQuestions([]);
    } catch (error) { setNotice(error.message); }
  }

  async function addExam(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("teacherId", user.id);
    formData.append("title", examForm.title);
    formData.append("course", examForm.course);
    if (examForm.date) formData.append("date", examForm.date);
    if (examForm.file) formData.append("file", examForm.file);
    try {
      const savedExam = await apiRequest("/api/teacher/exams", { method: "POST", body: formData });
      setExams((items) => [savedExam, ...items]);
      setExamForm({ title: "", course: "Web Development", date: "", file: null });
      setNotice("Assessment draft saved to your account.");
    } catch (error) { setNotice(error.message); }
  }

  return (
    <div className="teacher-shell">
      <aside className="teacher-sidebar">
        <a className="brand teacher-brand" href="#top"><span className="brand-icon">E</span><span>EduAdapt</span></a>
        <div className="workspace-label">TEACHER WORKSPACE</div>
        <nav className="teacher-nav" aria-label="Teacher navigation">
          {[ ["overview", "▦", "Overview"], ["questions", "?", "Question bank"], ["exams", "▤", "Exams & assessments"] ].map(([key, icon, label]) => <button key={key} className={`nav-item ${view === key ? "active" : ""}`} onClick={() => { setView(key); setNotice(""); }}><span className="nav-icon">{icon}</span>{label}</button>)}
        </nav>
        <div className="teacher-side-bottom"><div className="teacher-help"><span>✦</span><strong>Ready for class?</strong><p>Build a question bank and create assessments for your learners.</p></div><button className="nav-item logout-button" onClick={onLogout}><span className="nav-icon">↪</span>Sign out</button></div>
      </aside>
      <main className="teacher-main" id="top">
        <header className="teacher-topbar"><div><p className="topbar-caption">EDUADAPT · TEACHER WORKSPACE</p><h1>{title}</h1></div><div className="profile"><div className="avatar">{name.charAt(0).toUpperCase()}</div><div className="profile-info"><strong>{name}</strong><span>TEACHER</span></div></div></header>
        {notice && <div className="teacher-notice" role="status">✓ {notice}</div>}
        {view === "overview" && <>
          <section className="teacher-hero"><div><span className="teacher-eyebrow">YOUR CLASSROOM, ORGANIZED</span><h2>Good to have you here, {name.split(" ")[0]}.</h2><p>Prepare questions, build assessments, and keep your course materials in one place.</p><button className="teacher-primary" onClick={() => setView("exams")}>Create an exam <span>→</span></button></div><div className="teacher-hero-art" aria-hidden="true">✎</div></section>
          <div className="teacher-stats"><article><span className="teacher-stat-icon violet">▤</span><div><p>Exams & assessments</p><strong>{exams.length}</strong><small>In your workspace</small></div></article><article><span className="teacher-stat-icon mint">?</span><div><p>Questions added</p><strong>{questions.length}</strong><small>Ready to use</small></div></article><article><span className="teacher-stat-icon amber">◷</span><div><p>Published exams</p><strong>{exams.filter((exam) => exam.status === "Published").length}</strong><small>Shared with learners</small></div></article></div>
          <div className="teacher-content-grid"><section className="teacher-panel"><div className="teacher-panel-head"><div><h3>Recent assessments</h3><p>Your latest exam activity</p></div><button className="teacher-text-button" onClick={() => setView("exams")}>View all →</button></div><ExamList exams={exams.slice(0, 3)} teacherId={user.id} /></section><section className="teacher-panel teacher-quick-panel"><div className="teacher-panel-head"><div><h3>Quick actions</h3><p>Get your next class ready</p></div></div><button onClick={() => setView("questions")}><span className="quick-icon violet">?</span><span><strong>Add questions</strong><small>Write questions or upload a file</small></span><b>→</b></button><button onClick={() => setView("exams")}><span className="quick-icon mint">▤</span><span><strong>Create an exam</strong><small>Set a date and attach materials</small></span><b>→</b></button></section></div>
        </>}
        {view === "questions" && <><section className="teacher-page-intro"><div><h2>Build your question bank</h2><p>Add questions one at a time or import a file to reuse in assessments.</p></div><span className="teacher-counter">{questions.length} added</span></section><div className="teacher-content-grid question-layout"><form className="teacher-panel teacher-form" onSubmit={addQuestion}><div className="teacher-panel-head"><div><h3>Write a question</h3><p>Add a question and its correct answer.</p></div><span className="form-step">01</span></div><label>Course<select value={questionForm.course} onChange={(e) => setQuestionForm({ ...questionForm, course: e.target.value })}><option>Web Development</option><option>Java Programming</option><option>Database Management</option><option>Machine Learning</option></select></label><label>Question<textarea value={questionForm.prompt} onChange={(e) => setQuestionForm({ ...questionForm, prompt: e.target.value })} placeholder="e.g. What does the CSS flex property control?" required rows="4" /></label><div className="teacher-form-row"><label>Correct answer<input value={questionForm.answer} onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })} placeholder="Enter the answer" required /></label><label>Difficulty<select value={questionForm.difficulty} onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label></div><button type="submit" className="teacher-primary">Add to question bank <span>→</span></button></form><section className="teacher-panel import-panel"><div className="teacher-panel-head"><div><h3>Import questions</h3><p>Upload your existing question file.</p></div><span className="form-step">02</span></div><label className="upload-zone"><input type="file" accept=".csv,.xlsx,.doc,.docx,.pdf,.txt" onChange={uploadQuestionFile} /><span className="upload-icon">↑</span><strong>Choose a file to upload</strong><small>CSV, Excel, Word, PDF, or TXT · up to 10 MB</small><span className="upload-choose">Browse files</span></label><p className="upload-footnote"><span>ⓘ</span> Files are saved for download; their contents are not parsed into individual questions.</p></section></div><section className="teacher-panel teacher-ai-panel"><div className="teacher-panel-head"><div><h3>Generate with AI</h3><p>Create a draft set from a topic, then review before adding.</p></div><span className="form-step">AI</span></div><form className="teacher-ai-form" onSubmit={generateAIQuestions}><label>Topic or lesson<input value={aiTopic} onChange={(event) => setAiTopic(event.target.value)} placeholder="e.g. CSS flexbox and responsive layouts" maxLength="400" required /></label><div className="teacher-form-row"><label>Difficulty<select value={aiDifficulty} onChange={(event) => setAiDifficulty(event.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label>Number of questions<select value={aiCount} onChange={(event) => setAiCount(event.target.value)}>{[3, 5, 8, 10].map((count) => <option key={count} value={count}>{count}</option>)}</select></label></div><button className="teacher-primary" type="submit" disabled={aiLoading}>{aiLoading ? "Generating…" : "Generate questions"} <span>✦</span></button></form>{aiError && <p className="teacher-ai-error" role="alert">{aiError}</p>}{aiQuestions.length > 0 && <><div className="teacher-ai-results">{aiQuestions.map((question, index) => <article key={`${index}-${question.prompt}`}><strong>{index + 1}. {question.prompt}</strong><small>Answer: {question.answer}</small></article>)}</div><button className="teacher-text-button" onClick={addAIQuestions}>Add these {aiQuestions.length} questions to my bank →</button></>}</section><section className="teacher-panel teacher-question-list"><div className="teacher-panel-head"><div><h3>Recently added</h3><p>Your saved questions and uploaded files</p></div></div>{dataLoading ? <p className="teacher-empty">Loading saved questions…</p> : questions.length ? <div className="question-list">{questions.map((q) => <article key={q.id}><span className="question-mark">?</span><div><strong>{q.prompt}</strong><small>{q.course} · {q.difficulty}</small></div>{q.attachmentName ? <a className="teacher-file-link" href={`${API_BASE_URL}/api/teacher/questions/${q.id}/file?teacherId=${user.id}`}>Download file</a> : <span className="question-answer">{q.answer}</span>}</article>)}</div> : <div className="teacher-empty"><span>?</span><strong>Your question bank is ready</strong><p>Questions you add or import will appear here.</p></div>}</section></>}
        {view === "exams" && <><section className="teacher-page-intro"><div><h2>Exams & assessments</h2><p>Create an assessment, set the schedule, and attach your exam file.</p></div><span className="teacher-counter">{exams.length} assessments</span></section><div className="teacher-content-grid question-layout"><form className="teacher-panel teacher-form" onSubmit={addExam}><div className="teacher-panel-head"><div><h3>Create an assessment</h3><p>Start a draft for one of your courses.</p></div><span className="form-step">✦</span></div><label>Assessment name<input value={examForm.title} onChange={(e) => setExamForm({ ...examForm, title: e.target.value })} placeholder="e.g. Mid-term assessment" required /></label><label>Course<select value={examForm.course} onChange={(e) => setExamForm({ ...examForm, course: e.target.value })}><option>Web Development</option><option>Java Programming</option><option>Database Management</option><option>Machine Learning</option></select></label><label>Scheduled date<input type="date" value={examForm.date} onChange={(e) => setExamForm({ ...examForm, date: e.target.value })} /></label><label className="exam-file-field">Attach exam file <span className="optional">Optional · up to 10 MB</span><input type="file" accept=".pdf,.doc,.docx,.xlsx,.csv" onChange={(e) => setExamForm({ ...examForm, file: e.target.files?.[0] || null })} /></label>{examForm.file && <div className="selected-file">▧ <span>{examForm.file.name}</span><button type="button" onClick={() => setExamForm({ ...examForm, file: null })} aria-label="Remove attached file">×</button></div>}<button className="teacher-primary" type="submit">Save as draft <span>→</span></button></form><section className="teacher-panel exam-guide"><span className="guide-icon">✦</span><h3>Assessment checklist</h3><p>Give learners a clear, organized exam experience.</p><ul><li><span>✓</span> Choose the course</li><li><span>✓</span> Give the assessment a clear name</li><li><span>✓</span> Add the exam date</li><li><span>✓</span> Attach an exam file or add questions</li></ul><button className="teacher-text-button" onClick={() => setView("questions")}>Open question bank →</button></section></div><section className="teacher-panel teacher-question-list"><div className="teacher-panel-head"><div><h3>All assessments</h3><p>Saved exams and drafts</p></div></div>{dataLoading ? <p className="teacher-empty">Loading saved assessments…</p> : <ExamList exams={exams} teacherId={user.id} />}</section></>}
        <footer className="teacher-footer"><span>EduAdapt for Educators</span><span>Teaching tools, all in one place.</span></footer>
      </main>
    </div>
  );
}

function ExamList({ exams, teacherId }) {
  return exams.length ? <div className="exam-list">{exams.map((exam) => <article key={exam.id}><span className="exam-file-icon">▤</span><div className="exam-details"><strong>{exam.title}</strong><small>{exam.course} · {exam.questions ? `${exam.questions} questions` : exam.file || "No file attached"}</small>{exam.file && <a className="teacher-file-link" href={`${API_BASE_URL}/api/teacher/exams/${exam.id}/file?teacherId=${teacherId}`}>Download attached file</a>}</div><span className="exam-date">{exam.date || "Date not set"}</span><span className={`exam-status ${exam.status === "Published" ? "published" : "draft"}`}><i />{exam.status}</span></article>)}</div> : <div className="teacher-empty"><span>▤</span><strong>No assessments yet</strong><p>Create an assessment to get started.</p></div>;
}

function Stat({ icon, label, value }) {
  return (
    <article className="stat-card">
      <span className="stat-icon">{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function CourseCard({ course, onOpen }) {
  return (
    <article className="course-card">
      <div className="course-card-top">
        <span className="course-icon">{course.icon}</span>
        <span className="level-tag">{course.level}</span>
      </div>

      <p className="course-category">{course.category}</p>
      <h3>{course.title}</h3>
      <p className="course-description">
        Learn key concepts and build practical skills at your own pace.
      </p>

      <div className="course-progress-label">
        <span>Course progress</span>
        <strong>{course.progress}%</strong>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label={`${course.title} progress`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={course.progress}
      >
        <div style={{ width: `${course.progress}%` }} />
      </div>

      <button className="course-button" onClick={onOpen}>
        View progress <span>→</span>
      </button>
    </article>
  );
}

export default App;
