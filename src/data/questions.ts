import { Question } from '../types/game';

export const ORIGINAL_QUESTIONS: Question[] = [
  {
    id: "01",
    question: "Người lạ mời cốc đã rót sẵn. Em biết chắc điều nào?",
    options: {
      A: "Cốc chứa ma túy",
      B: "Cốc đã rót sẵn",
      C: "Người đó phạm pháp",
      D: "Cốc an toàn"
    },
    answer: "B",
    rationale: "Dữ kiện nhìn thấy; chưa thể xác định thành phần.",
    levelLabel: "Căn bản",
    aiHint: "Hãy quan sát thật kỹ: Chúng ta chỉ biết rõ điều gì đang hiển hiện trước mắt bằng giác quan trực tiếp. Chưa có kiểm nghiệm khoa học thì chưa thể gán nhãn thành phần hay phán xét pháp lý."
  },
  {
    id: "02",
    question: "Với cốc trên, cách đầu tiên phù hợp nhất?",
    options: {
      A: "Uống thử một ngụm",
      B: "Nhận rồi bỏ",
      C: "Từ chối và rời đi",
      D: "Hỏi giá"
    },
    answer: "C",
    rationale: "Không cần thử để quyết định an toàn.",
    levelLabel: "Căn bản",
    aiHint: "Nguyên tắc bảo vệ bản thân số 1: An toàn là trên hết. Không nể nang, không thử nghiệm mạo hiểm. Một lời từ chối lịch sự dứt khoát kèm theo hành động rời khỏi khu vực đó là tối ưu."
  },
  {
    id: "03",
    question: "Bạn rủ dùng thứ “giúp tỉnh táo” và nói ai cũng thử. Điều gì là sức ép?",
    options: {
      A: "“Ai cũng thử”",
      B: "Giờ học",
      C: "Màu sản phẩm",
      D: "Tên bạn"
    },
    answer: "A",
    rationale: "Sức ép số đông không làm rõ nguồn gốc.",
    levelLabel: "Căn bản",
    aiHint: "Đây là chiêu bài tâm lý 'hiệu ứng bầy đàn' (áp lực bạn bè). Câu nói nhằm làm em sợ bị cô lập, nhưng số đông thử không đồng nghĩa với an toàn hay hợp pháp."
  },
  {
    id: "04",
    question: "Câu từ chối nào rõ và có hành động tiếp theo?",
    options: {
      A: "“Để sau”",
      B: "“Cho xem đã”",
      C: "“Chắc không sao”",
      D: "“Mình không thử. Mình đi gặp cô.”"
    },
    answer: "D",
    rationale: "Nói không rõ ràng, gắn với lối ra.",
    levelLabel: "Quan trọng",
    aiHint: "Từ chối hiệu quả cần 2 vế: (1) Khẳng định 'KHÔNG' rõ ràng, không nước đôi để đối phương không thể nài ép; (2) Hành động chuyển hướng ngay lập tức đến khu vực an toàn."
  },
  {
    id: "05",
    question: "Bạn thân nhờ giữ gói kín. Em nên làm gì?",
    options: {
      A: "Nhận vì bạn thân",
      B: "Mở ra xem",
      C: "Không nhận và rời đi",
      D: "Giấu vào cặp"
    },
    answer: "C",
    rationale: "Không biết rõ thì không cầm giữ hay tự kiểm tra.",
    levelLabel: "Mốc An Toàn 1 ⭐",
    aiHint: "Pháp luật và an toàn cá nhân: Việc cầm giữ đồ vật không rõ nguồn gốc có thể biến em thành người liên quan đến hành vi vi phạm pháp luật. Không kiểm tra, không giữ hộ!"
  },
  {
    id: "06",
    question: "Bạn nói “Không giữ hộ là không tin mình”. Em đáp thế nào?",
    options: {
      A: "Nhận để giữ tình bạn",
      B: "“Mình quý bạn nhưng không giữ đồ không rõ”",
      C: "Chụp gói đăng nhóm",
      D: "Im lặng cầm gói"
    },
    answer: "B",
    rationale: "Từ chối việc giữ hộ, không quy kết bạn.",
    levelLabel: "Trung cấp",
    aiHint: "Tách bạch rõ giữa cảm xúc tình bạn và ranh giới an toàn. Chúng ta tôn trọng bạn nhưng kiên quyết từ chối hành động rủi ro, đồng thời không công kích cá nhân bạn."
  },
  {
    id: "07",
    question: "Bạn nhắn đang bị rủ thử thứ lạ và xin giữ kín. Cách hỗ trợ?",
    options: {
      A: "Hứa không kể với ai",
      B: "Gửi tin nhắn cho cả lớp",
      C: "Lắng nghe và cùng tìm người lớn tin cậy",
      D: "Đi tìm người rủ để chất vấn"
    },
    answer: "C",
    rationale: "An toàn của bạn cần người có trách nhiệm.",
    levelLabel: "Trung cấp",
    aiHint: "Giữ bí mật khi bạn đang đứng trước nguy cơ tổn hại sức khỏe không phải là giúp bạn. Trẻ em chưa có đủ thẩm quyền xử lý, cần đưa vụ việc đến người lớn có trách nhiệm."
  },
  {
    id: "08",
    question: "Điều nào là suy đoán, chưa phải dữ kiện?",
    options: {
      A: "Bạn nói “giữ hộ”",
      B: "Gói có vỏ kín",
      C: "Lời nhắn lúc 15 giờ",
      D: "“Bạn chắc chắn bán ma túy”"
    },
    answer: "D",
    rationale: "Lời kết luận thiếu chứng cứ.",
    levelLabel: "Tư duy phản biện",
    aiHint: "Phân biệt dữ kiện (Fact) và suy đoán (Inference). Dữ kiện là thời gian, hình dáng, lời nói có thật. Kết luận về tội danh khi chưa có cơ quan chức năng điều tra chỉ là suy đoán cảm tính."
  },
  {
    id: "09",
    question: "Bạn báo không khỏe sau khi dùng thứ chưa rõ. Ưu tiên?",
    options: {
      A: "Chờ tự khỏi",
      B: "Tìm người lớn và hỗ trợ y tế ngay",
      C: "Cho dùng thêm nước lạ",
      D: "Quay video"
    },
    answer: "B",
    rationale: "Không tự chẩn đoán hoặc tự chữa.",
    levelLabel: "Khẩn cấp y tế",
    aiHint: "Tính mạng và sức khỏe là ưu tiên cấp bách nhất. Tuyệt đối không cho uống thuốc bừa bãi hay chờ đợi làm mất thời gian vàng cấp cứu y tế."
  },
  {
    id: "10",
    question: "Ở chỗ nhóm đang ép, em có thể rời an toàn. Cách làm?",
    options: {
      A: "Ở lại tranh cãi",
      B: "Giữ đồ họ đưa",
      C: "Nói không, rời đến người lớn",
      D: "Thử để hết bị trêu"
    },
    answer: "C",
    rationale: "Lời từ chối đi cùng bước chân rời đi.",
    levelLabel: "Mốc An Toàn 2 ⭐",
    aiHint: "Khi còn có lối thoát an toàn, tranh cãi chỉ làm tăng nguy cơ kích động đối phương. Quyết đoán bước đi về phía có thầy cô, bảo vệ hoặc đám đông an toàn."
  },
  {
    id: "11",
    question: "Không thể rời ngay vì bị chặn lối. Em ưu tiên gì?",
    options: {
      A: "Giằng co lấy đồ",
      B: "Giữ bình tĩnh, gọi người lớn/hỗ trợ từ chỗ an toàn",
      C: "Chấp nhận dùng thử",
      D: "Một mình điều tra"
    },
    answer: "B",
    rationale: "Tránh đối đầu; tìm hỗ trợ phù hợp hoàn cảnh.",
    levelLabel: "Kỹ năng tự vệ",
    aiHint: "Khi bị bao vây hoặc chặn đường, giằng co vật lý dễ dẫn đến chấn thương. Cần giữ bình tĩnh tối đa, quan sát cơ hội phát tín hiệu cầu cứu người lớn."
  },
  {
    id: "12",
    question: "Thấy vật lạ trong lớp, vài bạn định mở. Em làm gì?",
    options: {
      A: "Mở để kiểm tra",
      B: "Mang về",
      C: "Giữ khoảng cách, báo giáo viên/người trực",
      D: "Đăng ảnh kèm tên bạn nghi ngờ"
    },
    answer: "C",
    rationale: "Không chạm hoặc tự xác định vật phẩm.",
    levelLabel: "Xử lý hiện trường",
    aiHint: "Vật thể lạ có thể chứa chất độc, chất cấm hoặc hóa chất nguy hiểm. Giữ nguyên hiện trường, ngăn các bạn tò mò và báo ngay thầy cô quản nhiệm."
  },
  {
    id: "13",
    question: "Lời báo nào chỉ gồm thông tin em biết?",
    options: {
      A: "“Bạn M bán ma túy”",
      B: "“Em thấy gói không rõ chủ ở góc lớp lúc ra chơi”",
      C: "“Chắc cả nhóm phạm luật”",
      D: "“Em đoán chất ấy nguy hiểm”"
    },
    answer: "B",
    rationale: "Báo thời gian, nơi thấy và dữ kiện trực tiếp.",
    levelLabel: "Kỹ năng báo tin",
    aiHint: "Kỹ năng khai báo thông tin trung thực: Nêu rõ Thời gian, Địa điểm, Hành động quan sát thấy. Không thêm thắt định kiến hoặc phỏng đoán cá nhân."
  },
  {
    id: "14",
    question: "Giáo viên em định tìm vắng mặt. Em làm gì?",
    options: {
      A: "Bỏ qua",
      B: "Tự xử lý",
      C: "Đăng lên mạng",
      D: "Tìm giáo viên khác, người trực hoặc người chăm sóc"
    },
    answer: "D",
    rationale: "Luôn có phương án tìm người lớn thay thế.",
    levelLabel: "Bản lĩnh kiên trì",
    aiHint: "An toàn là trách nhiệm của toàn bộ hệ thống nhà trường. Nếu cô chủ nhiệm vắng mặt, luôn có thầy cô trực ban, nhân viên y tế, bác bảo vệ hoặc Ban Giám hiệu sẵn sàng trợ giúp."
  },
  {
    id: "15",
    question: "Chưa biết vật đó có phải ma túy. Kết luận nào đúng?",
    options: {
      A: "Phải xác định chất trước mới được từ chối",
      B: "Có thể thử cho biết",
      C: "Vẫn có thể từ chối, rời đi, tìm trợ giúp và báo tin",
      D: "Có thể gán nhãn người đưa"
    },
    answer: "C",
    rationale: "Quyết định an toàn không cần khẳng định thành phần.",
    levelLabel: "ĐỈNH CAO BẢN LĨNH 👑",
    aiHint: "ĐỈNH CAO BẢN LĨNH: Em không cần phải là chuyên gia giám định hóa học để tự bảo vệ mình! Chỉ cần một dấu hiệu bất thường, em hoàn toàn có quyền TỪ CHỐI, RỜI ĐI và BÁO TIN."
  }
];

