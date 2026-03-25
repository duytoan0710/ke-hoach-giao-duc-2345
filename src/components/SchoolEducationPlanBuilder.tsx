import React, { useState, useEffect } from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  FileText, 
  LayoutGrid, 
  CheckSquare,
  Trash2,
  Save,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Info,
  UserCheck,
  Calendar,
  MapPin,
  School,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  Download,
  Send,
  Edit3,
  Clock,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PlanPDFDocument } from './PlanPDFDocument';

import { ErrorBoundary } from './ErrorBoundary';

type BlockType = 'h1' | 'h2' | 'h3' | 'image' | 'text' | 'table' | 'list';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface Block {
  id: string;
  type: BlockType;
  title?: string;
  content: any;
  isCollapsed?: boolean;
  placeholder?: string;
}

interface StepInfo {
  id: number;
  title: string;
  description: string;
}

const STEPS: StepInfo[] = [
  { id: 1, title: 'Thông tin chung', description: 'Khai báo thông tin hành chính & nhân sự' },
  { id: 2, title: 'Căn cứ', description: 'Đây là các văn bản pháp lý và chỉ đạo thực hiện' },
  { id: 3, title: 'Đặc điểm', description: 'Tình hình địa phương, nhà trường, học sinh, đội ngũ và đánh giá thuận lợi, khó khăn' },
  { id: 4, title: 'Mục tiêu', description: 'Chỉ tiêu giáo dục năm học' },
  { id: 5, title: 'Kế hoạch', description: 'Khung thời gian & chương trình' },
  { id: 6, title: 'Giải pháp thực hiện', description: 'Các biện pháp thực hiện' },
  { id: 7, title: 'Tổ chức thực hiện', description: 'Phân công & triển khai' },
  { id: 8, title: 'Phụ lục', description: 'Các biểu mẫu & bảng biểu đính kèm' },
];

const TOOLBOX_ITEMS = [
  { type: 'h2', label: 'Tiêu đề lớn', icon: Type },
  { type: 'h3', label: 'Tiêu đề nhỏ', icon: Type },
  { type: 'text', label: 'Văn bản', icon: FileText },
  { type: 'table', label: 'Bảng số liệu', icon: LayoutGrid },
  { type: 'list', label: 'Danh mục', icon: CheckSquare },
  { type: 'image', label: 'Hình ảnh', icon: ImageIcon },
];

