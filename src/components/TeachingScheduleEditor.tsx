import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Wand2, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon,
  ChevronRight,
  Info,
  CheckCircle2,
  Edit3,
  FileText,
  User,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { X } from 'lucide-react';
import TeachingSchedulePDF from './TeachingSchedulePDF';

interface ScheduleEntry {
  id: string;
  day: string;
  date: string;
  session: 'Sáng' | 'Chiều';
  periodTKB: number;
  subject: string;
  className: string;
  periodPPCT: number;
  lessonTitle: string;
  teachingAids: string;
}

interface TeachingScheduleEditorProps {
  weekNumber: number;
  startDate: string;
  endDate: string;
  onBack: () => void;
}

const DAYS_OF_WEEK = [
  { label: 'HAI', value: 'Thứ Hai' },
  { label: 'BA', value: 'Thứ Ba' },
  { label: 'TƯ', value: 'Thứ Tư' },
  { label: 'NĂM', value: 'Thứ Năm' },
  { label: 'SÁU', value: 'Thứ Sáu' },
  { label: 'BẢY', value: 'Thứ Bảy' }
];

export default function TeachingScheduleEditor({ weekNumber, startDate, endDate, onBack }: TeachingScheduleEditorProps) {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [teacherName, setTeacherName] = useState('Nguyễn Văn A');
  const [departmentName, setDepartmentName] = useState('Tổ 1');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Initialize with a full week (Monday to Friday)
  useEffect(() => {
    const initialEntries: ScheduleEntry[] = [];
    const days = ['HAI', 'BA', 'TƯ', 'NĂM', 'SÁU'];
    
    days.forEach((day, dayIdx) => {
      // Mock dates starting from 06/09 (from user's screenshot)
      const date = new Date('2025-09-01'); // Monday
      date.setDate(date.getDate() + dayIdx);
      const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      // Add 4 morning periods (1-4) and 4 afternoon periods (5-8) for each day
      let periodCounter = 1;
      ['Sáng', 'Chiều'].forEach(session => {
        const periods = 4;
        for (let p = 1; p <= periods; p++) {
          initialEntries.push({
            id: Math.random().toString(36).substr(2, 9),
            day,
            date: dateStr,
            session: session as 'Sáng' | 'Chiều',
            periodTKB: periodCounter++,
            subject: '',
            className: '',
            periodPPCT: 0,
            lessonTitle: '',
            teachingAids: ''
          });
        }
      });
    });
    setEntries(initialEntries);
  }, []);

  const handleAutoGenerate = () => {
    setIsAutoGenerating(true);
    // Simulate API call with more comprehensive data
    setTimeout(() => {
      const demoData: Record<string, Record<number, Partial<ScheduleEntry>>> = {
        'HAI': {
          1: { subject: 'Chào cờ', className: '3A', periodPPCT: 1, lessonTitle: 'Sinh hoạt dưới cờ', teachingAids: 'Loa, đài' },
          2: { subject: 'Toán', className: '3A', periodPPCT: 1, lessonTitle: 'Ôn tập các số đến 1000', teachingAids: 'Bộ đồ dùng toán' },
          3: { subject: 'Tiếng Việt', className: '3A', periodPPCT: 1, lessonTitle: 'Ngày khai trường', teachingAids: 'Tranh minh họa' },
          4: { subject: 'Tiếng Việt', className: '3A', periodPPCT: 2, lessonTitle: 'Ngày khai trường (Tiếp)', teachingAids: 'Tranh minh họa' },
          5: { subject: 'Đạo đức', className: '3A', periodPPCT: 1, lessonTitle: 'An toàn giao thông', teachingAids: 'Video clip' }
        },
        'BA': {
          1: { subject: 'Toán', className: '3A', periodPPCT: 2, lessonTitle: 'Ôn tập các số đến 1000 (Tiếp)', teachingAids: 'Bảng phụ' },
          2: { subject: 'Tiếng Việt', className: '3A', periodPPCT: 3, lessonTitle: 'Tập đọc: Đơn xin vào Đội', teachingAids: 'Tranh minh họa' },
          3: { subject: 'Tự nhiên xã hội', className: '3A', periodPPCT: 1, lessonTitle: 'Gia đình em', teachingAids: 'Ảnh gia đình' },
          4: { subject: 'Tiếng Anh', className: '3A', periodPPCT: 1, lessonTitle: 'Unit 1: Hello', teachingAids: 'Flashcards' }
        },
        'TƯ': {
          1: { subject: 'Toán', className: '3A', periodPPCT: 3, lessonTitle: 'Cộng các số có ba chữ số', teachingAids: 'Que tính' },
          2: { subject: 'Tiếng Việt', className: '3A', periodPPCT: 4, lessonTitle: 'Chính tả: Nghe viết', teachingAids: 'Bảng con' },
          3: { subject: 'Tiếng Việt', className: '3A', periodPPCT: 5, lessonTitle: 'Luyện từ và câu', teachingAids: 'Từ điển' },
          4: { subject: 'Âm nhạc', className: '3A', periodPPCT: 1, lessonTitle: 'Học hát bài: Quốc ca', teachingAids: 'Đàn, loa' }
        },
        'NĂM': {
          1: { subject: 'Toán', className: '3A', periodPPCT: 4, lessonTitle: 'Trừ các số có ba chữ số', teachingAids: 'Vở bài tập' },
          2: { subject: 'Tiếng Việt', className: '3A', periodPPCT: 6, lessonTitle: 'Tập làm văn: Kể về gia đình', teachingAids: 'Giấy A4' },
          3: { subject: 'Mỹ thuật', className: '3A', periodPPCT: 1, lessonTitle: 'Vẽ chân dung', teachingAids: 'Bút chì, màu' },
          4: { subject: 'Thể dục', className: '3A', periodPPCT: 1, lessonTitle: 'Đội hình đội ngũ', teachingAids: 'Còi' }
        },
        'SÁU': {
          1: { subject: 'Toán', className: '3A', periodPPCT: 5, lessonTitle: 'Luyện tập chung', teachingAids: 'Phiếu bài tập' },
          2: { subject: 'Tiếng Việt', className: '3A', periodPPCT: 7, lessonTitle: 'Ôn tập cuối tuần', teachingAids: 'Sách giáo khoa' },
          3: { subject: 'Công nghệ', className: '3A', periodPPCT: 1, lessonTitle: 'Làm quen với máy tính', teachingAids: 'Phòng máy' },
          8: { subject: 'Sinh hoạt lớp', className: '3A', periodPPCT: 1, lessonTitle: 'Tổng kết tuần 1', teachingAids: 'Sổ tay' }
        }
      };

      const autoGenerated = entries.map(entry => {
        const dayData = demoData[entry.day];
        if (dayData && dayData[entry.periodTKB]) {
          return { ...entry, ...dayData[entry.periodTKB] };
        }
        return entry;
      }).filter(entry => {
        // Filter out rows that have no subject and no lesson title after generation
        return entry.subject.trim() !== '' || entry.lessonTitle.trim() !== '';
      });
      
      setEntries(autoGenerated);
      setIsAutoGenerating(false);
    }, 1500);
  };

  const updateEntry = (id: string, field: keyof ScheduleEntry, value: any) => {
    if (isCompleted) return;
    setEntries(prev => prev.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const addRow = () => {
    if (isCompleted) return;
    const lastEntry = entries[entries.length - 1];
    setEntries(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      day: lastEntry?.day || 'HAI',
      date: lastEntry?.date || '',
      session: lastEntry?.session || 'Sáng',
      periodTKB: (lastEntry?.periodTKB || 0) + 1,
      subject: '',
      className: '',
      periodPPCT: 0,
      lessonTitle: '',
      teachingAids: ''
    }]);
  };

  const removeRow = (id: string) => {
    if (isCompleted) return;
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleViewPDF = async () => {
    if (entries.length === 0) {
      alert('Vui lòng nhập liệu trước khi xem PDF');
      return;
    }
    setShowPDFModal(true);
  };

  return (
    <div className="flex flex-col h-full gap-4 w-full bg-slate-50/50 p-4 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">Soạn lịch báo giảng</h2>
              <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-black">TUẦN {weekNumber}</span>
              {isCompleted && <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-black uppercase tracking-wider">Hoàn tất</span>}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-3 h-3" />
                <span>Từ {startDate} đến {endDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                <input 
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  disabled={isCompleted}
                  className="bg-transparent border-none p-0 focus:ring-0 text-slate-600 font-bold w-24 outline-none"
                  placeholder="Tổ..."
                />
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3" />
                <input 
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  disabled={isCompleted}
                  className="bg-transparent border-none p-0 focus:ring-0 text-slate-600 font-bold w-32 outline-none"
                  placeholder="Giáo viên..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {!isCompleted ? (
            <>
              <button 
                onClick={handleAutoGenerate}
                disabled={isAutoGenerating}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all disabled:opacity-50 shadow-sm"
              >
                <Wand2 className={`w-4 h-4 ${isAutoGenerating ? 'animate-spin' : ''}`} />
                <span>Tự động lên lịch (TKB + PPCT)</span>
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
                <Save className="w-4 h-4" />
                <span>Lưu nháp</span>
              </button>
              <button 
                onClick={() => setIsCompleted(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn tất</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsCompleted(false)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                <span>Sửa</span>
              </button>
              <button 
                onClick={handleViewPDF}
                disabled={isGeneratingPDF}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all shadow-sm disabled:opacity-50"
              >
                <FileText className={`w-4 h-4 ${isGeneratingPDF ? 'animate-pulse' : ''}`} />
                <span>{isGeneratingPDF ? 'Đang tạo...' : 'Xem PDF'}</span>
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                <Send className="w-4 h-4" />
                <span>Trình ký file PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor Table */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-800 text-white">
                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-700 w-24 text-center">Thứ/Ngày</th>
                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-700 w-20 text-center">Buổi</th>
                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-700 w-16 text-center">Tiết TKB</th>
                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-700 w-32">Môn</th>
                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-700 w-20 text-center">Lớp</th>
                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-700 w-16 text-center">Tiết PPCT</th>
                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-700">Tên bài dạy</th>
                <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider border-r border-slate-700 w-40">Đồ dùng dạy học</th>
                {!isCompleted && <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider w-12 text-center">Xóa</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry, index) => {
                // Logic for merging "Thứ/Ngày" cells
                const showDay = index === 0 || entries[index - 1].day !== entry.day;
                
                // Logic for merging "Buổi" cells
                const showSession = index === 0 || entries[index - 1].day !== entry.day || entries[index - 1].session !== entry.session;
                
                return (
                  <tr key={entry.id} className={`hover:bg-slate-50/50 transition-colors group ${isCompleted ? 'bg-slate-50/10' : ''}`}>
                    <td className={`px-3 py-2 border-r border-slate-100 text-center align-top ${!showDay ? 'bg-slate-50/20' : ''}`}>
                      {showDay && (
                        <div className="space-y-1">
                          <div className="text-xs font-black text-slate-800">{entry.day}</div>
                          <div className="text-[10px] font-bold text-slate-400">{entry.date}</div>
                        </div>
                      )}
                    </td>
                    <td className={`px-3 py-2 border-r border-slate-100 text-center align-top ${!showSession ? 'bg-slate-50/5' : ''}`}>
                      {showSession && (
                        <div className="text-[12px] font-bold text-slate-600 py-1">
                          {entry.session}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center">
                      <input 
                        type="number"
                        value={entry.periodTKB}
                        disabled={isCompleted}
                        onChange={(e) => updateEntry(entry.id, 'periodTKB', parseInt(e.target.value))}
                        className={`w-full bg-transparent text-center text-[12px] font-bold text-slate-600 outline-none ${isCompleted ? 'cursor-default' : ''}`}
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      <input 
                        type="text"
                        placeholder="Nhập môn..."
                        value={entry.subject}
                        disabled={isCompleted}
                        onChange={(e) => updateEntry(entry.id, 'subject', e.target.value)}
                        className={`w-full bg-transparent text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-300 ${isCompleted ? 'cursor-default' : ''}`}
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center">
                      <input 
                        type="text"
                        placeholder="Lớp..."
                        value={entry.className}
                        disabled={isCompleted}
                        onChange={(e) => updateEntry(entry.id, 'className', e.target.value)}
                        className={`w-full bg-transparent text-center text-[12px] font-bold text-slate-600 outline-none placeholder:text-slate-300 ${isCompleted ? 'cursor-default' : ''}`}
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center">
                      <input 
                        type="number"
                        value={entry.periodPPCT}
                        disabled={isCompleted}
                        onChange={(e) => updateEntry(entry.id, 'periodPPCT', parseInt(e.target.value))}
                        className={`w-full bg-transparent text-center text-[12px] font-bold text-slate-600 outline-none ${isCompleted ? 'cursor-default' : ''}`}
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      <textarea 
                        rows={1}
                        placeholder="Nhập tên bài dạy..."
                        value={entry.lessonTitle}
                        disabled={isCompleted}
                        onChange={(e) => updateEntry(entry.id, 'lessonTitle', e.target.value)}
                        className={`w-full bg-transparent text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-300 resize-none py-1 ${isCompleted ? 'cursor-default' : ''}`}
                      />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      <input 
                        type="text"
                        placeholder="Đồ dùng..."
                        value={entry.teachingAids}
                        disabled={isCompleted}
                        onChange={(e) => updateEntry(entry.id, 'teachingAids', e.target.value)}
                        className={`w-full bg-transparent text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-300 ${isCompleted ? 'cursor-default' : ''}`}
                      />
                    </td>
                    {!isCompleted && (
                      <td className="px-3 py-2 text-center">
                        <button 
                          onClick={() => removeRow(entry.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer Actions */}
        {!isCompleted && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <button 
              onClick={addRow}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm dòng mới</span>
            </button>
            
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium italic">
              <Info className="w-3.5 h-3.5" />
              <span>Hệ thống tự động lưu nháp sau mỗi 30 giây</span>
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {showPDFModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 md:p-10"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Xem trước Lịch báo giảng</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tuần {weekNumber} • {teacherName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPDFModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 bg-slate-100 p-4">
                <PDFViewer className="w-full h-full rounded-xl border border-slate-200 shadow-inner">
                  <TeachingSchedulePDF
                    weekNumber={weekNumber}
                    startDate={startDate}
                    endDate={endDate}
                    teacherName={teacherName}
                    departmentName={departmentName}
                    entries={entries}
                  />
                </PDFViewer>
              </div>
              
              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setShowPDFModal(false)}
                  className="px-6 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => {
                    // Trigger download manually if needed, but PDFViewer already has download button
                    setShowPDFModal(false);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