export const BACKUP_QUESTIONS: Question[] = [
  {
    id: "B1",
    question: "Khi đối mặt tình huống nghi ngờ bị ép buộc dùng chất lạ, số điện thoại trợ giúp bảo vệ trẻ em khẩn cấp là gì?",
    options: {
      A: "111 (Tổng đài Quốc gia Bảo vệ Trẻ em)",
      B: "118",
      C: "Không có số nào",
      D: "1080"
    },
    answer: "A",
    rationale: "Tổng đài 111 trực 24/7 bảo vệ và can thiệp cho trẻ em.",
    levelLabel: "Đổi câu hỏi",
    aiHint: "111 là đường dây nóng miễn phí, luôn sẵn sàng đồng hành hỗ trợ mọi học sinh trên toàn quốc."
  }
];

export const TEN_SELECTED_INDICES = [0, 1, 2, 3, 4, 6, 7, 9, 12, 14];

export const REWARDS_10 = [
  "100 Điểm",
  "200 Điểm",
  "300 Điểm",
  "400 Điểm",
  "500 Điểm", // Milestone 1 (Q5)
  "600 Điểm",
  "700 Điểm",
  "800 Điểm",
  "900 Điểm",
  "1.000 Điểm" // Goal (Q10)
];

export const REWARDS_15 = [
  "100 Điểm",
  "200 Điểm",
  "300 Điểm",
  "400 Điểm",
  "500 Điểm", // Milestone 1 (Q5)
  "600 Điểm",
  "700 Điểm",
  "800 Điểm",
  "900 Điểm",
  "1.000 Điểm", // Milestone 2 (Q10)
  "1.100 Điểm",
  "1.200 Điểm",
  "1.300 Điểm",
  "1.400 Điểm",
  "1.500 Điểm"  // Final Goal (Q15)
];

