import React from 'react';
import { 
  Users, 
  RefreshCw, 
  Calendar, 
  ListChecks, 
  FileText, 
  PenTool, 
  Archive, 
  ArrowRight, 
  ArrowDown,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

const WorkflowStep = ({ 
  number, 
  title, 
  description, 
  icon: Icon, 
  actionLabel, 
  isLast = false,
  subSteps = []
}: { 
  number: string; 
  title: string; 
  description: string | React.ReactNode; 
  icon: any; 
  actionLabel?: string;
  isLast?: boolean;
  subSteps?: { title: string; icon: any }[];
}) => {
  return (
    <div className="relative flex gap-8 mb-12 last:mb-0">
      {!isLast && (
        <div className="absolute left-7 top-14 bottom-[-20px] w-1 bg-gradient-to-b from-indigo-500 to-indigo-200 rounded-full">
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-indigo-600">
            <ArrowDown className="w-6 h-6 fill-current" />
          </div>
        </div>
      )}
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center text-indigo-600 group-hover:border-indigo-500 transition-all">
          <Icon className="w-7 h-7" />
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-white">
            {number}
          </div>
        </div>
      </div>

      <div className="flex-1 pt-1">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              <h4 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                {title}
                <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {description}
              </p>
              
              {subSteps.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {subSteps.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                      <sub.icon className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{sub.title}</span>
                      {idx < subSteps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                    </div>
                  ))}
                </div>
              )}

              {actionLabel && (
                <div className="flex justify-end mt-4">
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-emerald-100">
                    {actionLabel}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowFlowchart = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Quy trình triển khai EduPlan 2345</h2>
        <p className="text-lg text-indigo-900/70 max-w-3xl mx-auto font-bold leading-relaxed bg-indigo-50/50 py-4 px-8 rounded-3xl border border-indigo-100/50 shadow-sm">
          Để đảm bảo hệ thống tự động hóa tối đa và tuân thủ đúng Công văn 2345, nhà trường vui lòng thực hiện theo trình tự các bước dưới đây.
        </p>
      </div>

      <div className="space-y-4">
        <WorkflowStep 
          number="01"
          title="Thiết lập Tổ chuyên môn"
          description={
            <>
              Khai báo <span className="text-indigo-600 font-black">danh sách tổ</span>, các môn học phụ trách và <span className="text-indigo-600 font-black">phân quyền giáo viên</span> vào tổ. Đây là <span className="text-indigo-600 font-black">dữ liệu nền tảng</span> để hệ thống <span className="text-indigo-600 font-black">tự động hiển thị</span> danh sách môn và hỗ trợ <span className="text-indigo-600 font-black">ghép file kế hoạch giáo dục hợp nhất</span>.
            </>
          }
          icon={Users}
          actionLabel="Quản lý Tổ chuyên môn"
        />

        <WorkflowStep 
          number="02"
          title="Đồng bộ dữ liệu CSDL Ngành"
          description={
            <>
              Thực hiện <span className="text-indigo-600 font-black">đồng bộ</span> kết quả xếp lớp và phân công giảng dạy từ hệ thống <span className="text-indigo-600 font-black">CSDL Ngành</span>. Dữ liệu này là <span className="text-indigo-600 font-black">đầu vào bắt buộc</span> để xây dựng <span className="text-indigo-600 font-black">thời khóa biểu</span> và <span className="text-indigo-600 font-black">lịch báo giảng tự động</span>.
            </>
          }
          icon={RefreshCw}
          actionLabel="Đồng bộ dữ liệu"
        />

        <WorkflowStep 
          number="03"
          title="Xây dựng Thời khóa biểu"
          description={
            <>
              Lập <span className="text-indigo-600 font-black">thời khóa biểu chi tiết</span> cho toàn trường. Hệ thống sẽ căn cứ vào TKB này để <span className="text-indigo-600 font-black">tự động tạo khung lịch báo giảng</span> cho từng giáo viên hàng tuần.
            </>
          }
          icon={Calendar}
          actionLabel="Lập thời khóa biểu"
        />

        <WorkflowStep 
          number="04"
          title="Phân phối chương trình (PPCT)"
          description={
            <>
              Xây dựng và <span className="text-indigo-600 font-black">ký duyệt ban hành PPCT</span>. PPCT đã duyệt là <span className="text-indigo-600 font-black">điều kiện cần</span> để hệ thống <span className="text-indigo-600 font-black">tự động điền thông tin bài dạy</span> vào lịch báo giảng và các kế hoạch liên quan theo <span className="text-indigo-600 font-black">chuẩn 2345</span>.
            </>
          }
          icon={ListChecks}
          actionLabel="Quản lý PPCT"
        />

        <WorkflowStep 
          number="05"
          title="Thực hiện Kế hoạch giáo dục 2345"
          description={
            <>
              Sau khi có đầy đủ dữ liệu đầu vào, nhà trường bắt đầu quy trình <span className="text-indigo-600 font-black">lập kế hoạch định kỳ</span>. Mỗi bước đều <span className="text-indigo-600 font-black">tích hợp ký số</span> để <span className="text-indigo-600 font-black">phê duyệt trực tuyến</span>.
            </>
          }
          icon={FileText}
          subSteps={[
            { title: 'KH Trường', icon: FileText },
            { title: 'KH Tổ', icon: Users },
            { title: 'Báo giảng', icon: Calendar },
            { title: 'Bài dạy', icon: PenTool }
          ]}
          actionLabel="Bắt đầu lập kế hoạch"
        />

        <WorkflowStep 
          number="06"
          title="Kho minh chứng & Lưu trữ"
          description={
            <>
              <span className="text-indigo-600 font-black">Tự động lưu trữ</span> các <span className="text-indigo-600 font-black">hồ sơ đã ký số</span>. Hỗ trợ nén file, <span className="text-indigo-600 font-black">tải hàng loạt</span> để phục vụ <span className="text-indigo-600 font-black">đánh giá trường học số (DTI)</span> hoặc <span className="text-indigo-600 font-black">kiểm định chất lượng giáo dục</span>.
            </>
          }
          icon={Archive}
          actionLabel="Truy cập Kho minh chứng"
          isLast={true}
        />
      </div>

      <div className="mt-16 p-8 bg-indigo-900 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20">
            <Info className="w-10 h-10 text-indigo-300" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black mb-2 uppercase tracking-widest">Lưu ý quan trọng</h4>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Việc tuân thủ đúng trình tự giúp hệ thống <strong>EduPlan 2345</strong> tự động điền đến 80% nội dung hồ sơ, giúp giáo viên và nhà trường tiết kiệm tối đa thời gian soạn thảo và phê duyệt.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default WorkflowFlowchart;
