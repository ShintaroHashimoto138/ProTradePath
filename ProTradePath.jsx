import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, FileText, Target, Play, CheckCircle, User, Home, BarChart3, Award, Users, Settings, ArrowRight } from 'lucide-react';

// モックデータベース（実際のアプリケーションでは外部データベースを使用）
const mockDatabase = {
  users: [
    { id: 1, name: '田中太郎', email: 'tanaka@example.com', level: 'beginner', totalPoints: 1250 }
  ],
  courses: [
    {
      id: 1,
      title: '基本的な経済の知識',
      description: '経済学の基礎を学び、市場の仕組みを理解します。',
      progress: 75,
      lessons: [
        { id: 1, title: '需要と供給', completed: true, content: '市場における需要と供給の関係について学びます。' },
        { id: 2, title: 'GDP・インフレ', completed: true, content: 'GDPとインフレーションの仕組みを理解します。' },
        { id: 3, title: '金利政策', completed: false, content: '中央銀行の金利政策が経済に与える影響を学びます。' },
        { id: 4, title: '為替相場', completed: false, content: '為替レートの決定要因と影響を理解します。' }
      ]
    },
    {
      id: 2,
      title: '株価・経済指標の読み方',
      description: 'チャート分析と重要経済指標の活用方法を習得します。',
      progress: 20,
      lessons: [
        { id: 1, title: 'ローソク足の読み方', completed: true, content: '株価チャートの基本的な読み方を学びます。' },
        { id: 2, title: '移動平均線', completed: false, content: 'テクニカル分析の基本となる移動平均線について学びます。' },
        { id: 3, title: '経済指標の活用', completed: false, content: '重要な経済指標の読み方と投資への活用方法を学びます。' },
        { id: 4, title: 'チャートパターン', completed: false, content: '代表的なチャートパターンとその意味を理解します。' }
      ]
    },
    {
      id: 3,
      title: 'IR情報の読み方',
      description: '企業の財務諸表やIR資料から投資判断に必要な情報を読み解きます。',
      progress: 0,
      lessons: [
        { id: 1, title: '決算書の基本', completed: false, content: '損益計算書・貸借対照表・キャッシュフロー計算書の読み方を学びます。' },
        { id: 2, title: '財務指標の分析', completed: false, content: 'ROE、ROA、PERなどの重要指標を理解します。' },
        { id: 3, title: '決算発表の読み方', completed: false, content: '決算発表資料から投資判断に必要な情報を抽出します。' },
        { id: 4, title: '企業価値評価', completed: false, content: '企業の適正価値を評価する方法を学びます。' }
      ]
    },
    {
      id: 4,
      title: '投資手法の勉強',
      description: '様々な投資戦略とリスク管理について学びます。',
      progress: 0,
      lessons: [
        { id: 1, title: '投資の基本原則', completed: false, content: '長期投資・分散投資・リスク管理の基本を学びます。' },
        { id: 2, title: 'バリュー投資', completed: false, content: '割安株を見つける方法とバリュー投資の考え方を学びます。' },
        { id: 3, title: 'グロース投資', completed: false, content: '成長株投資の手法とリスクを理解します。' },
        { id: 4, title: 'ポートフォリオ管理', completed: false, content: '効率的なポートフォリオの構築と管理方法を学びます。' }
      ]
    }
  ],
  practicalTasks: [
    {
      id: 1,
      title: '模擬IRクイズ',
      description: '実際のIR情報をもとに、企業の状況を分析するクイズに挑戦。',
      progress: 0,
      type: 'quiz'
    },
    {
      id: 2,
      title: '株価予測シミュレーション',
      description: '過去のデータから株価の動きを予測し、投資戦略を試す。',
      progress: 0,
      type: 'simulation'
    },
    {
      id: 3,
      title: 'トレンド分析レポート作成',
      description: '世間のトレンドを読み解き、投資への影響をレポートにまとめる。',
      progress: 0,
      type: 'report'
    }
  ],
  quizzes: [
    {
      id: 1,
      courseId: 1,
      lessonId: 1,
      question: '需要が増加し、供給が一定の場合、価格はどうなりますか？',
      options: ['上昇する', '下降する', '変わらない', '予測できない'],
      correct: 0,
      explanation: '需要が増加して供給が一定の場合、需要と供給の均衡点が上方にシフトし、価格は上昇します。'
    },
    {
      id: 2,
      courseId: 1,
      lessonId: 2,
      question: 'GDPが継続的に増加している状況を何と呼びますか？',
      options: ['インフレ', '経済成長', 'デフレ', '景気後退'],
      correct: 1,
      explanation: 'GDPが継続的に増加している状況は「経済成長」と呼ばれます。'
    }
  ]
};

const ProTradePathApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userProgress, setUserProgress] = useState(mockDatabase.courses);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // サイドバーメニュー
  const sidebarItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: Home },
    { id: 'courses', label: 'コース', icon: BookOpen },
    { id: 'tasks', label: 'タスク', icon: Target },
    { id: 'progress', label: '進捗', icon: BarChart3 },
    { id: 'community', label: 'コミュニティ', icon: Users },
    { id: 'profile', label: 'プロフィール', icon: User }
  ];

  // クイズの回答処理
  const handleQuizAnswer = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  // クイズ結果の表示
  const showQuizResults = () => {
    setShowResults(true);
  };

  // レッスン完了処理
  const completeLesson = (courseId, lessonId) => {
    setUserProgress(prev => prev.map(course => {
      if (course.id === courseId) {
        const updatedLessons = course.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        );
        const completedCount = updatedLessons.filter(lesson => lesson.completed).length;
        const progress = Math.round((completedCount / updatedLessons.length) * 100);
        return { ...course, lessons: updatedLessons, progress };
      }
      return course;
    }));
  };

  // ダッシュボードビュー
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">ProTradePathへようこそ！</h2>
        <p className="text-teal-100">体系的な投資知識を学んで、賢い投資家になりましょう。</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">学習進捗</p>
              <p className="text-2xl font-bold text-teal-600">42%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-teal-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">獲得ポイント</p>
              <p className="text-2xl font-bold text-orange-600">1,250</p>
            </div>
            <Award className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">完了レッスン</p>
              <p className="text-2xl font-bold text-green-600">8/16</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">今日のおすすめ</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-teal-500 mr-3" />
            <div>
              <p className="font-medium">金利政策の基本</p>
              <p className="text-sm text-gray-600">中央銀行の金利政策が経済に与える影響を学びます</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );

  // コースビュー
  const CoursesView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">コース一覧</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userProgress.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{course.description}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>進捗</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
            
            <button 
              onClick={() => {
                setSelectedCourse(course);
                setCurrentView('course-detail');
              }}
              className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition duration-300"
            >
              コースを開始
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // コース詳細ビュー
  const CourseDetailView = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setCurrentView('courses')}
          className="text-teal-600 hover:text-teal-800"
        >
          ← コース一覧に戻る
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
        <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>コース進捗</span>
            <span>{selectedCourse.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-500 h-2 rounded-full"
              style={{ width: `${selectedCourse.progress}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">レッスン一覧</h3>
          {selectedCourse.lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {lesson.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Play className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-600">{lesson.content}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedLesson(lesson);
                  setCurrentView('lesson');
                }}
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-300"
              >
                {lesson.completed ? '復習' : '開始'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // レッスンビュー
  const LessonView = () => {
    const quiz = mockDatabase.quizzes.find(q => 
      q.courseId === selectedCourse.id && q.lessonId === selectedLesson.id
    );
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCurrentView('course-detail')}
            className="text-teal-600 hover:text-teal-800"
          >
            ← コースに戻る
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">{selectedLesson.title}</h2>
          
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed">{selectedLesson.content}</p>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">学習ポイント</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• 基本概念を理解する</li>
                <li>• 実際の事例で考える</li>
                <li>• 投資判断に活用する</li>
              </ul>
            </div>
          </div>
          
          {quiz && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">理解度チェック</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-4">{quiz.question}</p>
                <div className="space-y-2">
                  {quiz.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`quiz-${quiz.id}`}
                        value={index}
                        onChange={() => handleQuizAnswer(quiz.id, index)}
                        className="text-teal-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                
                {userAnswers[quiz.id] !== undefined && (
                  <div className="mt-4 p-3 bg-white rounded border">
                    <p className={`font-medium ${userAnswers[quiz.id] === quiz.correct ? 'text-green-600' : 'text-red-600'}`}>
                      {userAnswers[quiz.id] === quiz.correct ? '正解！' : '不正解'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{quiz.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <button 
              onClick={() => setCurrentView('course-detail')}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-300"
            >
              戻る
            </button>
            <button 
              onClick={() => {
                completeLesson(selectedCourse.id, selectedLesson.id);
                setCurrentView('course-detail');
              }}
              className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition duration-300"
            >
              レッスン完了
            </button>
          </div>
        </div>
      </div>
    );
  };

  // タスクビュー
  const TasksView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">実践タスク</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDatabase.practicalTasks.map((task) => (
          <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{task.description}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>進捗</span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
            
            <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300">
              タスクを開始
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // 進捗ビュー
  const ProgressView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">学習進捗</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">コース別進捗</h3>
        <div className="space-y-4">
          {userProgress.map((course) => (
            <div key={course.id} className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{course.title}</h4>
                <span className="text-sm text-gray-600">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-teal-500 h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>完了レッスン: {course.lessons.filter(l => l.completed).length}/{course.lessons.length}</span>
                <span>推定残り時間: {Math.max(0, 4 - course.lessons.filter(l => l.completed).length)}時間</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // メインコンテンツの表示
  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'courses':
        return <CoursesView />;
      case 'course-detail':
        return <CourseDetailView />;
      case 'lesson':
        return <LessonView />;
      case 'tasks':
        return <TasksView />;
      case 'progress':
        return <ProgressView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
              PTP
            </div>
            <h1 className="text-xl font-semibold text-gray-800 ml-2">ProTradePath</h1>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    currentView === item.id
                      ? 'bg-teal-100 text-teal-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 p-8">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default ProTradePathApp;