export const PRAISE_LIST = [
  "🌟 Xuất sắc! Nhận diện dữ kiện vô cùng sắc bén và tỉnh táo!",
  "👏 Quá tuyệt vời! Lập luận chuẩn mực, bản lĩnh vững vàng trước tình huống!",
  "🎯 Chính xác 100%! Em có tư duy phân tích cực kỳ nhạy bén!",
  "🔥 Rất ấn tượng! Tự tin đưa ra quyết định an toàn chuẩn không cần chỉnh!",
  "⭐ Đỉnh cao bản lĩnh! Cả trường quay cùng vỗ tay khen ngợi em!",
  "🏆 Tuyệt đỉnh thông minh! Giữ vững lập trường, không để bị dẫn dụ!"
];

export const ENCOURAGEMENT_LIST = [
  "💪 Đừng nản lòng nhé! Sai sót hôm nay là bài học vàng giúp em vững vàng hơn ngoài đời thật.",
  "🌱 Không sao cả! Dám giơ tay và thử sức đã là sự dũng cảm rất đáng khen ngợi rồi!",
  "✨ Hãy vững tin lên! Ghi nhớ quy tắc này để luôn là người làm chủ sự an toàn của chính mình nhé!",
  "🛡️ Thêm một kinh nghiệm quý giá! Thầy cô và bạn bè luôn đồng hành cùng em trong từng thử thách!",
  "💡 Một cơ hội tuyệt vời để nhớ sâu hơn! Lần sau chắc chắn em sẽ nhận diện chuẩn xác!"
];