export default function SchoolEducationPlanBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState<'draft' | 'ready_to_submit' | 'waiting_principal' | 'waiting_clerk' | 'published'>('draft');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Administrative Info
  const [adminInfo, setAdminInfo] = useState(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed
    const schoolYear = currentMonth >= 8 
      ? `${currentYear} - ${currentYear + 1}` 
      : `${currentYear - 1} - ${currentYear}`;

    return {
      departmentName: 'ỦY BAN NHÂN DÂN PHƯỜNG TÂN MỸ',
      schoolName: 'TRƯỜNG TIỂU HỌC TÂN MỸ',
      location: 'Phường Tân Mỹ',
      date: `ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`,
      schoolYear: schoolYear,
      principalName: 'Nguyễn Văn A',
    };
  });

  // Blocks organized by step (2 to 8)
  const [stepBlocks, setStepBlocks] = useState<Record<number, Block[]>>({
    2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []
  });

  // Initialize with template if empty
  useEffect(() => {
    const hasData = Object.values(stepBlocks).some((blocks: Block[]) => blocks.length > 0);
    if (!hasData) {
      applyDefaultTemplate();
    }
  }, []);

  const applyDefaultTemplate = () => {
    const template: Record<number, Block[]> = {
      2: [
        { id: 'b2-title', type: 'h2', content: 'II. CĂN CỨ XÂY DỰNG KẾ HOẠCH', isCollapsed: false },
        { 
          id: 'b2-1', 
          type: 'text', 
          content: 'Căn cứ Luật Giáo dục ngày 14 tháng 6 năm 2019;\n\nCăn cứ Nghị định số 24/2021/NĐ-CP ngày 23 tháng 3 năm 2021 của Chính phủ quy định việc quản lý trong cơ sở giáo dục mầm non và cơ sở giáo dục phổ thông công lập;\n\nCăn cứ Thông tư số 32/2020/TT-BGDĐT ngày 15 tháng 9 năm 2020 của Bộ trưởng Bộ Giáo dục và Đào tạo ban hành Điều lệ Trường tiểu học;\n\nCăn cứ Thông tư số 28/2020/TT-BGDĐT ngày 04 tháng 9 năm 2020 của Bộ trưởng Bộ Giáo dục và Đào tạo ban hành Điều lệ Trường tiểu học;\n\nCăn cứ Công văn số 2345/BGDĐT-GDTH ngày 07 tháng 6 năm 2021 của Bộ Giáo dục và Đào tạo về việc hướng dẫn xây dựng kế hoạch giáo dục của nhà trường cấp tiểu học.', 
          isCollapsed: false 
        },
      ],
      3: [
        { id: 'b3-1', type: 'h2', content: 'III. ĐẶC ĐIỂM TÌNH HÌNH', isCollapsed: false },
        { id: 'b3-2-h', type: 'h3', content: '1. Đặc điểm kinh tế - xã hội địa phương', isCollapsed: false },
        { 
          id: 'b3-2', 
          type: 'text', 
          content: '1.1. Vị trí địa lý và điều kiện tự nhiên:\n- Trường Tiểu học [Tên trường] đóng trên địa bàn [Tên xã/phường, quận/huyện].\n- Vị trí của trường nằm ở khu vực [Trung tâm/Ngoại ô/Vùng sâu vùng xa], có hệ thống giao thông [Thuận tiện/Còn khó khăn] cho việc đi lại của học sinh và giáo viên.\n- Địa bàn dân cư trải rộng/tập trung, đa số học sinh cư trú tại [Các thôn/ấp/tổ dân phố gần trường].\n\n1.2. Tình hình kinh tế:\n- Đời sống kinh tế của nhân dân địa phương chủ yếu dựa vào [Sản xuất nông nghiệp/Tiểu thủ công nghiệp/Thương mại dịch vụ/Làm công nhân tại các khu công nghiệp].\n- Thu nhập bình quân đầu người ở mức [Trung bình/Khá/Thấp]. Một bộ phận nhỏ gia đình có hoàn cảnh kinh tế khó khăn, thuộc diện hộ nghèo/cận nghèo, cần sự hỗ trợ từ cộng đồng.\n- Sự phát triển kinh tế của địa phương có tác động [Tích cực/Trực tiếp] đến việc đầu tư cho giáo dục của các gia đình.\n\n1.3. Tình hình văn hóa - xã hội:\n- Địa phương có truyền thống văn hóa [Lâu đời/Phong phú], nhân dân có tinh thần [Hiếu học/Đoàn kết/Tương thân tương ái].\n- Các phong trào văn hóa, văn nghệ, thể dục thể thao tại địa phương phát triển [Mạnh mẽ/Ổn định], tạo môi trường giáo dục lành mạnh cho học sinh.\n- Tình hình an ninh chính trị và trật tự an toàn xã hội trên địa bàn luôn được giữ vững [Ổn định], không có các tệ nạn xã hội phức tạp xung quanh khu vực trường học.\n\n1.4. Sự quan tâm của chính quyền và các đoàn thể:\n- Đảng ủy, HĐND, UBND và các đoàn thể địa phương luôn đặt giáo dục là quốc sách hàng đầu, có những nghị quyết, kế hoạch cụ thể để hỗ trợ nhà trường.\n- Công tác phối hợp giữa nhà trường, gia đình và xã hội (Ban đại diện CMHS, Hội Khuyến học, Hội Cựu chiến binh...) được thực hiện [Chặt chẽ/Hiệu quả].\n- Các nguồn lực xã hội hóa giáo dục được huy động tốt để cải tạo cảnh quan, mua sắm trang thiết bị dạy học.', 
          isCollapsed: false,
          placeholder: 'Gợi ý: Mô tả vị trí địa lý của trường, tình hình kinh tế - xã hội của địa phương (phường/xã), các đặc điểm văn hóa đặc thù, sự quan tâm của chính quyền địa phương đối với giáo dục...'
        },
        { id: 'b3-3', type: 'h3', content: '2. Đặc điểm tình hình nhà trường', isCollapsed: false },
        { id: 'b3-4', type: 'h3', content: '2.1. Đặc điểm học sinh của trường', isCollapsed: false },
        { id: 'b3-5', type: 'table', content: {
          headers: ['Khối', 'Lớp', 'HS Tổng', 'HS Nữ', 'Dân tộc', 'Hòa nhập', 'Khó khăn', 'Bán trú (Lớp)', 'Bán trú (HS)', 'TA Tăng cường (Lớp)', 'TA Tăng cường (HS)', 'TA Tích hợp (Lớp)', 'TA Tích hợp (HS)'],
          rows: [
            ['1', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['2', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['3', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['4', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['5', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Tổng', '', '', '', '', '', '', '', '', '', '', '', '']
          ]
        }, isCollapsed: false },
        { id: 'b3-6', type: 'h3', content: '2.2. Tình hình đội ngũ giáo viên, nhân viên, viên chức quản lý', isCollapsed: false },
        { id: 'b3-7', type: 'table', content: {
          headers: ['Đội ngũ', 'Tổng', 'Nam', 'Nữ', 'Th.S', 'ĐH', 'CĐ', 'TC', 'Dân tộc', 'Đảng viên', 'Ghi chú'],
          rows: [
            ['Viên chức quản lý', '', '', '', '', '', '', '', '', '', ''],
            ['- Hiệu trưởng', '', '', '', '', '', '', '', '', '', ''],
            ['- Phó hiệu trưởng', '', '', '', '', '', '', '', '', '', ''],
            ['Giáo viên', '', '', '', '', '', '', '', '', '', ''],
            ['- Dạy nhiều môn', '', '', '', '', '', '', '', '', '', ''],
            ['- Giáo dục thể chất', '', '', '', '', '', '', '', '', '', ''],
            ['- Âm nhạc', '', '', '', '', '', '', '', '', '', ''],
            ['- Mỹ thuật', '', '', '', '', '', '', '', '', '', ''],
            ['- Tin học', '', '', '', '', '', '', '', '', '', ''],
            ['- Tiếng Anh', '', '', '', '', '', '', '', '', '', ''],
            ['Nhân viên', '', '', '', '', '', '', '', '', '', ''],
            ['- Kế toán', '', '', '', '', '', '', '', '', '', ''],
            ['- Văn thư', '', '', '', '', '', '', '', '', '', ''],
            ['- Y tế', '', '', '', '', '', '', '', '', '', ''],
            ['- Thư viện', '', '', '', '', '', '', '', '', '', ''],
            ['- Công nghệ thông tin', '', '', '', '', '', '', '', '', '', ''],
            ['Người lao động', '', '', '', '', '', '', '', '', '', ''],
            ['- Bảo vệ', '', '', '', '', '', '', '', '', '', ''],
            ['- Phục vụ', '', '', '', '', '', '', '', '', '', ''],
            ['- Bảo mẫu', '', '', '', '', '', '', '', '', '', ''],
            ['Tổng', '', '', '', '', '', '', '', '', '', '']
          ]
        }, isCollapsed: false },
        { id: 'b3-8', type: 'h3', content: '2.3. Cơ sở vật chất, thiết bị trường học', isCollapsed: false },
        { 
          id: 'b3-9', 
          type: 'table', 
          content: {
            headers: ['STT', 'Cơ sở vật chất', 'Số lượng', 'Ghi chú'],
            rows: [
              ['', 'Tổng diện tích: 11 747 m2', '', ''],
              ['', 'Diện tích sân chơi, bãi tập: 5287 m2', '', ''],
              ['1', 'Khối phòng hành chính quản trị', '', ''],
              ['1.1', '- Phòng hiệu trưởng', '', ''],
              ['1.2', '- Phòng phó hiệu trưởng', '', ''],
              ['1.3', '- Văn phòng', '', ''],
              ['1.4', '- Phòng bảo vệ', '', ''],
              ['1.5', '- Khu vệ sinh giáo viên, cán bộ, nhân viên', '', ''],
              ['1.6', '- Khu để xe của giáo viên, cán bộ, nhân viên', '', ''],
              ['2', 'Khối phòng học tập', '', ''],
              ['2.1', '- Phòng học', '', ''],
              ['2.2', '- Phòng học bộ môn Âm nhạc', '', ''],
              ['2.3', '- Phòng học bộ môn Mỹ thuật', '', ''],
              ['2.4', '- Phòng học bộ môn Khoa học - Công nghệ', '', ''],
              ['2.5', '- Phòng học bộ môn Tin học', '', ''],
              ['2.6', '- Phòng học bộ môn Ngoại ngữ', '', ''],
              ['2.7', '- Phòng đa chức năng', '', ''],
              ['3', 'Khối phòng hỗ trợ học tập', '', ''],
              ['3.1', '- Thư viện', '', ''],
              ['3.2', '- Phòng thiết bị giáo dục', '', ''],
              ['3.3', '- Phòng tư vấn học đường và hỗ trợ giáo dục học sinh khuyết tật học hòa nhập', '', ''],
              ['3.4', '- Phòng truyền thống', '', ''],
              ['3.5', '- Phòng Đội Thiếu niên', '', ''],
              ['4', 'Khối phụ trợ', '', ''],
              ['4.1', '- Phòng họp', '', ''],
              ['4.2', '- Phòng Y tế trường học', '', ''],
              ['4.3', '- Nhà kho', '', ''],
              ['4.4', '- Khu để xe học sinh', '', ''],
              ['4.5', '- Khu vệ sinh học sinh', '', ''],
              ['5', 'Khu sân chơi, thể dục thể thao', '', ''],
              ['5.1', '- Nhà thi đấu đa năng', '', ''],
              ['5.2', '- Sân bóng đá', '', ''],
              ['5.3', '- Sân chơi', '', ''],
              ['6', 'Khối phục vụ sinh hoạt', '', ''],
              ['', 'Nhà ăn', '', ''],
            ]
          }, 
          isCollapsed: false 
        },
        { id: 'b3-10', type: 'h3', content: '3. Đánh giá chung (Thuận lợi, Khó khăn)', isCollapsed: false },
        { id: 'b3-11', type: 'h3', content: '3.1. Thuận lợi', isCollapsed: false },
        { 
          id: 'b3-12', 
          type: 'text', 
          content: '3.1.1. Về đội ngũ cán bộ, giáo viên và nhân viên:\n- Nhà trường có đội ngũ cán bộ quản lý [Năng động/Sáng tạo/Có kinh nghiệm], luôn sâu sát trong công tác chỉ đạo chuyên môn và các hoạt động giáo dục.\n- Đội ngũ giáo viên [100% đạt chuẩn trình độ đào tạo/Có tỉ lệ trên chuẩn cao], nhiệt tình, tâm huyết với nghề và có tinh thần trách nhiệm cao trong công việc.\n- Tập thể sư phạm nhà trường luôn [Đoàn kết/Thống nhất], có ý thức tự học, tự bồi dưỡng để nâng cao năng lực chuyên môn và nghiệp vụ sư phạm.\n\n3.1.2. Về phía học sinh:\n- Đa số học sinh [Ngoan/Lễ phép/Có ý thức rèn luyện tốt], có nề nếp học tập ổn định và tích cực tham gia các phong trào do nhà trường tổ chức.\n- Tỉ lệ học sinh chuyên cần luôn được duy trì ở mức [Cao/Ổn định], các em có tinh thần tương thân tương ái, giúp đỡ lẫn nhau trong học tập.\n- Một bộ phận học sinh có năng khiếu về [Văn nghệ/Thể dục thể thao/Ngoại ngữ], là hạt nhân cho các phong trào mũi nhọn của trường.\n\n3.1.3. Về cơ sở vật chất và trang thiết bị dạy học:\n- Hệ thống phòng học [Kiên cố/Khang trang], đảm bảo đủ ánh sáng, thoáng mát và được trang bị đầy đủ bàn ghế đúng quy cách cho học sinh.\n- Các phòng chức năng (Tin học, Ngoại ngữ, Thư viện...) được đầu tư [Đồng bộ/Hiện đại], đáp ứng tốt nhu cầu dạy học theo chương trình giáo dục phổ thông mới.\n- Khuôn viên trường [Xanh - Sạch - Đẹp - An toàn], có sân chơi bãi tập rộng rãi, tạo môi trường giáo dục thân thiện cho học sinh.\n\n3.1.4. Về công tác phối hợp và sự quan tâm của các cấp:\n- Nhà trường luôn nhận được sự chỉ đạo sâu sát của [Phòng Giáo dục và Đào tạo/Lãnh đạo địa phương] về mọi mặt hoạt động.\n- Ban đại diện Cha mẹ học sinh hoạt động [Tích cực/Hiệu quả], luôn đồng hành và hỗ trợ nhà trường trong việc giáo dục học sinh cũng như cải thiện điều kiện học tập.\n- Mối quan hệ giữa Nhà trường - Gia đình - Xã hội được thiết lập [Chặt chẽ/Bền vững], tạo sức mạnh tổng hợp để hoàn thành tốt nhiệm vụ năm học.', 
          isCollapsed: false,
          placeholder: 'Gợi ý: Phân tích các điểm mạnh về đội ngũ, học sinh, cơ sở vật chất, sự quan tâm của phụ huynh...'
        },
        { id: 'b3-13', type: 'h3', content: '3.2. Khó khăn', isCollapsed: false },
        { 
          id: 'b3-14', 
          type: 'text', 
          content: '3.2.1. Về đội ngũ và nhân sự:\n- Còn thiếu giáo viên ở các bộ môn [Tiếng Anh/Tin học/Âm nhạc/Mỹ thuật], gây khó khăn trong việc triển khai chương trình giáo dục phổ thông mới.\n- Một số giáo viên [Lớn tuổi/Mới ra trường] còn gặp hạn chế trong việc ứng dụng công nghệ thông tin vào giảng dạy và đổi mới phương pháp.\n- Nhân viên các bộ phận [Y tế/Văn thư/Thư viện] còn kiêm nhiệm nhiều việc, ảnh hưởng đến hiệu quả công tác chuyên môn.\n\n3.2.2. Về cơ sở vật chất và thiết bị dạy học:\n- Một số hạng mục công trình như [Sân chơi/Bãi tập/Tường rào/Nhà vệ sinh] đã xuống cấp, cần được đầu tư kinh phí để sửa chữa, nâng cấp.\n- Trang thiết bị dạy học hiện đại (máy chiếu, tivi thông minh) còn [Thiếu/Chưa đồng bộ] ở các lớp học, ảnh hưởng đến việc đổi mới phương pháp dạy học.\n- Diện tích [Phòng học/Phòng chức năng] còn hạn hẹp so với quy mô học sinh ngày càng tăng, gây khó khăn trong việc tổ chức các hoạt động giáo dục.\n\n3.2.3. Về phía học sinh và gia đình:\n- Một bộ phận học sinh có hoàn cảnh gia đình [Khó khăn/Bố mẹ đi làm xa], sự quan tâm và phối hợp với nhà trường trong việc giáo dục con em còn hạn chế.\n- Tỉ lệ học sinh [Khuyết tật/Hòa nhập/Dân tộc thiểu số] còn cao, đòi hỏi giáo viên phải dành nhiều thời gian và công sức để hỗ trợ, kèm cặp.\n- Ý thức tự học của một số em còn [Chưa cao/Chưa tự giác], còn phụ thuộc nhiều vào sự nhắc nhở của giáo viên và phụ huynh.\n\n3.2.4. Về địa bàn và các yếu tố khách quan:\n- Địa bàn dân cư [Trải rộng/Chia cắt], một số học sinh ở xa trường gặp khó khăn trong việc đi lại, đặc biệt là trong [Mùa mưa bão/Điều kiện thời tiết xấu].\n- Các tệ nạn xã hội xung quanh khu vực trường học [Vẫn còn tiềm ẩn/Có nguy cơ ảnh hưởng], đòi hỏi nhà trường phải tăng cường công tác phối hợp an ninh.\n- Nguồn kinh phí xã hội hóa giáo dục còn [Hạn hẹp/Khó huy động] do điều kiện kinh tế của nhân dân địa phương còn nhiều khó khăn.', 
          isCollapsed: false,
          placeholder: 'Gợi ý: Phân tích các hạn chế về nhân sự, cơ sở vật chất, địa bàn dân cư, điều kiện kinh tế của phụ huynh...'
        },
      ],
      4: [
        { id: 'b4-title', type: 'h2', content: 'IV. MỤC TIÊU GIÁO DỤC NĂM HỌC', isCollapsed: false },
        { id: 'b4-1', type: 'h3', content: '1. Mục tiêu chung', isCollapsed: false },
        { 
          id: 'b4-2', 
          type: 'text', 
          content: '1.1. Xây dựng môi trường giáo dục [An toàn - Thân thiện - Hạnh phúc]:\n- Đảm bảo tuyệt đối an ninh, an toàn trường học, chủ động phòng chống bạo lực học đường và các tai nạn thương tích cho học sinh.\n- Xây dựng văn hóa ứng xử học đường [Văn minh/Lịch sự/Kỷ cương], tạo dựng mối quan hệ thân thiện, tôn trọng giữa thầy và trò, giữa học sinh với học sinh.\n- Chú trọng đầu tư cảnh quan sư phạm theo tiêu chí [Xanh - Sạch - Đẹp - An toàn], tạo không gian học tập truyền cảm hứng cho học sinh.\n\n1.2. Thực hiện hiệu quả Chương trình giáo dục phổ thông 2018:\n- Triển khai đồng bộ các giải pháp nhằm nâng cao chất lượng dạy học các môn học và hoạt động giáo dục theo hướng [Phát triển năng lực và phẩm chất] người học.\n- Đổi mới mạnh mẽ phương pháp dạy học và hình thức tổ chức dạy học nhằm phát huy tính [Tự giác/Chủ động/Sáng tạo] của học sinh trong mỗi tiết học.\n- Thực hiện đánh giá học sinh theo đúng tinh thần Thông tư [27/2020/TT-BGDĐT], đảm bảo tính khách quan, công bằng và vì sự tiến bộ của học sinh.\n\n1.3. Nâng cao chất lượng giáo dục toàn diện và phát triển kỹ năng:\n- Chú trọng giáo dục đạo đức, lối sống, giá trị sống và kỹ năng sống cho học sinh thông qua [Các hoạt động trải nghiệm/Hoạt động ngoài giờ lên lớp/Sinh hoạt dưới cờ].\n- Nâng cao chất lượng dạy học Ngoại ngữ và Tin học, tạo điều kiện cho học sinh tiếp cận với [Chuẩn quốc tế/Công nghệ hiện đại] ngay từ cấp tiểu học.\n- Phát hiện và bồi dưỡng kịp thời những học sinh có năng khiếu, đồng thời có kế hoạch hỗ trợ học sinh [Còn hạn chế/Khuyết tật] để đảm bảo công bằng trong giáo dục.\n\n1.4. Đẩy mạnh chuyển đổi số và nâng cao năng lực quản trị:\n- Tăng cường ứng dụng công nghệ thông tin trong quản lý nhà trường và trong [Giảng dạy/Kiểm tra đánh giá/Lưu trữ hồ sơ].\n- Xây dựng kho học liệu số [Phong phú/Chất lượng], đẩy mạnh việc sử dụng các phần mềm hỗ trợ dạy học hiện đại và các nền tảng học tập trực tuyến.\n- Nâng cao năng lực quản trị nhà trường theo hướng [Tự chủ/Dân chủ/Công khai/Minh bạch], tăng cường trách nhiệm giải trình của người đứng đầu.', 
          isCollapsed: false,
          placeholder: 'Nêu các mục tiêu tổng quát của nhà trường trong năm học...'
        },
        { id: 'b4-3', type: 'h3', content: '2. Chỉ tiêu cụ thể', isCollapsed: false },
        { id: 'b4-4', type: 'h3', content: '2.1. Phổ cập giáo dục', isCollapsed: false },
        { 
          id: 'b4-5', 
          type: 'text', 
          content: '- Huy động trẻ 6 tuổi vào lớp 1 đạt tỉ lệ [100%], đảm bảo không có trẻ trong độ tuổi phổ cập bị bỏ sót.\n- Duy trì sĩ số học sinh trong suốt năm học đạt [100%], hạn chế tối đa tình trạng học sinh nghỉ học dài ngày hoặc bỏ học.\n- Duy trì và nâng cao chất lượng Phổ cập giáo dục tiểu học mức độ [3], hoàn thành hồ sơ minh chứng đúng tiến độ quy định.\n- Đảm bảo 100% học sinh khuyết tật có khả năng học tập được tiếp cận giáo dục hòa nhập và có kế hoạch giáo dục cá nhân phù hợp.', 
          isCollapsed: false 
        },
        { id: 'b4-6', type: 'h3', content: '2.2. Chất lượng giáo dục', isCollapsed: false },
        { 
          id: 'b4-7', 
          type: 'text', 
          content: '- Học sinh hoàn thành chương trình lớp học: [100%].\n- Học sinh hoàn thành chương trình tiểu học: [100%].\n- Hiệu suất đào tạo: [99,8%].\n- [100%] học sinh tiểu học biết chơi ít nhất 01 môn nghệ thuật/nhạc cụ và luyện tập ít nhất 01 môn thể thao.\n- [100%] học sinh lớp 5 Hoàn thành chương trình tiểu học đạt cấp độ ngoại ngữ [A1 hoặc tương đương].\n- [40%] học sinh tiểu học đạt chứng chỉ tin học theo [chuẩn quốc tế].\n- [100%] học sinh tiếp cận học tập trên nền tảng [LMS].\n- [100%] các lớp thực hiện chuyển đổi số khi tổ chức các hoạt động học tập và tương tác, trao đổi thông tin hoạt động dạy - học.\n- [100%] học sinh được tham gia các ngày hội, các hoạt động trải nghiệm trong và ngoài nhà trường, rèn kỹ năng sống, phát triển tư duy, câu lạc bộ Thể dục thể thao và năng khiếu, tiếp cận nghiên cứu khoa học, các hoạt động trải nghiệm và sáng tạo,... và hội thi các cấp.\n- [100%] học sinh lớp 3 được phổ cập bơi an toàn và phòng chống đuối nước; các khối lớp còn lại tham gia phổ cập bơi theo nhu cầu.\n- Tăng [15%] tổng số huy chương (trong đó [10%] huy chương vàng) và tăng [10%] tổng số huy chương cấp thành phố (trong đó [15%] huy chương vàng) so với năm học 2024 - 2025.', 
          isCollapsed: false 
        },
        { id: 'b4-8', type: 'h3', content: '3. Danh hiệu thi đua, khen thưởng', isCollapsed: false },
        { id: 'b4-9', type: 'h3', content: '3.1. Tập thể', isCollapsed: false },
        { 
          id: 'b4-10', 
          type: 'text', 
          content: '- Tổ lao động Tiên tiến: [08 tổ];\n- Tổ lao động Xuất sắc: [02 tổ];\n- Tập thể lao động [Tiên tiến];\n- Tập thể lao động [Xuất sắc];\n- Công đoàn: [Xuất sắc];\n- Chi đoàn: [Xuất sắc];\n- Đội: [Xuất sắc];\n- [Cờ thi đua Thành phố];\n- [Bằng khen Bộ Giáo dục và Đào tạo].', 
          isCollapsed: false 
        },
        { id: 'b4-11', type: 'h3', content: '3.2. Cá nhân', isCollapsed: false },
        { 
          id: 'b4-12', 
          type: 'text', 
          content: '- Giáo viên giỏi, giáo viên chủ nhiệm giỏi cấp trường: [80%];\n- Giáo viên giỏi chủ nhiệm giỏi cấp phường: [30%];\n- Lao động tiên tiến: [100%];\n- Chiến sĩ thi đua cơ sở: từ [10] cá nhân trở lên.', 
          isCollapsed: false 
        },
      ],
      5: [
        { id: 'b5-title', type: 'h2', content: 'V. KẾ HOẠCH GIÁO DỤC', isCollapsed: false },
        { id: 'b5-5', type: 'h3', content: '1. Khung thời gian thực hiện chương trình năm học', isCollapsed: false },
        { id: 'b5-6', type: 'h3', content: '1.1. Khung thời gian', isCollapsed: false },
        { 
          id: 'b5-7', 
          type: 'table', 
          content: {
            headers: ['STT', 'Nội dung', 'Khung thời gian', 'Ghi chú'],
            rows: [
              ['1', 'Ngày tựu trường', '- Lớp 1: [Thường từ 21/8 - 23/8]\n- Lớp 2, 3, 4, 5: [Thường từ 26/8 - 28/8]', ''],
              ['2', 'Ngày Khai giảng', '[Cố định ngày 05/9 hàng năm]', ''],
              ['3', 'Học kỳ I', 'Từ [05/9] đến [trước 15/01]\n- [18 tuần]: thực học\n- Còn lại: hoạt động khác.', ''],
              ['4', 'Học kỳ II', 'Từ [sau 15/01] đến [trước 25/5]\n- [17 tuần]: thực học\n- Còn lại: hoạt động khác.', ''],
              ['5', 'Bế giảng', '[Thường từ 25/5 - 30/5]', ''],
              ['6', 'Xét HTCTTH', '[Trước ngày 30/6]', '']
            ]
          }, 
          isCollapsed: false 
        },
        { id: 'b5-8', type: 'h3', content: '1.2. Thời gian sinh hoạt chuyên môn', isCollapsed: false },
        { 
          id: 'b5-9', 
          type: 'text', 
          content: '- Sinh hoạt Hội đồng sư phạm: [01 lần/tháng].\n- Sinh hoạt Tổ chuyên môn: [02 lần/tháng] (vào chiều [Thứ Tư] tuần thứ 2 và tuần thứ 4 hàng tháng).\n- Nội dung trọng tâm: [Nghiên cứu bài học, đổi mới phương pháp dạy học, ứng dụng CNTT, bồi dưỡng giáo viên thực hiện chương trình GDPT 2018].', 
          isCollapsed: false 
        },
        { id: 'b5-10', type: 'h3', content: '2. Kế hoạch giáo dục', isCollapsed: false },
        { id: 'b5-12', type: 'h3', content: '2.1. Đối với khối 1', isCollapsed: false },
        { id: 'b5-13-a-title', type: 'h3', content: 'a) Thời lượng giáo dục', isCollapsed: false },
        { 
          id: 'b5-13-a-table', 
          type: 'table', 
          content: {
            headers: ['TT', 'Nội dung', 'Số lượng tiết học', 'Phân phối số tiết/tuần', 'Ghi chú'],
            rows: [
              ['1', 'Tiếng Việt', '420', '12', ''],
              ['2', 'Toán', '105', '03', ''],
              ['3', 'Đạo đức', '35', '01', ''],
              ['4', 'Tự nhiên xã hội', '70', '02', ''],
              ['5', 'Hoạt động trải nghiệm', '105', '03', ''],
              ['6', 'Giáo dục thể chất', '70', '02', ''],
              ['7', 'Nghệ thuật (Âm nhạc)', '35', '01', ''],
              ['8', 'Nghệ thuật (Mĩ thuật)', '35', '01', ''],
              ['9', 'Môn học tự chọn', '105', '03', ''],
              ['-', 'Tiếng Anh', '70', '02', ''],
              ['-', 'Hoạt động làm quen giáo dục Tin học', '35', '01', ''],
              ['10', 'Hoạt động củng cố tăng cường (Tiếng Việt/Toán; Tiếng Anh tăng cường; Tin học ICDL)', '210', '06', ''],
              ['11', 'Hoạt động phát triển kỹ năng theo nhu cầu người học: kỹ năng sống; hoạt động trải nghiệm STEM; CLB Năng khiếu TDTT, CLB Nghệ thuật - CLB Khoa học vui; kỹ năng Công dân số; phổ cập bơi', '210', '06', ''],
              ['12', 'Sinh hoạt chuyên môn', '18', '2 lần/tháng', ''],
              ['13', 'Các ngày nghỉ trong năm', '10', '', ''],
              ['14', 'Tổng số tiết học kỳ I', '720', '40 tiết/tuần (tính cả tiết theo nhu cầu)', ''],
              ['15', 'Tổng số tiết học kỳ II', '680', '40 tiết/tuần (tính cả tiết theo nhu cầu)', '']
            ]
          }, 
          isCollapsed: false 
        },
        { id: 'b5-13-b-title', type: 'h3', content: 'b) Kế hoạch dạy học các môn học, hoạt động giáo dục khối lớp 1', isCollapsed: false },
        { id: 'b5-13-b-text', type: 'text', content: '(Đính kèm phụ lục kế hoạch chi tiết)', isCollapsed: false },
        
        { id: 'b5-14', type: 'h3', content: '2.2. Đối với khối 2', isCollapsed: false },
        { id: 'b5-15-a-title', type: 'h3', content: 'a) Thời lượng giáo dục', isCollapsed: false },
        { 
          id: 'b5-15-a-table', 
          type: 'table', 
          content: {
            headers: ['TT', 'Nội dung', 'Số lượng tiết học', 'Phân phối số tiết/tuần', 'Ghi chú'],
            rows: [
              ['1', 'Tiếng Việt', '350', '10', ''],
              ['2', 'Toán', '175', '05', ''],
              ['3', 'Đạo đức', '35', '01', ''],
              ['4', 'Tự nhiên xã hội', '70', '02', ''],
              ['5', 'Hoạt động trải nghiệm', '105', '03', ''],
              ['6', 'Giáo dục thể chất', '70', '02', ''],
              ['7', 'Nghệ thuật (Âm nhạc)', '35', '01', ''],
              ['8', 'Nghệ thuật (Mĩ thuật)', '35', '01', ''],
              ['9', 'Môn học tự chọn', '105', '03', ''],
              ['-', 'Tiếng Anh', '70', '02', ''],
              ['-', 'Hoạt động làm quen giáo dục Tin học', '35', '01', ''],
              ['10', 'Hoạt động củng cố tăng cường', '210', '06', ''],
              ['11', 'Hoạt động phát triển kỹ năng theo nhu cầu người học', '210', '06', ''],
              ['12', 'Sinh hoạt chuyên môn', '18', '2 lần/tháng', ''],
              ['13', 'Các ngày nghỉ trong năm', '10', '', ''],
              ['14', 'Tổng số tiết học kỳ I', '720', '40 tiết/tuần', ''],
              ['15', 'Tổng số tiết học kỳ II', '680', '40 tiết/tuần', '']
            ]
          }, 
          isCollapsed: false 
        },
        { id: 'b5-15-b-title', type: 'h3', content: 'b) Kế hoạch dạy học các môn học, hoạt động giáo dục khối lớp 2', isCollapsed: false },
        { id: 'b5-15-b-text', type: 'text', content: '(Đính kèm phụ lục kế hoạch chi tiết)', isCollapsed: false },

        { id: 'b5-16', type: 'h3', content: '2.3. Đối với khối 3', isCollapsed: false },
        { id: 'b5-17-a-title', type: 'h3', content: 'a) Thời lượng giáo dục', isCollapsed: false },
        { 
          id: 'b5-17-a-table', 
          type: 'table', 
          content: {
            headers: ['TT', 'Nội dung', 'Số lượng tiết học', 'Phân phối số tiết/tuần', 'Ghi chú'],
            rows: [
              ['1', 'Tiếng Việt', '245', '07', ''],
              ['2', 'Toán', '175', '05', ''],
              ['3', 'Đạo đức', '35', '01', ''],
              ['4', 'Tự nhiên xã hội', '70', '02', ''],
              ['5', 'Hoạt động trải nghiệm', '105', '03', ''],
              ['6', 'Giáo dục thể chất', '70', '02', ''],
              ['7', 'Nghệ thuật (Âm nhạc)', '35', '01', ''],
              ['8', 'Nghệ thuật (Mĩ thuật)', '35', '01', ''],
              ['9', 'Ngoại ngữ 1 (Tiếng Anh)', '140', '04', ''],
              ['10', 'Tin học', '35', '01', ''],
              ['11', 'Công nghệ', '35', '01', ''],
              ['12', 'Hoạt động củng cố tăng cường', '140', '04', ''],
              ['13', 'Hoạt động phát triển kỹ năng theo nhu cầu người học', '140', '04', ''],
              ['14', 'Sinh hoạt chuyên môn', '18', '2 lần/tháng', ''],
              ['15', 'Các ngày nghỉ trong năm', '10', '', ''],
              ['16', 'Tổng số tiết học kỳ I', '720', '40 tiết/tuần', ''],
              ['17', 'Tổng số tiết học kỳ II', '680', '40 tiết/tuần', '']
            ]
          }, 
          isCollapsed: false 
        },
        { id: 'b5-17-b-title', type: 'h3', content: 'b) Kế hoạch dạy học các môn học, hoạt động giáo dục khối lớp 3', isCollapsed: false },
        { id: 'b5-17-b-text', type: 'text', content: '(Đính kèm phụ lục kế hoạch chi tiết)', isCollapsed: false },

        { id: 'b5-18', type: 'h3', content: '2.4. Đối với khối 4', isCollapsed: false },
        { id: 'b5-19-a-title', type: 'h3', content: 'a) Thời lượng giáo dục', isCollapsed: false },
        { 
          id: 'b5-19-a-table', 
          type: 'table', 
          content: {
            headers: ['TT', 'Nội dung', 'Số lượng tiết học', 'Phân phối số tiết/tuần', 'Ghi chú'],
            rows: [
              ['1', 'Tiếng Việt', '245', '07', ''],
              ['2', 'Toán', '175', '05', ''],
              ['3', 'Đạo đức', '35', '01', ''],
              ['4', 'Khoa học', '70', '02', ''],
              ['5', 'Lịch sử và Địa lí', '70', '02', ''],
              ['6', 'Hoạt động trải nghiệm', '105', '03', ''],
              ['7', 'Giáo dục thể chất', '70', '02', ''],
              ['8', 'Nghệ thuật (Âm nhạc)', '35', '01', ''],
              ['9', 'Nghệ thuật (Mĩ thuật)', '35', '01', ''],
              ['10', 'Ngoại ngữ 1 (Tiếng Anh)', '140', '04', ''],
              ['11', 'Tin học', '35', '01', ''],
              ['12', 'Công nghệ', '35', '01', ''],
              ['13', 'Hoạt động củng cố tăng cường', '140', '04', ''],
              ['14', 'Hoạt động phát triển kỹ năng theo nhu cầu người học', '140', '04', ''],
              ['15', 'Sinh hoạt chuyên môn', '18', '2 lần/tháng', ''],
              ['16', 'Các ngày nghỉ trong năm', '10', '', ''],
              ['17', 'Tổng số tiết học kỳ I', '720', '40 tiết/tuần', ''],
              ['18', 'Tổng số tiết học kỳ II', '680', '40 tiết/tuần', '']
            ]
          }, 
          isCollapsed: false 
        },
        { id: 'b5-19-b-title', type: 'h3', content: 'b) Kế hoạch dạy học các môn học, hoạt động giáo dục khối lớp 4', isCollapsed: false },
        { id: 'b5-19-b-text', type: 'text', content: '(Đính kèm phụ lục kế hoạch chi tiết)', isCollapsed: false },

        { id: 'b5-20', type: 'h3', content: '2.5. Đối với khối 5', isCollapsed: false },
        { id: 'b5-21-a-title', type: 'h3', content: 'a) Thời lượng giáo dục', isCollapsed: false },
        { 
          id: 'b5-21-a-table', 
          type: 'table', 
          content: {
            headers: ['TT', 'Nội dung', 'Số lượng tiết học', 'Phân phối số tiết/tuần', 'Ghi chú'],
            rows: [
              ['1', 'Tiếng Việt', '245', '07', ''],
              ['2', 'Toán', '175', '05', ''],
              ['3', 'Đạo đức', '35', '01', ''],
              ['4', 'Khoa học', '70', '02', ''],
              ['5', 'Lịch sử và Địa lí', '70', '02', ''],
              ['6', 'Hoạt động trải nghiệm', '105', '03', ''],
              ['7', 'Giáo dục thể chất', '70', '02', ''],
              ['8', 'Nghệ thuật (Âm nhạc)', '35', '01', ''],
              ['9', 'Nghệ thuật (Mĩ thuật)', '35', '01', ''],
              ['10', 'Ngoại ngữ 1 (Tiếng Anh)', '140', '04', ''],
              ['11', 'Tin học', '35', '01', ''],
              ['12', 'Công nghệ', '35', '01', ''],
              ['13', 'Hoạt động củng cố tăng cường', '140', '04', ''],
              ['14', 'Hoạt động phát triển kỹ năng theo nhu cầu người học', '140', '04', ''],
              ['15', 'Sinh hoạt chuyên môn', '18', '2 lần/tháng', ''],
              ['16', 'Các ngày nghỉ trong năm', '10', '', ''],
              ['17', 'Tổng số tiết học kỳ I', '720', '40 tiết/tuần', ''],
              ['18', 'Tổng số tiết học kỳ II', '680', '40 tiết/tuần', '']
            ]
          }, 
          isCollapsed: false 
        },
        { id: 'b5-21-b-title', type: 'h3', content: 'b) Kế hoạch dạy học các môn học, hoạt động giáo dục khối lớp 5', isCollapsed: false },
        { id: 'b5-21-b-text', type: 'text', content: '(Đính kèm phụ lục kế hoạch chi tiết)', isCollapsed: false },
      ],
      6: [
        { id: 'b6-title', type: 'h2', content: 'VI. GIẢI PHÁP THỰC HIỆN', isCollapsed: false },
        
        { id: 'b6-1-h', type: 'h3', content: '1. Thực hiện các giải pháp giáo dục tư tưởng, đạo đức lối sống, phát huy giá trị văn hoá truyền thống, bảo đảm an toàn trường học', isCollapsed: false },
        { id: 'b6-1', type: 'text', content: '- Tăng cường giáo dục đạo đức, lối sống, kỹ năng sống cho học sinh thông qua các môn học và hoạt động trải nghiệm.\n- Đẩy mạnh việc học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh.\n- Tổ chức các hoạt động văn hóa, văn nghệ, trò chơi dân gian nhằm phát huy giá trị văn hóa truyền thống của địa phương và dân tộc.\n- Xây dựng và thực hiện nghiêm túc bộ Quy tắc ứng xử văn hóa trong trường học.\n- Đảm bảo tuyệt đối an ninh trật tự, an toàn trường học; chủ động phòng chống bạo lực học đường, tai nạn thương tích và các tệ nạn xã hội xâm nhập vào trường học.\n- Phối hợp chặt chẽ với chính quyền, công an địa phương và Ban đại diện Cha mẹ học sinh trong việc quản lý, giáo dục học sinh.', isCollapsed: false },
        
        { id: 'b6-2-h', type: 'h3', content: '2. Thực hiện đảm bảo chất lượng, hiệu quả chương trình giáo dục phổ thông', isCollapsed: false },
        { id: 'b6-2', type: 'text', content: 'a) Xây dựng kế hoạch giáo dục nhà trường:\n- Chủ động xây dựng kế hoạch giáo dục nhà trường theo hướng dẫn tại Công văn 2345/BGDĐT-GDTH, đảm bảo tính khoa học, linh hoạt và phù hợp với đặc điểm tâm sinh lý học sinh, điều kiện thực tế của nhà trường và địa phương.\n- Tổ chức rà soát, điều chỉnh nội dung dạy học, tinh giản các nội dung trùng lặp, bổ sung các nội dung giáo dục đặc thù của địa phương vào kế hoạch dạy học các môn học.\n\nb) Triển khai Chương trình GDPT 2018:\n- Thực hiện nghiêm túc, hiệu quả chương trình GDPT 2018 đối với các khối lớp [Điền các khối lớp, ví dụ: 1, 2, 3, 4, 5].\n- Đảm bảo đủ thời lượng dạy học 2 buổi/ngày (không quá 7 tiết/ngày; mỗi tiết 35 phút) để học sinh hoàn thành nội dung học tập tại lớp, không giao bài tập về nhà đối với học sinh học 2 buổi/ngày.\n- Chú trọng tích hợp các nội dung giáo dục: Bảo vệ môi trường, quyền con người, giáo dục kỹ năng sống, phòng chống tai nạn thương tích, an toàn giao thông... vào các môn học và hoạt động giáo dục.\n\nc) Đổi mới phương pháp và hình thức tổ chức dạy học:\n- Chuyển từ truyền thụ kiến thức sang phát triển phẩm chất, năng lực học sinh. Đẩy mạnh các phương pháp dạy học tích cực: Bàn tay nặn bột, dạy học dự án, giải quyết vấn đề.\n- Đa dạng hóa các hình thức tổ chức dạy học: Học tại lớp, học ngoài không gian lớp học, tham quan thực tế, trải nghiệm sáng tạo.\n\nd) Đảm bảo hiệu quả đánh giá học sinh:\n- Thực hiện đánh giá học sinh tiểu học theo Thông tư 27/2020/TT-BGDĐT. Chú trọng đánh giá thường xuyên bằng nhận xét, giúp học sinh nhận ra sự tiến bộ và những điểm cần cố gắng.\n- Tổ chức các kỳ kiểm tra định kỳ đảm bảo nghiêm túc, khách quan, phản ánh đúng chất lượng dạy và học thực tế.\n\ne) Công tác kiểm tra và hỗ trợ chuyên môn:\n- Tăng cường dự giờ, thăm lớp, sinh hoạt chuyên môn theo nghiên cứu bài học để hỗ trợ giáo viên kịp thời về phương pháp dạy học và quản lý lớp học.\n- Thực hiện kiểm tra nội bộ định kỳ và đột xuất việc thực hiện chương trình, kế hoạch giáo dục của tổ chuyên môn và giáo viên.', isCollapsed: false },
        
        { id: 'b6-3-h', type: 'h3', content: '3. Tổ chức giảng dạy ngoại ngữ (Tiếng Anh), Tin học', isCollapsed: false },
        { id: 'b6-3-1-h', type: 'h3', content: '3.1. Dạy học ngoại ngữ (Tiếng Anh)', isCollapsed: false },
        { id: 'b6-3-1', type: 'text', content: 'a) Mục tiêu dạy học:\n- Hình thành và phát triển năng lực ngôn ngữ (nghe, nói, đọc, viết) cho học sinh ở mức độ cơ bản, giúp học sinh tự tin trong giao tiếp đơn giản.\n- Tạo niềm yêu thích, hứng thú học tập ngoại ngữ và xây dựng nền tảng vững chắc cho việc học Tiếng Anh ở các cấp học tiếp theo.\n\nb) Chương trình và thời lượng:\n- Thực hiện dạy học Tiếng Anh là môn học bắt buộc đối với khối lớp 3, 4, 5 với thời lượng 4 tiết/tuần theo Chương trình GDPT 2018.\n- Đối với khối lớp 1, 2: Tổ chức dạy học Tiếng Anh tự chọn (làm quen Tiếng Anh) với thời lượng [Điền số tiết, ví dụ: 2 tiết/tuần] nhằm tạo tiền đề cho học sinh.\n- Sử dụng bộ sách giáo khoa: [Điền tên bộ sách, ví dụ: Global Success / i-Learn Smart Start...].\n\nc) Phương pháp dạy học và hình thức tổ chức:\n- Áp dụng phương pháp dạy học giao tiếp (Communicative Language Teaching), lấy học sinh làm trung tâm, tăng cường tối đa thời lượng thực hành nói cho học sinh.\n- Đa dạng hóa các hoạt động trong lớp: Trò chơi ngôn ngữ, hát, kể chuyện, đóng vai, làm dự án học tập nhỏ.\n- Đẩy mạnh ứng dụng CNTT và các phần mềm hỗ trợ dạy học Tiếng Anh, khai thác học liệu số để làm phong phú bài giảng.\n- Tổ chức các sân chơi ngoại ngữ: Câu lạc bộ Tiếng Anh, Ngày hội Tiếng Anh (English Day), các cuộc thi hùng biện, Rung chuông vàng Tiếng Anh.\n\nd) Kiểm tra và đánh giá:\n- Thực hiện đánh giá thường xuyên qua các hoạt động trên lớp, nhận xét sự tiến bộ của học sinh về thái độ và kỹ năng.\n- Đề kiểm tra định kỳ (giữa kỳ, cuối kỳ) đảm bảo đủ 4 kỹ năng: Nghe, Nói, Đọc, Viết với tỷ lệ phù hợp, bám sát yêu cầu cần đạt của chương trình.\n\ne) Điều kiện thực hiện:\n- Bố trí phòng học Tiếng Anh chuyên dụng có đầy đủ trang thiết bị: Máy chiếu, loa, tranh ảnh, thẻ từ (flashcards).\n- Đảm bảo đội ngũ giáo viên đủ về số lượng, đạt chuẩn về trình độ năng lực ngoại ngữ và nghiệp vụ sư phạm tiểu học.', isCollapsed: false },
        { id: 'b6-3-2-h', type: 'h3', content: '3.2. Dạy tin học', isCollapsed: false },
        { id: 'b6-3-2', type: 'text', content: 'a) Mục tiêu dạy học:\n- Giúp học sinh bước đầu làm quen với công nghệ kỹ thuật số, hình thành năng lực tin học cơ bản và tư duy giải quyết vấn đề với sự hỗ trợ của máy tính.\n- Xây dựng ý thức sử dụng thiết bị công nghệ an toàn, có trách nhiệm và tuân thủ đạo đức trong môi trường số.\n\nb) Chương trình và thời lượng:\n- Thực hiện dạy học Tin học là môn học bắt buộc đối với khối lớp 3, 4, 5 với thời lượng 1 tiết/tuần theo Chương trình GDPT 2018.\n- Đối với khối lớp 1, 2: Tổ chức các hoạt động làm quen với Tin học và Công nghệ kỹ thuật số thông qua các câu lạc bộ hoặc hoạt động trải nghiệm (nếu điều kiện nhà trường cho phép).\n- Sử dụng bộ sách giáo khoa: [Điền tên bộ sách, ví dụ: Kết nối tri thức với cuộc sống / Chân trời sáng tạo...].\n\nc) Phương pháp dạy học và hình thức tổ chức:\n- Ưu tiên phương pháp dạy học thực hành, lấy việc rèn luyện kỹ năng thao tác trên máy tính làm trọng tâm.\n- Áp dụng dạy học dựa trên dự án (Project-based learning) thông qua các bài tập thiết kế sản phẩm số đơn giản (vẽ tranh, soạn thảo văn bản ngắn, tạo bài trình chiếu).\n- Tích hợp giáo dục STEM vào các bài học Tin học để tăng tính ứng dụng và sáng tạo.\n- Hướng dẫn học sinh kỹ năng khai thác tài nguyên trên Internet phục vụ học tập một cách an toàn và hiệu quả.\n\nd) Kiểm tra và đánh giá:\n- Đánh giá thường xuyên tập trung vào kỹ năng thực hành và sản phẩm số của học sinh trong mỗi tiết học.\n- Đề kiểm tra định kỳ kết hợp giữa lý thuyết (trắc nghiệm) và thực hành trên máy, đảm bảo đánh giá đúng năng lực vận dụng kiến thức của học sinh.\n\ne) Điều kiện thực hiện:\n- Duy trì và nâng cấp phòng máy tính: Đảm bảo đủ số lượng máy tính hoạt động tốt cho học sinh thực hành (tối thiểu 2 học sinh/máy), có kết nối Internet ổn định và các phần mềm học tập cần thiết.\n- Giáo viên Tin học thường xuyên cập nhật kiến thức công nghệ mới và đổi mới phương pháp dạy học phù hợp với đặc thù môn học.', isCollapsed: false },
        
        { id: 'b6-4-h', type: 'h3', content: '4. Tổ chức dạy học nội dung giáo dục địa phương theo chương trình giáo dục phổ thông 2018', isCollapsed: false },
        { id: 'b6-4-intro', type: 'text', content: 'a) Mục tiêu giáo dục:\n- Giúp học sinh hiểu biết về nơi mình đang sinh sống, bồi dưỡng tình yêu quê hương, ý thức tìm hiểu và vận dụng những điều đã học để góp phần bảo tồn những giá trị văn hóa của địa phương.\n- Hình thành năng lực tìm tòi, khám phá các vấn đề lịch sử, địa lý, văn hóa, kinh tế - xã hội của Thành phố.\n\nb) Hình thức tổ chức dạy học:\n- Nội dung giáo dục địa phương được thực hiện tích hợp trong các môn học: Đạo đức, Tự nhiên và Xã hội, Lịch sử và Địa lý và các Hoạt động trải nghiệm.\n- Tổ chức các chuyến tham quan thực tế tại các di tích lịch sử, bảo tàng, làng nghề truyền thống trên địa bàn Thành phố.\n\nc) Khung nội dung chi tiết (Gợi ý cho khối 1, 2, 3):', isCollapsed: false },
        { 
          id: 'b6-4-table', 
          type: 'table', 
          content: {
            headers: ['STT', 'CHỦ ĐỀ', 'LỚP', 'BÀI HỌC'],
            rows: [
              ['1', 'Quê hương em tươi đẹp', '1', 'Thành phố Hồ Chí Minh – Quê hương em tươi đẹp'],
              ['', '', '2', 'Thành phố Hồ Chí Minh – những nét đặc trưng'],
              ['', '', '3', 'Thành phố Hồ Chí Minh – Vùng đất, con người'],
              ['2', 'Danh nhân lịch sử, văn hoá', '1', 'Nguyễn Hữu Cảnh – Người mở cõi đất phương Nam'],
              ['', '', '2', 'Tả quân Lê Văn Duyệt'],
              ['', '', '3', 'Giáo sư Trần Văn Giàu – Một tài năng, một nhân cách lớn'],
              ['3', 'Nghệ thuật/ làng nghề truyền thống', '1', 'Làng hoa Gò Vấp'],
              ['', '', '2', 'Làng nghề làm lồng đèn ở Thành phố Hồ Chí Minh'],
              ['', '', '3', 'Nghệ thuật sân khấu cải lương'],
              ['4', 'Đặc sản địa phương', '1', 'Các món ăn quen thuộc ở Thành phố Hồ Chí Minh'],
              ['', '', '2', 'Cơm tấm Sài Gòn'],
              ['', '', '3', 'Cà phê – Một nét văn hoá ở Thành phố Hồ Chí Minh'],
              ['5', 'Di tích lịch sử – văn hóa', '1', 'Bảo tàng Lịch sử Việt Nam Thành phố Hồ Chí Minh'],
              ['', '', '2', 'Khu di tích lịch sử địa đạo Củ Chi'],
              ['', '', '3', 'Dinh Độc Lập']
            ]
          }, 
          isCollapsed: false 
        },
        { id: 'b6-4-outro', type: 'text', content: 'd) Đánh giá kết quả học tập:\n- Đánh giá thông qua sự tham gia tích cực của học sinh trong các hoạt động tìm hiểu địa phương.\n- Đánh giá qua các sản phẩm học tập: Tranh vẽ, bài viết ngắn, sưu tầm hình ảnh hoặc các bài thuyết trình đơn giản về chủ đề đã học.', isCollapsed: false },
        
        { id: 'b6-5-h', type: 'h3', content: '5. Tổ chức thực hiện giáo dục STEM', isCollapsed: false },
        { id: 'b6-5', type: 'text', content: 'a) Mục tiêu:\n- Nâng cao nhận thức cho cán bộ quản lý và giáo viên về vị trí, vai trò và ý nghĩa của giáo dục STEM trong thực hiện Chương trình GDPT 2018.\n- Hình thành và phát triển các năng lực, phẩm chất cho học sinh thông qua các hoạt động trải nghiệm thực tế, giải quyết vấn đề.\n\nb) Các hình thức tổ chức:\n- Bài học STEM: Tích hợp trong các môn học chính khóa như Toán, Tự nhiên và Xã hội, Khoa học, Công nghệ, Tin học, Mỹ thuật. Mỗi khối lớp thực hiện ít nhất [2-3] bài học STEM/học kỳ.\n- Hoạt động trải nghiệm STEM: Tổ chức ngày hội STEM, các câu lạc bộ khoa học, tham quan các cơ sở nghiên cứu hoặc sản xuất.\n- Làm quen với nghiên cứu khoa học, kỹ thuật: Dành cho học sinh có năng khiếu và đam mê, hướng dẫn thực hiện các dự án nhỏ.\n\nc) Lộ trình thực hiện:\n- Học kỳ I: Tập huấn giáo viên, xây dựng danh mục các bài học STEM cho từng khối lớp, tổ chức Ngày hội STEM cấp trường.\n- Học kỳ II: Triển khai dạy học STEM đại trà, đánh giá và rút kinh nghiệm, trưng bày sản phẩm STEM cuối năm học.\n\nd) Điều kiện thực hiện:\n- Nhân lực: Thành lập tổ nòng cốt giáo dục STEM gồm các giáo viên cốt cán các bộ môn.\n- Cơ sở vật chất: Tận dụng phòng học bộ môn, trang bị thêm các bộ kit STEM, vật liệu tái chế và các thiết bị hỗ trợ.\n- Kinh phí: Từ nguồn ngân sách nhà trường và xã hội hóa giáo dục.', isCollapsed: false },
        
        { id: 'b6-6-h', type: 'h3', content: '6. Triển khai dạy học giáo dục kỹ năng công dân số trong nhà trường', isCollapsed: false },
        { id: 'b6-6', type: 'text', content: 'a) Mục tiêu:\n- Giúp học sinh hình thành các kỹ năng cơ bản để sử dụng công nghệ số một cách an toàn, có trách nhiệm và hiệu quả.\n- Xây dựng văn hóa ứng xử văn minh trên môi trường mạng.\n\nb) Nội dung trọng tâm:\n- Khai thác và sử dụng thông tin số: Kỹ năng tìm kiếm, đánh giá và chọn lọc thông tin trên Internet.\n- Giao tiếp và hợp tác trong môi trường số: Sử dụng email, mạng xã hội an toàn, tôn trọng quyền riêng tư.\n- An toàn và bảo mật thông tin: Bảo vệ thông tin cá nhân, nhận diện các nguy cơ lừa đảo, mã độc.\n- Đạo đức và pháp luật trong môi trường số: Tuân thủ quy định về bản quyền, không tham gia các hành vi bắt nạt trực tuyến.\n\nc) Hình thức triển khai:\n- Lồng ghép trong môn Tin học và các môn học khác.\n- Tổ chức các buổi sinh hoạt dưới cờ, hoạt động ngoại khóa về chủ đề "Công dân số tương lai".\n- Phối hợp với phụ huynh để hướng dẫn học sinh sử dụng thiết bị số tại nhà.', isCollapsed: false },
        
        { id: 'b6-7-h', type: 'h3', content: '7. Xây dựng trường học hạnh phúc', isCollapsed: false },
        { id: 'b6-7', type: 'text', content: 'a) Mục tiêu:\n- Xây dựng môi trường giáo dục an toàn, thân thiện, tôn trọng và yêu thương.\n- Tạo động lực và niềm vui cho giáo viên, học sinh khi đến trường.\n\nb) Các tiêu chí thực hiện:\n- Môi trường nhà trường: Xanh - Sạch - Đẹp - An toàn, không có bạo lực học đường.\n- Mối quan hệ trong nhà trường: Tôn trọng sự khác biệt, lắng nghe và chia sẻ giữa giáo viên - học sinh, giáo viên - giáo viên, nhà trường - phụ huynh.\n- Hoạt động giáo dục: Giảm áp lực bài vở, tăng cường các hoạt động trải nghiệm, rèn luyện kỹ năng sống và phát triển năng khiếu cá nhân.\n\nc) Các giải pháp cụ thể:\n- Tổ chức các "Hộp thư điều em muốn nói" để lắng nghe tâm tư của học sinh.\n- Triển khai mô hình "Lớp học hạnh phúc" với các góc sáng tạo, góc thư giãn.\n- Tổ chức các ngày hội văn hóa, thể thao, các chương trình thiện nguyện để gắn kết cộng đồng.', isCollapsed: false },
        
        { id: 'b6-8-h', type: 'h3', content: '8. Tích cực đổi mới phương pháp, hình thức tổ chức dạy học, đánh giá học sinh', isCollapsed: false },
        { id: 'b6-8-1-h', type: 'h3', content: '8.1. Tổ chức dạy học', isCollapsed: false },
        { id: 'b6-8-1', type: 'text', content: 'a) Đổi mới phương pháp dạy học:\n- Chuyển từ truyền thụ kiến thức sang phát triển phẩm chất, năng lực học sinh.\n- Áp dụng các phương pháp dạy học tích cực: Bàn tay nặn bột, dạy học dự án, kỹ thuật các mảnh ghép, khăn trải bàn...\n- Tăng cường ứng dụng CNTT và các phần mềm hỗ trợ dạy học.\n\nb) Hình thức tổ chức:\n- Đa dạng hóa các hình thức: Học trên lớp, học ngoài thiên nhiên, tham quan di tích lịch sử, bảo tàng.\n- Tổ chức các câu lạc bộ học thuật, ngày hội trải nghiệm sáng tạo.', isCollapsed: false },
        { id: 'b6-8-2-h', type: 'h3', content: '8.2. Đánh giá học sinh', isCollapsed: false },
        { id: 'b6-8-2', type: 'text', content: 'a) Đánh giá thường xuyên:\n- Thực hiện theo Thông tư 27/2020/TT-BGDĐT.\n- Đánh giá bằng nhận xét, tập trung vào sự tiến bộ của học sinh.\n- Kết hợp đánh giá của giáo viên, học sinh tự đánh giá và bạn đánh giá.\n\nb) Đánh giá định kỳ:\n- Tổ chức kiểm tra định kỳ nhẹ nhàng, không gây áp lực.\n- Đề kiểm tra xây dựng theo ma trận đặc tả, đảm bảo 4 mức độ nhận thức.', isCollapsed: false },
        
        { id: 'b6-9-h', type: 'h3', content: '9. Củng cố nâng cao chất lượng giáo dục', isCollapsed: false },
        { id: 'b6-9-1-h', type: 'h3', content: '9.1. Duy trì, nâng cao chất lượng giáo dục', isCollapsed: false },
        { id: 'b6-9-1', type: 'text', content: '- Thực hiện nghiêm túc chương trình, kế hoạch giáo dục.\n- Tổ chức bồi dưỡng học sinh chưa đạt chuẩn kiến thức, kỹ năng.\n- Phát hiện và bồi dưỡng học sinh năng khiếu thông qua các sân chơi trí tuệ.', isCollapsed: false },
        { id: 'b6-9-2-h', type: 'h3', content: '9.2. Đảm bảo hiệu quả kiểm định chất lượng giáo dục', isCollapsed: false },
        { id: 'b6-9-2', type: 'text', content: '- Tự đánh giá chất lượng giáo dục theo chu kỳ.\n- Hoàn thiện hồ sơ minh chứng phục vụ công tác kiểm định.\n- Đề xuất các cấp đánh giá ngoài và công nhận trường đạt chuẩn quốc gia.', isCollapsed: false },
        
        { id: 'b6-10-h', type: 'h3', content: '10. Thực hiện giáo dục đối với trẻ khuyết tật, trẻ có hoàn cảnh khó khăn', isCollapsed: false },
        { id: 'b6-10-1-h', type: 'h3', content: '10.1. Đối với trẻ khuyết tật, học hoà nhập', isCollapsed: false },
        { id: 'b6-10-1', type: 'text', content: '- Lập hồ sơ theo dõi sức khỏe và tiến độ học tập của từng học sinh khuyết tật.\n- Xây dựng kế hoạch giáo dục cá nhân phù hợp với khả năng của trẻ.\n- Tạo môi trường hòa nhập, không phân biệt đối xử.', isCollapsed: false },
        { id: 'b6-10-2-h', type: 'h3', content: '10.2. Đối với trẻ có hoàn cảnh khó khăn', isCollapsed: false },
        { id: 'b6-10-2', type: 'text', content: '- Rà soát, lập danh sách học sinh thuộc diện hộ nghèo, cận nghèo, mồ côi.\n- Vận động các nguồn lực hỗ trợ sách vở, đồ dùng học tập, học bổng.\n- Quan tâm, động viên tinh thần để các em không bỏ học.', isCollapsed: false },
        
        { id: 'b6-11-h', type: 'h3', content: '11. Củng cố, tăng cường các điều kiện đảm bảo chất lượng giáo dục', isCollapsed: false },
        { id: 'b6-11-1-h', type: 'h3', content: '11.1. Công tác nhân sự', isCollapsed: false },
        { id: 'b6-11-1', type: 'text', content: '- Sắp xếp, phân công chuyên môn hợp lý, đúng năng lực.\n- Tổ chức bồi dưỡng nâng cao trình độ lý luận chính trị và chuyên môn nghiệp vụ.\n- Thực hiện đầy đủ các chế độ chính sách cho cán bộ, giáo viên.', isCollapsed: false },
        { id: 'b6-11-2-h', type: 'h3', content: '11.2. Tăng cường cơ sở vật chất, thiết bị dạy học', isCollapsed: false },
        { id: 'b6-11-2', type: 'text', content: '- Sửa chữa, nâng cấp các phòng học, phòng chức năng.\n- Mua sắm bổ sung thiết bị dạy học theo danh mục tối thiểu.\n- Khai thác và sử dụng hiệu quả các thiết bị hiện có.', isCollapsed: false },
        { id: 'b6-11-3-h', type: 'h3', content: '11.3. Nâng cao hoạt động của thư viện trường học', isCollapsed: false },
        { id: 'b6-11-3', type: 'text', content: '- Xây dựng thư viện đạt chuẩn (hoặc tiên tiến, xuất sắc).\n- Bổ sung đầu sách, tài liệu tham khảo phong phú.\n- Tổ chức các hoạt động khuyến đọc: Tiết đọc thư viện, Ngày hội đọc sách.', isCollapsed: false },
        
        { id: 'b6-12-h', type: 'h3', content: '12. Tăng cường chuyển đổi số trong giáo dục và đào tạo', isCollapsed: false },
        { id: 'b6-12-1-h', type: 'h3', content: '12.1. Tăng cường ứng dụng công nghệ thông tin', isCollapsed: false },
        { id: 'b6-12-1', type: 'text', content: '- Sử dụng các phần mềm quản lý nhà trường, quản lý học sinh.\n- Xây dựng kho học liệu số, bài giảng điện tử E-learning.\n- Triển khai họp trực tuyến, quản lý văn bản đi/đến qua môi trường mạng.', isCollapsed: false },
        { id: 'b6-12-2-h', type: 'h3', content: '12.2. Triển khai thực hiện học bạ số', isCollapsed: false },
        { id: 'b6-12-2', type: 'text', content: '- Tập huấn cho giáo viên về cách sử dụng và ký số học bạ.\n- Đảm bảo hạ tầng kỹ thuật và tính bảo mật của dữ liệu.\n- Hoàn thành việc cập nhật dữ liệu học bạ lên hệ thống đúng tiến độ.', isCollapsed: false },
        
        { id: 'b6-13-h', type: 'h3', content: '13. Công tác truyền thông', isCollapsed: false },
        { id: 'b6-13', type: 'text', content: 'a) Mục tiêu:\n- Tạo sự đồng thuận và ủng hộ của cha mẹ học sinh và cộng đồng đối với các hoạt động của nhà trường.\n- Quảng bá hình ảnh và các thành tích của nhà trường.\n\nb) Nội dung truyền thông:\n- Các chủ trương, chính sách mới về giáo dục.\n- Kết quả học tập, rèn luyện và các hoạt động ngoại khóa của học sinh.\n- Gương người tốt việc tốt, các điển hình tiên tiến trong nhà trường.\n\nc) Các kênh truyền thông:\n- Website nhà trường, trang Fanpage, nhóm Zalo lớp.\n- Bảng tin nhà trường, hệ thống loa phát thanh.\n- Thông qua các buổi họp cha mẹ học sinh.', isCollapsed: false },
        
        { id: 'b6-14-h', type: 'h3', content: '14. Nâng cao hiệu quả sinh hoạt chuyên môn', isCollapsed: false },
        { id: 'b6-14-1-h', type: 'h3', content: '14.1. Sinh hoạt chuyên môn', isCollapsed: false },
        { id: 'b6-14-1', type: 'text', content: '- Duy trì sinh hoạt chuyên môn định kỳ 2 tuần/lần.\n- Tập trung thảo luận về đổi mới phương pháp dạy học, giải quyết các bài khó.\n- Sinh hoạt chuyên môn theo nghiên cứu bài học.', isCollapsed: false },
        { id: 'b6-14-2-h', type: 'h3', content: '14.2. Tổ chức thực hiện chuyên đề, thao giảng', isCollapsed: false },
        { id: 'b6-14-2', type: 'text', content: '- Mỗi giáo viên thực hiện ít nhất 2 tiết dạy tốt/năm học.\n- Tổ chức các chuyên đề cấp tổ, cấp trường về các môn học mới.\n- Tham gia đầy đủ các hội thi giáo viên dạy giỏi các cấp.', isCollapsed: false },
        
        { id: 'b6-15-h', type: 'h3', content: '15. Các hoạt động trọng tâm khác', isCollapsed: false },
        { id: 'b6-15-1-h', type: 'h3', content: '15.1. Công tác quản trị trường học', isCollapsed: false },
        { id: 'b6-15-1', type: 'text', content: '- Thực hiện công khai, dân chủ trong mọi hoạt động.\n- Cải cách thủ tục hành chính, tạo điều kiện thuận lợi cho phụ huynh và học sinh.\n- Đảm bảo an ninh trật tự, an toàn trường học.', isCollapsed: false },
        { id: 'b6-15-2-h', type: 'h3', content: '15.2. Công tác y tế', isCollapsed: false },
        { id: 'b6-15-2', type: 'text', content: '- Khám sức khỏe định kỳ cho học sinh.\n- Tuyên truyền phòng chống dịch bệnh, vệ sinh học đường.\n- Đảm bảo an toàn thực phẩm đối với bếp ăn bán trú.', isCollapsed: false },
        { id: 'b6-15-3-h', type: 'h3', content: '15.3. Hoạt động đoàn thể', isCollapsed: false },
        { id: 'b6-15-3', type: 'text', content: '- Công đoàn: Chăm lo đời sống, bảo vệ quyền lợi cho đoàn viên.\n- Chi đoàn: Phát huy vai trò xung kích trong các hoạt động phong trào.\n- Đội Thiếu niên: Tổ chức các hoạt động giáo dục truyền thống, đạo đức, lối sống.', isCollapsed: false },
        
        { id: 'b6-16-h', type: 'h3', content: '16. Công tác tài chính', isCollapsed: false },
        { id: 'b6-16', type: 'text', content: '- Lập dự toán thu chi đúng quy định, công khai minh bạch.\n- Ưu tiên kinh phí cho các hoạt động dạy và học.\n- Thực hiện tốt công tác xã hội hóa giáo dục để tăng cường nguồn lực.', isCollapsed: false },
        
        { id: 'b6-17-h', type: 'h3', content: '17. Công tác phối hợp', isCollapsed: false },
        { id: 'b6-17-1-h', type: 'h3', content: '17.1. Với cha mẹ học sinh', isCollapsed: false },
        { id: 'b6-17-1', type: 'text', content: '- Duy trì liên lạc thường xuyên qua sổ liên lạc điện tử, nhóm Zalo.\n- Tổ chức các buổi họp Ban đại diện CMHS để bàn bạc các giải pháp giáo dục.\n- Phối hợp giáo dục đạo đức, lối sống cho học sinh tại gia đình.', isCollapsed: false },
        { id: 'b6-17-2-h', type: 'h3', content: '17.2. Với chính quyền địa phương', isCollapsed: false },
        { id: 'b6-17-2', type: 'text', content: '- Tham mưu với Đảng ủy, UBND về các kế hoạch phát triển giáo dục.\n- Phối hợp với các đoàn thể địa phương trong công tác khuyến học, khuyến tài.\n- Đảm bảo an ninh trật tự khu vực xung quanh trường.', isCollapsed: false },
      ],
      7: [
        { id: 'b7-title', type: 'h2', content: 'VII. TỔ CHỨC THỰC HIỆN', isCollapsed: false },
        { id: 'b7-1-h', type: 'h3', content: '1. Hiệu trưởng', isCollapsed: false },
        { id: 'b7-1', type: 'text', content: 'a) Quản lý, chỉ đạo chung:\n- Quản lý, chỉ đạo chung và toàn diện các hoạt động của nhà trường theo các chỉ tiêu, nội dung kế hoạch đã xây dựng và triển khai.\n- Tổ chức xây dựng, triển khai, kiểm tra, đánh giá việc thực hiện kế hoạch giáo dục nhà trường.\n- Chỉ đạo phó hiệu trưởng, trưởng các đoàn thể, tổ trưởng các chuyên môn và tổ văn phòng lập kế hoạch hoạt động chi tiết, cụ thể cho [năm học, tháng, tuần] theo quy định; phê duyệt hoặc phân cấp phó hiệu trưởng phê duyệt kế hoạch theo thẩm quyền.\n\nb) Đảm bảo chất lượng giáo dục:\n- Chỉ đạo việc tổ chức thực hiện công tác kiểm định chất lượng giáo dục, xây dựng kế hoạch cải tiến chất lượng giáo dục; việc xây dựng trường đạt chuẩn quốc gia trong năm học [2025 - 2026].\n- Giám sát việc triển khai thực hiện kế hoạch của các tổ chuyên môn, đoàn thể trong nhà trường theo kế hoạch; kịp thời lấy ý kiến và điều chỉnh nội dung, tiêu chí của Kế hoạch khi cần để đảm bảo phù hợp thực tiễn và nâng cao chất lượng, hiệu quả hoạt động giáo dục của nhà trường trong năm học.\n\nc) Tổ chức các hoạt động và thi đua:\n- Chỉ đạo tổ chức các hoạt động [hội thi, hội giảng] trong năm học.\n- Xây dựng tiêu chí thi đua trong nhà trường.\n\nd) Quản lý nhân sự:\n- Ban hành các quyết định thành lập tổ chuyên môn, bổ nhiệm các chức danh tổ trưởng, tổ phó chuyên môn.\n- Tham dự sinh hoạt chuyên môn của các tổ.\n- Phân công nhiệm vụ tất cả các viên chức, người lao động trong nhà trường đảm bảo công bằng, khách quan, hợp lý, phù hợp với năng lực, phẩm chất của từng cá nhân.', isCollapsed: false },
        { id: 'b7-2-h', type: 'h3', content: '2. Phó hiệu trưởng', isCollapsed: false },
        { id: 'b7-2', type: 'text', content: 'a) Tham mưu và lập kế hoạch:\n- Tham mưu Hiệu trưởng về công tác đảm bảo an toàn trường học; hoạt động chuyên môn; công tác phổ cập giáo dục; phát triển cơ sở vật chất, lập kế hoạch giáo dục [năm học], kế hoạch kiểm tra nội bộ và kế hoạch đầu việc trong phạm vi công việc được phân công phụ trách; đẩy mạnh ứng dụng công nghệ thông tin trong quản lý hoạt động giáo dục.\n- Tham mưu Hiệu trưởng giải pháp thực hiện đổi mới sinh hoạt tổ chuyên môn, nâng cao chất lượng đội ngũ, kiểm tra, giám sát các hoạt động chuyên môn, tăng cường các giải pháp để nâng cao chất lượng giáo dục toàn diện, phát triển học sinh năng khiếu.\n- Tham mưu việc tăng cường cơ sở vật chất cho dạy và học đảm bảo theo chuẩn quy định.\n\nb) Chỉ đạo chuyên môn và bồi dưỡng đội ngũ:\n- Xây dựng chuyên đề nâng cao chất lượng giáo dục toàn diện, tư vấn chuyên môn cho nhà trường, xây dựng kế hoạch bồi dưỡng đội ngũ, bồi dưỡng thường xuyên; công tác phổ cập giáo dục.\n- Xây dựng kế hoạch kiểm tra chuyên môn, dự giờ thăm lớp; chỉ đạo tổ chuyên môn xây dựng kế hoạch dạy học các môn học, hoạt động giáo dục tổ khối; kiểm tra và duyệt kế hoạch bài dạy của giáo viên.\n- [Hằng tháng] họp thống nhất các nội dung chuyên môn với các tổ.\n\nc) Quản lý các hoạt động giáo dục khác:\n- Xây dựng kế hoạch tổ chức các hoạt động ngoài giờ lên lớp; kế hoạch bồi dưỡng học sinh có năng khiếu, phụ đạo học sinh nhận thức chậm và các hoạt động khác có liên quan đến giáo dục.\n- Duyệt hoạt động ngoài giờ lên lớp, chuyên đề cấp trường, cấp tổ, tổ chức trong [năm học]; phản ánh kịp thời với hiệu trưởng những vấn đề phát sinh để điều chỉnh, bổ sung kế hoạch cho phù hợp và hiệu quả.\n\nd) Công tác truyền thông và báo cáo:\n- Làm tốt công tác truyền thông về giáo dục, phối hợp với các đoàn thể làm tốt công tác tư vấn chuyên môn cho nhà trường, nâng cao chất lượng dạy học, xây dựng khối đoàn kết nội bộ.\n- Kịp thời báo cáo hiệu trưởng kết quả triển khai, chỉ đạo thực hiện các nhiệm vụ theo phân công; những vấn đề phát sinh, vượt quá thẩm quyền để xin ý kiến chỉ đạo.', isCollapsed: false },
        { id: 'b7-3-h', type: 'h3', content: '3. Tổ trưởng chuyên môn', isCollapsed: false },
        { id: 'b7-3', type: 'text', content: 'a) Tham mưu và xây dựng kế hoạch:\n- Tham mưu với lãnh đạo nhà trường những giải pháp thúc đẩy hoạt động chung và hoạt động chuyên môn của nhà trường cũng như tổ/khối mình được phân công phụ trách.\n- Tổ chức thành viên trong tổ thảo luận, xây dựng kế hoạch dạy học các môn học và hoạt động giáo dục của tổ; xây dựng kế hoạch sinh hoạt tổ chuyên môn năm học [2025-2026] trình Hiệu trưởng duyệt.\n\nb) Tổ chức và điều hành sinh hoạt chuyên môn:\n- Tổ chức, điều hành sinh hoạt tổ chuyên môn theo quy định.\n- Tiếp nhận, phản hồi và báo cáo những chỉ đạo từ lãnh đạo nhà trường đến các thành viên trong tổ.\n\nc) Hướng dẫn và giám sát giáo viên:\n- Hướng dẫn giáo viên (nhân viên) lập kế hoạch cá nhân (kế hoạch chủ nhiệm và các hoạt động chuyên môn).\n- Giám sát và tư vấn cho giáo viên thực hiện các hoạt động chuyên môn theo nội dung kế hoạch đã xây dựng.', isCollapsed: false },
        { id: 'b7-4-h', type: 'h3', content: '4. Tổng phụ trách Đội', isCollapsed: false },
        { id: 'b7-4', type: 'text', content: 'a) Xây dựng kế hoạch và phối hợp:\n- Kết hợp với tổ trưởng chuyên môn và các bộ phận xây dựng kế hoạch tổ chức các hoạt động giáo dục, hoạt động ngoài giờ lên lớp, hoạt động trải nghiệm cho học sinh.\n\nb) Tổ chức các hoạt động và phong trào:\n- Tổ chức tất cả các hoạt động trải nghiệm, hoạt động giáo dục và hoạt động ngoài giờ lên lớp phù hợp với điều kiện nhà trường và theo những chỉ đạo từ Hội đồng đội các cấp.\n- Thành lập các câu lạc bộ, đội nhóm của Liên đội để thúc đẩy mọi hoạt động của nhà trường.\n\nc) Thi đua và tập huấn:\n- Xây dựng tiêu chí thi đua của Liên đội. [Mỗi học kỳ] tổ chức một buổi tập huấn dành cho giáo viên phụ trách chi, giáo viên phụ trách lớp nhi đồng.', isCollapsed: false },
        { id: 'b7-5-h', type: 'h3', content: '5. Giáo viên chủ nhiệm', isCollapsed: false },
        { id: 'b7-5', type: 'text', content: 'a) Thực hiện nhiệm vụ giảng dạy và chuyên môn:\n- Chịu trách nhiệm giảng dạy theo sự phân công của Hiệu trưởng.\n- Thực hiện nghiêm túc mọi quy chế chuyên môn; chịu trách nhiệm chất lượng của lớp, môn giảng dạy.\n- Tích cực tự trau dồi chuyên môn, nghiệp vụ; tham gia đầy đủ các buổi chuyên đề do các cấp tổ chức khi được điều động.\n\nb) Xây dựng và thực hiện kế hoạch:\n- Căn cứ vào kế hoạch giáo dục của nhà trường, kế hoạch dạy học các môn học và hoạt động giáo dục của tổ được Hiệu trưởng phê duyệt, xây dựng kế hoạch dạy học để thực hiện được tổ trưởng kiểm tra và cán bộ quản lý phê duyệt.\n- Kế hoạch của mỗi cá nhân phải được xây dựng dựa trên chỉ tiêu nhà trường, tổ; đảm bảo tính đồng bộ, liên thông với kế hoạch chung của nhà trường. Đẩy mạnh ứng dụng công nghệ thông tin trong giảng dạy, báo cáo và quản lý học sinh.\n- Trình tổ trưởng, lãnh đạo nhà trường phê duyệt kế hoạch; không được tự động điều chỉnh kế hoạch khi chưa được sự đồng ý và thống nhất của tổ trưởng và phê duyệt của lãnh đạo nhà trường.\n\nc) Phối hợp giáo dục và hỗ trợ học sinh:\n- Phối hợp chặt chẽ với Tổng phụ trách Đội, triển khai, tổ chức cho học sinh tham gia tích cực công tác Đội và phong trào thiếu nhi; các hoạt động ngoài giờ lên lớp trong và ngoài nhà trường.\n- Kết hợp với giáo viên môn chuyên, cha mẹ học sinh trong việc nhận xét đánh giá học sinh.\n- Xây dựng kế hoạch hỗ trợ học sinh còn hạn chế về năng lực học tập, danh sách học sinh cần hỗ trợ trình hiệu trưởng duyệt để hỗ trợ học sinh.', isCollapsed: false },
        { id: 'b7-6-h', type: 'h3', content: '6. Giáo viên phụ trách môn học', isCollapsed: false },
        { id: 'b7-6', type: 'text', content: 'a) Trau dồi chuyên môn và ứng dụng CNTT:\n- Tích cực tự trau dồi chuyên môn, nghiệp vụ; tham gia đầy đủ các buổi chuyên đề do các cấp tổ chức khi được điều động.\n- Ứng dụng công nghệ thông tin trong công tác giảng dạy.\n\nb) Xây dựng và thực hiện kế hoạch:\n- Căn cứ vào kế hoạch giáo dục của nhà trường, kế hoạch dạy học các môn học và hoạt động giáo dục của tổ được hiệu trưởng phê duyệt. Xây dựng kế hoạch dạy học và chịu trách nhiệm về kết quả giáo dục môn học và hoạt động giáo dục do mình phụ trách.\n- Kế hoạch của cá nhân phải được xây dựng dựa trên chỉ tiêu đề ra của nhà trường; đảm bảo tính đồng bộ, liên thông với kế hoạch chung của nhà trường.\n- Trình tổ trưởng, cán bộ quản lý phê duyệt kế hoạch; không được tự động điều chỉnh kế hoạch khi chưa được sự đồng ý và thống nhất của tổ trưởng và phê duyệt của cán bộ quản lý.\n\nc) Phối hợp và đánh giá học sinh:\n- Kết hợp với giáo viên chủ nhiệm, cha mẹ học sinh trong việc nhận xét đánh giá học sinh. Chịu trách nhiệm kết quả giáo dục của học sinh môn học được phân công phụ trách giảng dạy.', isCollapsed: false },
        { id: 'b7-7-h', type: 'h3', content: '7. Nhân viên', isCollapsed: false },
        { id: 'b7-7', type: 'text', content: 'a) Thực hiện nhiệm vụ và báo cáo:\n- Tham mưu, xây dựng, thực hiện và báo cáo kết quả kế hoạch hoạt động được phân công phụ trách (năm, tháng, tuần); chịu trách nhiệm trước Hiệu trưởng về lĩnh vực phụ trách.\n- Tăng cường ứng dụng công nghệ thông tin trong việc được phân công phụ trách.\n\nb) Phối hợp và hỗ trợ:\n- Tham gia các hoạt động do nhà trường tổ chức và được phân công hỗ trợ.\n- Phối hợp chặt chẽ với giáo viên và các bộ phận trong nhà trường khi giải quyết các công việc liên quan đến mọi hoạt động giáo dục của nhà trường. Trong quá trình thực hiện có vướng mắc liên hệ tổ trưởng, lãnh đạo phụ trách để được giải quyết.', isCollapsed: false },
      ],
      8: [
        { id: 'b8-1', type: 'h2', content: 'PHỤ LỤC', isCollapsed: false },
        { id: 'b8-8', type: 'h3', content: 'Lịch công tác', isCollapsed: false },
        { 
          id: 'b8-9', 
          type: 'table', 
          content: {
            headers: ['Tháng', 'Nội dung'],
            rows: [
              ['[Tháng 8/Năm]', '- Hoàn tất và công khai danh sách học sinh toàn trường;\n- Phân công nhiệm vụ năm học;\n- Xây dựng dự thảo kế hoạch giáo dục năm học [Năm học], lấy ý kiến góp ý;\n- Xây dựng thời khóa biểu;\n- Tập huấn chuyển đổi số, ma trận đề kiểm tra; chuyên đề quản lý, sắp xếp công việc cá nhân hiệu quả; giáo dục kỹ năng công dân số...\n- Rà soát điều kiện thực hiện Chương trình GDPT 2018;\n- Kiểm tra cơ sở vật chất, hoàn tất công tác chuẩn bị năm học mới;\n- Tham dự các lớp bồi dưỡng, tập huấn theo văn bản của Sở GDĐT.'],
              ['[Tháng 9/Năm]', '- Khai giảng năm học [Năm học], phát động chủ đề năm học\n- Thực hiện chương trình tuần 1 đến tuần 4\n- Hoàn chỉnh và ban hành Kế hoạch Giáo dục nhà trường\n- Dự giờ thăm lớp đầu năm\n- Sinh hoạt tổ chuyên môn\n- Tổ chức cuộc thi [Tên cuộc thi/hoạt động] – kì 1\n- Kiểm tra suất ăn bán trú, ATVSTP\n- Tổ chức thao giảng, chuyên đề\n- Triển khai hoạt động Giáo dục An toàn giao thông\n- Tổ chức họp cha mẹ học sinh toàn trường\n- Thành lập Hội đồng tự đánh giá của nhà trường\n- Đăng kí đánh giá ngoài với Sở GDĐT để đánh giá trường đạt chuẩn quốc gia.\n- Tổ chức chấm sản phẩm dự thi "[Tên hội thi/phong trào]" (sơ kết).'],
              ['[Tháng 10/Năm]', '- Thực hiện chương trình tuần 5 đến tuần 8\n- Tổ chức tuyên truyền phòng cháy, chữa cháy\n- Thực hiện kế hoạch hoạt động trải nghiệm ngoài nhà trường\n- Thực hiện thao giảng – chuyên đề cấp trường\n- Tham gia hội thi [Tên hội thi giáo viên] – vòng 1\n- Dự giờ, kiểm tra hoạt động sư phạm nhà giáo\n- Tổ chức cuộc thi [Tên cuộc thi/hoạt động] – kì 2\n- Kiểm tra suất ăn bán trú, ATVSTP\n- Kiểm tra công tác hành chính học vụ\n- Dự chuyên đề cấp cụm, Thành phố (nếu có)\n- Tổ chức chấm sản phẩm dự thi "[Tên hội thi/phong trào]" (chung kết).'],
              ['[Tháng 11/Năm]', '- Thực hiện chương trình tuần 9 đến tuần 12\n- Đón đoàn [Tên đoàn khách/giao lưu] ([Ngày/Tháng/Năm])\n- Tổ chức lễ kỉ niệm ngày Nhà giáo Việt Nam 20/11\n- Kiểm tra định kì giữa học kì 1 lớp 4, 5\n- Nhận xét bài Kiểm tra định kì giữa học kì 1 lớp 4, 5\n- Thực hiện thao giảng – chuyên đề cấp trường\n- Dự giờ, kiểm tra hoạt động sư phạm nhà giáo\n- Tổ chức [Tên ngày hội/sự kiện]\n- Hướng dẫn kiểm tra định kì cuối kì 1\n- Tổ chức cuộc thi [Tên cuộc thi/hoạt động] – kì 3\n- Kiểm tra suất ăn bán trú, ATVSTP\n- Kiểm tra các hoạt động công đoàn và tài chính\n- Dự chuyên đề cấp cụm, Thành phố (nếu có)\n- Đón Đoàn đánh giá ngoài (Sở Giáo dục và Đào tạo Thành phố)'],
              ['[Tháng 12/Năm]', '- Thực hiện chương trình tuần 13 đến tuần 16\n- Thực hiện thao giảng – chuyên đề cấp trường\n- Dự giờ, kiểm tra hoạt động sư phạm nhà giáo\n- Tổ chức cuộc thi [Tên cuộc thi/hoạt động] – kì 4\n- Kiểm tra suất ăn bán trú, ATVSTP\n- Kiểm tra công tác y tế\n- Kiểm tra định kì cuối kì 1\n- Rút kinh nghiệm việc soạn bài kiểm tra học kì 1, đặc biệt ở khối lớp 5\n- Thực hiện thống kê, sơ kết cuối kì 1\n- Dự chuyên đề cấp cụm, Thành phố (nếu có).'],
              ['[Tháng 01/Năm]', '- Vào chương trình học kì 2;\n- Thực hiện chương trình tuần 17 đến tuần 20\n- Thực hiện thao giảng – chuyên đề cấp trường\n- Dự giờ, kiểm tra hoạt động sư phạm nhà giáo\n- Tổ chức cuộc thi [Tên cuộc thi/hoạt động] – kì 5\n- Kiểm tra suất ăn bán trú, ATVSTP\n- Kiểm tra công tác Đội, chuyên môn\n- Dự chuyên đề cấp cụm, Thành phố (nếu có)'],
              ['[Tháng 02/Năm]', '- Thực hiện chương trình tuần 21 đến tuần 23\n- Thực hiện thao giảng – chuyên đề cấp trường\n- Dự giờ, kiểm tra hoạt động sư phạm nhà giáo\n- Kiểm tra suất ăn bán trú, ATVSTP\n- Kiểm tra công tác Thư viện – thiết bị\n- Dự chuyên đề cấp cụm Thành phố (nếu có)\n- Tổ chức [Tên ngày hội/sự kiện]'],
              ['[Tháng 03/Năm]', '- Thực hiện chương trình tuần 24 đến tuần 27\n- Kiểm tra định kỳ giữa kì 2 lớp 4, 5\n- Thực hiện các hội thi cấp trường\n- Tổ chức [Tên ngày hội/sự kiện] (lần 2)\n- Dự chuyên đề cấp cụm, Thành phố (nếu có)\n- Tham gia Khảo sát học sinh lớp 3 thành phố\n- Thực hiện thao giảng – chuyên đề cấp trường\n- Dự giờ, kiểm tra hoạt động sư phạm nhà giáo\n- Tổ chức cuộc thi [Tên cuộc thi/hoạt động] – kì 6\n- Kiểm tra suất ăn bán trú, ATVSTP\n- Kiểm tra hồ sơ chuyên môn'],
              ['[Tháng 04/Năm]', '- Thực hiện chương trình tuần 28 đến tuần 32\n- Thực hiện thao giảng – chuyên đề cấp trường\n- Dự giờ, kiểm tra hoạt động sư phạm nhà giáo\n- Tổ chức cuộc thi [Tên cuộc thi/hoạt động] – kì 8\n- Hướng dẫn KTĐK cuối năm và bàn giao chất lượng học tập, tổng kết năm học\n- Kiểm tra suất ăn bán trú, ATVSTP\n- Dự chuyên đề cấp cụm, Thành phố (nếu có).'],
              ['[Tháng 05/Năm]', '- Kiểm tra định kì cuối học kì 2\n- Xét hoàn thành chương trình tiểu học cho học sinh lớp 5\n- Ngày hội "[Tên ngày hội cuối năm]"\n- Ngày lễ "[Tên lễ ra trường]"\n- Tổng kết các Hội thi\n- Tổ chức Lễ Tổng kết năm học [Năm học] và Lễ tri ân ra trường cho học sinh lớp 5\n- Rà soát thống kê kì cuối năm trên CSDL\n- Thực hiện học bạ số\n- Xây dựng kế hoạch tổ chức hoạt động hè [Năm].'],
              ['[Tháng 06/Năm]', '- Chuẩn bị tập huấn bồi dưỡng hè\n- Báo cáo số liệu cuối năm học [Năm học]\n- Tổ chức tuyển sinh lớp 1\n- Báo cáo tổng kết giáo dục tiểu học năm học [Năm học].']
            ]
          }, 
          isCollapsed: false 
        },
      ]
    };
    setStepBlocks(template);
  };

  const addBlock = (type: BlockType) => {
    if (currentStep < 2) return;
    
    let content: any = '';
    if (type === 'text') content = 'Nhập nội dung văn bản...';
    else if (type === 'table') content = { headers: ['Cột 1', 'Cột 2'], rows: [['', '']] };
    else if (type === 'list') content = ['Mục mới'];
    else if (type === 'h2' || type === 'h3') content = 'Tiêu đề mới';

    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content,
      isCollapsed: false,
    };

    setStepBlocks({
      ...stepBlocks,
      [currentStep]: [...stepBlocks[currentStep], newBlock]
    });
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setStepBlocks({
      ...stepBlocks,
      [currentStep]: stepBlocks[currentStep].map(b => b.id === id ? { ...b, ...updates } : b)
    });
  };

  const removeBlock = (id: string) => {
    setStepBlocks({
      ...stepBlocks,
      [currentStep]: stepBlocks[currentStep].filter(b => b.id !== id)
    });
  };

  const getSuggestion = (blockId: string) => {
    const suggestions: Record<string, string> = {
      'b6-5': 'a) Mục tiêu:\n- Nâng cao nhận thức cho cán bộ quản lý và giáo viên về vị trí, vai trò và ý nghĩa của giáo dục STEM trong thực hiện Chương trình GDPT 2018.\n- Hình thành và phát triển các năng lực, phẩm chất cho học sinh thông qua các hoạt động trải nghiệm thực tế, giải quyết vấn đề.\n- Khơi dậy niềm đam mê khoa học, công nghệ, kỹ thuật và toán học cho học sinh.\n\nb) Các hình thức tổ chức:\n- Bài học STEM: Tích hợp trong các môn học chính khóa như Toán, Tự nhiên và Xã hội, Khoa học, Công nghệ, Tin học, Mỹ thuật. Mỗi khối lớp thực hiện ít nhất [2-3] bài học STEM/học kỳ.\n- Hoạt động trải nghiệm STEM: Tổ chức ngày hội STEM, các câu lạc bộ khoa học, tham quan các cơ sở nghiên cứu hoặc sản xuất.\n- Làm quen với nghiên cứu khoa học, kỹ thuật: Dành cho học sinh có năng khiếu và đam mê, hướng dẫn thực hiện các dự án nhỏ.\n\nc) Lộ trình thực hiện:\n- Học kỳ I: Tập huấn giáo viên, xây dựng danh mục các bài học STEM cho từng khối lớp, tổ chức Ngày hội STEM cấp trường.\n- Học kỳ II: Triển khai dạy học STEM đại trà, đánh giá và rút kinh nghiệm, trưng bày sản phẩm STEM cuối năm học.\n\nd) Điều kiện thực hiện:\n- Nhân lực: Thành lập tổ nòng cốt giáo dục STEM gồm các giáo viên cốt cán các bộ môn.\n- Cơ sở vật chất: Tận dụng phòng học bộ môn, trang bị thêm các bộ kit STEM, vật liệu tái chế và các thiết bị hỗ trợ.\n- Kinh phí: Từ nguồn ngân sách nhà trường và xã hội hóa giáo dục.',
      'b6-6': 'a) Mục tiêu:\n- Giúp học sinh hình thành các kỹ năng cơ bản để sử dụng công nghệ số một cách an toàn, có trách nhiệm và hiệu quả.\n- Xây dựng văn hóa ứng xử văn minh trên môi trường mạng.\n- Nâng cao nhận thức về an toàn thông tin và bảo vệ dữ liệu cá nhân.\n\nb) Nội dung trọng tâm:\n- Khai thác và sử dụng thông tin số: Kỹ năng tìm kiếm, đánh giá và chọn lọc thông tin trên Internet.\n- Giao tiếp và hợp tác trong môi trường số: Sử dụng email, mạng xã hội an toàn, tôn trọng quyền riêng tư.\n- An toàn và bảo mật thông tin: Bảo vệ thông tin cá nhân, nhận diện các nguy cơ lừa đảo, mã độc.\n- Đạo đức và pháp luật trong môi trường số: Tuân thủ quy định về bản quyền, không tham gia các hành vi bắt nạt trực tuyến.\n\nc) Hình thức triển khai:\n- Lồng ghép trong môn Tin học và các môn học khác.\n- Tổ chức các buổi sinh hoạt dưới cờ, hoạt động ngoại khóa về chủ đề "Công dân số tương lai".\n- Phối hợp với phụ huynh để hướng dẫn học sinh sử dụng thiết bị số tại nhà.',
      'b6-7': 'a) Mục tiêu:\n- Xây dựng môi trường giáo dục an toàn, thân thiện, tôn trọng và yêu thương.\n- Tạo động lực và niềm vui cho giáo viên, học sinh khi đến trường.\n- Giảm thiểu áp lực học tập, chú trọng phát triển toàn diện.\n\nb) Các tiêu chí thực hiện:\n- Môi trường nhà trường: Xanh - Sạch - Đẹp - An toàn, không có bạo lực học đường.\n- Mối quan hệ trong nhà trường: Tôn trọng sự khác biệt, lắng nghe và chia sẻ giữa giáo viên - học sinh, giáo viên - giáo viên, nhà trường - phụ huynh.\n- Hoạt động giáo dục: Giảm áp lực bài vở, tăng cường các hoạt động trải nghiệm, rèn luyện kỹ năng sống và phát triển năng khiếu cá nhân.\n\nc) Các giải pháp cụ thể:\n- Tổ chức các "Hộp thư điều em muốn nói" để lắng nghe tâm tư của học sinh.\n- Triển khai mô hình "Lớp học hạnh phúc" với các góc sáng tạo, góc thư giãn.\n- Tổ chức các ngày hội văn hóa, thể thao, các chương trình thiện nguyện để gắn kết cộng đồng.',
      'b6-8-1': 'a) Đổi mới phương pháp dạy học:\n- Chuyển từ truyền thụ kiến thức sang phát triển phẩm chất, năng lực học sinh.\n- Áp dụng các phương pháp dạy học tích cực: Bàn tay nặn bột, dạy học dự án, kỹ thuật các mảnh ghép, khăn trải bàn...\n- Tăng cường ứng dụng CNTT và các phần mềm hỗ trợ dạy học.\n- Chú trọng rèn luyện phương pháp tự học, tự nghiên cứu cho học sinh.\n\nb) Hình thức tổ chức:\n- Đa dạng hóa các hình thức: Học trên lớp, học ngoài thiên nhiên, tham quan di tích lịch sử, bảo tàng.\n- Tổ chức các câu lạc bộ học thuật, ngày hội trải nghiệm sáng tạo.\n- Kết hợp dạy học trực tiếp và trực tuyến khi cần thiết.',
      'b6-8-2': 'a) Đánh giá thường xuyên:\n- Thực hiện theo Thông tư 27/2020/TT-BGDĐT.\n- Đánh giá bằng nhận xét, tập trung vào sự tiến bộ của học sinh.\n- Kết hợp đánh giá của giáo viên, học sinh tự đánh giá và bạn đánh giá.\n- Đa dạng hóa các hình thức đánh giá: qua hồ sơ học tập, dự án, bài thuyết trình.\n\nb) Đánh giá định kỳ:\n- Tổ chức kiểm tra định kỳ nhẹ nhàng, không gây áp lực.\n- Đề kiểm tra xây dựng theo ma trận đặc tả, đảm bảo 4 mức độ nhận thức.\n- Sử dụng kết quả đánh giá để điều chỉnh phương pháp dạy học.',
      'b6-13': 'a) Mục tiêu:\n- Tạo sự đồng thuận và ủng hộ của cha mẹ học sinh và cộng đồng đối với các hoạt động của nhà trường.\n- Quảng bá hình ảnh và các thành tích của nhà trường.\n- Nâng cao vị thế và uy tín của nhà trường trong xã hội.\n\nb) Nội dung truyền thông:\n- Các chủ trương, chính sách mới về giáo dục.\n- Kết quả học tập, rèn luyện và các hoạt động ngoại khóa của học sinh.\n- Gương người tốt việc tốt, các điển hình tiên tiến trong nhà trường.\n- Các hoạt động đổi mới sáng tạo, các mô hình giáo dục hiệu quả.\n\nc) Các kênh truyền thông:\n- Website nhà trường, trang Fanpage, nhóm Zalo lớp.\n- Bảng tin nhà trường, hệ thống loa phát thanh.\n- Thông qua các buổi họp cha mẹ học sinh.\n- Phối hợp với các cơ quan báo đài địa phương.',
      'b7-1': 'a) Quản lý, chỉ đạo chung:\n- Quản lý, chỉ đạo chung và toàn diện các hoạt động của nhà trường theo các chỉ tiêu, nội dung kế hoạch đã xây dựng và triển khai.\n- Tổ chức xây dựng, triển khai, kiểm tra, đánh giá việc thực hiện kế hoạch giáo dục nhà trường.\n- Chỉ đạo phó hiệu trưởng, trưởng các đoàn thể, tổ trưởng các chuyên môn và tổ văn phòng lập kế hoạch hoạt động chi tiết, cụ thể cho [năm học, tháng, tuần] theo quy định; phê duyệt hoặc phân cấp phó hiệu trưởng phê duyệt kế hoạch theo thẩm quyền.\n\nb) Đảm bảo chất lượng giáo dục:\n- Chỉ đạo việc tổ chức thực hiện công tác kiểm định chất lượng giáo dục, xây dựng kế hoạch cải tiến chất lượng giáo dục; việc xây dựng trường đạt chuẩn quốc gia trong năm học [2025 - 2026].\n- Giám sát việc triển khai thực hiện kế hoạch của các tổ chuyên môn, đoàn thể trong nhà trường theo kế hoạch; kịp thời lấy ý kiến và điều chỉnh nội dung, tiêu chí của Kế hoạch khi cần để đảm bảo phù hợp thực tiễn và nâng cao chất lượng, hiệu quả hoạt động giáo dục của nhà trường trong năm học.\n\nc) Tổ chức các hoạt động và thi đua:\n- Chỉ đạo tổ chức các hoạt động [hội thi, hội giảng] trong năm học.\n- Xây dựng tiêu chí thi đua trong nhà trường.\n\nd) Quản lý nhân sự:\n- Ban hành các quyết định thành lập tổ chuyên môn, bổ nhiệm các chức danh tổ trưởng, tổ phó chuyên môn.\n- Tham dự sinh hoạt chuyên môn của các tổ.\n- Phân công nhiệm vụ tất cả các viên chức, người lao động trong nhà trường đảm bảo công bằng, khách quan, hợp lý, phù hợp với năng lực, phẩm chất của từng cá nhân.',
      'b7-2': 'a) Tham mưu và lập kế hoạch:\n- Tham mưu Hiệu trưởng về công tác đảm bảo an toàn trường học; hoạt động chuyên môn; công tác phổ cập giáo dục; phát triển cơ sở vật chất, lập kế hoạch giáo dục [năm học], kế hoạch kiểm tra nội bộ và kế hoạch đầu việc trong phạm vi công việc được phân công phụ trách; đẩy mạnh ứng dụng công nghệ thông tin trong quản lý hoạt động giáo dục.\n- Tham mưu Hiệu trưởng giải pháp thực hiện đổi mới sinh hoạt tổ chuyên môn, nâng cao chất lượng đội ngũ, kiểm tra, giám sát các hoạt động chuyên môn, tăng cường các giải pháp để nâng cao chất lượng giáo dục toàn diện, phát triển học sinh năng khiếu.\n- Tham mưu việc tăng cường cơ sở vật chất cho dạy và học đảm bảo theo chuẩn quy định.\n\nb) Chỉ đạo chuyên môn và bồi dưỡng đội ngũ:\n- Xây dựng chuyên đề nâng cao chất lượng giáo dục toàn diện, tư vấn chuyên môn cho nhà trường, xây dựng kế hoạch bồi dưỡng đội ngũ, bồi dưỡng thường xuyên; công tác phổ cập giáo dục.\n- Xây dựng kế hoạch kiểm tra chuyên môn, dự giờ thăm lớp; chỉ đạo tổ chuyên môn xây dựng kế hoạch dạy học các môn học, hoạt động giáo dục tổ khối; kiểm tra và duyệt kế hoạch bài dạy của giáo viên.\n- [Hằng tháng] họp thống nhất các nội dung chuyên môn với các tổ.\n\nc) Quản lý các hoạt động giáo dục khác:\n- Xây dựng kế hoạch tổ chức các hoạt động ngoài giờ lên lớp; kế hoạch bồi dưỡng học sinh có năng khiếu, phụ đạo học sinh nhận thức chậm và các hoạt động khác có liên quan đến giáo dục.\n- Duyệt hoạt động ngoài giờ lên lớp, chuyên đề cấp trường, cấp tổ, tổ chức trong [năm học]; phản ánh kịp thời với hiệu trưởng những vấn đề phát sinh để điều chỉnh, bổ sung kế hoạch cho phù hợp và hiệu quả.\n\nd) Công tác truyền thông và báo cáo:\n- Làm tốt công tác truyền thông về giáo dục, phối hợp với các đoàn thể làm tốt công tác tư vấn chuyên môn cho nhà trường, nâng cao chất lượng dạy học, xây dựng khối đoàn kết nội bộ.\n- Kịp thời báo cáo hiệu trưởng kết quả triển khai, chỉ đạo thực hiện các nhiệm vụ theo phân công; những vấn đề phát sinh, vượt quá thẩm quyền để xin ý kiến chỉ đạo.',
      'b7-3': 'a) Tham mưu và xây dựng kế hoạch:\n- Tham mưu với lãnh đạo nhà trường những giải pháp thúc đẩy hoạt động chung và hoạt động chuyên môn của nhà trường cũng như tổ/khối mình được phân công phụ trách.\n- Tổ chức thành viên trong tổ thảo luận, xây dựng kế hoạch dạy học các môn học và hoạt động giáo dục của tổ; xây dựng kế hoạch sinh hoạt tổ chuyên môn năm học [2025-2026] trình Hiệu trưởng duyệt.\n\nb) Tổ chức và điều hành sinh hoạt chuyên môn:\n- Tổ chức, điều hành sinh hoạt tổ chuyên môn theo quy định.\n- Tiếp nhận, phản hồi và báo cáo những chỉ đạo từ lãnh đạo nhà trường đến các thành viên trong tổ.\n\nc) Hướng dẫn và giám sát giáo viên:\n- Hướng dẫn giáo viên (nhân viên) lập kế hoạch cá nhân (kế hoạch chủ nhiệm và các hoạt động chuyên môn).\n- Giám sát và tư vấn cho giáo viên thực hiện các hoạt động chuyên môn theo nội dung kế hoạch đã xây dựng.',
      'b7-4': 'a) Xây dựng kế hoạch và phối hợp:\n- Kết hợp với tổ trưởng chuyên môn và các bộ phận xây dựng kế hoạch tổ chức các hoạt động giáo dục, hoạt động ngoài giờ lên lớp, hoạt động trải nghiệm cho học sinh.\n\nb) Tổ chức các hoạt động và phong trào:\n- Tổ chức tất cả các hoạt động trải nghiệm, hoạt động giáo dục và hoạt động ngoài giờ lên lớp phù hợp với điều kiện nhà trường và theo những chỉ đạo từ Hội đồng đội các cấp.\n- Thành lập các câu lạc bộ, đội nhóm của Liên đội để thúc đẩy mọi hoạt động của nhà trường.\n\nc) Thi đua và tập huấn:\n- Xây dựng tiêu chí thi đua của Liên đội. [Mỗi học kỳ] tổ chức một buổi tập huấn dành cho giáo viên phụ trách chi, giáo viên phụ trách lớp nhi đồng.',
      'b7-5': 'a) Thực hiện nhiệm vụ giảng dạy và chuyên môn:\n- Chịu trách nhiệm giảng dạy theo sự phân công của Hiệu trưởng.\n- Thực hiện nghiêm túc mọi quy chế chuyên môn; chịu trách nhiệm chất lượng của lớp, môn giảng dạy.\n- Tích cực tự trau dồi chuyên môn, nghiệp vụ; tham gia đầy đủ các buổi chuyên đề do các cấp tổ chức khi được điều động.\n\nb) Xây dựng và thực hiện kế hoạch:\n- Căn cứ vào kế hoạch giáo dục của nhà trường, kế hoạch dạy học các môn học và hoạt động giáo dục của tổ được Hiệu trưởng phê duyệt, xây dựng kế hoạch dạy học để thực hiện được tổ trưởng kiểm tra và cán bộ quản lý phê duyệt.\n- Kế hoạch của mỗi cá nhân phải được xây dựng dựa trên chỉ tiêu nhà trường, tổ; đảm bảo tính đồng bộ, liên thông với kế hoạch chung của nhà trường. Đẩy mạnh ứng dụng công nghệ thông tin trong giảng dạy, báo cáo và quản lý học sinh.\n- Trình tổ trưởng, lãnh đạo nhà trường phê duyệt kế hoạch; không được tự động điều chỉnh kế hoạch khi chưa được sự đồng ý và thống nhất của tổ trưởng và phê duyệt của lãnh đạo nhà trường.\n\nc) Phối hợp giáo dục và hỗ trợ học sinh:\n- Phối hợp chặt chẽ với Tổng phụ trách Đội, triển khai, tổ chức cho học sinh tham gia tích cực công tác Đội và phong trào thiếu nhi; các hoạt động ngoài giờ lên lớp trong và ngoài nhà trường.\n- Kết hợp với giáo viên môn chuyên, cha mẹ học sinh trong việc nhận xét đánh giá học sinh.\n- Xây dựng kế hoạch hỗ trợ học sinh còn hạn chế về năng lực học tập, danh sách học sinh cần hỗ trợ trình hiệu trưởng duyệt để hỗ trợ học sinh.',
      'b7-6': 'a) Trau dồi chuyên môn và ứng dụng CNTT:\n- Tích cực tự trau dồi chuyên môn, nghiệp vụ; tham gia đầy đủ các buổi chuyên đề do các cấp tổ chức khi được điều động.\n- Ứng dụng công nghệ thông tin trong công tác giảng dạy.\n\nb) Xây dựng và thực hiện kế hoạch:\n- Căn cứ vào kế hoạch giáo dục của nhà trường, kế hoạch dạy học các môn học và hoạt động giáo dục của tổ được hiệu trưởng phê duyệt. Xây dựng kế hoạch dạy học và chịu trách nhiệm về kết quả giáo dục môn học và hoạt động giáo dục do mình phụ trách.\n- Kế hoạch của cá nhân phải được xây dựng dựa trên chỉ tiêu đề ra của nhà trường; đảm bảo tính đồng bộ, liên thông với kế hoạch chung của nhà trường.\n- Trình tổ trưởng, cán bộ quản lý phê duyệt kế hoạch; không được tự động điều chỉnh kế hoạch khi chưa được sự đồng ý và thống nhất của tổ trưởng và phê duyệt của cán bộ quản lý.\n\nc) Phối hợp và đánh giá học sinh:\n- Kết hợp với giáo viên chủ nhiệm, cha mẹ học sinh trong việc nhận xét đánh giá học sinh. Chịu trách nhiệm kết quả giáo dục của học sinh môn học được phân công phụ trách giảng dạy.',
      'b7-7': 'a) Thực hiện nhiệm vụ và báo cáo:\n- Tham mưu, xây dựng, thực hiện và báo cáo kết quả kế hoạch hoạt động được phân công phụ trách (năm, tháng, tuần); chịu trách nhiệm trước Hiệu trưởng về lĩnh vực phụ trách.\n- Tăng cường ứng dụng công nghệ thông tin trong việc được phân công phụ trách.\n\nb) Phối hợp và hỗ trợ:\n- Tham gia các hoạt động do nhà trường tổ chức và được phân công hỗ trợ.\n- Phối hợp chặt chẽ với giáo viên và các bộ phận trong nhà trường khi giải quyết các công việc liên quan đến mọi hoạt động giáo dục của nhà trường. Trong quá trình thực hiện có vướng mắc liên hệ tổ trưởng, lãnh đạo phụ trách để được giải quyết.',
    };
    return suggestions[blockId] || null;
  };

  const renderStep1 = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex items-start gap-4">
        <div className="p-3 bg-white/20 rounded-2xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-lg">Chào mừng bạn đến với trình soạn thảo kế hoạch nhà trường</h4>
          <p className="text-sm text-indigo-100 mt-1 leading-relaxed">
            Hãy bắt đầu bằng việc nhập các thông tin hành chính cơ bản. Các thông tin này sẽ tự động hiển thị ở đầu văn bản kế hoạch của bạn.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hành chính */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 uppercase tracking-tight text-lg">Thông tin đơn vị</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cơ quan chủ quản</label>
              <input 
                type="text" 
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm"
                value={adminInfo.departmentName}
                onChange={(e) => setAdminInfo({ ...adminInfo, departmentName: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tên trường</label>
              <input 
                type="text" 
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm"
                value={adminInfo.schoolName}
                onChange={(e) => setAdminInfo({ ...adminInfo, schoolName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Địa danh</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm"
                  value={adminInfo.location}
                  onChange={(e) => setAdminInfo({ ...adminInfo, location: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Năm học</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm"
                  value={adminInfo.schoolYear}
                  onChange={(e) => setAdminInfo({ ...adminInfo, schoolYear: e.target.value })}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nhân sự & Thời gian */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-sm">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 uppercase tracking-tight text-lg">Ký duyệt & Thời gian</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ngày ban hành</label>
              <input 
                type="text" 
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm"
                value={adminInfo.date}
                onChange={(e) => setAdminInfo({ ...adminInfo, date: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hiệu trưởng (Người ký)</label>
              <input 
                type="text" 
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm"
                value={adminInfo.principalName}
                onChange={(e) => setAdminInfo({ ...adminInfo, principalName: e.target.value })}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const renderBlocks = () => {
    const blocks = stepBlocks[currentStep] || [];
    
    return (
      <div className="space-y-6 pb-32 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[3rem] flex items-start gap-8 mb-12 shadow-2xl shadow-indigo-200/40 border border-indigo-500/20 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          
          <div className="p-5 bg-white/20 backdrop-blur-md rounded-[2rem] text-white shadow-inner border border-white/30 relative z-10">
            <Info className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-white text-2xl tracking-tight">{STEPS[currentStep - 1].title}</h4>
            <p className="text-base text-indigo-50 font-semibold mt-3 leading-relaxed max-w-3xl opacity-90">
              {STEPS[currentStep - 1].description}
              {currentStep !== 2 && ". Bạn có thể thêm các khối nội dung như văn bản, bảng biểu, danh sách để làm rõ nội dung này."}
            </p>
          </div>
        </div>

        {blocks.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
            <Plus className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-semibold">Chưa có nội dung nào. Hãy chọn một thành phần từ bên trái để bắt đầu.</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <motion.div 
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all p-5"
            >
              {/* Controls */}
              <div className="absolute -right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10 transition-all">
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-xl shadow-indigo-100/50 p-1.5 flex flex-col gap-1.5">
                  <button 
                    onClick={() => {
                      if (index > 0) {
                        const newBlocks = [...blocks];
                        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
                        setStepBlocks({ ...stepBlocks, [currentStep]: newBlocks });
                      }
                    }}
                    className="p-2.5 text-indigo-400 hover:text-indigo-700 hover:bg-white rounded-xl transition-all shadow-sm bg-white/50"
                    title="Di chuyển lên"
                  >
                    <ChevronDown className="w-5 h-5 rotate-180" />
                  </button>
                  <button 
                    onClick={() => {
                      if (index < blocks.length - 1) {
                        const newBlocks = [...blocks];
                        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
                        setStepBlocks({ ...stepBlocks, [currentStep]: newBlocks });
                      }
                    }}
                    className="p-2.5 text-indigo-400 hover:text-indigo-700 hover:bg-white rounded-xl transition-all shadow-sm bg-white/50"
                    title="Di chuyển xuống"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <div className="h-px bg-indigo-200 mx-2 my-1" />
                  <button 
                    onClick={() => removeBlock(block.id)}
                    className="p-2.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all shadow-sm bg-white/50"
                    title="Xóa khối"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                  {/* Header row - Hidden for headings to keep it clean */}
                  {block.type !== 'h2' && block.type !== 'h3' && (
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateBlock(block.id, { isCollapsed: !block.isCollapsed })}
                          className="p-1.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          {block.isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {currentStep !== 2 && block.type !== 'h2' && block.type !== 'h3' && (
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] truncate max-w-[400px]">
                              {block.type === 'text' ? 'Văn bản' : 
                               block.type === 'table' ? 'Bảng số liệu' : 
                               block.type === 'list' ? 'Danh mục' : 'Hình ảnh'}
                            </span>
                            {block.type === 'text' && getSuggestion(block.id) && (
                              <button 
                                onClick={() => {
                                  const suggestion = getSuggestion(block.id);
                                  if (suggestion) {
                                    updateBlock(block.id, { content: suggestion });
                                  }
                                }}
                                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-full transition-all group/suggest"
                                title="Gợi ý nội dung mẫu"
                              >
                                <Sparkles className="w-3 h-3 group-hover/suggest:animate-pulse" />
                                <span className="text-[9px] font-bold uppercase tracking-wider">Gợi ý nội dung</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!block.isCollapsed && (
                    <div className="mt-2">
                      {(block.type === 'h2' || block.type === 'h3') && (
                        <div className="relative group">
                          <textarea 
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            ref={(el) => {
                              if (el) {
                                el.style.height = 'auto';
                                el.style.height = el.scrollHeight + 'px';
                              }
                            }}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = target.scrollHeight + 'px';
                            }}
                            className={`w-full bg-transparent border-none focus:ring-0 font-black text-slate-800 p-0 tracking-tight transition-all resize-none overflow-hidden ${
                              block.type === 'h2' ? 'text-2xl mb-1' : 'text-xl'
                            } group-hover:text-indigo-600`}
                          />
                          <div className={`h-1 bg-indigo-100 rounded-full transition-all duration-500 origin-left ${
                            block.type === 'h2' ? 'w-24 group-hover:w-32' : 'w-12 group-hover:w-20'
                          }`} />
                        </div>
                      )}
                      {block.type === 'text' && (
                        <div className="relative group mt-2">
                          <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          
                          <div className="relative min-h-[60px] w-full border border-slate-200 rounded-3xl bg-white shadow-sm overflow-hidden focus-within:ring-8 focus-within:ring-indigo-500/5 focus-within:border-indigo-400 transition-all">
                            {/* Mirror div for auto-growth and highlighting */}
                            <div 
                              className="w-full px-8 py-6 text-[15px] leading-8 font-sans whitespace-pre-wrap break-words min-h-[60px] invisible"
                              aria-hidden="true"
                            >
                              {(block.content as string) + '\n\n'}
                            </div>

                            {/* Highlight Layer */}
                            <div 
                              className="absolute inset-0 px-8 py-6 text-[15px] leading-8 font-sans whitespace-pre-wrap break-words pointer-events-none select-none"
                              style={{ color: 'transparent', WebkitTextFillColor: 'transparent' }}
                            >
                              {(block.content as string).split(/(\[.*?\])/g).map((part, i) => (
                                part.startsWith('[') && part.endsWith(']') ? (
                                  <span key={i} className="bg-amber-100/80 px-1 rounded-md border border-amber-200/50 shadow-sm ring-2 ring-amber-400/20">
                                    {part}
                                  </span>
                                ) : (
                                  <span key={i}>{part}</span>
                                )
                              ))}
                            </div>

                            {/* Actual Textarea */}
                            <textarea 
                              value={block.content}
                              onChange={(e) => {
                                updateBlock(block.id, { content: e.target.value });
                              }}
                              spellCheck="false"
                              className="absolute inset-0 w-full h-full bg-transparent border-none focus:ring-0 px-8 py-6 text-[15px] leading-8 font-sans text-slate-700 resize-none overflow-hidden"
                              placeholder={block.placeholder || "Nhập nội dung chi tiết tại đây..."}
                              style={{ 
                                caretColor: '#4f46e5',
                                outline: 'none',
                              }}
                            />
                          </div>
                          
                          <div className="absolute top-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            <div className="flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full backdrop-blur-md border border-indigo-100 shadow-sm">
                              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Cần chỉnh sửa [...]</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {block.type === 'list' && (
                        <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {(block.content as string[]).map((item, lIdx) => (
                            <div key={lIdx} className="flex items-center gap-3 group/li bg-white p-2 rounded-xl border border-slate-200">
                              <div className="w-5 h-5 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                {lIdx + 1}
                              </div>
                              <textarea 
                                value={item}
                                onChange={(e) => {
                                  const newList = [...(block.content as string[])];
                                  newList[lIdx] = e.target.value;
                                  updateBlock(block.id, { content: newList });
                                }}
                                ref={(el) => {
                                  if (el) {
                                    el.style.height = 'auto';
                                    el.style.height = el.scrollHeight + 'px';
                                  }
                                }}
                                onInput={(e) => {
                                  const target = e.target as HTMLTextAreaElement;
                                  target.style.height = 'auto';
                                  target.style.height = target.scrollHeight + 'px';
                                }}
                                className={`flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm font-medium transition-colors resize-none overflow-hidden ${
                                  item.includes('[') && item.includes(']') 
                                    ? 'text-amber-700 font-medium' 
                                    : 'text-slate-700'
                                }`}
                              />
                              <button 
                                onClick={() => {
                                  const newList = (block.content as string[]).filter((_, i) => i !== lIdx);
                                  updateBlock(block.id, { content: newList });
                                }}
                                className="text-slate-300 hover:text-rose-500 opacity-0 group-hover/li:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const newList = [...(block.content as string[]), ''];
                              updateBlock(block.id, { content: newList });
                            }}
                            className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 mt-2"
                          >
                            <Plus className="w-3 h-3" /> THÊM MỤC
                          </button>
                        </div>
                      )}
                      {block.type === 'table' && (
                        <div className="space-y-4">
                          <div className="border border-slate-300 rounded-2xl overflow-x-auto bg-white shadow-sm">
                            <table className="w-full border-collapse min-w-[800px]">
                              <thead>
                                {block.id === 'b3-5' || block.id === 'b3-7' ? (
                                  <>
                                    {block.id === 'b3-5' ? (
                                      <>
                                        <tr className="bg-slate-50 border-b border-slate-300">
                                          <th rowSpan={2} className="p-2 border-r border-slate-300 w-16 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Khối</th>
                                          <th rowSpan={2} className="p-2 border-r border-slate-300 w-16 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lớp</th>
                                          <th colSpan={2} className="p-2 border-r border-slate-300 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Học sinh</th>
                                          <th rowSpan={2} className="p-2 border-r border-slate-300 w-20 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dân tộc</th>
                                          <th rowSpan={2} className="p-2 border-r border-slate-300 w-20 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hòa nhập</th>
                                          <th rowSpan={2} className="p-2 border-r border-slate-300 w-20 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Khó khăn</th>
                                          <th colSpan={2} className="p-2 border-r border-slate-300 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bán trú</th>
                                          <th colSpan={2} className="p-2 border-r border-slate-300 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tiếng Anh tăng cường</th>
                                          <th colSpan={2} className="p-2 border-r border-slate-300 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tiếng Anh tích hợp</th>
                                          <th rowSpan={2} className="p-2 w-16"></th>
                                        </tr>
                                        <tr className="bg-slate-50 border-b border-slate-300">
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Tổng</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Nữ</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Số lớp</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Số HS</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Số lớp</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Số HS</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Số lớp</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Số HS</th>
                                        </tr>
                                      </>
                                    ) : (
                                      <>
                                        <tr className="bg-slate-50 border-b border-slate-300">
                                          <th rowSpan={2} className="p-2 border-r border-slate-300 w-40 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Đội ngũ</th>
                                          <th colSpan={3} className="p-2 border-r border-slate-300 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Số lượng</th>
                                          <th colSpan={4} className="p-2 border-r border-slate-300 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trình độ đào tạo</th>
                                          <th rowSpan={2} className="p-2 border-r border-slate-300 w-20 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dân tộc</th>
                                          <th rowSpan={2} className="p-2 border-r border-slate-300 w-20 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Đảng viên</th>
                                          <th rowSpan={2} className="p-2 border-r border-slate-300 w-24 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ghi chú</th>
                                          <th rowSpan={2} className="p-2 w-16"></th>
                                        </tr>
                                        <tr className="bg-slate-50 border-b border-slate-300">
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Tổng</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Nam</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Nữ</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">Th.S</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">ĐH</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">CĐ</th>
                                          <th className="p-2 border-r border-slate-300 text-center text-[9px] font-bold text-slate-400 uppercase">TC</th>
                                        </tr>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <tr className="bg-slate-50 border-b border-slate-300">
                                    {(block.content as TableData).headers.map((header, hIdx) => (
                                      <th 
                                        key={hIdx} 
                                        className={`p-3 text-left border-r border-slate-300 last:border-r-0 relative group/th ${
                                          header.toLowerCase() === 'stt' || header.toLowerCase() === 'tt' ? 'w-[60px]' : 
                                          header.toLowerCase() === 'lớp' ? 'w-[80px]' :
                                          header.toLowerCase() === 'tháng' ? 'w-[120px]' :
                                          header.toLowerCase().includes('chủ đề') ? 'w-[220px]' :
                                          header.toLowerCase().includes('nội dung') ? (block.id === 'b5-7' ? 'w-[150px]' : 'w-[300px]') :
                                          header.toLowerCase().includes('thời gian') ? 'w-[350px]' :
                                          header.toLowerCase().includes('số lượng tiết học') ? 'w-[150px]' :
                                          header.toLowerCase().includes('phân phối') ? 'w-[180px]' :
                                          header.toLowerCase().includes('ghi chú') ? (block.id === 'b5-7' ? 'w-[300px]' : 'w-[150px]') :
                                          header.toLowerCase().includes('bài học') ? 'w-auto' :
                                          'min-w-[100px]'
                                        }`}
                                      >
                                        <div className="relative">
                                          <textarea 
                                            value={header}
                                            onChange={(e) => {
                                              const data = block.content as TableData;
                                              const newHeaders = [...data.headers];
                                              newHeaders[hIdx] = e.target.value;
                                              updateBlock(block.id, { content: { ...data, headers: newHeaders } });
                                            }}
                                            rows={1}
                                            className="bg-transparent border-none focus:ring-0 p-0 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-full text-center resize-none overflow-hidden min-h-[32px] leading-tight flex items-center justify-center pr-4"
                                            ref={(el) => {
                                              if (el) {
                                                el.style.height = 'auto';
                                                el.style.height = el.scrollHeight + 'px';
                                              }
                                            }}
                                            onInput={(e) => {
                                              const target = e.target as HTMLTextAreaElement;
                                              target.style.height = 'auto';
                                              target.style.height = target.scrollHeight + 'px';
                                            }}
                                          />
                                          <button 
                                            onClick={() => {
                                              const data = block.content as TableData;
                                              if (data.headers.length <= 1) return;
                                              const newHeaders = data.headers.filter((_, i) => i !== hIdx);
                                              const newRows = data.rows.map(row => row.filter((_, i) => i !== hIdx));
                                              updateBlock(block.id, { content: { headers: newHeaders, rows: newRows } });
                                            }}
                                            className="absolute -top-1 -right-1 text-slate-300 hover:text-rose-500 transition-all p-1"
                                            title="Xóa cột"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </th>
                                    ))}
                                    <th className="p-2 w-16 text-center border-l border-slate-300 bg-slate-50/50">
                                      <button 
                                        onClick={() => {
                                          const data = block.content as TableData;
                                          updateBlock(block.id, { content: {
                                            headers: [...data.headers, 'Cột mới'],
                                            rows: data.rows.map(row => [...row, ''])
                                          }});
                                        }}
                                        className="text-indigo-600 hover:scale-110 transition-all flex items-center justify-center w-full h-full min-h-[40px]"
                                        title="Thêm cột"
                                      >
                                        <Plus className="w-5 h-5" />
                                      </button>
                                    </th>
                                  </tr>
                                )}
                              </thead>
                              <tbody className="divide-y divide-slate-300">
                                {(block.content as TableData).rows.map((row, rIdx) => {
                                  const isFacilitiesTable = (block.content as TableData).headers.length === 4;
                                  const isTeacherTable = block.id === 'b3-7';
                                  const isTimelineTable = block.id === 'b5-7';
                                  
                                  // Logic to detect if a row should be bolded (main sections or info headers)
                                  let isBoldRow = false;
                                  if (isTeacherTable) {
                                    // In teacher table, bold main categories (not starting with -) and "Tổng"
                                    isBoldRow = row[0] !== '' && !row[0].startsWith('-') && !row[0].includes('.');
                                  } else if (isTimelineTable) {
                                    isBoldRow = false;
                                  } else {
                                    isBoldRow = (row[0] !== '' && !row[0].includes('.')) || 
                                               (row[0] === '' && row[1] !== '' && row[2] === '' && row[3] === '');
                                  }
                                  
                                  // Logic to detect if a row should be merged (only for 4-column tables like facilities)
                                  const isMergedRow = isFacilitiesTable && isBoldRow && row[2] === '' && row[3] === '';

                                  return (
                                    <tr key={rIdx} className={`group/tr transition-all duration-300 ${isBoldRow ? 'bg-slate-50/80 font-semibold' : 'hover:bg-indigo-50/30'}`}>
                                      {row.map((cell, cIdx) => {
                                        // If it's a merged row and we are at the second column, make it span
                                        if (isMergedRow && cIdx === 1) {
                                          return (
                                            <td key={cIdx} colSpan={3} className="p-4 border-r border-slate-200 last:border-r-0">
                                            <textarea 
                                              value={cell}
                                              onChange={(e) => {
                                                const data = block.content as TableData;
                                                const newRows = [...data.rows];
                                                newRows[rIdx] = [...newRows[rIdx]];
                                                newRows[rIdx][cIdx] = e.target.value;
                                                updateBlock(block.id, { content: { ...data, rows: newRows } });
                                              }}
                                              ref={(el) => {
                                                if (el) {
                                                  el.style.height = 'auto';
                                                  el.style.height = el.scrollHeight + 'px';
                                                }
                                              }}
                                              onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = 'auto';
                                                target.style.height = target.scrollHeight + 'px';
                                              }}
                                              className={`w-full bg-transparent border-none focus:ring-0 p-0 text-[13px] text-slate-700 font-bold resize-none overflow-hidden`}
                                            />
                                            </td>
                                          );
                                        }
                                        
                                        // Skip columns 2 and 3 if the row is merged
                                        if (isMergedRow && (cIdx === 2 || cIdx === 3)) return null;

                                        const headerText = (block.content as TableData).headers[cIdx]?.toLowerCase() || '';
                                        const isNumericCol = cIdx === 0 || 
                                                           headerText.includes('số lượng') || 
                                                           headerText.includes('phân phối') || 
                                                           headerText.includes('tiết') || 
                                                           headerText.includes('tt') ||
                                                           headerText === 'stt' ||
                                                           headerText === 'lớp';

                                        return (
                                          <td key={cIdx} className="p-4 border-r border-slate-200 last:border-r-0 align-top">
                                            <div className="relative w-full">
                                              {/* Mirror div for auto-growth and highlighting */}
                                              <div 
                                                className={`w-full p-0 text-[13px] whitespace-pre-wrap break-words invisible ${
                                                  isNumericCol ? 'text-center' : 'text-left'
                                                } ${isBoldRow ? 'font-semibold' : ''}`}
                                                aria-hidden="true"
                                              >
                                                {cell.toString() + '\n'}
                                              </div>

                                              {/* Highlight Layer */}
                                              <div 
                                                className={`absolute inset-0 p-0 text-[13px] whitespace-pre-wrap break-words pointer-events-none select-none ${
                                                  isNumericCol ? 'text-center' : 'text-left'
                                                } ${isBoldRow ? 'font-semibold' : ''}`}
                                                style={{ color: 'transparent', WebkitTextFillColor: 'transparent' }}
                                              >
                                                {cell.toString().split(/(\[.*?\])/g).map((part, i) => (
                                                  part.startsWith('[') && part.endsWith(']') ? (
                                                    <span key={i} className="bg-amber-100/80 px-1 rounded border border-amber-200/50 shadow-sm">
                                                      {part}
                                                    </span>
                                                  ) : (
                                                    <span key={i}>{part}</span>
                                                  )
                                                ))}
                                              </div>

                                              {/* Actual Textarea */}
                                              <textarea 
                                                value={cell}
                                                onChange={(e) => {
                                                  const data = block.content as TableData;
                                                  const newRows = [...data.rows];
                                                  newRows[rIdx] = [...newRows[rIdx]];
                                                  newRows[rIdx][cIdx] = e.target.value;
                                                  updateBlock(block.id, { content: { ...data, rows: newRows } });
                                                }}
                                                spellCheck="false"
                                                className={`absolute inset-0 w-full h-full bg-transparent border-none focus:ring-0 p-0 text-[13px] text-slate-700 resize-none overflow-hidden ${
                                                  isNumericCol ? 'text-center' : 'text-left'
                                                } ${isBoldRow ? 'font-semibold' : ''}`}
                                                style={{ 
                                                  caretColor: '#4f46e5',
                                                  outline: 'none',
                                                }}
                                              />
                                            </div>
                                          </td>
                                        );
                                      })}
                                      <td className="p-2 w-16 text-center border-l border-slate-200">
                                        <button 
                                          onClick={() => {
                                            const data = block.content as TableData;
                                            updateBlock(block.id, { content: { ...data, rows: data.rows.filter((_, i) => i !== rIdx) } });
                                          }}
                                          className="text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center w-full h-full min-h-[40px]"
                                          title="Xóa dòng"
                                        >
                                          <X className="w-5 h-5" />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <button 
                            onClick={() => {
                              const data = block.content as TableData;
                              updateBlock(block.id, { content: { ...data, rows: [...data.rows, new Array(data.headers.length).fill('')] } });
                            }}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Thêm dòng
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    );
  };

  const renderSummaryCard = () => {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Kế hoạch giáo dục nhà trường</h2>
                      <p className="text-indigo-100 font-medium">Năm học {adminInfo.schoolYear}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 border ${
                    status === 'published' ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30' :
                    ['waiting_principal', 'waiting_clerk'].includes(status) ? 'bg-amber-500/20 text-amber-100 border-amber-500/30' :
                    status === 'ready_to_submit' ? 'bg-blue-500/20 text-blue-100 border-blue-500/30' :
                    'bg-white/20 text-white border-white/30'
                  }`}>
                    {status === 'published' && <CheckCircle2 className="w-4 h-4" />}
                    {['waiting_principal', 'waiting_clerk'].includes(status) && <Clock className="w-4 h-4" />}
                    {status === 'ready_to_submit' && <Send className="w-4 h-4" />}
                    {status === 'draft' && <Edit3 className="w-4 h-4" />}
                    {status === 'published' ? 'Đã ban hành' : 
                     status === 'waiting_clerk' ? 'Chờ văn thư ký' : 
                     status === 'waiting_principal' ? 'Chờ BGH ký' : 
                     status === 'ready_to_submit' ? 'Chờ trình ký' : 'Bản nháp'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Trường</div>
                    <div className="font-semibold">{adminInfo.schoolName || 'Chưa cập nhật'}</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Người lập</div>
                    <div className="font-semibold">{adminInfo.principalName || 'Chưa cập nhật'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Hành động</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={async () => {
                    try {
                      setIsGeneratingPdf(true);
                      const { pdf } = await import('@react-pdf/renderer');
                      const blob = await pdf(<PlanPDFDocument adminInfo={adminInfo} stepBlocks={stepBlocks} STEPS={STEPS} />).toBlob();
                      const url = URL.createObjectURL(blob);
                      setPreviewUrl(url);
                      setIsPreviewModalOpen(true);
                    } catch (error) {
                      console.error('Error generating PDF preview:', error);
                      alert('Đã xảy ra lỗi khi tạo bản xem trước PDF.');
                    } finally {
                      setIsGeneratingPdf(false);
                    }
                  }}
                  disabled={isGeneratingPdf}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold transition-all group ${isGeneratingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                    {isGeneratingPdf ? (
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </div>
                  {isGeneratingPdf ? 'Đang tạo...' : 'Xem trước PDF'}
                </button>
                <button
                  onClick={async () => {
                    try {
                      const { pdf } = await import('@react-pdf/renderer');
                      const blob = await pdf(<PlanPDFDocument adminInfo={adminInfo} stepBlocks={stepBlocks} STEPS={STEPS} />).toBlob();
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `Ke-hoach-giao-duc-${adminInfo.schoolYear || 'nam-hoc'}.pdf`;
                      link.click();
                      URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Error generating PDF:', error);
                      alert('Đã xảy ra lỗi khi tạo PDF.');
                    }
                  }}
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                    <Download className="w-5 h-5" />
                  </div>
                  Tải xuống PDF
                </button>
                
                {status === 'ready_to_submit' && (
                  <>
                    <button 
                      onClick={() => setStatus('waiting_principal')}
                      className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-all group col-span-2"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-200/50 flex items-center justify-center transition-colors">
                        <Send className="w-5 h-5" />
                      </div>
                      Trình ký kế hoạch
                    </button>
                    <button 
                      onClick={() => {
                        setIsCompleted(false);
                        setStatus('draft');
                      }}
                      className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-600 font-bold transition-all group col-span-2"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center transition-colors">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      Tiếp tục chỉnh sửa
                    </button>
                  </>
                )}
                {status === 'waiting_principal' && (
                  <button 
                    onClick={() => setStatus('waiting_clerk')}
                    className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-all group col-span-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-200/50 flex items-center justify-center transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    Xác nhận BGH đã ký
                  </button>
                )}
                {status === 'waiting_clerk' && (
                  <button 
                    onClick={() => setStatus('published')}
                    className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-all group col-span-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-200/50 flex items-center justify-center transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    Xác nhận Văn thư đã ký
                  </button>
                )}
              </div>

              {/* Status Timeline */}
              <div className="mt-12">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Trạng thái</h3>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
                  
                  <div className="relative flex items-start gap-6 mb-8">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center relative z-10 shadow-sm">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="pt-3">
                      <h4 className="font-bold text-slate-800">Bản nháp</h4>
                      <p className="text-sm text-slate-500 mt-1">Kế hoạch đang được soạn thảo.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-6 mb-8">
                    <div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center relative z-10 shadow-sm ${
                      ['waiting_principal', 'waiting_clerk', 'published'].includes(status) ? 'bg-emerald-100' : 
                      status === 'ready_to_submit' ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      {['waiting_principal', 'waiting_clerk', 'published'].includes(status) ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : status === 'ready_to_submit' ? (
                        <Clock className="w-6 h-6 text-blue-600" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="pt-3">
                      <h4 className={`font-bold ${
                        ['waiting_principal', 'waiting_clerk', 'published'].includes(status) ? 'text-slate-800' : 
                        status === 'ready_to_submit' ? 'text-blue-800' : 'text-slate-400'
                      }`}>Chờ trình ký</h4>
                      <p className="text-sm text-slate-500 mt-1">Kế hoạch đã soạn xong, sẵn sàng trình ký.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-6 mb-8">
                    <div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center relative z-10 shadow-sm ${
                      ['waiting_clerk', 'published'].includes(status) ? 'bg-emerald-100' : 
                      status === 'waiting_principal' ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      {['waiting_clerk', 'published'].includes(status) ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : status === 'waiting_principal' ? (
                        <Clock className="w-6 h-6 text-blue-600" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="pt-3">
                      <h4 className={`font-bold ${
                        ['waiting_clerk', 'published'].includes(status) ? 'text-slate-800' : 
                        status === 'waiting_principal' ? 'text-blue-800' : 'text-slate-400'
                      }`}>Chờ BGH ký</h4>
                      <p className="text-sm text-slate-500 mt-1">Đã trình ký, đang chờ Ban Giám Hiệu phê duyệt.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-6 mb-8">
                    <div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center relative z-10 shadow-sm ${
                      status === 'published' ? 'bg-emerald-100' : 
                      status === 'waiting_clerk' ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      {status === 'published' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : status === 'waiting_clerk' ? (
                        <Clock className="w-6 h-6 text-blue-600" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="pt-3">
                      <h4 className={`font-bold ${
                        status === 'published' ? 'text-slate-800' : 
                        status === 'waiting_clerk' ? 'text-blue-800' : 'text-slate-400'
                      }`}>Chờ văn thư ký</h4>
                      <p className="text-sm text-slate-500 mt-1">BGH đã ký, chờ văn thư đóng dấu và ký nháy.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center relative z-10 shadow-sm ${
                      status === 'published' ? 'bg-emerald-100' : 'bg-slate-100'
                    }`}>
                      {status === 'published' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="pt-3">
                      <h4 className={`font-bold ${status === 'published' ? 'text-slate-800' : 'text-slate-400'}`}>Đã ban hành</h4>
                      <p className="text-sm text-slate-500 mt-1">Kế hoạch đã được ban hành chính thức.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Header for Summary View */}
        <div className="bg-white border-b border-slate-200 p-6 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCompleted(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Tổng quan kế hoạch</h2>
                <p className="text-xs font-bold text-slate-400">Xem lại và trình ký kế hoạch giáo dục</p>
              </div>
            </div>
          </div>
        </div>
        {renderSummaryCard()}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
      {/* Stepper Header */}
      <div className="bg-white border-b border-slate-200 p-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Quy trình soạn thảo kế hoạch</h2>
              <p className="text-xs font-bold text-slate-400">Hoàn thành từng bước để có bản kế hoạch chuẩn nhất</p>
            </div>
            <div className="flex gap-3">
              <button 
                className="px-6 py-2.5 bg-white border-2 border-indigo-100 text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center gap-2"
                onClick={() => setIsAssignModalOpen(true)}
              >
                <Users className="w-5 h-5" /> Phân công người thực hiện
              </button>
              <button 
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                onClick={() => alert('Đã lưu bản nháp kế hoạch!')}
              >
                <Save className="w-5 h-5" /> Lưu nháp
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between relative px-4">
            {/* Progress Line Background */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 rounded-full -z-0" />
            {/* Active Progress Line - More vibrant blue */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              className="absolute top-5 left-8 h-1 bg-blue-600 transition-all duration-500 -z-0 shadow-[0_0_8px_rgba(37,99,235,0.3)]" 
            />

            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className="relative flex flex-col items-center group z-10"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  currentStep === step.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-110' 
                    : currentStep > step.id 
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}>
                  {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : step.id}
                </div>
                <span className={`mt-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  currentStep === step.id ? 'text-blue-700' : 'text-slate-500'
                }`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Toolbox - Only visible for steps 2-7 */}
        <AnimatePresence>
          {currentStep > 1 && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isSidebarCollapsed ? 80 : 280, opacity: 1 }}
              className="bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-hidden relative"
            >
              {/* Toggle Button */}
              <motion.button 
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    "0 0 15px 2px rgba(37, 99, 235, 0.4)",
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-14 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center z-50 transition-colors hover:bg-blue-700"
              >
                {isSidebarCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
              </motion.button>

              <div className="p-6 flex flex-col gap-6 h-full">
                {!isSidebarCollapsed && (
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thành phần nội dung</h3>
                )}
                
                <div className={`grid gap-4 ${isSidebarCollapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {TOOLBOX_ITEMS.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => addBlock(item.type as BlockType)}
                      title={item.label}
                      className={`flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-white hover:shadow-lg hover:shadow-blue-50 transition-all group ${
                        isSidebarCollapsed ? 'p-3' : 'p-4'
                      }`}
                    >
                      <item.icon className={`text-slate-400 group-hover:text-blue-600 ${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5 mb-2'}`} />
                      {!isSidebarCollapsed && (
                        <span className="text-[10px] font-bold text-slate-700 uppercase">{item.label}</span>
                      )}
                    </button>
                  ))}
                </div>

                {!isSidebarCollapsed && (
                  <div className="mt-auto p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 leading-relaxed">
                      Mẹo: Bạn có thể thêm nhiều khối nội dung khác nhau để làm phong phú cho mục này.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Viewport */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 ? renderStep1() : renderBlocks()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-slate-200 p-6 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              currentStep === 1 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-5 h-5" /> Quay lại
          </button>

          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Bước {currentStep} / {STEPS.length}
          </div>

          {currentStep < STEPS.length ? (
            <button
              onClick={() => setCurrentStep(Math.min(STEPS.length, currentStep + 1))}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              Tiếp theo <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setIsCompleted(true);
                if (status === 'draft') {
                  setStatus('ready_to_submit');
                }
              }}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
            >
              Hoàn tất <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Xem trước Kế hoạch</h3>
                  <p className="text-sm text-slate-500">Bản xem trước nội dung sẽ xuất ra PDF</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                  }
                }}
                className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 bg-slate-200/50 p-4">
              <iframe 
                src={`${previewUrl}#toolbar=0`} 
                className="w-full h-full rounded-2xl border-0 shadow-inner bg-white" 
                title="PDF Preview" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      <AnimatePresence>
        {isCompleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Hoàn tất kế hoạch!</h3>
                <p className="text-slate-500 mb-8">
                  Kế hoạch giáo dục nhà trường đã được soạn thảo thành công. Bạn có thể tải xuống hoặc chia sẻ tài liệu này.
                </p>
                <div className="space-y-3">
                  <PDFDownloadLink
                    document={<PlanPDFDocument adminInfo={adminInfo} stepBlocks={stepBlocks} STEPS={STEPS} />}
                    fileName={`Ke-hoach-giao-duc-${adminInfo.schoolYear || 'nam-hoc'}.pdf`}
                    className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" /> Tải xuống PDF
                  </PDFDownloadLink>
                  <button 
                    onClick={() => setIsCompleteModalOpen(false)}
                    className="w-full py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Assign Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Phân công người thực hiện</h3>
                <p className="text-slate-500 mb-6 text-sm">
                  Trong trường hợp Ban giám hiệu bận lịch làm việc, có thể phân công người phụ trách soạn thảo. Ban giám hiệu sẽ rà soát lại và ký duyệt sau.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Người được phân công</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                    >
                      <option value="">Chọn cán bộ/giáo viên...</option>
                      <option value="nguyen_van_a">Nguyễn Văn A - Tổ trưởng Tổ Tự nhiên</option>
                      <option value="tran_thi_b">Trần Thị B - Tổ trưởng Tổ Xã hội</option>
                      <option value="le_van_c">Lê Văn C - Giáo viên</option>
                      <option value="pham_van_d">Phạm Văn D - Giáo viên</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ghi chú thêm (Tùy chọn)</label>
                    <textarea 
                      placeholder="Nhập ghi chú cho người được phân công..." 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none h-24"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsAssignModalOpen(false)}
                    className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={() => {
                      alert('Đã gửi thông báo phân công!');
                      setIsAssignModalOpen(false);
                    }}
                    className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Gửi phân công
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
