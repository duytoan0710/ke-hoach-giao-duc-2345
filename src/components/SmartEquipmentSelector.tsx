import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Star, Clock, MapPin, Package, X, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Master Data Types ---
export interface Equipment {
  id: string;
  name: string;
  category: string;
  subjectId: string;
  keywords: string[];
}

export interface Location {
  id: string;
  name: string;
  icon: any;
}

// --- Mock Master Data ---
const MASTER_EQUIPMENT: Equipment[] = [
  { id: 'EQ_001', name: 'Máy chiếu', category: 'Điện tử', subjectId: 'all', keywords: ['trình chiếu', 'video', 'hình ảnh'] },
  { id: 'EQ_002', name: 'Bảng phụ', category: 'Cơ bản', subjectId: 'all', keywords: ['nhóm', 'thảo luận'] },
  { id: 'EQ_003', name: 'Bộ đồ dùng Toán 4', category: 'Bộ đồ dùng', subjectId: 'math_4', keywords: ['toán', 'số học'] },
  { id: 'EQ_004', name: 'Thước kẻ 50cm', category: 'Đo lường', subjectId: 'math_4', keywords: ['hình học', 'đo', 'vẽ'] },
  { id: 'EQ_005', name: 'Ê-ke nhựa lớn', category: 'Đo lường', subjectId: 'math_4', keywords: ['hình học', 'góc', 'vuông'] },
  { id: 'EQ_006', name: 'Bộ hình khối', category: 'Hình học', subjectId: 'math_4', keywords: ['hình học', 'khối', 'lập phương'] },
  { id: 'EQ_007', name: 'Cân đồng hồ', category: 'Đo lường', subjectId: 'math_4', keywords: ['khối lượng', 'cân', 'nặng'] },
  { id: 'EQ_008', name: 'Phiếu bài tập', category: 'Giấy', subjectId: 'all', keywords: ['luyện tập', 'kiểm tra'] },
];

const MASTER_LOCATIONS: Location[] = [
  { id: 'LOC_001', name: 'Tại lớp học', icon: Package },
  { id: 'LOC_002', name: 'Phòng máy tính', icon: Clock },
  { id: 'LOC_003', name: 'Sân trường', icon: MapPin },
  { id: 'LOC_004', name: 'Thư viện', icon: Star },
  { id: 'LOC_005', name: 'Phòng đa năng', icon: Star },
];

interface Props {
  subjectId: string;
  lessonName: string;
  selectedEquipIds: string[];
  selectedLocId: string;
  onChange: (equipIds: string[], locId: string) => void;
  readOnly?: boolean;
}

export default function SmartEquipmentSelector({ subjectId, lessonName, selectedEquipIds, selectedLocId, onChange, readOnly }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Logic gợi ý thông minh
  const suggestions = useMemo(() => {
    const keywords = lessonName.toLowerCase();
    return MASTER_EQUIPMENT.filter(e => 
      (e.subjectId === subjectId || e.subjectId === 'all') &&
      e.keywords.some(k => keywords.includes(k)) &&
      !selectedEquipIds.includes(e.id)
    ).slice(0, 4);
  }, [subjectId, lessonName, selectedEquipIds]);

  // Lọc danh sách theo search
  const filteredEquip = useMemo(() => {
    const query = search.toLowerCase();
    return MASTER_EQUIPMENT.filter(e => 
      (e.subjectId === subjectId || e.subjectId === 'all') &&
      (e.name.toLowerCase().includes(query) || e.category.toLowerCase().includes(query))
    );
  }, [search, subjectId]);

  // Đóng khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleEquip = (id: string) => {
    const newIds = selectedEquipIds.includes(id) 
      ? selectedEquipIds.filter(i => i !== id)
      : [...selectedEquipIds, id];
    onChange(newIds, selectedLocId);
  };

  const setLoc = (id: string) => {
    onChange(selectedEquipIds, id);
  };

  const selectedEquipObjects = MASTER_EQUIPMENT.filter(e => selectedEquipIds.includes(e.id));
  const selectedLocObject = MASTER_LOCATIONS.find(l => l.id === selectedLocId);

  return (
    <div className="relative" ref={containerRef}>
      {/* Default View (Tags) */}
      <div 
        onClick={() => !readOnly && setIsOpen(!isOpen)}
        className={`p-1 rounded-lg border transition-all cursor-pointer flex flex-wrap gap-1 items-center content-start ${
          isOpen ? 'border-indigo-500 bg-white shadow-sm' : 'border-transparent hover:border-slate-200'
        }`}
      >
        {selectedEquipObjects.map(e => (
          <span key={e.id} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase flex items-center gap-1 border border-blue-100 leading-none">
            <Package className="w-2.5 h-2.5" /> {e.name}
          </span>
        ))}
        {selectedLocObject && (
          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[9px] font-black uppercase flex items-center gap-1 border border-amber-100 leading-none">
            <MapPin className="w-2.5 h-2.5" /> {selectedLocObject.name}
          </span>
        )}
        {!readOnly && selectedEquipIds.length === 0 && !selectedLocId && (
          <span className="text-slate-300 text-[9px] font-bold italic px-1">Chọn thiết bị...</span>
        )}
        {!readOnly && (
          <div className="ml-auto p-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
            <Plus className="w-3 h-3 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Popover Selection UI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] top-full mt-2 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden origin-top-right"
          >
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm thiết bị..."
                className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 w-full p-0"
              />
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {/* Suggestions Section */}
              {suggestions.length > 0 && !search && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Gợi ý cho bài học
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map(e => (
                      <button 
                        key={e.id}
                        onClick={() => toggleEquip(e.id)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[11px] font-bold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                      >
                        + {e.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Selection */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Hình thức / Địa điểm</p>
                <div className="grid grid-cols-2 gap-2">
                  {MASTER_LOCATIONS.map(l => (
                    <button 
                      key={l.id}
                      onClick={() => setLoc(l.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                        selectedLocId === l.id 
                          ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-100' 
                          : 'bg-white text-slate-600 border-slate-100 hover:border-amber-200'
                      }`}
                    >
                      <l.icon className="w-3.5 h-3.5" />
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment List */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Danh mục thiết bị</p>
                <div className="space-y-1">
                  {filteredEquip.map(e => (
                    <button 
                      key={e.id}
                      onClick={() => toggleEquip(e.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                        selectedEquipIds.includes(e.id) ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50 border-transparent'
                      } border`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${selectedEquipIds.includes(e.id) ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Package className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-bold ${selectedEquipIds.includes(e.id) ? 'text-blue-700' : 'text-slate-700'}`}>{e.name}</p>
                          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{e.category}</p>
                        </div>
                      </div>
                      {selectedEquipIds.includes(e.id) && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-indigo-600 transition-all"
              >
                Hoàn tất
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
