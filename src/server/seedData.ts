// ============================================================================
// TOEIC MASTER AI - Verified Seed Data
// Contains exact specs from Section 4.3 (POSTPONE, AVAILABLE, REDUCE),
// rich vocab from TOEIC-001 to TOEIC-005, Tips for Parts 1-7, and Exam Bank.
// ============================================================================

import { TOEIC_138_VOCABULARY } from './toeic138Vocab';

export interface LexicalRelation {
  id: string;
  targetPhrase: string;
  relationType: 'synonym' | 'antonym' | 'paraphrase' | 'collocation' | 'word_family';
  context: string;
  usageLevel: 'Cao' | 'Trung bình' | 'Thấp';
  priority: 'Priority 1' | 'Priority 2' | 'Priority 3';
  supportingExample: string;
  supportingExampleVi?: string;
  interchangeability: 'exact' | 'near' | 'conditional' | 'none';
  verificationStatus: 'verified' | 'context-dependent' | 'needs_review';
}

export interface VocabularyItem {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: 'verb' | 'noun' | 'adjective' | 'adverb' | 'phrase' | 'preposition';
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  priorityLevel: 'Priority 1' | 'Priority 2' | 'Priority 3';
  definitionVi: string;
  definitionEn: string;
  definitions?: Array<{ vi: string; en: string }>;
  exampleEn: string;
  exampleVi: string;
  examples?: Array<{ en: string; vi: string }>;
  senses?: Array<{
    meaningVi: string;
    meaningEn?: string;
    priority?: number;
    examples?: Array<{ en: string; vi: string }>;
    synonyms?: Array<{
      word: string;
      meaningVi: string;
      priority?: number;
      examples?: Array<{ en: string; vi: string }>;
    }>;
    antonyms?: Array<{
      word: string;
      meaningVi: string;
      priority?: number;
      examples?: Array<{ en: string; vi: string }>;
    }>;
  }>;
  topic: string;
  toeicPart: string;
  sourceDoc: string;
  sourcePage?: number;
  synonyms: LexicalRelation[];
  antonyms: LexicalRelation[];
  collocations: string[];
  wordFamily: {
    noun?: string;
    verb?: string;
    adjective?: string;
    adverb?: string;
  };
  contextNotes?: string;
  paraphraseExamples?: Array<{
    original: string;
    paraphrased: string;
    vietnamese: string;
  }>;
}

