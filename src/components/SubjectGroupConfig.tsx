import React, { useState, useRef, useEffect } from 'react';
import { Settings, X, Plus, Users, BookOpen, ChevronRight, Edit2, Search } from 'lucide-react';
import { SUBJECT_GROUPS } from '../constants/subjectGroups';

const ALL_SUBJECTS = [
  'Toán', 'Tiếng Việt', 'Tiếng Anh', 'Đạo đức', 'Tự nhiên và Xã hội', 
  'Lịch sử và Địa lí', 'Khoa học', 'Tin học', 'Công nghệ', 
  'Giáo dục thể chất', 'Âm nhạc', 'Mĩ thuật', 'Hoạt động trải nghiệm'
];

const ALL_TEACHERS = [
  'Nguyễn Thị A', 'Trần Văn B', 'Lê Thị C', 'Phạm Văn D', 'Hoàng Thị E', 
  'Nguyễn Văn F', 'Vũ Thị G', 'Đặng Văn H', 'Bùi Thị I', 'Đỗ Văn K',
  'Lý Thị L', 'Trương Văn M', 'Ngô Thị N', 'Dương Văn P'
];

export default function SubjectGroupConfig() {
  const [config, setConfig] = useState({
    subjectGroups: SUBJECT_GROUPS
  });

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedGroup = config.subjectGroups.find(g => g.id === selectedGroupId);

  // Close dropdowns when clicking outside
  const subjectDropdownRef = useRef<HTMLDivElement>(null);
  const teacherDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target as Node)) {
        setShowAddSubject(false);
      }
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
        setShowAddTeacher(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddSubject = (subject: string) => {
    if (!selectedGroup) return;
    if (!selectedGroup.subjects.includes(subject)) {
      setConfig(prev => ({
        ...prev,
        subjectGroups: prev.subjectGroups.map(g => 
          g.id === selectedGroup.id ? { ...g, subjects: [...g.subjects, subject] } : g
        )
      }));
    }
    setShowAddSubject(false);
    setSearchTerm('');
  };

  const handleRemoveSubject = (subject: string) => {
    if (!selectedGroup) return;
    setConfig(prev => ({
      ...prev,
      subjectGroups: prev.subjectGroups.map(g => 
        g.id === selectedGroup.id ? { ...g, subjects: g.subjects.filter(s => s !== subject) } : g
      )
    }));
  };

  const handleAddTeacher = (teacher: string) => {
    if (!selectedGroup) return;
    if (!selectedGroup.teachers.includes(teacher)) {
      setConfig(prev => ({
        ...prev,
        subjectGroups: prev.subjectGroups.map(g => 
          g.id === selectedGroup.id ? { ...g, teachers: [...g.teachers, teacher] } : g
        )
      }));
    }
    setShowAddTeacher(false);
    setSearchTerm('');
  };

  const handleRemoveTeacher = (teacher: string) => {
    if (!selectedGroup) return;
    setConfig(prev => ({
      ...prev,
      subjectGroups: prev.subjectGroups.map(g => 
        g.id === selectedGroup.id ? { ...g, teachers: g.teachers.filter(t => t !== teacher) } : g
      )
    }));
  };

  const availableSubjects = ALL_SUBJECTS.filter(s => !selectedGroup?.subjects.includes(s) && s.toLowerCase().includes(searchTerm.toLowerCase()));
  const availableTeachers = ALL_TEACHERS.filter(t => !selectedGroup?.teachers.includes(t) && t.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Cấu hình Tổ chuyên môn & Môn học</h1>
            <p className="text-sm text-slate-500 mt-1">Quản lý danh sách tổ bộ môn, môn học trực thuộc và giáo viên</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            <button className="text-left px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-bold">Tổ bộ môn</button>
            <button className="text-left px-4 py-2 rounded-lg hover:bg-slate-100 text-slate-600 font-medium">Tổ khối</button>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>Lưu ý:</strong> Dữ liệu này được đồng bộ từ CSDL ngành. Bạn có thể kiểm tra và bổ sung thêm môn học hoặc giáo viên nếu cần thiết.
              </p>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {!selectedGroup ? (
              <>
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <h2 className="font-bold text-slate-800">Danh sách Tổ bộ môn</h2>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Thêm tổ mới
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {config.subjectGroups.map(group => (
                    <div 
                      key={group.id} 
                      onClick={() => setSelectedGroupId(group.id)}
                      className="px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">Tổ {group.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {group.subjects.length} môn học</span>
                          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {group.teachers.length} giáo viên</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full">
                {/* Detail Header */}
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedGroupId(null)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h2 className="font-bold text-slate-800 text-lg">Chi tiết Tổ {selectedGroup.name}</h2>
                  </div>
                  <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                    <Edit2 className="w-4 h-4" /> Đổi tên tổ
                  </button>
                </div>
                
                {/* Detail Content */}
                <div className="p-6 space-y-8 overflow-y-auto bg-white">
                  {/* Subjects Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        Môn học trực thuộc ({selectedGroup.subjects.length})
                      </h3>
                      <div className="relative" ref={subjectDropdownRef}>
                        <button 
                          onClick={() => { setShowAddSubject(!showAddSubject); setShowAddTeacher(false); setSearchTerm(''); }}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Thêm môn
                        </button>
                        
                        {showAddSubject && (
                          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden">
                            <div className="p-2 border-b border-slate-100">
                              <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                  type="text" 
                                  placeholder="Tìm môn học..." 
                                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto p-1">
                              {availableSubjects.length > 0 ? (
                                availableSubjects.map(sub => (
                                  <button
                                    key={sub}
                                    onClick={() => handleAddSubject(sub)}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                                  >
                                    {sub}
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-4 text-center text-sm text-slate-500">
                                  Không tìm thấy môn học
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[80px]">
                      <div className="flex flex-wrap gap-2">
                        {selectedGroup.subjects.map(sub => (
                          <span key={sub} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 text-sm font-medium flex items-center gap-2">
                            {sub} 
                            <button onClick={() => handleRemoveSubject(sub)} className="text-slate-400 hover:text-rose-500 transition-colors"><X className="w-3.5 h-3.5"/></button>
                          </span>
                        ))}
                        {selectedGroup.subjects.length === 0 && (
                          <span className="text-sm text-slate-400 italic py-1.5">Chưa có môn học nào</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Teachers Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        Danh sách giáo viên ({selectedGroup.teachers.length})
                      </h3>
                      <div className="relative" ref={teacherDropdownRef}>
                        <button 
                          onClick={() => { setShowAddTeacher(!showAddTeacher); setShowAddSubject(false); setSearchTerm(''); }}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Thêm giáo viên
                        </button>
                        
                        {showAddTeacher && (
                          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden">
                            <div className="p-2 border-b border-slate-100">
                              <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                  type="text" 
                                  placeholder="Tìm giáo viên..." 
                                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto p-1">
                              {availableTeachers.length > 0 ? (
                                availableTeachers.map(teacher => (
                                  <button
                                    key={teacher}
                                    onClick={() => handleAddTeacher(teacher)}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                                  >
                                    {teacher}
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-4 text-center text-sm text-slate-500">
                                  Không tìm thấy giáo viên
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[80px]">
                      <div className="flex flex-wrap gap-2">
                        {selectedGroup.teachers.map(teacher => (
                          <span key={teacher} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 text-sm font-medium flex items-center gap-2">
                            {teacher} 
                            <button onClick={() => handleRemoveTeacher(teacher)} className="text-slate-400 hover:text-rose-500 transition-colors"><X className="w-3.5 h-3.5"/></button>
                          </span>
                        ))}
                        {selectedGroup.teachers.length === 0 && (
                          <span className="text-sm text-slate-400 italic py-1.5">Chưa có giáo viên nào</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
