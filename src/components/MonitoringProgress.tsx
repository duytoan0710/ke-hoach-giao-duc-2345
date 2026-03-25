import React, { useState } from 'react';
import { BarChart3, Clock, CheckCircle2, AlertCircle, FileText, ChevronDown, TrendingUp, Users, School, ChevronLeft, ChevronRight, BookOpen, Calculator, Leaf, Heart, Beaker, Globe, Calendar, PenTool } from 'lucide-react';
import { GRADES } from '../constants/grades';
import { SUBJECT_GROUPS } from '../constants/subjectGroups';

const OBJECT_TYPES = [
  { id: 'group_plan', label: 'Kế hoạch tổ' },
  { id: 'teaching_schedule', label: 'Lịch báo giảng' },
  { id: 'lesson_plan', label: 'Kế hoạch bài dạy' },
];

const MonitoringProgress = () => {
  const [objectType, setObjectType] = useState(OBJECT_TYPES[0].id);
  const [weekFilter, setWeekFilter] = useState('current');
  const [activeGrade, setActiveGrade] = useState('Khối 1');
  const [activeSubject, setActiveSubject] = useState('Tiếng Việt');
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [viewMode, setViewMode] = useState('by_lesson');
  const [selectedTeacher, setSelectedTeacher] = useState(0);

  const getStats = () => {
    switch (objectType) {
      case 'group_plan': return { total: 15, draft: 2, pending_sign: 3, pending_group_leader: 2, pending_bgh: 2, pending_office: 1, approved: 5 };
      case 'teaching_schedule': return { total: 45, draft: 5, pending_sign: 5, pending_group_leader: 5, pending_bgh: 5, pending_office: 5, approved: 20 };
      case 'lesson_plan': return { total: 120, draft: 10, pending_sign: 10, pending_group_leader: 20, pending_bgh: 20, pending_office: 10, approved: 50 };
      default: return { total: 0, draft: 0, pending_sign: 0, pending_group_leader: 0, pending_bgh: 0, pending_office: 0, approved: 0 };
    }
  };

  const stats = getStats();

  const renderKpiCards = () => {
    if (objectType !== 'group_plan') {
      return [
        { label: 'Tổng hồ sơ', value: stats.total, icon: FileText, color: 'text-slate-600' },
        { label: 'Đã ban hành', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-600' },
        { label: 'Chờ duyệt', value: stats.pending_sign, icon: Clock, color: 'text-amber-600' },
        { label: 'Bản nháp', value: stats.draft, icon: AlertCircle, color: 'text-rose-600' },
      ];
    }
    return [
      { label: 'Tổng số', value: stats.total, icon: FileText, color: 'text-slate-600' },
      { label: 'Bản nháp', value: stats.draft, icon: AlertCircle, color: 'text-rose-600' },
      { label: 'Chờ trình ký', value: stats.pending_sign, icon: Clock, color: 'text-amber-600' },
      { label: 'Chờ Tổ trưởng', value: stats.pending_group_leader, icon: Users, color: 'text-amber-600' },
      { label: 'Chờ BGH', value: stats.pending_bgh, icon: School, color: 'text-amber-600' },
      { label: 'Chờ Văn thư', value: stats.pending_office, icon: FileText, color: 'text-amber-600' },
      { label: 'Đã ban hành', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-600' },
    ];
  };

  const getDetailedData = () => {
    if (objectType === 'group_plan') {
      return [
        ...GRADES.map(g => ({ name: g.label, status: 'Đã ban hành' })),
        ...SUBJECT_GROUPS.map(s => ({ name: `Tổ ${s.name}`, status: 'Chờ Tổ trưởng ký' }))
      ];
    }
    
    // Tree structure logic for teaching_schedule
    if (objectType === 'teaching_schedule') {
      return [
        {
          org: 'Tổ Toán',
          teachers: [
            { name: 'Nguyễn Văn A', schedule: 'Lịch tuần 12', status: 'Hoàn thành' },
            { name: 'Trần Thị B', schedule: 'Lịch tuần 12', status: 'Chưa làm' },
            { name: 'Trần Văn E', schedule: 'Lịch tuần 12', status: 'Chờ Tổ trưởng ký' },
            { name: 'Nguyễn Thị F', schedule: 'Lịch tuần 12', status: 'Chờ BGH ký' },
          ]
        },
        {
          org: 'Tổ Văn',
          teachers: [
            { name: 'Lê Văn C', schedule: 'Lịch tuần 12', status: 'Đang soạn' },
            { name: 'Phạm Văn D', schedule: 'Lịch tuần 12', status: 'Chờ BGH ký' },
            { name: 'Hoàng Thị G', schedule: 'Lịch tuần 12', status: 'Chưa làm' },
            { name: 'Đặng Văn H', schedule: 'Lịch tuần 12', status: 'Hoàn thành' },
          ]
        }
      ];
    }

    // Tree structure logic for lesson_plan
    if (objectType === 'lesson_plan') {
      return [
        {
          grade: 'Khối 1',
          subjects: [
            {
              name: 'Tiếng Việt',
              weeks: [
                {
                  name: 'Tuần 12',
                  lessons: [
                    {
                      name: 'Bài 1: Chữ A',
                      teachers: [
                        { name: 'Nguyễn Văn A', status: 'Hoàn thành' },
                        { name: 'Trần Thị B', status: 'Chưa làm' }
                      ]
                    },
                    {
                      name: 'Bài 2: Chữ B',
                      teachers: [
                        { name: 'Nguyễn Văn A', status: 'Đang soạn' },
                        { name: 'Trần Thị B', status: 'Chờ Tổ trưởng ký' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-emerald-100 text-emerald-700';
      case 'Chưa làm': return 'bg-rose-100 text-rose-700';
      case 'Đang soạn': return 'bg-slate-100 text-slate-600';
      case 'Chờ Tổ trưởng ký': return 'bg-amber-100 text-amber-700';
      case 'Chờ BGH ký': return 'bg-violet-100 text-violet-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };


  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-2">
        {OBJECT_TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => setObjectType(t.id)}
            className={`flex-1 px-6 py-3 rounded-xl text-sm font-black transition-all ${
              objectType === t.id 
                ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' 
                : 'text-slate-500 hover:bg-slate-200/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      
      {/* Week Filter for Teaching Schedule */}
      {objectType === 'teaching_schedule' && (
        <div className="flex items-center gap-2">
          {['Tuần hiện tại', 'Tuần tới'].map(w => (
            <button
              key={w}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                w === 'Tuần hiện tại' 
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {w}
            </button>
          ))}
          <div className="relative">
            <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold bg-white text-slate-600 border border-slate-200">
              Tuần khác <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {objectType !== 'teaching_schedule' && objectType !== 'lesson_plan' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {renderKpiCards().map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[100px]">
              <div className="space-y-2">
                <p className="text-slate-800 text-[10px] font-black uppercase tracking-wider leading-tight">
                  {stat.label}
                </p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {objectType === 'teaching_schedule' ? (
            <div className="space-y-6">
              <div className="bg-indigo-50 text-indigo-800 px-4 py-2 rounded-lg text-sm font-black tracking-wide border border-indigo-100 shadow-sm inline-block">
                Tuần 12: 20/03 - 26/03
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Tổng GV', value: 8, color: 'text-slate-600' },
                  { label: 'Chưa làm', value: 2, color: 'text-rose-600' },
                  { label: 'Đang soạn', value: 1, color: 'text-slate-500' },
                  { label: 'Chờ Tổ trưởng ký', value: 1, color: 'text-amber-600' },
                  { label: 'Chờ BGH ký', value: 2, color: 'text-amber-600' },
                  { label: 'Hoàn thành', value: 2, color: 'text-emerald-600' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.color} mt-1`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {getDetailedData().map((org: any, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 font-bold text-indigo-700 border-b border-slate-200">
                    {org.org}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {org.teachers.map((t: any, j: number) => (
                      <div key={j} className="grid grid-cols-[1fr_120px_100px] items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {t.name.split(' ').pop()?.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-700">{t.name}</span>
                        </div>
                        <div className="text-xs text-slate-400 text-center">{t.schedule}</div>
                        <div className="flex justify-end">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${getStatusColor(t.status)}`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : objectType === 'lesson_plan' ? (
            <div className="space-y-6">
              {/* Filters Section */}
              <div className="space-y-4">
                {/* Optimized Filters Section */}
                <div className="flex flex-wrap items-end gap-6 p-4 bg-slate-50/50 rounded-[2rem] border-2 border-slate-100 shadow-inner">
                  {/* Grade Select */}
                  <div className="flex flex-col gap-1.5 min-w-[180px]">
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] pl-1">Chọn Khối Lớp</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-focus-within:scale-110 transition-transform pointer-events-none z-10">
                        <School className="w-4.5 h-4.5" />
                      </div>
                      <select
                        value={activeGrade}
                        onChange={(e) => setActiveGrade(e.target.value)}
                        className="w-full pl-14 pr-10 py-2.5 bg-white border-2 border-indigo-100 rounded-xl text-sm font-black text-indigo-900 appearance-none cursor-pointer hover:border-indigo-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none shadow-sm"
                      >
                        {['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'].map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Subject Select */}
                  <div className="flex flex-col gap-1.5 min-w-[240px]">
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] pl-1">Chọn Môn Học</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-focus-within:scale-110 transition-transform pointer-events-none z-10">
                        <BookOpen className="w-4.5 h-4.5" />
                      </div>
                      <select
                        value={activeSubject}
                        onChange={(e) => setActiveSubject(e.target.value)}
                        className="w-full pl-14 pr-10 py-2.5 bg-white border-2 border-emerald-100 rounded-xl text-sm font-black text-emerald-900 appearance-none cursor-pointer hover:border-emerald-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none shadow-sm"
                      >
                        {[
                          { name: 'Tiếng Việt', icon: BookOpen },
                          { name: 'Toán', icon: Calculator },
                          { name: 'Tự nhiên & Xã hội', icon: Leaf },
                          { name: 'Đạo đức', icon: Heart },
                          { name: 'Khoa học', icon: Beaker },
                          { name: 'Lịch sử & Địa lý', icon: Globe }
                        ].map(subject => (
                          <option key={subject.name} value={subject.name}>{subject.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master-Detail Layout */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.4)]" />
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                      {viewMode === 'by_lesson' ? 'Danh sách bài học & Chi tiết tiến độ' : 'Danh sách giáo viên & Tiến độ cá nhân'}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setViewMode('by_lesson')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                          viewMode === 'by_lesson'
                            ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Theo bài học
                      </button>
                      <button
                        onClick={() => setViewMode('by_teacher')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                          viewMode === 'by_teacher'
                            ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Theo giáo viên
                      </button>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-black uppercase tracking-wider">Tuần 12: 20/03 - 26/03</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {viewMode === 'by_lesson' ? (
                    <>
                      {/* Left Pane: Lesson List (Master) */}
                      <div className="lg:col-span-4 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {[
                          "Bài 1: Làm quen với các nét cơ bản và chữ cái Tiếng Việt",
                          "Bài 2: Các dấu thanh và cách ghép vần cơ bản",
                          "Bài 3: Luyện đọc các từ đơn và câu ngắn",
                          "Bài 4: Kỹ năng viết chữ đẹp và giữ gìn vở sạch",
                          "Bài 5: Ôn tập tổng hợp kiến thức chương 1",
                          "Bài 6: Phân biệt các âm đầu dễ nhầm lẫn",
                          "Bài 7: Luyện viết đoạn văn ngắn kể về gia đình",
                          "Bài 8: Đọc hiểu văn bản truyện cổ tích Việt Nam"
                        ].map((lesson, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedLesson(idx)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                              selectedLesson === idx
                                ? 'bg-white border-indigo-600 shadow-sm'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedLesson === idx ? 'text-indigo-600' : 'text-slate-400'}`}>
                                  Bài {idx + 1}
                                </span>
                                {selectedLesson === idx && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                )}
                              </div>
                              <p className={`text-sm font-bold leading-tight ${selectedLesson === idx ? 'text-slate-900' : 'text-slate-600'}`}>
                                {lesson.split(': ')[1]}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex -space-x-2">
                                  {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-5 h-5 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-[8px] font-bold text-slate-400`}>
                                      {i}
                                    </div>
                                  ))}
                                </div>
                                <span className={`text-[10px] font-bold ${selectedLesson === idx ? 'text-indigo-600' : 'text-emerald-600'}`}>
                                  85% Hoàn thành
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Right Pane: Teacher Status (Detail) */}
                      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden sticky top-6">
                        <div className="bg-white p-6 border-b border-slate-100">
                          <div className="flex flex-col gap-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-200">Bài {selectedLesson + 1}</span>
                                  <h4 className="text-slate-800 font-black text-lg leading-tight">
                                    {[
                                      "Làm quen với các nét cơ bản và chữ cái Tiếng Việt",
                                      "Các dấu thanh và cách ghép vần cơ bản",
                                      "Luyện đọc các từ đơn và câu ngắn",
                                      "Kỹ năng viết chữ đẹp và giữ gìn vở sạch",
                                      "Ôn tập tổng hợp kiến thức chương 1",
                                      "Phân biệt các âm đầu dễ nhầm lẫn",
                                      "Luyện viết đoạn văn ngắn kể về gia đình",
                                      "Đọc hiểu văn bản truyện cổ tích Việt Nam"
                                    ][selectedLesson]}
                                  </h4>
                                </div>
                                <p className="text-slate-600 text-xs font-medium">Theo dõi tiến độ soạn bài của tất cả giáo viên trong khối</p>
                              </div>
                            </div>

                            {/* Integrated Summary Bar */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-2 bg-slate-100/50 rounded-2xl border border-slate-200">
                              <div className="flex flex-col items-center justify-center py-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mb-2 whitespace-nowrap">Đã ban hành</p>
                                <p className="text-xl font-black text-emerald-600 leading-none">6</p>
                              </div>
                              <div className="flex flex-col items-center justify-center py-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mb-2 whitespace-nowrap">Chờ duyệt</p>
                                <p className="text-xl font-black text-amber-600 leading-none">4</p>
                              </div>
                              <div className="flex flex-col items-center justify-center py-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mb-2 whitespace-nowrap">Đang soạn</p>
                                <p className="text-xl font-black text-indigo-600 leading-none">1</p>
                              </div>
                              <div className="flex flex-col items-center justify-center py-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mb-2 whitespace-nowrap">Chưa soạn</p>
                                <p className="text-xl font-black text-slate-500 leading-none">1</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-0 overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest w-20">STT</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Giáo viên</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest w-32">Lớp</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest w-48">Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {Array.from({ length: 12 }, (_, i) => {
                                const getStatus = (index: number) => {
                                  if (index < 6) return { label: 'Đã ban hành', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-600' };
                                  if (index < 8) return { label: 'Chờ BGH ký', color: 'bg-purple-50 border-purple-200 text-purple-700', dot: 'bg-purple-500' };
                                  if (index < 9) return { label: 'Chờ tổ trưởng ký', color: 'bg-blue-50 border-blue-200 text-blue-700', dot: 'bg-blue-500' };
                                  if (index < 10) return { label: 'Đã trình ký', color: 'bg-indigo-50 border-indigo-200 text-indigo-700', dot: 'bg-indigo-500' };
                                  if (index < 11) return { label: 'Đang soạn', color: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-500' };
                                  return { label: 'Chưa soạn', color: 'bg-slate-100 border-slate-200 text-slate-600', dot: 'bg-slate-400' };
                                };
                                const status = getStatus(i);
                                return (
                                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-500">{i + 1}</td>
                                    <td className="px-6 py-4">
                                      <p className="text-sm font-bold text-slate-700">Giáo viên {i + 1}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Lớp {activeGrade.replace('Khối ', '')}{String.fromCharCode(65 + i)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${status.color}`}>
                                        <div className={`w-1 h-1 rounded-full ${status.dot}`} /> {status.label}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="bg-slate-50/30 p-4 border-t border-slate-100 flex items-center justify-center">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dữ liệu được cập nhật tự động theo thời gian thực</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Left Pane: Teacher List (Master) */}
                      <div className="lg:col-span-4 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {Array.from({ length: 12 }, (_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTeacher(idx)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                              selectedTeacher === idx
                                ? 'bg-white border-indigo-600 shadow-sm'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${selectedTeacher === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className={`text-sm font-bold truncate ${selectedTeacher === idx ? 'text-slate-900' : 'text-slate-600'}`}>
                                    Giáo viên {idx + 1}
                                  </p>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTeacher === idx ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {activeGrade.replace('Khối ', '')}{String.fromCharCode(65 + idx)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full" style={{ width: `${80 - idx * 5}%` }} />
                                  </div>
                                  <span className="text-[9px] font-bold text-emerald-600 ml-2 whitespace-nowrap">
                                    {80 - idx * 5}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Right Pane: Lesson Progress for Teacher (Detail) */}
                      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden sticky top-6">
                        <div className="bg-white p-6 border-b border-slate-100">
                          <div className="flex flex-col gap-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shadow-sm">
                                  {String.fromCharCode(65 + selectedTeacher)}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-slate-800 font-black text-lg leading-tight">Giáo viên {selectedTeacher + 1}</h4>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">Lớp {activeGrade.replace('Khối ', '')}{String.fromCharCode(65 + selectedTeacher)}</span>
                                    <span className="text-slate-400 text-[10px] font-bold">•</span>
                                    <span className="text-slate-500 text-xs font-medium">Chi tiết tiến độ soạn bài theo từng bài học</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Teacher Summary Stats */}
                            <div className="grid grid-cols-3 gap-3 p-2 bg-slate-100/50 rounded-2xl border border-slate-200">
                              <div className="flex flex-col items-center justify-center py-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mb-2">Tổng bài học</p>
                                <p className="text-xl font-black text-slate-800 leading-none">8</p>
                              </div>
                              <div className="flex flex-col items-center justify-center py-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mb-2">Đã hoàn thành</p>
                                <p className="text-xl font-black text-emerald-600 leading-none">6</p>
                              </div>
                              <div className="flex flex-col items-center justify-center py-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none mb-2">Tỷ lệ</p>
                                <p className="text-xl font-black text-indigo-600 leading-none">75%</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-0 overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest w-20">STT</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên bài học</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest w-48">Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {[
                                "Làm quen với các nét cơ bản và chữ cái Tiếng Việt",
                                "Các dấu thanh và cách ghép vần cơ bản",
                                "Luyện đọc các từ đơn và câu ngắn",
                                "Kỹ năng viết chữ đẹp và giữ gìn vở sạch",
                                "Ôn tập tổng hợp kiến thức chương 1",
                                "Phân biệt các âm đầu dễ nhầm lẫn",
                                "Luyện viết đoạn văn ngắn kể về gia đình",
                                "Đọc hiểu văn bản truyện cổ tích Việt Nam"
                              ].map((lesson, i) => {
                                const getStatus = (index: number) => {
                                  if (index < 5) return { label: 'Đã ban hành', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-600' };
                                  if (index === 5) return { label: 'Chờ BGH ký', color: 'bg-purple-50 border-purple-200 text-purple-700', dot: 'bg-purple-500' };
                                  if (index === 6) return { label: 'Đang soạn', color: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-500' };
                                  return { label: 'Chưa soạn', color: 'bg-slate-100 border-slate-200 text-slate-600', dot: 'bg-slate-400' };
                                };
                                const status = getStatus(i);
                                return (
                                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-500">{i + 1}</td>
                                    <td className="px-6 py-4">
                                      <p className="text-sm font-bold text-slate-700">{lesson}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${status.color}`}>
                                        <div className={`w-1 h-1 rounded-full ${status.dot}`} /> {status.label}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="bg-slate-50/30 p-4 border-t border-slate-100 flex items-center justify-center">
                          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Xuất báo cáo tiến độ cá nhân</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="pb-4 text-left">Tên</th>
                    <th className="pb-4 text-left">Trạng thái</th>
                    <th className="pb-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getDetailedData().map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="py-4 font-bold text-slate-700">{item.name}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase whitespace-nowrap ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-indigo-600 font-bold hover:underline">Xem chi tiết</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
};

export default MonitoringProgress;