// ----------------------------------------------------------------------------
// MANDATORY VOCABULARY SEEDS (SECTION 4.3 + TOEIC-003, 004, 005)
// ----------------------------------------------------------------------------
const BASE_MANDATORY_VOCABULARY: VocabularyItem[] = [
  // FLASHCARD 01 - POSTPONE (MANDATORY SAMPLE 1)
  {
    id: "vocab-postpone",
    word: "POSTPONE",
    ipa: "/pəˈspoʊn/",
    partOfSpeech: "verb",
    cefrLevel: "B2",
    priorityLevel: "Priority 1",
    definitionVi: "Trì hoãn, hoãn lại.",
    definitionEn: "To delay an event and plan or decide that it should happen at a later date or time.",
    definitions: [
      { vi: "Trì hoãn, hoãn lại.", en: "To delay an event and plan or decide that it should happen at a later date or time." },
      { vi: "Hoãn thanh toán.", en: "To delay a payment." },
      { vi: "Dời lịch.", en: "To reschedule to a later time." }
    ],
    exampleEn: "The company decided to postpone the meeting until Friday.",
    exampleVi: "Công ty quyết định hoãn cuộc họp đến thứ Sáu.",
    examples: [
      {
        en: "The company decided to postpone the meeting until Friday.",
        vi: "Công ty quyết định hoãn cuộc họp đến thứ Sáu."
      },
      {
        en: "We had to postpone the product launch because promotional materials were delayed.",
        vi: "Chúng tôi đã phải hoãn việc ra mắt sản phẩm vì tài liệu quảng bá bị chậm trễ."
      },
      {
        en: "Please do not postpone submitting your expense report past the end of the month.",
        vi: "Vui lòng không trì hoãn việc nộp báo cáo chi phí quá ngày cuối tháng."
      }
    ],
    senses: [
      {
        meaningVi: "Hoãn, trì hoãn.",
        meaningEn: "To delay an event and plan or decide that it should happen at a later date or time.",
        priority: 1,
        examples: [
          {
            en: "The company decided to postpone the meeting until Friday.",
            vi: "Công ty quyết định hoãn cuộc họp đến thứ Sáu."
          }
        ],
        synonyms: [
          {
            word: "Delay",
            meaningVi: "Trì hoãn",
            priority: 1,
            examples: [
              {
                en: "The airline delayed the flight due to bad weather.",
                vi: "Hãng hàng không đã hoãn chuyến bay do thời tiết xấu."
              }
            ]
          },
          {
            word: "Put off",
            meaningVi: "Hoãn lại",
            priority: 2,
            examples: [
              {
                en: "The manager put off the training session until next week.",
                vi: "Người quản lý đã hoãn buổi đào tạo đến tuần sau."
              }
            ]
          },
          {
            word: "Defer",
            meaningVi: "Trì hoãn đến thời điểm sau",
            priority: 3,
            examples: [
              {
                en: "The committee deferred its decision.",
                vi: "Ủy ban đã hoãn quyết định của mình."
              }
            ]
          }
        ],
        antonyms: [
          {
            word: "Advance",
            meaningVi: "Đẩy lịch lên sớm hơn",
            priority: 1,
            examples: [
              {
                en: "The company advanced the meeting to Monday.",
                vi: "Công ty đã chuyển lịch họp lên thứ Hai."
              }
            ]
          },
          {
            word: "Bring forward",
            meaningVi: "Dời lên thời điểm sớm hơn",
            priority: 2,
            examples: [
              {
                en: "The director brought forward the deadline.",
                vi: "Giám đốc đã dời hạn chót lên sớm hơn."
              }
            ]
          }
        ]
      }
    ],
    topic: "Meetings & Schedules",
    toeicPart: "Part 3, 4, 7",
    sourceDoc: "TOEIC-004",
    sourcePage: 12,
    contextNotes: "Các từ chỉ thay thế cho nhau khi phù hợp với cấu trúc câu và ngữ cảnh lịch trình, sự kiện hoặc cuộc họp.",
    synonyms: [
      {
        id: "rel-postpone-syn-1",
        targetPhrase: "Delay",
        relationType: "synonym",
        context: "Trì hoãn",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "The airline delayed the flight due to bad weather.",
        supportingExampleVi: "Hãng hàng không đã hoãn chuyến bay do thời tiết xấu.",
        interchangeability: "near",
        verificationStatus: "verified"
      },
      {
        id: "rel-postpone-syn-2",
        targetPhrase: "Put off",
        relationType: "synonym",
        context: "Hoãn lại",
        usageLevel: "Trung bình",
        priority: "Priority 2",
        supportingExample: "The manager put off the training session until next week.",
        supportingExampleVi: "Người quản lý đã hoãn buổi đào tạo đến tuần sau.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      },
      {
        id: "rel-postpone-syn-3",
        targetPhrase: "Defer",
        relationType: "synonym",
        context: "Trì hoãn đến thời điểm sau",
        usageLevel: "Trung bình",
        priority: "Priority 3",
        supportingExample: "The committee deferred its decision.",
        supportingExampleVi: "Ủy ban đã hoãn quyết định của mình.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      }
    ],
    antonyms: [
      {
        id: "rel-postpone-ant-1",
        targetPhrase: "Advance",
        relationType: "antonym",
        context: "Đẩy lịch lên sớm hơn",
        usageLevel: "Trung bình",
        priority: "Priority 1",
        supportingExample: "The company advanced the meeting to Monday.",
        supportingExampleVi: "Công ty đã chuyển lịch họp lên thứ Hai.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      },
      {
        id: "rel-postpone-ant-2",
        targetPhrase: "Bring forward",
        relationType: "antonym",
        context: "Dời lên thời điểm sớm hơn",
        usageLevel: "Trung bình",
        priority: "Priority 2",
        supportingExample: "The director brought forward the deadline.",
        supportingExampleVi: "Giám đốc đã dời hạn chót lên sớm hơn.",
        interchangeability: "exact",
        verificationStatus: "verified"
      }
    ],
    paraphraseExamples: [
      {
        original: "The meeting was delayed.",
        paraphrased: "The meeting was postponed.",
        vietnamese: "Cuộc họp bị hoãn."
      },
      {
        original: "We put off the meeting.",
        paraphrased: "We postponed the meeting.",
        vietnamese: "Chúng tôi hoãn cuộc họp."
      },
      {
        original: "The meeting was brought forward.",
        paraphrased: "The meeting was rescheduled to an earlier time.",
        vietnamese: "Cuộc họp được dời lên sớm hơn."
      }
    ],
    collocations: ["postpone a meeting", "postpone indefinitely", "postpone until further notice"],
    wordFamily: {
      verb: "postpone",
      noun: "postponement"
    }
  },

  // FLASHCARD 02 - AVAILABLE (MANDATORY SAMPLE 2)
  {
    id: "vocab-available",
    word: "AVAILABLE",
    ipa: "/əˈveɪ.lə.bəl/",
    partOfSpeech: "adjective",
    cefrLevel: "A2",
    priorityLevel: "Priority 1",
    definitionVi: "Có sẵn, có thể sử dụng được.",
    definitionEn: "Able to be bought, used, or reached; not busy.",
    exampleEn: "The printer is available in our store.",
    exampleVi: "Máy in hiện có sẵn tại cửa hàng.",
    examples: [
      {
        en: "The replacement parts are readily available in our central warehouse.",
        vi: "Các bộ phận thay thế luôn có sẵn tại nhà kho trung tâm của chúng tôi."
      },
      {
        en: "The head of human resources will be available for consultations on Monday morning.",
        vi: "Trưởng phòng nhân sự sẽ có mặt để tư vấn vào sáng thứ Hai."
      },
      {
        en: "Discounted airline tickets are available exclusively to club members.",
        vi: "Vé máy bay giảm giá chỉ dành riêng cho các thành viên câu lạc bộ."
      }
    ],
    topic: "Purchase & Inventory",
    toeicPart: "Part 3, 5, 7",
    sourceDoc: "TOEIC-003",
    sourcePage: 4,
    contextNotes: "'Available' còn có nghĩa là rảnh hoặc có thể tham gia. Các từ như 'in stock' không phù hợp khi nói về lịch của nhân viên.",
    synonyms: [
      {
        id: "rel-available-syn-1",
        targetPhrase: "In stock",
        relationType: "synonym",
        context: "Còn hàng trong kho hàng hóa",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "All replacement toner cartridges are in stock.",
        supportingExampleVi: "Tất cả các hộp mực thay thế đều còn hàng.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      },
      {
        id: "rel-available-syn-2",
        targetPhrase: "On hand",
        relationType: "synonym",
        context: "Có sẵn ngay tại chỗ để sử dụng hoặc cung cấp",
        usageLevel: "Trung bình",
        priority: "Priority 2",
        supportingExample: "We have enough brochures on hand for the seminar.",
        supportingExampleVi: "Chúng tôi có sẵn đủ tài liệu quảng cáo tại chỗ cho hội thảo.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      },
      {
        id: "rel-available-syn-3",
        targetPhrase: "Obtainable",
        relationType: "synonym",
        context: "Có thể tìm mua hoặc tiếp cận được sau một quy trình",
        usageLevel: "Thấp",
        priority: "Priority 3",
        supportingExample: "Permits are obtainable at the local council office.",
        supportingExampleVi: "Giấy phép có thể xin được tại văn phòng hội đồng địa phương.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      }
    ],
    antonyms: [
      {
        id: "rel-available-ant-1",
        targetPhrase: "Unavailable",
        relationType: "antonym",
        context: "Không có sẵn hoặc bận không thể liên hệ",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "The manager is currently unavailable for calls.",
        supportingExampleVi: "Người quản lý hiện không thể nhận cuộc gọi.",
        interchangeability: "exact",
        verificationStatus: "verified"
      },
      {
        id: "rel-available-ant-2",
        targetPhrase: "Out of stock",
        relationType: "antonym",
        context: "Hết hàng trong kho (ngữ cảnh hàng hóa)",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "The requested wireless keyboard is out of stock.",
        supportingExampleVi: "Bàn phím không dây được yêu cầu hiện đã hết hàng.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      },
      {
        id: "rel-available-ant-3",
        targetPhrase: "Sold out",
        relationType: "antonym",
        context: "Đã bán hết sạch (vé sự kiện, sản phẩm)",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "Tickets for the keynote address are completely sold out.",
        supportingExampleVi: "Vé cho bài phát biểu chính đã bán hết sạch.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      }
    ],
    paraphraseExamples: [
      {
        original: "The printer is in stock.",
        paraphrased: "The printer is available.",
        vietnamese: "Máy in còn hàng / có sẵn."
      },
      {
        original: "The printer is currently unavailable.",
        paraphrased: "The printer cannot be purchased at this moment.",
        vietnamese: "Máy in hiện không có sẵn."
      },
      {
        original: "The printer is sold out.",
        paraphrased: "There are no remaining printers in inventory.",
        vietnamese: "Máy in đã bán hết."
      }
    ],
    collocations: ["readily available", "make available", "available upon request", "available for immediate delivery"],
    wordFamily: {
      adjective: "available",
      noun: "availability"
    }
  },

  // FLASHCARD 03 - REDUCE (MANDATORY SAMPLE 3)
  {
    id: "vocab-reduce",
    word: "REDUCE",
    ipa: "/rɪˈduːs/",
    partOfSpeech: "verb",
    cefrLevel: "B1",
    priorityLevel: "Priority 1",
    definitionVi: "Giảm, cắt giảm.",
    definitionEn: "To make something smaller or less in size, amount, price, or degree.",
    exampleEn: "We reduced shipping costs.",
    exampleVi: "Chúng tôi đã giảm chi phí vận chuyển.",
    examples: [
      {
        en: "Implementing energy-saving measures helped reduce our monthly utility bills by 20%.",
        vi: "Việc áp dụng các biện pháp tiết kiệm năng lượng đã giúp giảm 20% hóa đơn tiện ích hàng tháng của chúng tôi."
      },
      {
        en: "The logistics team is working hard to reduce delivery transit times.",
        vi: "Đội ngũ hậu cần đang nỗ lực tối đa để giảm thời gian vận chuyển hàng."
      },
      {
        en: "To stay competitive, the company must reduce operational expenses immediately.",
        vi: "Để duy trì tính cạnh tranh, công ty phải cắt giảm chi phí hoạt động ngay lập tức."
      }
    ],
    topic: "Financial & Budgeting",
    toeicPart: "Part 5, 6, 7",
    sourceDoc: "TOEIC-004",
    sourcePage: 45,
    contextNotes: "Một số từ có thể là nội động từ (decrease/fall) hoặc ngoại động từ (lower/cut/reduce). Không được thay thế từ mà làm sai cấu trúc ngữ pháp.",
    synonyms: [
      {
        id: "rel-reduce-syn-1",
        targetPhrase: "Lower",
        relationType: "synonym",
        context: "Hạ thấp mức giá, chi phí hoặc tỷ lệ",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "The airline lowered ticket fares for off-peak season.",
        supportingExampleVi: "Hãng hàng không đã hạ giá vé cho mùa thấp điểm.",
        interchangeability: "near",
        verificationStatus: "verified"
      },
      {
        id: "rel-reduce-syn-2",
        targetPhrase: "Cut",
        relationType: "synonym",
        context: "Cắt giảm ngân sách, nhân sự hoặc chi phí trực tiếp",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "The board decided to cut marketing expenses by 15%.",
        supportingExampleVi: "Hội đồng quản trị đã quyết định cắt giảm 15% chi phí tiếp thị.",
        interchangeability: "near",
        verificationStatus: "verified"
      },
      {
        id: "rel-reduce-syn-3",
        targetPhrase: "Decrease",
        relationType: "synonym",
        context: "Giảm xuống về số lượng hoặc quy mô (dùng cả nội/ngoại động từ)",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "Customer complaints decreased significantly after the update.",
        supportingExampleVi: "Khiếu nại của khách hàng đã giảm đáng kể sau bản cập nhật.",
        interchangeability: "near",
        verificationStatus: "verified"
      }
    ],
    antonyms: [
      {
        id: "rel-reduce-ant-1",
        targetPhrase: "Increase",
        relationType: "antonym",
        context: "Tăng lên về lượng hoặc quy mô",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "Shipping costs increased due to rising fuel surcharges.",
        supportingExampleVi: "Chi phí vận chuyển đã tăng do phụ phí nhiên liệu tăng.",
        interchangeability: "exact",
        verificationStatus: "verified"
      },
      {
        id: "rel-reduce-ant-2",
        targetPhrase: "Raise",
        relationType: "antonym",
        context: "Nâng cao, tăng lên (ngoại động từ, cần tân ngữ trực tiếp: raise prices/salary)",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "The company raised salaries to retain top talent.",
        supportingExampleVi: "Công ty đã tăng lương để giữ chân nhân tài xuất sắc.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      },
      {
        id: "rel-reduce-ant-3",
        targetPhrase: "Boost",
        relationType: "antonym",
        context: "Thúc đẩy tăng mạnh mẽ (doanh số, tinh thần, năng suất)",
        usageLevel: "Trung bình",
        priority: "Priority 2",
        supportingExample: "The promotional campaign boosted quarterly revenue.",
        supportingExampleVi: "Chiến dịch quảng bá đã thúc đẩy doanh thu theo quý tăng mạnh.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      }
    ],
    paraphraseExamples: [
      {
        original: "We lowered shipping costs.",
        paraphrased: "We reduced shipping costs.",
        vietnamese: "Chúng tôi đã giảm chi phí vận chuyển."
      },
      {
        original: "We cut shipping costs.",
        paraphrased: "We trimmed our delivery expenditures.",
        vietnamese: "Chúng tôi cắt giảm chi phí vận chuyển."
      },
      {
        original: "Shipping costs increased.",
        paraphrased: "Transportation fees escalated.",
        vietnamese: "Chi phí vận chuyển tăng lên."
      }
    ],
    collocations: ["reduce costs", "drastically reduce", "reduce waste", "reduce turnaround time"],
    wordFamily: {
      verb: "reduce",
      noun: "reduction",
      adjective: "reducible"
    }
  },

  // FLASHCARD 04 - CANDIDATE (Personnel)
  {
    id: "vocab-candidate",
    word: "CANDIDATE",
    ipa: "/ˈkæn.dɪ.deɪt/",
    partOfSpeech: "noun",
    cefrLevel: "B1",
    priorityLevel: "Priority 1",
    definitionVi: "Ứng viên (xin việc, đề cử).",
    definitionEn: "A person who applies for a job or is competing for a position.",
    exampleEn: "The committee interviewed several qualified candidates.",
    exampleVi: "Hội đồng đã phỏng vấn một số ứng viên đủ năng lực.",
    examples: [
      {
        en: "The interview panel will select the best candidate based on practical experience.",
        vi: "Hội đồng phỏng vấn sẽ chọn ứng viên xuất sắc nhất dựa trên kinh nghiệm thực tế."
      },
      {
        en: "Each candidate must provide at least two professional references before the final round.",
        vi: "Mỗi ứng viên phải cung cấp ít nhất hai người tham chiếu chuyên môn trước vòng chung kết."
      },
      {
        en: "She proved to be an outstanding candidate for the regional director position.",
        vi: "Cô ấy đã chứng tỏ là một ứng viên xuất sắc cho vị trí giám đốc khu vực."
      }
    ],
    topic: "Personnel",
    toeicPart: "Part 5, 7",
    sourceDoc: "TOEIC-003",
    sourcePage: 18,
    contextNotes: "Trong TOEIC, 'candidate' thường được dùng hoán đổi với 'applicant' trong các bài tuyển dụng Part 7.",
    synonyms: [
      {
        id: "rel-candidate-syn-1",
        targetPhrase: "Applicant",
        relationType: "synonym",
        context: "Người nộp hồ sơ xin việc",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "All applicants must submit their resume before Friday.",
        supportingExampleVi: "Tất cả ứng viên phải nộp sơ yếu lý lịch trước thứ Sáu.",
        interchangeability: "near",
        verificationStatus: "verified"
      },
      {
        id: "rel-candidate-syn-2",
        targetPhrase: "Job seeker",
        relationType: "synonym",
        context: "Người tìm kiếm việc làm nói chung",
        usageLevel: "Trung bình",
        priority: "Priority 2",
        supportingExample: "The job fair attracted over 500 job seekers.",
        supportingExampleVi: "Hội chợ việc làm đã thu hút hơn 500 người tìm việc.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      }
    ],
    antonyms: [
      {
        id: "rel-candidate-ant-1",
        targetPhrase: "Employer",
        relationType: "antonym",
        context: "Nhà tuyển dụng / người sử dụng lao động",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "The employer offers comprehensive health coverage.",
        supportingExampleVi: "Nhà tuyển dụng cung cấp bảo hiểm y tế toàn diện.",
        interchangeability: "exact",
        verificationStatus: "verified"
      }
    ],
    paraphraseExamples: [
      {
        original: "Applicants must send resumes.",
        paraphrased: "Candidates are required to submit CVs.",
        vietnamese: "Ứng viên bắt buộc phải nộp hồ sơ."
      }
    ],
    collocations: ["qualified candidate", "prospective candidate", "interview candidates"],
    wordFamily: {
      noun: "candidacy / candidate"
    }
  },

  // FLASHCARD 05 - MALFUNCTION (Office Issues)
  {
    id: "vocab-malfunction",
    word: "MALFUNCTION",
    ipa: "/ˌmælˈfʌŋk.ʃən/",
    partOfSpeech: "verb",
    cefrLevel: "B2",
    priorityLevel: "Priority 1",
    definitionVi: "Gặp sự cố, trục trặc kỹ thuật.",
    definitionEn: "To fail to function normally or properly.",
    exampleEn: "The photocopier malfunctioned during the peak printing hour.",
    exampleVi: "Máy photocopy bị trục trặc trong giờ cao điểm in ấn.",
    examples: [
      {
        en: "The heavy printing press malfunctioned right before the publishing deadline.",
        vi: "Máy in công suất lớn gặp sự cố kỹ thuật ngay trước hạn chót xuất bản."
      },
      {
        en: "Technicians identified the reason why the main cooling unit had malfunctioned.",
        vi: "Các kỹ thuật viên đã xác định được nguyên nhân khiến bộ phận làm mát chính bị trục trặc."
      },
      {
        en: "If the barcode scanner malfunctions again, contact IT support immediately.",
        vi: "Nếu máy quét mã vạch lại bị hỏng, hãy liên hệ ngay với bộ phận hỗ trợ CNTT."
      }
    ],
    topic: "Office Issues",
    toeicPart: "Part 3, 4, 7",
    sourceDoc: "TOEIC-004",
    sourcePage: 23,
    contextNotes: "Thường gặp trong email báo cáo sự cố thiết bị văn phòng (Part 3, Part 7 memo).",
    synonyms: [
      {
        id: "rel-malfunction-syn-1",
        targetPhrase: "Break down",
        relationType: "synonym",
        context: "Hỏng hóc, ngừng hoạt động",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "The delivery van broke down on the expressway.",
        supportingExampleVi: "Xe tải giao hàng đã bị hỏng trên đường cao tốc.",
        interchangeability: "near",
        verificationStatus: "verified"
      },
      {
        id: "rel-malfunction-syn-2",
        targetPhrase: "Out of order",
        relationType: "synonym",
        context: "Bị hỏng không dùng được (thường gắn trên biển báo)",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "The elevator is out of order until maintenance arrives.",
        supportingExampleVi: "Thang máy ngừng hoạt động cho đến khi thợ bảo trì tới.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      }
    ],
    antonyms: [
      {
        id: "rel-malfunction-ant-1",
        targetPhrase: "Operate smoothly",
        relationType: "antonym",
        context: "Vận hành êm ái, trơn tru",
        usageLevel: "Trung bình",
        priority: "Priority 2",
        supportingExample: "The assembly line is operating smoothly now.",
        supportingExampleVi: "Dây chuyền lắp ráp hiện đang vận hành rất trơn tru.",
        interchangeability: "near",
        verificationStatus: "verified"
      }
    ],
    paraphraseExamples: [
      {
        original: "The machine is out of order.",
        paraphrased: "The equipment has malfunctioned.",
        vietnamese: "Thiết bị gặp sự cố trục trặc."
      }
    ],
    collocations: ["equipment malfunction", "technical malfunction", "malfunction report"],
    wordFamily: {
      noun: "malfunction",
      verb: "malfunction"
    }
  },

  // FLASHCARD 06 - COMPLIANCE (Management Issues)
  {
    id: "vocab-compliance",
    word: "COMPLIANCE",
    ipa: "/kəmˈplaɪ.əns/",
    partOfSpeech: "noun",
    cefrLevel: "C1",
    priorityLevel: "Priority 2",
    definitionVi: "Sự tuân thủ (quy định, tiêu chuẩn, chính sách).",
    definitionEn: "The act of obeying an order, rule, or request.",
    exampleEn: "Strict compliance with safety regulations is mandatory for all personnel.",
    exampleVi: "Việc tuân thủ nghiêm ngặt các quy định an toàn là bắt buộc đối với mọi nhân viên.",
    examples: [
      {
        en: "Strict compliance with international safety standards is mandatory for all manufacturing plants.",
        vi: "Sự tuân thủ nghiêm ngặt các tiêu chuẩn an toàn quốc tế là bắt buộc đối với tất cả các nhà máy sản xuất."
      },
      {
        en: "The recent external audit confirmed full compliance with corporate accounting regulations.",
        vi: "Cuộc kiểm toán độc lập gần đây đã xác nhận sự tuân thủ đầy đủ các quy định kế toán doanh nghiệp."
      },
      {
        en: "Employees must complete annual training to ensure ongoing compliance with privacy laws.",
        vi: "Nhân viên phải hoàn thành khóa đào tạo hàng năm để đảm bảo tuân thủ liên tục luật bảo mật dữ liệu."
      }
    ],
    topic: "Management Issues",
    toeicPart: "Part 5, 6, 7",
    sourceDoc: "TOEIC-005",
    sourcePage: 31,
    contextNotes: "Cực kỳ phổ biến trong các thông báo chính sách, kiểm định ISO và hướng dẫn quy chuẩn công ty.",
    synonyms: [
      {
        id: "rel-compliance-syn-1",
        targetPhrase: "Adherence",
        relationType: "synonym",
        context: "Sự bám sát, tuân theo quy chuẩn",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "Adherence to company guidelines ensures audit readiness.",
        supportingExampleVi: "Sự tuân thủ các hướng dẫn công ty đảm bảo tính sẵn sàng cho kỳ kiểm toán.",
        interchangeability: "near",
        verificationStatus: "verified"
      },
      {
        id: "rel-compliance-syn-2",
        targetPhrase: "Conformity",
        relationType: "synonym",
        context: "Sự phù hợp với các tiêu chuẩn công nghiệp",
        usageLevel: "Trung bình",
        priority: "Priority 2",
        supportingExample: "The materials are inspected for conformity with national standards.",
        supportingExampleVi: "Vật liệu được kiểm tra để xem xét sự phù hợp với tiêu chuẩn quốc gia.",
        interchangeability: "conditional",
        verificationStatus: "verified"
      }
    ],
    antonyms: [
      {
        id: "rel-compliance-ant-1",
        targetPhrase: "Violation",
        relationType: "antonym",
        context: "Sự vi phạm quy tắc, điều khoản",
        usageLevel: "Cao",
        priority: "Priority 1",
        supportingExample: "Any violation of the confidentiality clause will result in termination.",
        supportingExampleVi: "Bất kỳ sự vi phạm nào đối với điều khoản bảo mật sẽ dẫn đến việc chấm dứt hợp đồng.",
        interchangeability: "exact",
        verificationStatus: "verified"
      }
    ],
    collocations: ["in compliance with", "ensure compliance", "regulatory compliance"],
    wordFamily: {
      noun: "compliance",
      verb: "comply",
      adjective: "compliant"
    }
  }
];

// Combine core mandatory samples with the 138 TOEIC vocabulary bank
export const SEED_VOCABULARY: VocabularyItem[] = [
  ...BASE_MANDATORY_VOCABULARY,
  ...TOEIC_138_VOCABULARY.filter(
    (item) => !BASE_MANDATORY_VOCABULARY.some((b) => b.word.toUpperCase() === item.word.toUpperCase())
  ),
];

