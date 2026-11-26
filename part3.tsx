import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  BookOpen,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Award,
  Sparkles,
  Filter,
  HelpCircle,
  Clock,
  Layers,
  MapPin,
  Plane,
  Receipt,
  Calendar,
  Headphones,
  Wind,
  Video,
  Bike,
} from "lucide-react";

// ============================================================================
// DỮ LIỆU ĐẦY ĐỦ 3 BỘ ĐỀ TOEIC PART 3 (TEST 1, TEST 2, TEST 3 - 117 CÂU HỎI)
// ============================================================================
const TOEIC_DATA = {
  test1: {
    id: "test1",
    title: "Test 1 (TOEIC Part 3 - No. 1)",
    description:
      "13 đoạn hội thoại (Câu 32 - 70) kèm biểu đồ & giải thích chi tiết",
    passages: [
      {
        id: "t1_32_34",
        range: "32 - 34",
        topic: "Khách sạn & Cải tạo sảnh",
        script: [
          {
            speaker: "W-Br",
            text: "Wow, the new wood flooring in our hotel's lobby looks really nice. The installation company we hired did a great job.",
            clues: [32],
          },
          {
            speaker: "M-Au",
            text: "I know—it was definitely worth closing the hotel for a few days to finish up the renovation.",
            clues: [33],
          },
          {
            speaker: "W-Br",
            text: "Yes, it was. Now we need to have the furniture moved back in here.",
            clues: [],
          },
          {
            speaker: "M-Au",
            text: "Right. I'll call the maintenance department now and ask about that. They should move it this afternoon since we reopen tomorrow.",
            clues: [34],
          },
        ],
        questions: [
          {
            number: 32,
            question: "Where do the speakers work?",
            options: [
              "At a hotel",
              "At an art gallery",
              "At a hardware store",
              "At a travel agency",
            ],
            correct: 0,
            explanation:
              'Người phụ nữ khen sàn gỗ mới ở sảnh khách sạn của chúng ta ("in our hotel\'s lobby") rất đẹp -> Hai người làm việc tại một khách sạn.',
            clueQuote:
              '"Wow, the new wood flooring in our hotel\'s lobby looks really nice."',
          },
          {
            number: 33,
            question: "Why was a building temporarily closed?",
            options: [
              "To take inventory",
              "To host an event",
              "To complete a renovation",
              "To celebrate a holiday",
            ],
            correct: 2,
            explanation:
              'Người đàn ông nói thật đáng giá khi đóng cửa khách sạn vài ngày để hoàn tất việc cải tạo ("finish up the renovation").',
            clueQuote:
              '"it was definitely worth closing the hotel for a few days to finish up the renovation."',
          },
          {
            number: 34,
            question: "What is the man going to do next?",
            options: [
              "Post some flyers",
              "Send customers an e-mail",
              "Place a food order",
              "Contact the maintenance department",
            ],
            correct: 3,
            explanation:
              'Người đàn ông nói anh ấy sẽ gọi cho bộ phận bảo trì ngay bây giờ ("call the maintenance department now") để nhờ chuyển đồ đạc vào lại.',
            clueQuote:
              '"I\'ll call the maintenance department now and ask about that."',
          },
        ],
      },
      {
        id: "t1_35_37",
        range: "35 - 37",
        topic: "Tổ chức tiệc tri ân nhân viên",
        script: [
          {
            speaker: "M-Cn",
            text: "Monica, I wanted to talk to you about our company's annual employee appreciation dinner—I'm in charge of planning it this year. I know it was at the Rose Banquet Hall last year...",
            clues: [35, 36],
          },
          {
            speaker: "W-Am",
            text: "Yes, it was. But it doesn't have to be held there. How about that new Italian restaurant in Hillside instead?",
            clues: [36],
          },
          {
            speaker: "M-Cn",
            text: "But isn't that restaurant too far from the office? That might discourage people from coming to the dinner.",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "I don't think so. The company always provides shuttle service from the office, so people can take that bus if they don't want to drive.",
            clues: [37],
          },
        ],
        questions: [
          {
            number: 35,
            question: "What are the speakers planning?",
            options: [
              "A company dinner",
              "A conference schedule",
              "An upcoming trip",
              "A factory inspection",
            ],
            correct: 0,
            explanation:
              'Người đàn ông muốn bàn về bữa tối tri ân nhân viên hằng năm của công ty ("our company\'s annual employee appreciation dinner").',
            clueQuote:
              '"I wanted to talk to you about our company\'s annual employee appreciation dinner"',
          },
          {
            number: 36,
            question: "What does the woman suggest?",
            options: [
              "Inviting a guest speaker",
              "Reserving a different venue",
              "Checking a budget",
              "Postponing a party",
            ],
            correct: 1,
            explanation:
              'Năm ngoái tiệc tổ chức ở Rose Banquet Hall, người phụ nữ đề xuất đổi sang nhà hàng Ý mới ở Hillside ("How about that new Italian restaurant in Hillside instead?") -> Đặt một địa điểm khác.',
            clueQuote:
              '"But it doesn\'t have to be held there. How about that new Italian restaurant in Hillside instead?"',
          },
          {
            number: 37,
            question: "What does the woman say will be provided?",
            options: [
              "Name tags",
              "A city tour",
              "Transportation",
              "Entertainment",
            ],
            correct: 2,
            explanation:
              'Công ty luôn cung cấp dịch vụ xe đưa đón ("shuttle service / bus") từ văn phòng -> Phương tiện đi lại (Transportation).',
            clueQuote:
              '"The company always provides shuttle service from the office, so people can take that bus"',
          },
        ],
      },
      {
        id: "t1_38_40",
        range: "38 - 40",
        topic: "Thiết kế biển hiệu cửa hàng",
        script: [
          {
            speaker: "W-Br",
            text: "Hi, Ana and Peter. Can you look at this design I created for our store's new sign?",
            clues: [38],
          },
          {
            speaker: "W-Am",
            text: "It's much better than the current one! I'm glad you made the words larger on the new sign.",
            clues: [],
          },
          {
            speaker: "M-Cn",
            text: "I like it too, but... I think we should also mention that we're open until ten P.M. You know, to promote the idea that customers have longer to shop here.",
            clues: [39],
          },
          {
            speaker: "W-Br",
            text: "I like that idea, Peter. Do you want to help me?",
            clues: [],
          },
          { speaker: "M-Cn", text: "Sure, I can do that now.", clues: [] },
          {
            speaker: "W-Am",
            text: "In that case, I can work on the weekly inventory list.",
            clues: [40],
          },
          {
            speaker: "W-Br",
            text: "Thanks, Ana. It'll take a while to update the list of available products in stock.",
            clues: [40],
          },
        ],
        questions: [
          {
            number: 38,
            question: "What are the speakers mainly discussing?",
            options: [
              "A store sign",
              "A Web site",
              "Some uniforms",
              "Some business cards",
            ],
            correct: 0,
            explanation:
              'Người phụ nữ nhờ Ana và Peter xem thiết kế cô ấy tạo cho biển hiệu mới của cửa hàng ("design I created for our store\'s new sign").',
            clueQuote:
              '"Can you look at this design I created for our store\'s new sign?"',
          },
          {
            number: 39,
            question: "What suggestion does the man make?",
            options: [
              "Adding display racks",
              "Giving a demonstration",
              "Researching some suppliers",
              "Advertising a business' hours",
            ],
            correct: 3,
            explanation:
              'Peter gợi ý nên ghi thêm thông tin cửa hàng mở cửa đến 10 giờ tối ("mention that we\'re open until ten P.M.") -> Quảng bá giờ mở cửa.',
            clueQuote:
              '"I think we should also mention that we\'re open until ten P.M."',
          },
          {
            number: 40,
            question: "What does Ana offer to do?",
            options: [
              "Lead a training session",
              "Greet a client",
              "Update a list",
              "Revise an announcement",
            ],
            correct: 2,
            explanation:
              'Ana đề nghị làm danh sách kiểm kê hàng tuần ("work on the weekly inventory list" / "update the list").',
            clueQuote:
              '"In that case, I can work on the weekly inventory list."',
          },
        ],
      },
      {
        id: "t1_41_43",
        range: "41 - 43",
        topic: "Hỏi mua sách tại hiệu sách",
        script: [
          {
            speaker: "W-Am",
            text: "Thanks for calling Ewing Books. How may I help you?",
            clues: [],
          },
          {
            speaker: "M-Cn",
            text: "Hello. Do you have Organization for All in stock? It's a book by James Dobbey.",
            clues: [41],
          },
          {
            speaker: "W-Am",
            text: "Let me see... Hmm—it looks like that particular item is currently sold out. But we're scheduled to get another shipment early next week.",
            clues: [42],
          },
          {
            speaker: "M-Cn",
            text: "Oh, in that case, would you mind holding a copy for me when the books arrive?",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "I'm awfully sorry, but we can't hold copies for customers. But if you give me your phone number, I'll make a note to call you as soon as the shipment is here.",
            clues: [43],
          },
        ],
        questions: [
          {
            number: 41,
            question: "What type of business is the man calling?",
            options: [
              "A bookstore",
              "A restaurant",
              "A clothing shop",
              "A printing shop",
            ],
            correct: 0,
            explanation:
              'Nhân viên nghe máy xưng tên "Ewing Books" và khách hỏi mua sách ("It\'s a book by James Dobbey") -> Hiệu sách.',
            clueQuote:
              '"Thanks for calling Ewing Books... It\'s a book by James Dobbey."',
          },
          {
            number: 42,
            question: "What will happen next week?",
            options: [
              "A class will begin.",
              "A shipment will arrive.",
              "A location will change.",
              "A sale will end.",
            ],
            correct: 1,
            explanation:
              'Nhân viên báo đầu tuần tới cửa hàng dự kiến nhận một lô hàng mới ("get another shipment early next week").',
            clueQuote:
              '"we\'re scheduled to get another shipment early next week."',
          },
          {
            number: 43,
            question: "What information does the woman ask for?",
            options: [
              "A bank account number",
              "A mailing address",
              "A discount code",
              "A telephone number",
            ],
            correct: 3,
            explanation:
              'Nhân viên xin số điện thoại ("give me your phone number") để gọi báo ngay khi hàng về.',
            clueQuote:
              '"if you give me your phone number, I\'ll make a note to call you as soon as the shipment is here."',
          },
        ],
      },
      {
        id: "t1_44_46",
        range: "44 - 46",
        topic: "Giao hàng & Lắp ráp ghế sofa",
        script: [
          {
            speaker: "W-Br",
            text: "Hello. I ordered a sofa from your store, but I remeasured my doorway and I'm afraid the sofa may be too large to fit through it.",
            clues: [44],
          },
          {
            speaker: "M-Au",
            text: "Ah, I understand. You know, the sofa will arrive unassembled, so it should fit without a problem—it'll take my delivery team about an hour to put it together.",
            clues: [45],
          },
          {
            speaker: "W-Br",
            text: "Oh, that's good to know. One more question. It's scheduled to be delivered on Friday. Could you reschedule everything for Saturday?",
            clues: [46],
          },
        ],
        questions: [
          {
            number: 44,
            question: "What is the woman concerned about?",
            options: [
              "The quality of some fabric",
              "The price of a shipment",
              "The size of some furniture",
              "The noise from some construction",
            ],
            correct: 2,
            explanation:
              'Khách hàng lo lắng chiếc ghế sofa quá lớn không lọt qua cửa ra vào ("sofa may be too large to fit through it").',
            clueQuote:
              '"I remeasured my doorway and I\'m afraid the sofa may be too large to fit through it."',
          },
          {
            number: 45,
            question:
              "What does the man say his team will do at the woman's house?",
            options: [
              "Paint a living room",
              "Assemble a product",
              "Take some measurements",
              "Remove some machinery",
            ],
            correct: 1,
            explanation:
              'Ghế sofa được giao dạng chưa lắp ráp và đội giao hàng sẽ mất khoảng 1 tiếng để lắp ráp nó ("put it together" = assemble).',
            clueQuote:
              '"the sofa will arrive unassembled... it\'ll take my delivery team about an hour to put it together."',
          },
          {
            number: 46,
            question: "What does the woman ask the man to do?",
            options: [
              "Resubmit an order form",
              "Send some samples",
              "Go to a different address",
              "Change a delivery date",
            ],
            correct: 3,
            explanation:
              'Đơn hàng dự kiến giao thứ Sáu, cô ấy hỏi đổi lịch sang thứ Bảy ("reschedule everything for Saturday") -> Đổi ngày giao hàng.',
            clueQuote:
              '"It\'s scheduled to be delivered on Friday. Could you reschedule everything for Saturday?"',
          },
        ],
      },
      {
        id: "t1_47_49",
        range: "47 - 49",
        topic: "Tuyển nhân viên thời vụ lưu trữ hồ sơ",
        script: [
          {
            speaker: "M-Cn",
            text: "Hi, Soon-yi. I'd like to hire a temporary employee. I need someone to go through the back-office filing cabinets.",
            clues: [47],
          },
          {
            speaker: "W-Br",
            text: "Sure, I can look into hiring someone. Are there any specific skills you're looking for?",
            clues: [],
          },
          {
            speaker: "M-Cn",
            text: "Yes, I'd like whoever we hire to scan and catalog architectural plans and sketches from the past five years. So, computer skills are a must.",
            clues: [48],
          },
          {
            speaker: "W-Br",
            text: "OK, how long would you need to hire the person for?",
            clues: [],
          },
          {
            speaker: "M-Cn",
            text: "Hopefully a year. Can you check the budget to see if it's possible?",
            clues: [49],
          },
        ],
        questions: [
          {
            number: 47,
            question: "Why does the man want to hire a temporary employee?",
            options: [
              "To hand out brochures",
              "To design a Web site",
              "To sort through some documents",
              "To pick up some office equipment",
            ],
            correct: 2,
            explanation:
              'Người đàn ông cần người rà soát, phân loại tủ hồ sơ văn phòng ("go through the back-office filing cabinets" / "scan and catalog architectural plans").',
            clueQuote:
              '"I need someone to go through the back-office filing cabinets."',
          },
          {
            number: 48,
            question: "According to the man, what does the job require?",
            options: [
              "Sales experience",
              "Public speaking skills",
              "Interior decorating experience",
              "Computer skills",
            ],
            correct: 3,
            explanation:
              'Anh ấy nói kỹ năng máy tính là bắt buộc ("computer skills are a must").',
            clueQuote: '"So, computer skills are a must."',
          },
          {
            number: 49,
            question: "What does the man ask the woman to do?",
            options: [
              "Check a budget",
              "Sign a contract",
              "Brainstorm marketing ideas",
              "Prepare some invoices",
            ],
            correct: 0,
            explanation:
              'Anh ấy nhờ kiểm tra ngân sách xem có đủ thuê trong 1 năm không ("Can you check the budget to see if it\'s possible?").',
            clueQuote: '"Can you check the budget to see if it\'s possible?"',
          },
        ],
      },
      {
        id: "t1_50_52",
        range: "50 - 52",
        topic: "Xếp ca làm thêm tại nhà hàng",
        script: [
          {
            speaker: "M-Au",
            text: "Hi, Jin-Hee. There's going to be a huge convention in town next week with around 20,000 attendees. I'm thinking about keeping the restaurant open later on those nights to get the extra business. I just need to make sure that I have a server who can work late each night.",
            clues: [50],
          },
          {
            speaker: "W-Am",
            text: "That sounds good. I'd love to work an extra shift. I could use the money to have some work done on my car. It's been making a strange noise for the last two weeks.",
            clues: [50, 51],
          },
          {
            speaker: "M-Au",
            text: "OK. Which night are you available to stay late, then?",
            clues: [52],
          },
          {
            speaker: "W-Am",
            text: "Hmm, Thursday is my mother's birthday.",
            clues: [52],
          },
          { speaker: "M-Au", text: "How about Friday?", clues: [] },
          { speaker: "W-Am", text: "That'll work, thanks!", clues: [] },
        ],
        questions: [
          {
            number: 50,
            question: "Where do the speakers most likely work?",
            options: [
              "At a hotel",
              "At a restaurant",
              "At a convention hall",
              "At an auto repair shop",
            ],
            correct: 1,
            explanation:
              'Quản lý muốn mở cửa nhà hàng muộn hơn và cần nhân viên phục vụ ("keeping the restaurant open later... have a server").',
            clueQuote:
              '"keeping the restaurant open later on those nights... have a server who can work late"',
          },
          {
            number: 51,
            question: "What does the woman say about her car?",
            options: [
              "She will loan it to a friend.",
              "She does not use it often.",
              "It was recently purchased.",
              "It needs to be fixed.",
            ],
            correct: 3,
            explanation:
              'Cô ấy cần tiền để sửa xe vì 2 tuần nay xe phát ra tiếng kêu lạ ("have some work done on my car. It\'s been making a strange noise").',
            clueQuote:
              '"I could use the money to have some work done on my car. It\'s been making a strange noise"',
          },
          {
            number: 52,
            question:
              'What does the woman mean when she says, "Thursday is my mother\'s birthday"?',
            options: [
              "She is inviting the man to a party.",
              "She cannot work on Thursday night.",
              "She has to buy a gift before Thursday.",
              "She forgot to update a calendar.",
            ],
            correct: 1,
            explanation:
              "Khi được hỏi tối nào làm muộn được, cô ấy trả lời thứ Năm là sinh nhật mẹ -> Hàm ý không thể làm ca tối thứ Năm.",
            clueQuote:
              '"Which night are you available to stay late, then? - Hmm, Thursday is my mother\'s birthday."',
          },
        ],
      },
      {
        id: "t1_53_55",
        range: "53 - 55",
        topic: "Ngày đầu tiên của nhân viên kế toán mới",
        script: [
          {
            speaker: "W-Br",
            text: "Hi Juan, welcome to your first day at TKZ Accounting. I'm Kate, from the training division of Human Resources.",
            clues: [53],
          },
          {
            speaker: "W-Am",
            text: "And I'm Rachel Goldberg. We organize new-hire training for all the accountants, so we'll be working with you closely over the next week.",
            clues: [53, 54],
          },
          {
            speaker: "M-Cn",
            text: "Very nice to meet you both, and I'm looking forward to working with you. This is my first full-time job in Accounting.",
            clues: [53],
          },
          {
            speaker: "W-Am",
            text: "Before we begin your training, do you have any questions?",
            clues: [],
          },
          {
            speaker: "M-Cn",
            text: "Yes, actually. When I came in for my interview I had to pay to park my car, but is there free parking for TKZ employees?",
            clues: [55],
          },
          {
            speaker: "W-Br",
            text: "Yes—there's a special parking sticker in your new-employee materials folder there on the table. Be sure to put it on your car before tomorrow morning.",
            clues: [55],
          },
        ],
        questions: [
          {
            number: 53,
            question: "What most likely is the man's position?",
            options: [
              "A maintenance worker",
              "A government official",
              "An editor",
              "An accountant",
            ],
            correct: 3,
            explanation:
              'Juan làm việc tại TKZ Accounting, tham gia đào tạo cho kế toán viên và nói đây là công việc kế toán toàn thời gian đầu tiên ("first full-time job in Accounting").',
            clueQuote: '"This is my first full-time job in Accounting."',
          },
          {
            number: 54,
            question: "What do the women do at their company?",
            options: [
              "They arrange travel.",
              "They provide legal assistance.",
              "They organize training sessions.",
              "They manage company inventory.",
            ],
            correct: 2,
            explanation:
              'Hai người phụ nữ thuộc bộ phận đào tạo nhân sự, chuyên tổ chức các buổi đào tạo cho nhân viên mới ("organize new-hire training").',
            clueQuote:
              '"We organize new-hire training for all the accountants"',
          },
          {
            number: 55,
            question: "What does the man ask about?",
            options: [
              "Free parking",
              "Technical support",
              "Payment options",
              "Printing supplies",
            ],
            correct: 0,
            explanation:
              'Juan hỏi liệu nhân viên công ty TKZ có được đỗ xe miễn phí không ("is there free parking for TKZ employees?").',
            clueQuote: '"is there free parking for TKZ employees?"',
          },
        ],
      },
      {
        id: "t1_56_58",
        range: "56 - 58",
        topic: "Góp ý thiết kế áo khoác mùa xuân",
        script: [
          {
            speaker: "M-Au",
            text: "Mara, I'd like to talk to you about the spring jacket designs. Maybe after your meeting?",
            clues: [56, 57],
          },
          { speaker: "W-Br", text: "My meeting was canceled.", clues: [57] },
          {
            speaker: "M-Au",
            text: "OK. So, I just looked over your drawings.",
            clues: [],
          },
          { speaker: "W-Br", text: "What did you think of them?", clues: [] },
          {
            speaker: "M-Au",
            text: "I like the jacket designs overall, but I'm concerned that there aren't enough inside pockets. You should add more on the inside.",
            clues: [],
          },
          {
            speaker: "W-Br",
            text: "All right. It shouldn't be too hard to add another pocket or two to the designs. I'll go and look over my sketches right now and see what I can change.",
            clues: [58],
          },
        ],
        questions: [
          {
            number: 56,
            question: "Which industry do the speakers most likely work in?",
            options: ["Health care", "Architecture", "Tourism", "Fashion"],
            correct: 3,
            explanation:
              'Họ đang thảo luận về bản vẽ thiết kế áo khoác mùa xuân ("spring jacket designs", "inside pockets") -> Ngành thời trang (Fashion).',
            clueQuote:
              '"I\'d like to talk to you about the spring jacket designs."',
          },
          {
            number: 57,
            question:
              'What does the woman mean when she says, "My meeting was canceled"?',
            options: [
              "She cannot answer a question.",
              "She is available to discuss an issue.",
              "She is confused by a schedule change.",
              "She is worried a project will be delayed.",
            ],
            correct: 1,
            explanation:
              'Người đàn ông hỏi liệu có thể trao đổi sau cuộc họp của cô không, cô đáp "Cuộc họp của tôi bị hủy rồi" -> Cô ấy đang rảnh để trao đổi ngay.',
            clueQuote: '"Maybe after your meeting? - My meeting was canceled."',
          },
          {
            number: 58,
            question: "What will the woman most likely do next?",
            options: [
              "Call a vendor",
              "Distribute a questionnaire",
              "Review some designs",
              "Contact some colleagues",
            ],
            correct: 2,
            explanation:
              'Cô ấy nói sẽ đi xem lại các bản phác thảo thiết kế ngay bây giờ ("look over my sketches right now").',
            clueQuote:
              '"I\'ll go and look over my sketches right now and see what I can change."',
          },
        ],
      },
      {
        id: "t1_59_61",
        range: "59 - 61",
        topic: "Hội thảo bảo mật máy tính",
        script: [
          {
            speaker: "W-Am",
            text: "Omar, we should discuss what we're going to cover in the company's upcoming computer-security seminar. I was thinking we could address best practices for password security.",
            clues: [59],
          },
          {
            speaker: "M-Au",
            text: "Yeah, good idea. People often ask questions about creating passwords. The seminar is mandatory, right? If not, it should be.",
            clues: [59, 60],
          },
          {
            speaker: "W-Am",
            text: "I don't think we should require all employees to come. Some people might already have meetings scheduled.",
            clues: [60],
          },
          {
            speaker: "M-Au",
            text: "Well, let's ask our supervisor and see what she thinks.",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "OK—and at the end, I'd like to give everyone a survey asking them about their experiences with technical support. It would help to find out if the system we have in place works for them.",
            clues: [61],
          },
        ],
        questions: [
          {
            number: 59,
            question: "What is the topic of an upcoming seminar?",
            options: [
              "Payroll procedures",
              "Videoconferencing tools",
              "Computer upgrades",
              "Password security",
            ],
            correct: 3,
            explanation:
              'Họ thống nhất sẽ trình bày về các phương pháp bảo mật mật khẩu ("best practices for password security").',
            clueQuote:
              '"I was thinking we could address best practices for password security."',
          },
          {
            number: 60,
            question:
              "What aspect of the seminar do the speakers disagree about?",
            options: [
              "How long it should last",
              "How it should be announced",
              "Whether attendance should be required",
              "Whether refreshments should be served",
            ],
            correct: 2,
            explanation:
              'Omar nghĩ hội thảo nên bắt buộc ("mandatory"), còn người phụ nữ không nghĩ nên bắt buộc tất cả nhân viên tham gia ("don\'t think we should require all employees to come").',
            clueQuote:
              '"The seminar is mandatory, right? - I don\'t think we should require all employees to come."',
          },
          {
            number: 61,
            question:
              "What does the woman want to distribute after the seminar?",
            options: [
              "A survey",
              "A manual",
              "Some paychecks",
              "Some hardware",
            ],
            correct: 0,
            explanation:
              'Cuối buổi cô ấy muốn phát một bản khảo sát ("give everyone a survey") về trải nghiệm hỗ trợ kỹ thuật.',
            clueQuote:
              '"at the end, I\'d like to give everyone a survey asking them about their experiences"',
          },
        ],
      },
      {
        id: "t1_62_64",
        range: "62 - 64",
        topic: "Tư vấn sức khỏe & Lịch bơi trung tâm cộng đồng",
        graphic: {
          type: "schedule",
          title: "Community Center Spring Activities (6:00 – 8:00 P.M.)",
          headers: ["Day", "Activity"],
          rows: [
            ["Monday", "Pottery"],
            ["Tuesday", "Swimming"],
            ["Wednesday", "Chess"],
            ["Thursday", "Basketball"],
            ["Friday", "Movie night"],
          ],
        },
        script: [
          {
            speaker: "M-Cn",
            text: "The results of your checkup look good, overall. Congratulations! You're in much better shape than you were when you last visited our medical practice. What have you been doing to keep healthy?",
            clues: [62],
          },
          {
            speaker: "W-Am",
            text: "Well, I've been jogging a lot more lately, but sometimes my knees hurt. I love aerobic exercise, but I don't want to get injured. Is there something else I could do?",
            clues: [63],
          },
          {
            speaker: "M-Cn",
            text: "Well—you could try swimming. It's easier on the knees. I believe they have weekly open swim times for adults at the local community center. Here—I happen to have their spring schedule with me.",
            clues: [64],
          },
          {
            speaker: "W-Am",
            text: "I'm actually free on that day—I'll give it a try. Thanks!",
            clues: [64],
          },
        ],
        questions: [
          {
            number: 62,
            question: "Who most likely is the man?",
            options: [
              "A fitness coach",
              "A medical doctor",
              "A teacher",
              "A receptionist",
            ],
            correct: 1,
            explanation:
              'Người đàn ông nói về kết quả khám sức khỏe ("results of your checkup") tại phòng khám y tế ("medical practice") -> Bác sĩ y khoa.',
            clueQuote:
              '"The results of your checkup look good, overall... when you last visited our medical practice."',
          },
          {
            number: 63,
            question: "What does the woman ask the man about?",
            options: [
              "Requirements for a job",
              "Alternative types of exercise",
              "Available appointment times",
              "Operating hours of a business",
            ],
            correct: 1,
            explanation:
              'Chạy bộ làm đau đầu gối nên cô ấy hỏi có môn thể dục thay thế nào khác không ("Is there something else I could do?").',
            clueQuote:
              '"I love aerobic exercise, but I don\'t want to get injured. Is there something else I could do?"',
          },
          {
            number: 64,
            question:
              "Look at the graphic. When will the woman probably go to the community center in the spring?",
            options: [
              "On Tuesdays",
              "On Wednesdays",
              "On Thursdays",
              "On Fridays",
            ],
            correct: 0,
            explanation:
              'Bác sĩ gợi ý môn bơi lội ("try swimming"). Đối chiếu bảng lịch hoạt động mùa xuân, Swimming diễn ra vào thứ Ba (Tuesday).',
            clueQuote:
              '"you could try swimming... open swim times for adults at the local community center."',
          },
        ],
      },
      {
        id: "t1_65_67",
        range: "65 - 67",
        topic: "Hỏi đường đi tàu & xe buýt đến nhà hát",
        graphic: {
          type: "rail_map",
          title: "City Rail Network",
          lines: [
            {
              name: "North Line",
              station: "Prospect Avenue Station",
              color: "bg-blue-600",
            },
            {
              name: "East Line",
              station: "Fifth Street Station",
              color: "bg-emerald-600",
            },
            {
              name: "South Line",
              station: "Central Plaza Station",
              color: "bg-amber-600",
            },
            {
              name: "West Line",
              station: "Harbor View Station",
              color: "bg-purple-600",
            },
          ],
        },
        script: [
          {
            speaker: "M-Au",
            text: "Excuse me, do you work here? I'm visiting the city for the first time, and I'm not sure which train line I should take.",
            clues: [],
          },
          { speaker: "W-Br", text: "OK. Where do you want to go?", clues: [] },
          {
            speaker: "M-Au",
            text: "I'm trying to get to the City Theater. I'm going to see a play there tonight.",
            clues: [65],
          },
          {
            speaker: "W-Br",
            text: "Oh, the theater is next to the Prospect Avenue station. Unfortunately, that line is closed for repairs. You know what—you can take the train to the Fifth Street station and then take the bus to the theater from there.",
            clues: [66],
          },
          {
            speaker: "M-Au",
            text: "Thanks! Will I need to buy a separate ticket for the bus?",
            clues: [67],
          },
          {
            speaker: "W-Br",
            text: "No, you can use your train pass to transfer to the bus for free.",
            clues: [],
          },
        ],
        questions: [
          {
            number: 65,
            question: "What does the man say he is doing tonight?",
            options: [
              "Taking a flight",
              "Eating in a restaurant",
              "Seeing a performance",
              "Visiting a friend",
            ],
            correct: 2,
            explanation:
              'Người đàn ông nói tối nay anh ấy đi xem một vở kịch ở Nhà hát Thành phố ("see a play there tonight" = seeing a performance).',
            clueQuote:
              "\"I'm trying to get to the City Theater. I'm going to see a play there tonight.\"",
          },
          {
            number: 66,
            question:
              "Look at the graphic. Which train line will the man most likely take?",
            options: [
              "The North Line",
              "The East Line",
              "The South Line",
              "The West Line",
            ],
            correct: 1,
            explanation:
              'Nhân viên hướng dẫn đi tàu đến ga Fifth Street ("take the train to the Fifth Street station"). Nhìn sơ đồ, Fifth Street Station thuộc tuyến East Line.',
            clueQuote: '"you can take the train to the Fifth Street station"',
          },
          {
            number: 67,
            question: "What does the man ask about a bus?",
            options: [
              "Whether he needs a different ticket",
              "Whether there are reserved seats",
              "How long the ride will take",
              "How often the bus runs",
            ],
            correct: 0,
            explanation:
              'Anh ấy hỏi liệu có cần mua một vé riêng cho xe buýt không ("Will I need to buy a separate ticket for the bus?").',
            clueQuote: '"Will I need to buy a separate ticket for the bus?"',
          },
        ],
      },
      {
        id: "t1_68_70",
        range: "68 - 70",
        topic: "Đổi tai nghe chống ồn tại cửa hàng điện tử",
        graphic: {
          type: "table",
          title: "Matphase Electronics — Headphones",
          headers: ["Model #", "Style", "Noise Reduction"],
          rows: [
            ["F-12", "On the Head", "Fair"],
            ["A-66", "In the Ear", "Good"],
            ["N-48", "In the Ear", "Excellent"],
            ["C-94", "On the Head", "Excellent"],
          ],
        },
        script: [
          {
            speaker: "W-Am",
            text: "Hello. I'd like to exchange these headphones for a different pair. I purchased them yesterday, but when I tried them on at home, I just didn't like them.",
            clues: [68],
          },
          {
            speaker: "M-Au",
            text: "Sure, I can help you with that. Tell me more about what you're looking for so I can recommend a different pair.",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "Well, I want the kind of headphones that you wear on your head. And I'd like the ones that reduce noise. I'm an electrical engineer, and there's a lot of noise on job sites. It makes it hard to focus.",
            clues: [69, 70],
          },
          {
            speaker: "M-Au",
            text: "OK, that helps. Matphase Electronics makes great headphones. I'd recommend this model here. They're the best at reducing noise, and I think you'll like them.",
            clues: [70],
          },
          { speaker: "W-Am", text: "Great. Thanks for your help.", clues: [] },
        ],
        questions: [
          {
            number: 68,
            question: "Why is the woman at the store?",
            options: [
              "To arrange a delivery",
              "To exchange a purchase",
              "To request an instruction manual",
              "To complain about an incorrect charge",
            ],
            correct: 1,
            explanation:
              'Cô ấy đến cửa hàng để đổi cặp tai nghe mua hôm qua sang loại khác ("exchange these headphones for a different pair").',
            clueQuote:
              '"I\'d like to exchange these headphones for a different pair."',
          },
          {
            number: 69,
            question: "What is the woman's job?",
            options: [
              "Jazz musician",
              "Studio photographer",
              "Carpenter",
              "Electrical engineer",
            ],
            correct: 3,
            explanation:
              'Cô ấy nói mình là kỹ sư điện ("I\'m an electrical engineer") và công trường rất ồn.',
            clueQuote:
              "\"I'm an electrical engineer, and there's a lot of noise on job sites.\"",
          },
          {
            number: 70,
            question: "Look at the graphic. What model does the man recommend?",
            options: ["F-12", "A-66", "N-48", "C-94"],
            correct: 3,
            explanation:
              'Khách cần loại chụp trên đầu ("On the Head") và chống ồn tốt nhất ("best at reducing noise" = Excellent). Trong bảng chỉ có mẫu C-94 đạt cả 2 tiêu chí này.',
            clueQuote: '"wear on your head... best at reducing noise"',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // TEST 2 (TOEIC PART 3 SCRIPT NO. 2)
  // ==========================================================================
  test2: {
    id: "test2",
    title: "Test 2 (TOEIC Part 3 - No. 2)",
    description:
      "13 đoạn hội thoại (Câu 32 - 70) kèm biểu đồ & giải thích chi tiết",
    passages: [
      {
        id: "t2_32_34",
        range: "32 - 34",
        topic: "Nhận phòng khách sạn & Tìm máy bán đồ ăn",
        script: [
          {
            speaker: "M-Au",
            text: "Hello, I have a reservation for tonight, but I can't remember my confirmation number.",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "No problem. What's your name?",
            clues: [33],
          },
          { speaker: "M-Au", text: "It's Martin Harris.", clues: [] },
          {
            speaker: "W-Am",
            text: "OK, here it is. You'll be staying with us for three nights. OK, here's your room key. Is there anything else I can help you with?",
            clues: [32],
          },
          {
            speaker: "M-Au",
            text: "Yes, where are the vending machines? I'm a bit hungry.",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "There's a snack machine down this hall to the right.",
            clues: [34],
          },
          {
            speaker: "M-Au",
            text: "Great. I can stop there on the way to my room.",
            clues: [34],
          },
        ],
        questions: [
          {
            number: 32,
            question: "Where are the speakers?",
            options: [
              "At an airport",
              "At a restaurant",
              "At a theater",
              "At a hotel",
            ],
            correct: 3,
            explanation:
              'Khách làm thủ tục nhận phòng ("staying with us for three nights", "here\'s your room key") -> Tại khách sạn.',
            clueQuote:
              "\"You'll be staying with us for three nights. OK, here's your room key.\"",
          },
          {
            number: 33,
            question: "What does the woman ask the man for?",
            options: [
              "His reservation number",
              "His name",
              "His departure day",
              "His credit card",
            ],
            correct: 1,
            explanation:
              'Khách quên mã xác nhận nên lễ tân hỏi tên của anh ấy ("What\'s your name?").',
            clueQuote: '"No problem. What\'s your name?"',
          },
          {
            number: 34,
            question: "What will the man most likely do next?",
            options: [
              "Park his car",
              "Upgrade a reservation",
              "Buy a snack",
              "Go to the pool",
            ],
            correct: 2,
            explanation:
              'Anh ấy hơi đói và nói sẽ ghé máy bán đồ ăn nhẹ trên đường về phòng ("stop there on the way to my room").',
            clueQuote:
              '"There\'s a snack machine down this hall to the right. - Great. I can stop there on the way to my room."',
          },
        ],
      },
      {
        id: "t2_35_37",
        range: "35 - 37",
        topic: "Báo hỏng điều hòa tại căn hộ",
        script: [
          {
            speaker: "M-Cn",
            text: "Hamilton Properties. This is the manager's office. How can I help you?",
            clues: [35],
          },
          {
            speaker: "W-Br",
            text: "Hi. I live in apartment four-C. I need someone to come check my air-conditioning unit.",
            clues: [36],
          },
          {
            speaker: "M-Cn",
            text: "OK. What seems to be the problem?",
            clues: [],
          },
          {
            speaker: "W-Br",
            text: "Well, it was working yesterday, but today it won't turn on. It's starting to get hot inside the apartment.",
            clues: [36],
          },
          {
            speaker: "M-Cn",
            text: "I'll send a technician out. What's your phone number so he can call to let you know when he'll be there?",
            clues: [37],
          },
          { speaker: "W-Br", text: "It's 555-0124.", clues: [] },
          {
            speaker: "M-Cn",
            text: "All right. Someone will call you shortly.",
            clues: [],
          },
        ],
        questions: [
          {
            number: 35,
            question: "Who most likely is the man?",
            options: [
              "A painter",
              "A security guard",
              "A bank teller",
              "A property manager",
            ],
            correct: 3,
            explanation:
              'Người đàn ông nghe máy tại văn phòng quản lý tòa nhà Hamilton Properties ("Hamilton Properties. This is the manager\'s office") -> Người quản lý bất động sản.',
            clueQuote: '"Hamilton Properties. This is the manager\'s office."',
          },
          {
            number: 36,
            question: "What problem does the woman have?",
            options: [
              "She found a mistake on a bill.",
              "She cannot locate a door key.",
              "An air conditioner is not working.",
              "An apartment is too noisy.",
            ],
            correct: 2,
            explanation:
              'Máy điều hòa ở căn hộ 4C hôm nay không bật lên được ("air-conditioning unit... today it won\'t turn on").',
            clueQuote:
              '"I need someone to come check my air-conditioning unit... today it won\'t turn on."',
          },
          {
            number: 37,
            question: "What information does the man ask for?",
            options: [
              "An address",
              "A security code",
              "A telephone number",
              "An appointment time",
            ],
            correct: 2,
            explanation:
              'Anh ấy xin số điện thoại của cô để kỹ thuật viên gọi báo trước khi đến ("What\'s your phone number").',
            clueQuote:
              "\"What's your phone number so he can call to let you know when he'll be there?\"",
          },
        ],
      },
      {
        id: "t2_38_40",
        range: "38 - 40",
        topic: "Đặt mua chai đựng đồ uống cho nhà máy",
        script: [
          {
            speaker: "W-Am",
            text: "Hi, Jermaine. We've been producing a lot of sports beverages here at the factory lately, and our supply of bottles will only last another month or so. Can you place an order for another shipment of bottles?",
            clues: [38],
          },
          {
            speaker: "M-Au",
            text: "Sure, but should I use the same supplier as last time?",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "That depends on whether they can give us a lower price on future orders. Could you negotiate the price with them?",
            clues: [39],
          },
          {
            speaker: "M-Au",
            text: "Hmm... good idea. I'll call the supplier and see what they say.",
            clues: [40],
          },
        ],
        questions: [
          {
            number: 38,
            question: "Where do the speakers most likely work?",
            options: [
              "At a manufacturing plant",
              "At a delivery company",
              "At a fitness center",
              "At a grocery store",
            ],
            correct: 0,
            explanation:
              'Họ đang sản xuất đồ uống thể thao tại nhà máy ("producing a lot of sports beverages here at the factory") -> Nhà máy sản xuất.',
            clueQuote:
              '"We\'ve been producing a lot of sports beverages here at the factory lately"',
          },
          {
            number: 39,
            question: "According to the woman, what does a decision depend on?",
            options: [
              "Employee availability",
              "Government regulations",
              "A price",
              "A timeline",
            ],
            correct: 2,
            explanation:
              'Việc có tiếp tục dùng nhà cung cấp cũ hay không phụ thuộc vào việc họ có giảm giá cho đơn hàng tới không ("depends on whether they can give us a lower price").',
            clueQuote:
              '"That depends on whether they can give us a lower price on future orders."',
          },
          {
            number: 40,
            question: "What does the man say he will do?",
            options: [
              "Check delivery dates",
              "Schedule an inspection",
              "Contact a supplier",
              "Test a product",
            ],
            correct: 2,
            explanation:
              'Anh ấy nói sẽ gọi điện cho nhà cung cấp để thương lượng giá ("call the supplier and see what they say").',
            clueQuote: '"I\'ll call the supplier and see what they say."',
          },
        ],
      },
      {
        id: "t2_41_43",
        range: "41 - 43",
        topic: "Đề nghị tăng ca cho hướng dẫn viên du lịch",
        script: [
          {
            speaker: "W-Br",
            text: "Edwin, you've been a tour guide with our company for six months now. How's it going?",
            clues: [41],
          },
          {
            speaker: "M-Cn",
            text: "Great. I really love this job. It's given me a chance to learn about the history of the city. I have a lot more knowledge now about the places we visit.",
            clues: [42],
          },
          {
            speaker: "W-Br",
            text: "That's good. And I've heard customers say your tours are very interesting. So, I was wondering if you'd like to increase your hours. Would you be interested in working a couple of extra shifts each week?",
            clues: [43],
          },
          {
            speaker: "M-Cn",
            text: "Yes, I'd like that a lot. I could work on weekends if you need me.",
            clues: [],
          },
        ],
        questions: [
          {
            number: 41,
            question: "What is the man's job?",
            options: [
              "University professor",
              "Newspaper reporter",
              "Flight attendant",
              "Tour guide",
            ],
            correct: 3,
            explanation:
              'Người phụ nữ nhắc trực tiếp: "Edwin, you\'ve been a tour guide with our company for six months now."',
            clueQuote:
              '"Edwin, you\'ve been a tour guide with our company for six months now."',
          },
          {
            number: 42,
            question: "What does the man say he likes about the job?",
            options: [
              "Meeting city officials",
              "Traveling to other countries",
              "Learning about local history",
              "Attending special celebrations",
            ],
            correct: 2,
            explanation:
              'Anh ấy thích công việc này vì có cơ hội tìm hiểu về lịch sử thành phố ("learn about the history of the city").',
            clueQuote:
              '"It\'s given me a chance to learn about the history of the city."',
          },
          {
            number: 43,
            question: "What does the woman ask the man to do?",
            options: [
              "Write an article",
              "Work more hours",
              "Train new employees",
              "Organize an event",
            ],
            correct: 1,
            explanation:
              'Cô ấy hỏi liệu anh có muốn tăng số giờ làm việc ("increase your hours" / "working a couple of extra shifts") không.',
            clueQuote:
              '"I was wondering if you\'d like to increase your hours. Would you be interested in working a couple of extra shifts each week?"',
          },
        ],
      },
      {
        id: "t2_44_46",
        range: "44 - 46",
        topic: "Viết bài báo về chợ nông sản",
        script: [
          {
            speaker: "W-Am",
            text: "Mr. Stern, I have an idea for our newspaper's upcoming edition. A lot of farmers markets in this region open during the summer months, so I'd like to write a short piece about them.",
            clues: [44],
          },
          {
            speaker: "M-Au",
            text: "That would work well. Are you planning to interview the vendors who are selling produce? We've received a lot of positive feedback from our readers when we print stories about local business owners.",
            clues: [45],
          },
          {
            speaker: "W-Am",
            text: "That's a good idea, but I'll need to find a photographer to accompany me this weekend.",
            clues: [46],
          },
          {
            speaker: "M-Au",
            text: "I don't think Elena has any assignments.",
            clues: [46],
          },
          {
            speaker: "W-Am",
            text: "Great! I'll speak with her now.",
            clues: [],
          },
        ],
        questions: [
          {
            number: 44,
            question: "What will be the topic of the woman's article?",
            options: [
              "Music festivals",
              "Local restaurants",
              "Farmers markets",
              "Sporting events",
            ],
            correct: 2,
            explanation:
              'Cô ấy muốn viết một bài ngắn về các khu chợ nông sản mở cửa vào mùa hè ("farmers markets... write a short piece about them").',
            clueQuote:
              '"A lot of farmers markets in this region open during the summer months, so I\'d like to write a short piece about them."',
          },
          {
            number: 45,
            question: "What does the man ask the woman about?",
            options: [
              "Interviewing some vendors",
              "Reformatting some images",
              "Extending a deadline",
              "Making travel arrangements",
            ],
            correct: 0,
            explanation:
              'Tổng biên tập hỏi cô có định phỏng vấn các tiểu thương bán nông sản không ("Are you planning to interview the vendors who are selling produce?").',
            clueQuote:
              '"Are you planning to interview the vendors who are selling produce?"',
          },
          {
            number: 46,
            question:
              'What does the man mean when he says, "I don\'t think Elena has any assignments"?',
            options: [
              "A colleague completes tasks quickly.",
              "A colleague may be available for a job.",
              "An office does not need more staff.",
              "A schedule may be incorrect.",
            ],
            correct: 1,
            explanation:
              'Phóng viên cần tìm nhiếp ảnh gia đi cùng cuối tuần này, và sếp bảo "Tôi không nghĩ Elena có nhiệm vụ nào" -> Đồng nghiệp Elena có thể rảnh để nhận việc này.',
            clueQuote:
              "\"I'll need to find a photographer to accompany me this weekend. - I don't think Elena has any assignments.\"",
          },
        ],
      },
      {
        id: "t2_47_49",
        range: "47 - 49",
        topic: "Chúc mừng xuất bản sách & Mời diễn thuyết",
        script: [
          {
            speaker: "M-Au",
            text: "Anita, congratulations on publishing your book about fund-raising for nonprofit organizations!",
            clues: [47],
          },
          {
            speaker: "W-Br",
            text: "Thanks! I couldn't have done it without the input from everyone here at the Society for Wildlife Preservation.",
            clues: [],
          },
          {
            speaker: "M-Au",
            text: "If it's possible, I'd really like you to give a talk on your book to the staff. I think it'd really motivate everyone to think creatively about how we can attract more donors to help our cause.",
            clues: [48],
          },
          {
            speaker: "W-Br",
            text: "Sure, I can do that, but it'll have to wait until next month because I'm attending that convention on protecting the rain forest.",
            clues: [49],
          },
        ],
        questions: [
          {
            number: 47,
            question: "Why does the man congratulate the woman?",
            options: [
              "She recently published a book.",
              "She just received a promotion.",
              "She acquired a major account.",
              "She completed a business course.",
            ],
            correct: 0,
            explanation:
              'Anh ấy chúc mừng Anita vì mới xuất bản cuốn sách về gây quỹ ("congratulations on publishing your book").',
            clueQuote:
              '"Anita, congratulations on publishing your book about fund-raising"',
          },
          {
            number: 48,
            question: "What does the man ask the woman to do?",
            options: [
              "Update a reservation",
              "Meet with a new client",
              "Submit a budget report",
              "Give a talk to staff members",
            ],
            correct: 3,
            explanation:
              'Anh ấy muốn cô nói chuyện/diễn thuyết về cuốn sách của mình cho toàn thể nhân viên ("give a talk on your book to the staff").',
            clueQuote:
              '"I\'d really like you to give a talk on your book to the staff."',
          },
          {
            number: 49,
            question: "Where does the woman say she will be going?",
            options: [
              "To a fund-raising event",
              "To a convention",
              "On a vacation",
              "On a promotional tour",
            ],
            correct: 1,
            explanation:
              'Cô ấy sẽ tham dự một hội nghị về bảo vệ rừng nhiệt đới ("attending that convention on protecting the rain forest").',
            clueQuote:
              '"I\'m attending that convention on protecting the rain forest."',
          },
        ],
      },
      {
        id: "t2_50_52",
        range: "50 - 52",
        topic: "Tư vấn thiết kế cải tạo nội thất & Sàn nhà",
        script: [
          {
            speaker: "M-Cn",
            text: "Ms. Lombardo, let me introduce you to my coworker Tom. He'll be helping me with the designs for your remodeling project. We're here today to see the space and listen to your ideas.",
            clues: [50],
          },
          {
            speaker: "W-Am",
            text: "Thank you both for coming. It's nice to meet you, Tom. Now, I'd like to talk about what's available for flooring first.",
            clues: [51],
          },
          {
            speaker: "M-Au",
            text: "Sure, there are some great laminate flooring options. They're fairly inexpensive and very durable.",
            clues: [],
          },
          {
            speaker: "M-Cn",
            text: "Yes, that's right. Tom, why don't you show her the flooring section of the catalog?",
            clues: [52],
          },
        ],
        questions: [
          {
            number: 50,
            question: "Who most likely are the men?",
            options: [
              "Real estate agents",
              "Interior designers",
              "Marketing executives",
              "Bank managers",
            ],
            correct: 1,
            explanation:
              'Hai người đàn ông đến xem không gian và phụ trách thiết kế cho dự án cải tạo ("designs for your remodeling project") -> Nhà thiết kế nội thất.',
            clueQuote:
              "\"He'll be helping me with the designs for your remodeling project. We're here today to see the space\"",
          },
          {
            number: 51,
            question: "What does the woman want to discuss first?",
            options: [
              "A delivery time",
              "A rental fee",
              "Some flooring options",
              "Some machinery upgrades",
            ],
            correct: 2,
            explanation:
              'Cô Lombardo muốn bàn về các loại vật liệu lát sàn đầu tiên ("talk about what\'s available for flooring first").',
            clueQuote:
              "\"Now, I'd like to talk about what's available for flooring first.\"",
          },
          {
            number: 52,
            question: "What will the woman most likely do next?",
            options: [
              "Look at a catalog",
              "Cancel a meeting",
              "Review a receipt",
              "Call a supervisor",
            ],
            correct: 0,
            explanation:
              'Người đàn ông bảo Tom cho khách xem phần vật liệu sàn trong cuốn danh mục ("show her the flooring section of the catalog").',
            clueQuote:
              '"Tom, why don\'t you show her the flooring section of the catalog?"',
          },
        ],
      },
      {
        id: "t2_53_55",
        range: "53 - 55",
        topic: "Sự cố kết nối máy chiếu trước buổi hội thảo",
        script: [
          {
            speaker: "W-Br",
            text: "Amir, can you help me? I'm trying to set up the conference room projector for a workshop I'm giving at two o'clock.",
            clues: [53],
          },
          { speaker: "M-Cn", text: "Sure. What's the problem?", clues: [] },
          {
            speaker: "W-Br",
            text: "Well, I'm having trouble connecting the projector to my laptop. My laptop cable isn't compatible with the projector.",
            clues: [54],
          },
          {
            speaker: "M-Cn",
            text: "Did the company just issue you a new laptop?",
            clues: [],
          },
          { speaker: "W-Br", text: "Yes—last week.", clues: [] },
          {
            speaker: "M-Cn",
            text: "Our new work laptops require a different cable. It should be in the box they gave you when they delivered your laptop. You should go look in your office.",
            clues: [55],
          },
          {
            speaker: "W-Br",
            text: "Thanks so much. I'll do that now.",
            clues: [],
          },
        ],
        questions: [
          {
            number: 53,
            question: "What is the woman planning to do at two o'clock?",
            options: [
              "Go to the airport",
              "Receive a shipment",
              "Meet with a customer",
              "Give a workshop",
            ],
            correct: 3,
            explanation:
              "Cô ấy đang chuẩn bị máy chiếu cho buổi hội thảo chuyên đề lúc 2 giờ (\"for a workshop I'm giving at two o'clock\").",
            clueQuote:
              "\"set up the conference room projector for a workshop I'm giving at two o'clock.\"",
          },
          {
            number: 54,
            question: "What problem is the woman having?",
            options: [
              "Her log-in information has expired.",
              "Her laptop cable does not work.",
              "Her reservation was not confirmed.",
              "Her mobile phone is missing.",
            ],
            correct: 1,
            explanation:
              'Dây cáp laptop của cô không tương thích với máy chiếu ("My laptop cable isn\'t compatible with the projector").',
            clueQuote:
              '"My laptop cable isn\'t compatible with the projector."',
          },
          {
            number: 55,
            question: "What does the man tell the woman to do?",
            options: [
              "Search in her office",
              "Visit an electronics store",
              "Borrow some equipment",
              "Contact a service team member",
            ],
            correct: 0,
            explanation:
              'Cáp đúng nằm trong hộp giao máy tính mới, anh ấy bảo cô quay lại văn phòng tìm ("You should go look in your office").',
            clueQuote:
              '"It should be in the box they gave you... You should go look in your office."',
          },
        ],
      },
      {
        id: "t2_56_58",
        range: "56 - 58",
        topic: "Chọn cây cảnh cho khu ngồi ngoài trời quán cà phê",
        script: [
          {
            speaker: "W-Am",
            text: "Satoshi, Luisa from the gardening center is here to look at our outdoor seating area.",
            clues: [56],
          },
          {
            speaker: "M-Au",
            text: "Hi, Luisa. The patio's here on the north side of the café, so it doesn't get much direct sunlight. But I'd like to have as many plants as possible to create a comfortable space for our customers to enjoy their coffee.",
            clues: [56, 57],
          },
          {
            speaker: "W-Br",
            text: "Well, there are quite a few species of potted plants that will thrive in that space with indirect sunlight. You should come by the garden center tomorrow to see them.",
            clues: [57],
          },
          {
            speaker: "M-Au",
            text: "Would you mind e-mailing me some photos instead? Some tables are being delivered tomorrow, so I'll need to stay here all day.",
            clues: [58],
          },
        ],
        questions: [
          {
            number: 56,
            question: "Where is the conversation taking place?",
            options: [
              "At a park",
              "At a café",
              "At a furniture store",
              "At a supermarket",
            ],
            correct: 1,
            explanation:
              'Satoshi giới thiệu khu sân hiên nằm ở phía bắc của quán cà phê ("on the north side of the café... enjoy their coffee").',
            clueQuote:
              '"The patio\'s here on the north side of the café... for our customers to enjoy their coffee."',
          },
          {
            number: 57,
            question: "What does Luisa suggest that the man do?",
            options: [
              "Open a window",
              "Use a coupon",
              "Visit a plant shop",
              "Extend business hours",
            ],
            correct: 2,
            explanation:
              'Luisa khuyên anh ấy ngày mai ghé qua trung tâm cây cảnh để xem các loại cây chậu ("come by the garden center tomorrow to see them").',
            clueQuote:
              '"You should come by the garden center tomorrow to see them."',
          },
          {
            number: 58,
            question: "What does the man ask Luisa for?",
            options: [
              "A list of prices",
              "A deadline extension",
              "Some coffee",
              "Some photographs",
            ],
            correct: 3,
            explanation:
              'Vì bận nhận bàn giao ngày mai nên anh nhờ Luisa gửi email một vài bức ảnh ("e-mailing me some photos instead").',
            clueQuote: '"Would you mind e-mailing me some photos instead?"',
          },
        ],
      },
      {
        id: "t2_59_61",
        range: "59 - 61",
        topic: "Báo cáo doanh số hàng điện tử quý 1",
        script: [
          {
            speaker: "W-Am",
            text: "Do you know Bob, the new hire? Well, he submitted his first quarterly sales report yesterday. I just finished analyzing it, and it looks like the electronic items, especially laptops, are underperforming in our Region 1 stores.",
            clues: [59],
          },
          { speaker: "M-Cn", text: "That doesn't sound good.", clues: [] },
          {
            speaker: "W-Am",
            text: "No, but the report concluded that the company should still focus on selling electronics, because the profit margin on these items is a lot higher.",
            clues: [],
          },
          {
            speaker: "M-Cn",
            text: "That makes sense. I think Bob should do a presentation for the sales department about his report.",
            clues: [60],
          },
          {
            speaker: "W-Am",
            text: "He's never done that before. Uh... I could present the report.",
            clues: [60],
          },
          {
            speaker: "M-Cn",
            text: "No, it's a good experience for a new employee. I'll organize a meeting with the sales department next week.",
            clues: [61],
          },
        ],
        questions: [
          {
            number: 59,
            question: "What problem does the woman mention?",
            options: [
              "A product is not selling well.",
              "A position is vacant.",
              "A proposal was not accepted.",
              "A supervisor is busy.",
            ],
            correct: 0,
            explanation:
              'Các mặt hàng điện tử, đặc biệt là laptop, đang bán kém/đạt doanh số thấp ở Khu vực 1 ("electronic items, especially laptops, are underperforming").',
            clueQuote:
              '"it looks like the electronic items, especially laptops, are underperforming in our Region 1 stores."',
          },
          {
            number: 60,
            question: 'Why does the woman say, "He\'s never done that before"?',
            options: [
              "To express concern",
              "To request more help",
              "To approve a decision",
              "To offer some praise",
            ],
            correct: 0,
            explanation:
              'Khi đồng nghiệp đề nghị Bob thuyết trình báo cáo, cô ấy nói "Cậu ấy chưa từng làm việc đó bao giờ" và ngỏ ý làm thay -> Bày tỏ sự lo ngại.',
            clueQuote:
              '"He\'s never done that before. Uh... I could present the report."',
          },
          {
            number: 61,
            question: "What does the man say he will do?",
            options: [
              "Write a report",
              "Conduct an interview",
              "Schedule a meeting",
              "Post an advertisement",
            ],
            correct: 2,
            explanation:
              'Người đàn ông nói anh ấy sẽ tổ chức/lên lịch một cuộc họp với bộ phận bán hàng vào tuần tới ("organize a meeting with the sales department next week").',
            clueQuote:
              '"I\'ll organize a meeting with the sales department next week."',
          },
        ],
      },
      {
        id: "t2_62_64",
        range: "62 - 64",
        topic: "Đổi trả hàng bị bẩn & Hóa đơn mua sắm",
        graphic: {
          type: "receipt",
          title: "Jay's Retail Outlet — Receipt",
          items: [
            { name: "Jacket", price: "$24.00" },
            { name: "Sweater", price: "$13.00" },
            { name: "Scarf", price: "$32.00" },
            { name: "T-shirt", price: "$7.00" },
          ],
          total: "$76.00",
        },
        script: [
          {
            speaker: "M-Au",
            text: "Excuse me. I was here in your store yesterday, and I need to return this item.",
            clues: [62],
          },
          {
            speaker: "W-Br",
            text: "OK. Are there any problems with it?",
            clues: [],
          },
          {
            speaker: "M-Au",
            text: "Yes. When I got home, I went to put it away and realized that there's a large stain right here. See?",
            clues: [62],
          },
          {
            speaker: "W-Br",
            text: "I'm sorry about that. OK. So, it looks like you spent 32 dollars on the item.",
            clues: [63],
          },
          {
            speaker: "M-Au",
            text: "Right, and I used my credit card for the purchase.",
            clues: [],
          },
          {
            speaker: "W-Br",
            text: "Well, I can certainly refund the amount to your credit card. Would you like me to do that?",
            clues: [64],
          },
          { speaker: "M-Au", text: "That sounds good.", clues: [] },
        ],
        questions: [
          {
            number: 62,
            question: "Why does the man want to return an item?",
            options: [
              "It has a stain.",
              "It has a tear.",
              "It is the wrong color.",
              "It is too large.",
            ],
            correct: 0,
            explanation:
              'Về nhà anh ấy phát hiện món đồ có một vết bẩn lớn ("there\'s a large stain right here").',
            clueQuote: '"realized that there\'s a large stain right here."',
          },
          {
            number: 63,
            question:
              "Look at the graphic. Which item does the man want to return?",
            options: ["The jacket", "The sweater", "The scarf", "The T-shirt"],
            correct: 2,
            explanation:
              'Nhân viên nói anh đã chi 32 đô la cho món đồ này ("spent 32 dollars on the item"). Trên hóa đơn, món giá $32.00 là Scarf (khăn quàng).',
            clueQuote: '"it looks like you spent 32 dollars on the item."',
          },
          {
            number: 64,
            question: "What does the woman offer to do for the man?",
            options: [
              "Issue a refund to his credit card",
              "Set up an account for him",
              "Consult with a manager",
              "Call another branch store",
            ],
            correct: 0,
            explanation:
              'Nhân viên đề nghị hoàn lại tiền vào thẻ tín dụng của anh ("refund the amount to your credit card").',
            clueQuote:
              '"I can certainly refund the amount to your credit card."',
          },
        ],
      },
      {
        id: "t2_65_67",
        range: "65 - 67",
        topic: "Giao đồ ăn & Bản đồ khu chung cư Hazelton",
        graphic: {
          type: "street_map",
          title: "Bản đồ khu vực Mill Street & Durham Road",
        },
        script: [
          {
            speaker: "M-Cn",
            text: "Joe's Pizza House. What would you like to order?",
            clues: [],
          },
          {
            speaker: "W-Br",
            text: "Hi, Joe. It's Vanessa. I'm on Mill Street by the bus stop right now. I'm almost finished delivering the food orders. But this last one doesn't have an address on it.",
            clues: [65, 66],
          },
          {
            speaker: "M-Cn",
            text: "Hmm... No address? Is there a name?",
            clues: [],
          },
          { speaker: "W-Br", text: "Uh... it's Dan Smith.", clues: [] },
          {
            speaker: "M-Cn",
            text: "OK. Let me look that up... The Smith order needs to be delivered to the Hazelton apartment building—apartment twelve.",
            clues: [67],
          },
          {
            speaker: "W-Br",
            text: "Oh yes, on Durham Road—directly across from the park. Thanks!",
            clues: [67],
          },
        ],
        questions: [
          {
            number: 65,
            question: "Who most likely is the woman?",
            options: [
              "A postal worker",
              "A delivery driver",
              "A repair technician",
              "A building supervisor",
            ],
            correct: 1,
            explanation:
              'Vanessa gọi về tiệm bánh pizza báo sắp giao xong các đơn đồ ăn ("almost finished delivering the food orders") -> Tài xế giao hàng.',
            clueQuote: '"I\'m almost finished delivering the food orders."',
          },
          {
            number: 66,
            question: "What problem does the woman mention?",
            options: [
              "A package has been damaged.",
              "A vehicle is not working.",
              "Some residents are not home.",
              "Some information is missing.",
            ],
            correct: 3,
            explanation:
              'Đơn hàng cuối cùng bị thiếu địa chỉ ("this last one doesn\'t have an address on it").',
            clueQuote: '"But this last one doesn\'t have an address on it."',
          },
          {
            number: 67,
            question: "Look at the graphic. Where will the woman go next?",
            options: [
              "To Building 1",
              "To Building 2",
              "To Building 3",
              "To Building 4",
            ],
            correct: 3,
            explanation:
              'Địa chỉ giao hàng nằm trên đường Durham Road, đối diện trực tiếp với công viên ("on Durham Road—directly across from the park"). Trên bản đồ, tòa nhà nằm trên Durham Road đối diện City Park là Building 4.',
            clueQuote: '"on Durham Road—directly across from the park."',
          },
        ],
      },
      {
        id: "t2_68_70",
        range: "68 - 70",
        topic: "Hoãn chuyến bay & Dời lịch gặp nhà thiết kế",
        graphic: {
          type: "departures",
          title: "AIRPORT DEPARTURES",
          flights: [
            {
              dest: "Barcelona",
              time: "9:00 A.M.",
              status: "40 minutes late",
              color: "text-amber-600",
            },
            {
              dest: "Lisbon",
              time: "10:30 A.M.",
              status: "On time",
              color: "text-emerald-600",
            },
            {
              dest: "Madrid",
              time: "11:00 A.M.",
              status: "55 minutes late",
              color: "text-rose-600",
            },
            {
              dest: "Paris",
              time: "11:20 A.M.",
              status: "25 minutes late",
              color: "text-amber-600",
            },
          ],
        },
        script: [
          {
            speaker: "W-Am",
            text: "Hi, Mario. I'm calling with some bad news. My flight was supposed to leave for Madrid at eleven o'clock, but it's been delayed.",
            clues: [68],
          },
          {
            speaker: "M-Au",
            text: "Oh, no. I was expecting you to be here in time to meet with a potential client. You're supposed to be presenting the new fabrics our company is making this year.",
            clues: [69],
          },
          {
            speaker: "W-Am",
            text: "Well, the delay's less than an hour, so I still might get there in time.",
            clues: [],
          },
          {
            speaker: "M-Au",
            text: "Maybe, but I'm going to reschedule for tomorrow morning. The potential client is a clothing designer, and we could bring in a lot of money if she agrees to buy our fabrics for use in her spring line.",
            clues: [70],
          },
        ],
        questions: [
          {
            number: 68,
            question:
              "Look at the graphic. What is the status of the woman's flight?",
            options: [
              "40 minutes late",
              "On time",
              "55 minutes late",
              "25 minutes late",
            ],
            correct: 2,
            explanation:
              'Chuyến bay đi Madrid lúc 11:00 A.M. ("leave for Madrid at eleven o\'clock"). Nhìn bảng khởi hành, chuyến đi Madrid bị trễ 55 phút (55 minutes late).',
            clueQuote:
              "\"My flight was supposed to leave for Madrid at eleven o'clock, but it's been delayed.\"",
          },
          {
            number: 69,
            question: "What kind of company do the speakers work for?",
            options: [
              "A fabric manufacturer",
              "A clothing store",
              "A travel agency",
              "A newspaper publisher",
            ],
            correct: 0,
            explanation:
              'Họ giới thiệu các loại vải mới mà công ty sản xuất năm nay ("presenting the new fabrics our company is making this year") -> Công ty sản xuất vải.',
            clueQuote:
              '"presenting the new fabrics our company is making this year."',
          },
          {
            number: 70,
            question: "What does the man say he is going to do?",
            options: [
              "Open another bank account",
              "Extend business hours",
              "Review a contract",
              "Change a meeting time",
            ],
            correct: 3,
            explanation:
              'Mario quyết định sẽ dời lịch cuộc họp sang sáng mai ("I\'m going to reschedule for tomorrow morning").',
            clueQuote: '"I\'m going to reschedule for tomorrow morning."',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // TEST 3 (TOEIC PART 3 SCRIPT NO. 3)
  // ==========================================================================
  test3: {
    id: "test3",
    title: "Test 3 (TOEIC Part 3 - No. 3)",
    description:
      "13 đoạn hội thoại (Câu 32 - 70) kèm biểu đồ & giải thích chi tiết",
    passages: [
      {
        id: "t3_32_34",
        range: "32 - 34",
        topic: "Hỏi tuyến xe buýt đi biển Tilden",
        script: [
          {
            speaker: "W-Am",
            text: "Excuse me, I'm looking for a bus that goes all the way to Tilden Beach.",
            clues: [32],
          },
          {
            speaker: "M-Cn",
            text: "My bus route will take you to the Tilden Beach boardwalk. But you should know that this bus line stops running at nine P.M. If you want to stay later than that, you'll need to find another way back.",
            clues: [33],
          },
          {
            speaker: "W-Am",
            text: "OK, thanks for letting me know. I'm actually staying for a concert that will end around ten P.M., so I'll take a taxi home.",
            clues: [34],
          },
        ],
        questions: [
          {
            number: 32,
            question: "Where does the woman say she wants to go?",
            options: [
              "To an airport",
              "To a beach",
              "To a hotel",
              "To a fitness center",
            ],
            correct: 1,
            explanation:
              'Cô ấy đang tìm xe buýt đi thẳng tới bãi biển Tilden ("goes all the way to Tilden Beach").',
            clueQuote:
              '"I\'m looking for a bus that goes all the way to Tilden Beach."',
          },
          {
            number: 33,
            question: "Who most likely is the man?",
            options: [
              "An auto mechanic",
              "A local musician",
              "A security guard",
              "A bus driver",
            ],
            correct: 3,
            explanation:
              'Người đàn ông nói "Tuyến xe buýt của tôi sẽ đưa cô đến lối đi dạo biển Tilden" ("My bus route will take you...") -> Tài xế xe buýt.',
            clueQuote:
              '"My bus route will take you to the Tilden Beach boardwalk."',
          },
          {
            number: 34,
            question: "Why will the woman return home late?",
            options: [
              "She is working overtime.",
              "She has a flight delay.",
              "She is attending a concert.",
              "She is eating at a restaurant.",
            ],
            correct: 2,
            explanation:
              'Cô ấy ở lại xem một buổi hòa nhạc kết thúc khoảng 10 giờ tối ("staying for a concert that will end around ten P.M.").',
            clueQuote:
              '"I\'m actually staying for a concert that will end around ten P.M."',
          },
        ],
      },
      {
        id: "t3_35_37",
        range: "35 - 37",
        topic: "Thay thế thiết bị nhà bếp khu chung cư",
        script: [
          {
            speaker: "M-Au",
            text: "Gertrude, I've received a lot of maintenance requests from tenants lately about their appliances. It made me realize that the kitchen appliances in the apartment complex are pretty old.",
            clues: [35],
          },
          {
            speaker: "W-Br",
            text: "I guess it's time to replace some... but I'll need to look over our budget to make sure there's enough money for such a significant expense.",
            clues: [36],
          },
          {
            speaker: "M-Au",
            text: "OK, and I'll talk to the manager of the appliance store this afternoon. Hopefully I can arrange a discount for buying a large quantity of items from them.",
            clues: [37],
          },
        ],
        questions: [
          {
            number: 35,
            question: "Where do the speakers most likely work?",
            options: [
              "At an appliance manufacturer",
              "At a construction firm",
              "At a grocery store",
              "At an apartment complex",
            ],
            correct: 3,
            explanation:
              'Anh ấy nhận được nhiều yêu cầu bảo trì từ người thuê nhà về thiết bị bếp trong khu chung cư ("from tenants... in the apartment complex").',
            clueQuote:
              '"received a lot of maintenance requests from tenants... in the apartment complex"',
          },
          {
            number: 36,
            question: "What does the woman say she will review?",
            options: [
              "A budget",
              "A contract",
              "A job posting",
              "An instruction manual",
            ],
            correct: 0,
            explanation:
              'Cô ấy nói cần xem lại ngân sách ("look over our budget") xem có đủ tiền chi cho khoản lớn này không.',
            clueQuote:
              "\"I'll need to look over our budget to make sure there's enough money\"",
          },
          {
            number: 37,
            question: "What does the man hope to do this afternoon?",
            options: [
              "Schedule an interview",
              "Arrange a discount",
              "Make a delivery",
              "Print some brochures",
            ],
            correct: 1,
            explanation:
              'Chiều nay anh sẽ nói chuyện với quản lý cửa hàng điện máy để thương lượng mức giảm giá khi mua số lượng lớn ("arrange a discount for buying a large quantity").',
            clueQuote:
              '"Hopefully I can arrange a discount for buying a large quantity of items from them."',
          },
        ],
      },
      {
        id: "t3_38_40",
        range: "38 - 40",
        topic: "Nhờ gặp khách hàng thay đồng nghiệp bị hủy chuyến bay",
        script: [
          {
            speaker: "W-Am",
            text: "Hi, Vinod. Thanks for stopping by my office. Can you meet with a new client today? They're interested in purchasing a software package.",
            clues: [38],
          },
          {
            speaker: "M-Au",
            text: "Sure. But I thought that was supposed to be Sameera's client.",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "It is, but her flight from New York has been canceled, so she won't be able to come in today. Normally, as the sales manager, I would take the meeting, but I have an urgent appointment at that time.",
            clues: [39],
          },
          {
            speaker: "M-Au",
            text: "What time is the meeting? And is there anything I should know about the client?",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "It's at three thirty in Conference Room B. And please be sure to check that the projector works ahead of time. We've been having trouble with it...",
            clues: [40],
          },
        ],
        questions: [
          {
            number: 38,
            question: "Who most likely is the man?",
            options: [
              "A flight attendant",
              "A sales representative",
              "An event organizer",
              "A repair technician",
            ],
            correct: 1,
            explanation:
              'Trưởng phòng kinh doanh ("sales manager") nhờ Vinod gặp khách hàng mới muốn mua gói phần mềm -> Nhân viên đại diện bán hàng (Sales representative).',
            clueQuote:
              '"Can you meet with a new client today? They\'re interested in purchasing a software package."',
          },
          {
            number: 39,
            question: "Why is Sameera unable to attend a meeting?",
            options: [
              "Her flight was canceled.",
              "Her car has broken down.",
              "She is on vacation.",
              "She is feeling sick.",
            ],
            correct: 0,
            explanation:
              'Chuyến bay của Sameera từ New York đã bị hủy ("her flight from New York has been canceled").',
            clueQuote:
              '"her flight from New York has been canceled, so she won\'t be able to come in today."',
          },
          {
            number: 40,
            question:
              "What does the woman say the man should do before a meeting?",
            options: [
              "Read some client information",
              "Prepare a contract",
              "Make a dinner reservation",
              "Check some equipment",
            ],
            correct: 3,
            explanation:
              'Cô dặn anh kiểm tra trước xem máy chiếu có hoạt động không ("check that the projector works ahead of time") -> Kiểm tra thiết bị.',
            clueQuote:
              '"please be sure to check that the projector works ahead of time."',
          },
        ],
      },
      {
        id: "t3_41_43",
        range: "41 - 43",
        topic: "Cửa hàng quần áo & Hàng xóm mới chuyển đến",
        script: [
          {
            speaker: "M-Cn",
            text: "Zoya, I was just arranging the display of spring dresses in the front window, and I noticed a bunch of tables and chairs being brought into the unit next to our clothing store.",
            clues: [41],
          },
          {
            speaker: "W-Am",
            text: "Really? Let me see... You're right! That space has been vacant for so long... I wonder what kind of business is moving in.",
            clues: [42],
          },
          {
            speaker: "M-Cn",
            text: "You know... Coffee shops need a lot of tables and chairs.",
            clues: [42],
          },
          {
            speaker: "W-Am",
            text: "That's true. Do you think the owners are inside?",
            clues: [],
          },
          {
            speaker: "M-Cn",
            text: "I only see employees from the moving company... But I'm sure the movers wouldn't be here on their own.",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "OK, then. Why don't you finish the display, and I'll go introduce myself?",
            clues: [43],
          },
        ],
        questions: [
          {
            number: 41,
            question: "Where do the speakers work?",
            options: [
              "At a clothing shop",
              "At a photography studio",
              "At a travel agency",
              "At a furniture store",
            ],
            correct: 0,
            explanation:
              'Người đàn ông đang bày váy mùa xuân ở cửa sổ mặt tiền của cửa hàng quần áo ("next to our clothing store").',
            clueQuote:
              '"arranging the display of spring dresses... next to our clothing store."',
          },
          {
            number: 42,
            question:
              'Why does the man say, "Coffee shops need a lot of tables and chairs"?',
            options: [
              "To request assistance",
              "To correct an error",
              "To express disagreement",
              "To make a guess",
            ],
            correct: 3,
            explanation:
              "Zoya tự hỏi không biết loại hình kinh doanh nào sắp chuyển vào mặt bằng trống bên cạnh, người đàn ông đoán có thể là quán cà phê vì thấy chuyển vào nhiều bàn ghế -> Đưa ra phỏng đoán.",
            clueQuote:
              '"I wonder what kind of business is moving in. - You know... Coffee shops need a lot of tables and chairs."',
          },
          {
            number: 43,
            question: "What will the woman do next?",
            options: [
              "Process an online order",
              "Call the building's property manager",
              "Meet some new neighbors",
              "Fix a broken piece of equipment",
            ],
            correct: 2,
            explanation:
              'Zoya nói cô ấy sẽ sang bên cạnh tự giới thiệu bản thân ("I\'ll go introduce myself") -> Gặp gỡ hàng xóm mới.',
            clueQuote:
              "\"Why don't you finish the display, and I'll go introduce myself?\"",
          },
        ],
      },
      {
        id: "t3_44_46",
        range: "44 - 46",
        topic: "Nhà báo đi nhầm lối vào bến bốc hàng",
        script: [
          {
            speaker: "W-Am",
            text: "Excuse me, the loading-dock entrance is only for warehouse employees. Visitors are supposed to use the front entrance.",
            clues: [44],
          },
          {
            speaker: "M-Au",
            text: "Oh, sorry. I'm here to see Mr. Suzuki. I'm a writer for the E-Commerce Business Weekly. I'm writing a report about your company's order-fulfillment process.",
            clues: [44, 45],
          },
          {
            speaker: "W-Am",
            text: "Right, we're expecting you. Please go to the security desk at the front entrance. You'll have to show your press credentials to get a visitor ID. I'll meet you there in a few minutes and take you to Mr. Suzuki's office.",
            clues: [46],
          },
        ],
        questions: [
          {
            number: 44,
            question: "Why does the man apologize?",
            options: [
              "He used the wrong entrance.",
              "He is late for an appointment.",
              "He forgot to bring identification.",
              "He lost an order number.",
            ],
            correct: 0,
            explanation:
              'Nhân viên nhắc lối bến bốc hàng chỉ dành cho nhân viên kho, khách phải đi cổng trước nên anh ấy xin lỗi ("used the wrong entrance").',
            clueQuote:
              '"the loading-dock entrance is only for warehouse employees... - Oh, sorry."',
          },
          {
            number: 45,
            question: "What is the man's job?",
            options: [
              "Delivery driver",
              "Electrician",
              "Journalist",
              "Security guard",
            ],
            correct: 2,
            explanation:
              'Anh ấy là cây viết cho tuần báo E-Commerce Business Weekly và có thẻ báo chí ("writer for the E-Commerce Business Weekly", "press credentials") -> Nhà báo (Journalist).',
            clueQuote: '"I\'m a writer for the E-Commerce Business Weekly."',
          },
          {
            number: 46,
            question: "Where does the woman direct the man to go?",
            options: [
              "To a conference room",
              "To a security desk",
              "To a construction site",
              "To a loading dock",
            ],
            correct: 1,
            explanation:
              'Cô hướng dẫn anh đến bàn bảo vệ ở cổng trước ("go to the security desk at the front entrance").',
            clueQuote:
              '"Please go to the security desk at the front entrance."',
          },
        ],
      },
      {
        id: "t3_47_49",
        range: "47 - 49",
        topic: "Máy tính bảng Techno bán cháy hàng",
        script: [
          {
            speaker: "M-Cn",
            text: "Hey, Janet, what a long day... we've had so many customers. The new Techno computer tablet sure is selling well, isn't it?",
            clues: [47, 48],
          },
          {
            speaker: "W-Am",
            text: "We've already sold out! We purchased 200 of them... I thought we'd be overstocked. This is great for business.",
            clues: [48],
          },
          {
            speaker: "M-Cn",
            text: "Yeah, they really are popular... I wonder why so many people are buying this tablet.",
            clues: [49],
          },
          {
            speaker: "W-Am",
            text: "I think it's because of all the good reviews on the Internet. Most of the reviews gave the tablet five stars out of five!",
            clues: [49],
          },
        ],
        questions: [
          {
            number: 47,
            question: "Where do the speakers most likely work?",
            options: [
              "At an advertising agency",
              "At an electronics shop",
              "At a furniture store",
              "At an assembly plant",
            ],
            correct: 1,
            explanation:
              'Họ phục vụ nhiều khách hàng đến mua máy tính bảng Techno ("so many customers. The new Techno computer tablet sure is selling well") -> Cửa hàng điện tử.',
            clueQuote:
              '"we\'ve had so many customers. The new Techno computer tablet sure is selling well"',
          },
          {
            number: 48,
            question: 'Why does the woman say, "We\'ve already sold out"?',
            options: [
              "To ask for help",
              "To refuse a request",
              "To express agreement",
              "To show concern",
            ],
            correct: 2,
            explanation:
              'Người đàn ông nói máy tính bảng bán chạy nhỉ ("selling well, isn\'t it?"), cô đáp "Chúng ta đã bán hết sạch rồi!" -> Bày tỏ sự đồng tình.',
            clueQuote:
              "\"The new Techno computer tablet sure is selling well, isn't it? - We've already sold out!\"",
          },
          {
            number: 49,
            question: "According to the woman, why is a product popular?",
            options: [
              "It has good online reviews.",
              "It has a lifetime warranty.",
              "It is being advertised by celebrities.",
              "It is being sold at a low price.",
            ],
            correct: 0,
            explanation:
              'Cô nghĩ là do có nhiều đánh giá tốt trên mạng, hầu hết đều chấm 5/5 sao ("good reviews on the Internet").',
            clueQuote:
              '"I think it\'s because of all the good reviews on the Internet."',
          },
        ],
      },
      {
        id: "t3_50_52",
        range: "50 - 52",
        topic: "Mua quà nghỉ hưu cho sếp thích leo núi",
        script: [
          {
            speaker: "W-Br",
            text: "Welcome to Gaduna's Outdoor Supplies. Can I help you both?",
            clues: [],
          },
          {
            speaker: "M-Cn",
            text: "Hi! Our boss is retiring in a month, and we'd like to get something to congratulate her.",
            clues: [50],
          },
          {
            speaker: "W-Br",
            text: "OK. Is there something in particular you're looking for?",
            clues: [],
          },
          {
            speaker: "M-Au",
            text: "Well... she's always said she wanted to spend more time hiking when she retired. But we're not really sure what to get her.",
            clues: [51],
          },
          {
            speaker: "W-Br",
            text: "I see. I'd recommend buying a membership to our store. She'll receive our newsletter and have access to digital trail maps. Plus, she'll get a ten percent discount on all of our merchandise.",
            clues: [52],
          },
          { speaker: "M-Cn", text: "That's a great idea!", clues: [] },
        ],
        questions: [
          {
            number: 50,
            question: "Why are the men at the store?",
            options: [
              "To return a defective item",
              "To purchase a gift",
              "To publicize a festival",
              "To apply for a position",
            ],
            correct: 1,
            explanation:
              'Sếp của họ sắp nghỉ hưu nên hai người muốn mua một món quà chúc mừng ("get something to congratulate her").',
            clueQuote:
              '"Our boss is retiring in a month, and we\'d like to get something to congratulate her."',
          },
          {
            number: 51,
            question: "What hobby is mentioned?",
            options: ["Hiking", "Swimming", "Skiing", "Cycling"],
            correct: 0,
            explanation:
              'Sếp luôn nói muốn dành nhiều thời gian đi bộ đường dài/leo núi khi nghỉ hưu ("spend more time hiking").',
            clueQuote:
              '"she\'s always said she wanted to spend more time hiking when she retired."',
          },
          {
            number: 52,
            question: "What does the woman recommend?",
            options: [
              "Finalizing a schedule",
              "Consulting a return policy",
              "Getting a membership",
              "Downloading a map",
            ],
            correct: 2,
            explanation:
              'Nhân viên cửa hàng khuyên nên mua thẻ hội viên của cửa hàng ("recommend buying a membership to our store").',
            clueQuote: '"I\'d recommend buying a membership to our store."',
          },
        ],
      },
      {
        id: "t3_53_55",
        range: "53 - 55",
        topic: "Trên chuyến bay đi đào tạo nhân viên chi nhánh",
        script: [
          {
            speaker: "M-Au",
            text: "I'm glad our flight took off on schedule. We'll be just in time to get to the employee training session.",
            clues: [53],
          },
          {
            speaker: "W-Br",
            text: "I agree. I wouldn't want to be late to a training session that we're supposed to lead!",
            clues: [53],
          },
          {
            speaker: "M-Au",
            text: "Right. OK, I'll work on the slides for our presentation during the flight then. They're almost ready, but I need to make the changes we discussed yesterday.",
            clues: [54],
          },
          {
            speaker: "W-Br",
            text: "Great. So when we land, should we head straight to the branch office?",
            clues: [55],
          },
          {
            speaker: "M-Au",
            text: "Probably. I would've liked to drop my luggage off at the hotel first, but that would take too long.",
            clues: [55],
          },
        ],
        questions: [
          {
            number: 53,
            question: "Why are the speakers traveling?",
            options: [
              "To attend a conference",
              "To train some employees",
              "To meet a client",
              "To open a new business location",
            ],
            correct: 1,
            explanation:
              'Họ bay đến kịp buổi đào tạo nhân viên mà chính họ phụ trách giảng dạy ("employee training session... that we\'re supposed to lead").',
            clueQuote:
              '"get to the employee training session... a training session that we\'re supposed to lead!"',
          },
          {
            number: 54,
            question: "What does the man say he will do during the flight?",
            options: [
              "Update a travel itinerary",
              "Edit some presentation slides",
              "Proofread a contract",
              "Review some resumes",
            ],
            correct: 1,
            explanation:
              'Trong suốt chuyến bay, anh ấy sẽ chỉnh sửa các trang trình chiếu ("work on the slides for our presentation... make the changes").',
            clueQuote:
              '"I\'ll work on the slides for our presentation during the flight then... make the changes"',
          },
          {
            number: 55,
            question: "What will the speakers most likely do when they land?",
            options: [
              "Check in to a hotel",
              "Eat at a restaurant",
              "Board another flight",
              "Go to an office building",
            ],
            correct: 3,
            explanation:
              'Họ sẽ đi thẳng đến văn phòng chi nhánh ("head straight to the branch office") vì ghé khách sạn cất hành lý sẽ mất nhiều thời gian.',
            clueQuote:
              '"when we land, should we head straight to the branch office? - Probably."',
          },
        ],
      },
      {
        id: "t3_56_58",
        range: "56 - 58",
        topic: "Bảo trì đèn và bồn rửa tại phòng khám y tế",
        script: [
          {
            speaker: "M-Cn",
            text: "Dolores from Maintenance is here fixing the lights in the waiting area.",
            clues: [57],
          },
          {
            speaker: "M-Au",
            text: "Great! The patients need to be able to see when they fill out their medical forms.",
            clues: [56],
          },
          {
            speaker: "M-Cn",
            text: "Oh, she's coming over. Maybe we should ask her to look at the sink in Examination Room One.",
            clues: [56, 57],
          },
          { speaker: "M-Au", text: "Good idea.", clues: [] },
          {
            speaker: "W-Am",
            text: "Hi, there. The lights are working now. Let me know if they go off again.",
            clues: [],
          },
          {
            speaker: "M-Au",
            text: "Thanks. Could you also look at the sink in Examination Room One? It leaks every time the doctors wash their hands.",
            clues: [],
          },
          {
            speaker: "W-Am",
            text: "I only handle electrical issues. You'll have to fill out another maintenance request form, but a plumber can probably come later today.",
            clues: [58],
          },
        ],
        questions: [
          {
            number: 56,
            question: "Where most likely are the speakers?",
            options: [
              "In a computer store",
              "In a recording studio",
              "In a medical clinic",
              "In an electrical supply shop",
            ],
            correct: 2,
            explanation:
              'Có bệnh nhân điền mẫu đơn y tế ("patients... medical forms"), phòng khám số 1 ("Examination Room One") và bác sĩ -> Phòng khám y tế.',
            clueQuote:
              '"The patients need to be able to see when they fill out their medical forms... Examination Room One."',
          },
          {
            number: 57,
            question: "What are the speakers mainly discussing?",
            options: [
              "A work schedule",
              "A recent illness",
              "Some pricing options",
              "Some maintenance problems",
            ],
            correct: 3,
            explanation:
              'Họ bàn về việc sửa đèn khu vực chờ và bồn rửa bị rò rỉ nước với nhân viên bảo trì ("Dolores from Maintenance") -> Các vấn đề bảo trì.',
            clueQuote:
              '"Dolores from Maintenance is here fixing the lights... look at the sink"',
          },
          {
            number: 58,
            question: "What does the woman say the men should do?",
            options: [
              "Contact a manager",
              "Complete a form",
              "Pay a bill",
              "Provide some identification",
            ],
            correct: 1,
            explanation:
              'Dolores chỉ sửa điện nên bảo họ điền một phiếu yêu cầu bảo trì khác ("fill out another maintenance request form") để thợ ống nước đến sửa.',
            clueQuote:
              '"You\'ll have to fill out another maintenance request form"',
          },
        ],
      },
      {
        id: "t3_59_61",
        range: "59 - 61",
        topic: "Chi phí nhập khẩu nguyên liệu tiệm bánh ngọt",
        script: [
          {
            speaker: "W-Am",
            text: "Akira, have you seen the recent increases in shipping expenses?",
            clues: [],
          },
          {
            speaker: "M-Cn",
            text: "Yeah, baking ingredients are becoming expensive to import. But our pastries are made with imported specialty flour and butter. And customers love them.",
            clues: [59],
          },
          {
            speaker: "W-Am",
            text: "I know, but I'd rather reduce our expenses than increase our prices. I think we should look for domestic suppliers that offer similar ingredients for less.",
            clues: [60],
          },
          {
            speaker: "M-Cn",
            text: "It's an option, but we'll have to test all of the recipes. I'm worried that using different ingredients will change the taste. We need to make sure we're still producing the quality baked goods that our customers expect.",
            clues: [61],
          },
        ],
        questions: [
          {
            number: 59,
            question:
              "What type of business do the speakers most likely operate?",
            options: [
              "A cooking school",
              "A kitchen supply store",
              "A dairy farm",
              "A specialty bakery",
            ],
            correct: 3,
            explanation:
              'Họ làm bánh ngọt ("pastries", "baked goods") từ bột mì và bơ chuyên dụng ("specialty flour and butter") -> Tiệm bánh chuyên biệt.',
            clueQuote:
              '"our pastries are made with imported specialty flour and butter."',
          },
          {
            number: 60,
            question: "How does the woman want to reduce expenses?",
            options: [
              "By relocating a business",
              "By shortening operating hours",
              "By using local suppliers",
              "By purchasing in bulk",
            ],
            correct: 2,
            explanation:
              'Cô ấy đề nghị tìm các nhà cung cấp trong nước ("look for domestic suppliers") bán nguyên liệu tương tự với giá rẻ hơn.',
            clueQuote:
              '"I think we should look for domestic suppliers that offer similar ingredients for less."',
          },
          {
            number: 61,
            question: "What is the man concerned about?",
            options: [
              "A change may affect product quality.",
              "A new recipe has not been successful.",
              "An ingredient is no longer being sold.",
              "A competing business is expanding.",
            ],
            correct: 0,
            explanation:
              'Akira lo rằng dùng nguyên liệu khác sẽ làm thay đổi hương vị và chất lượng bánh ("change the taste... producing the quality baked goods").',
            clueQuote:
              '"I\'m worried that using different ingredients will change the taste."',
          },
        ],
      },
      {
        id: "t3_62_64",
        range: "62 - 64",
        topic: "Vận chuyển linh kiện tua-bin gió siêu trường",
        graphic: {
          type: "wind_turbine",
          title: "Wind Turbine Dimensions",
          parts: [
            { name: "Tower", length: "66 meters", highlight: true },
            { name: "Blades", length: "49 meters", highlight: false },
            { name: "Foundation", length: "22 meters", highlight: false },
            { name: "Engine Case", length: "9 meters", highlight: false },
          ],
        },
        script: [
          {
            speaker: "M-Cn",
            text: "Hi, Elise. Good news—the last of the parts for the wind turbine have arrived.",
            clues: [62],
          },
          {
            speaker: "W-Br",
            text: "Great! Now we can start transporting them to the designated site in Bloomington on Tuesday.",
            clues: [62],
          },
          {
            speaker: "M-Cn",
            text: "Well, I'm meeting tomorrow with local officials to discuss temporarily closing down part of the road while we transport everything.",
            clues: [63],
          },
          {
            speaker: "W-Br",
            text: "OK. The foundation is already installed at the site, right? So let's send the longest part next.",
            clues: [64],
          },
          {
            speaker: "M-Cn",
            text: "Exactly. That way we'll only need the road closed for a day. I'll let you know when we get approval so you can schedule the drivers.",
            clues: [],
          },
        ],
        questions: [
          {
            number: 62,
            question: "What are the speakers mainly discussing?",
            options: [
              "An inspection of a facility",
              "Transportation of some parts",
              "A revised government policy",
              "Some upcoming road construction",
            ],
            correct: 1,
            explanation:
              'Họ thảo luận về việc vận chuyển các bộ phận của tua-bin gió đến công trường ở Bloomington ("start transporting them to the designated site").',
            clueQuote:
              '"the last of the parts for the wind turbine have arrived. - Great! Now we can start transporting them"',
          },
          {
            number: 63,
            question: "What does the man say he will do tomorrow?",
            options: [
              "Calculate a distance",
              "Adjust a budget",
              "Talk to local officials",
              "Print a permit",
            ],
            correct: 2,
            explanation:
              'Ngày mai anh ấy sẽ họp với các quan chức địa phương ("meeting tomorrow with local officials") để xin tạm đóng một phần đường.',
            clueQuote:
              '"I\'m meeting tomorrow with local officials to discuss temporarily closing down part of the road"',
          },
          {
            number: 64,
            question:
              "Look at the graphic. According to the speakers, what will be shipped next?",
            options: [
              "The engine case",
              "The tower",
              "The foundation",
              "The blades",
            ],
            correct: 1,
            explanation:
              'Họ quyết định gửi bộ phận dài nhất tiếp theo ("send the longest part next"). Nhìn sơ đồ kích thước: Tower = 66 meters (dài nhất), Blades = 49m, Foundation = 22m, Engine Case = 9m.',
            clueQuote: '"So let\'s send the longest part next."',
          },
        ],
      },
      {
        id: "t3_65_67",
        range: "65 - 67",
        topic: "Bố trí máy quay phim tại hội nghị kỹ thuật",
        graphic: {
          type: "auditorium",
          title: "Auditorium Camera Layout",
        },
        script: [
          {
            speaker: "W-Am",
            text: "Hey, Jerome. We're hosting the engineering conference this weekend. You're in charge of filming the presentations in the auditorium, right?",
            clues: [65],
          },
          {
            speaker: "M-Au",
            text: "Yes. And the conference organizers asked me to set up some additional cameras. Here's the new layout.",
            clues: [66],
          },
          {
            speaker: "W-Am",
            text: "Do you have enough people to handle that?",
            clues: [],
          },
          {
            speaker: "M-Au",
            text: "All set. I have people for the positions at the sides of the auditorium and the one near the stage. I want to run the camera at the back of the auditorium myself.",
            clues: [67],
          },
        ],
        questions: [
          {
            number: 65,
            question: "What event are the speakers preparing for?",
            options: [
              "A professional conference",
              "A political debate",
              "An awards ceremony",
              "A musical concert",
            ],
            correct: 0,
            explanation:
              'Cuối tuần này họ tổ chức hội nghị kỹ thuật ("hosting the engineering conference this weekend") -> Một hội nghị chuyên ngành.',
            clueQuote:
              '"We\'re hosting the engineering conference this weekend."',
          },
          {
            number: 66,
            question: "What was the man asked to do?",
            options: [
              "Collect tickets",
              "Leave empty rows near the stage",
              "Set up some extra equipment",
              "Pass out programs",
            ],
            correct: 2,
            explanation:
              'Ban tổ chức yêu cầu anh lắp đặt thêm một số máy quay ("set up some additional cameras") -> Lắp thêm thiết bị.',
            clueQuote:
              '"the conference organizers asked me to set up some additional cameras."',
          },
          {
            number: 67,
            question:
              "Look at the graphic. Where will the man most likely be working during the event?",
            options: [
              "At Position 1",
              "At Position 2",
              "At Position 3",
              "At Position 4",
            ],
            correct: 3,
            explanation:
              'Jerome nói anh muốn tự điều khiển máy quay ở phía cuối khán phòng ("run the camera at the back of the auditorium myself"). Trên sơ đồ: Position 1 gần sân khấu (Stage), Position 2 & 3 ở hai bên (sides), và Position 4 ở cuối khán phòng gần lối vào (Auditorium Entrance).',
            clueQuote:
              '"I want to run the camera at the back of the auditorium myself."',
          },
        ],
      },
      {
        id: "t3_68_70",
        range: "68 - 70",
        topic: "Đón tiếp khách hàng & Thuê xe đạp dạo thành phố",
        graphic: {
          type: "bike_table",
          title: "Bike Rental Stations — Nearby Locations",
          headers: ["Location", "Available Bicycles"],
          rows: [
            ["65 Elm St.", "1"],
            ["2 Peach St.", "4"],
            ["41 Ames Ave.", "3"],
            ["7 Edson Rd.", "2"],
          ],
        },
        script: [
          {
            speaker: "W-Br",
            text: "Since our meetings with the clients don't start until tomorrow, where should we take them this afternoon? They said they're interested in visiting some art museums.",
            clues: [68],
          },
          {
            speaker: "M-Au",
            text: "But it's Monday. The museums are all closed today. I still have some bus passes for a tour of the city... How about that?",
            clues: [69],
          },
          {
            speaker: "W-Br",
            text: "Actually, the weather's nice. Maybe we could rent bikes. Here, look at this mobile phone application. It has a list of the closest locations of the rental stations and how many bicycles are available.",
            clues: [],
          },
          {
            speaker: "M-Au",
            text: "Oh, great. Let's see—we'll need four bikes. Based on the app, it seems only one station near here has enough available bikes.",
            clues: [70],
          },
        ],
        questions: [
          {
            number: 68,
            question: "What does the woman say about the clients?",
            options: [
              "Their flight was delayed.",
              "Their contract has not been signed.",
              "They prefer to try a seafood restaurant.",
              "They want to visit museums.",
            ],
            correct: 3,
            explanation:
              'Khách hàng nói họ thích đi tham quan các bảo tàng nghệ thuật ("interested in visiting some art museums").',
            clueQuote:
              '"They said they\'re interested in visiting some art museums."',
          },
          {
            number: 69,
            question: "What does the man suggest doing?",
            options: [
              "Updating an event calendar",
              "Trying some local food",
              "Taking a bus tour",
              "Making reservations",
            ],
            correct: 2,
            explanation:
              'Anh ấy gợi ý dùng vé xe buýt để đi tham quan thành phố ("bus passes for a tour of the city... How about that?").',
            clueQuote:
              '"I still have some bus passes for a tour of the city... How about that?"',
          },
          {
            number: 70,
            question:
              "Look at the graphic. Which location will the speakers go to?",
            options: [
              "65 Elm St.",
              "2 Peach St.",
              "41 Ames Ave.",
              "7 Edson Rd.",
            ],
            correct: 1,
            explanation:
              'Họ cần 4 chiếc xe đạp ("we\'ll need four bikes"). Trong bảng chỉ có trạm 2 Peach St. có đủ 4 xe khả dụng.',
            clueQuote:
              '"we\'ll need four bikes. Based on the app, it seems only one station near here has enough available bikes."',
          },
        ],
      },
    ],
  },
};

// ============================================================================
// COMPONENT HIỂN THỊ BIỂU ĐỒ / SƠ ĐỒ MINH HỌA (GRAPHICS)
// ============================================================================
const GraphicCard = ({ graphic }) => {
  if (!graphic) return null;

  return (
    <div className="my-4 rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 border-b border-indigo-100 pb-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
          {graphic.type === "schedule" && <Calendar className="h-4 w-4" />}
          {graphic.type === "rail_map" && <MapPin className="h-4 w-4" />}
          {graphic.type === "table" && <Headphones className="h-4 w-4" />}
          {graphic.type === "receipt" && <Receipt className="h-4 w-4" />}
          {graphic.type === "street_map" && <MapPin className="h-4 w-4" />}
          {graphic.type === "departures" && <Plane className="h-4 w-4" />}
          {graphic.type === "wind_turbine" && <Wind className="h-4 w-4" />}
          {graphic.type === "auditorium" && <Video className="h-4 w-4" />}
          {graphic.type === "bike_table" && <Bike className="h-4 w-4" />}
        </span>
        <h4 className="text-sm font-bold uppercase tracking-wide text-indigo-950">
          {graphic.title}
        </h4>
      </div>

      {/* Bảng tiêu chuẩn (Schedule, Table, Bike Table) */}
      {(graphic.type === "schedule" ||
        graphic.type === "table" ||
        graphic.type === "bike_table") && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                {graphic.headers.map((h, i) => (
                  <th key={i} className="px-3.5 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {graphic.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-indigo-50/50">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-3.5 py-2 ${cIdx === 0 ? "font-semibold text-slate-900" : "text-slate-700"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sơ đồ mạng lưới tàu điện (Test 1: 65-67) */}
      {graphic.type === "rail_map" && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {graphic.lines.map((line, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-3.5 w-3.5 rounded-full ${line.color}`} />
                <span className="font-bold text-slate-800">{line.name}</span>
              </div>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                {line.station}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Hóa đơn mua hàng (Test 2: 62-64) */}
      {graphic.type === "receipt" && (
        <div className="mx-auto max-w-xs rounded-lg border border-dashed border-slate-400 bg-white p-4 font-mono text-sm shadow-xs">
          <div className="mb-2 border-b border-dashed border-slate-300 pb-2 text-center font-bold text-slate-800">
            JAY'S RETAIL OUTLET
          </div>
          <div className="space-y-1.5">
            {graphic.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-700">
                <span>{item.name}</span>
                <span className="font-semibold">{item.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-dashed border-slate-400 pt-2 text-base font-bold text-slate-900">
            <span>Total</span>
            <span>{graphic.total}</span>
          </div>
        </div>
      )}

      {/* Bản đồ đường phố Mill St & Durham Rd (Test 2: 65-67) */}
      {graphic.type === "street_map" && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-3">
          <svg viewBox="0 0 420 220" className="mx-auto h-48 w-full max-w-md">
            {/* Nền cỏ & công viên */}
            <rect
              x="230"
              y="135"
              width="170"
              height="70"
              rx="8"
              fill="#dcfce7"
              stroke="#86efac"
              strokeWidth="2"
            />
            <text
              x="315"
              y="175"
              textAnchor="middle"
              fill="#166534"
              fontSize="13"
              fontWeight="bold"
            >
              🌳 City Park
            </text>

            {/* Đường dọc bên trái */}
            <rect x="175" y="10" width="28" height="200" fill="#cbd5e1" />
            {/* Đường ngang Mill Street */}
            <rect x="10" y="95" width="400" height="26" fill="#cbd5e1" />
            <text
              x="95"
              y="112"
              textAnchor="middle"
              fill="#334155"
              fontSize="11"
              fontWeight="bold"
            >
              Mill Street
            </text>
            {/* Đường dọc Durham Road */}
            <rect x="200" y="95" width="24" height="115" fill="#cbd5e1" />
            <text
              x="212"
              y="165"
              textAnchor="middle"
              fill="#334155"
              fontSize="10"
              fontWeight="bold"
              transform="rotate(-90 212 165)"
            >
              Durham Road
            </text>

            {/* Bus Stop */}
            <rect
              x="55"
              y="65"
              width="68"
              height="22"
              rx="4"
              fill="#fef3c7"
              stroke="#f59e0b"
            />
            <text
              x="89"
              y="80"
              textAnchor="middle"
              fill="#92400e"
              fontSize="10"
              fontWeight="bold"
            >
              🚏 Bus Stop
            </text>

            {/* Building 1 */}
            <rect
              x="225"
              y="55"
              width="75"
              height="32"
              rx="5"
              fill="#e0e7ff"
              stroke="#6366f1"
              strokeWidth="1.5"
            />
            <text
              x="262"
              y="75"
              textAnchor="middle"
              fill="#312e81"
              fontSize="11"
              fontWeight="bold"
            >
              Building 1
            </text>

            {/* Building 2 */}
            <rect
              x="225"
              y="15"
              width="75"
              height="32"
              rx="5"
              fill="#e0e7ff"
              stroke="#6366f1"
              strokeWidth="1.5"
            />
            <text
              x="262"
              y="35"
              textAnchor="middle"
              fill="#312e81"
              fontSize="11"
              fontWeight="bold"
            >
              Building 2
            </text>

            {/* Building 3 */}
            <rect
              x="95"
              y="135"
              width="72"
              height="36"
              rx="5"
              fill="#e0e7ff"
              stroke="#6366f1"
              strokeWidth="1.5"
            />
            <text
              x="131"
              y="157"
              textAnchor="middle"
              fill="#312e81"
              fontSize="11"
              fontWeight="bold"
            >
              Building 3
            </text>

            {/* Building 4 */}
            <rect
              x="95"
              y="176"
              width="72"
              height="34"
              rx="5"
              fill="#e0e7ff"
              stroke="#6366f1"
              strokeWidth="1.5"
            />
            <text
              x="131"
              y="197"
              textAnchor="middle"
              fill="#312e81"
              fontSize="11"
              fontWeight="bold"
            >
              Building 4
            </text>
          </svg>
        </div>
      )}

      {/* Bảng chuyến bay khởi hành (Test 2: 68-70) */}
      {graphic.type === "departures" && (
        <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900 text-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-amber-400">
              <tr>
                <th className="px-3.5 py-2">Destination</th>
                <th className="px-3.5 py-2">Scheduled</th>
                <th className="px-3.5 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {graphic.flights.map((f, idx) => (
                <tr key={idx}>
                  <td className="px-3.5 py-2 font-bold">{f.dest}</td>
                  <td className="px-3.5 py-2 font-mono text-slate-300">
                    {f.time}
                  </td>
                  <td className="px-3.5 py-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold text-amber-300">
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sơ đồ kích thước Wind Turbine (Test 3: 62-64) */}
      {graphic.type === "wind_turbine" && (
        <div className="grid grid-cols-1 items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
          <svg
            viewBox="0 0 220 200"
            className="mx-auto h-44 w-full max-w-[200px]"
          >
            {/* Foundation */}
            <rect x="85" y="165" width="50" height="22" rx="3" fill="#94a3b8" />
            <text
              x="110"
              y="180"
              textAnchor="middle"
              fill="#fff"
              fontSize="9"
              fontWeight="bold"
            >
              Foundation
            </text>
            {/* Tower */}
            <polygon points="103,65 117,65 121,165 99,165" fill="#4f46e5" />
            {/* Engine Case */}
            <rect x="96" y="54" width="28" height="14" rx="4" fill="#1e293b" />
            {/* Blades */}
            <line
              x1="110"
              y1="60"
              x2="110"
              y2="10"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="110"
              y1="60"
              x2="65"
              y2="90"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="110"
              y1="60"
              x2="155"
              y2="90"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="110" cy="60" r="5" fill="#f59e0b" />
          </svg>
          <div className="space-y-2">
            {graphic.parts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-slate-800">{p.name}</span>
                <span className="rounded-md bg-indigo-100 px-2.5 py-0.5 font-mono font-bold text-indigo-800">
                  {p.length}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sơ đồ khán phòng Auditorium (Test 3: 65-67) */}
      {graphic.type === "auditorium" && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mx-auto max-w-sm rounded-xl border-2 border-slate-300 bg-slate-50 p-4 text-center">
            {/* Stage */}
            <div className="mx-auto mb-5 w-3/4 rounded-lg bg-indigo-600 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
              Stage (Sân khấu)
            </div>

            {/* Position 1 */}
            <div className="mb-4 flex justify-center">
              <span className="rounded-full border-2 border-indigo-600 bg-white px-3 py-1 text-xs font-bold text-indigo-800 shadow-xs">
                📷 Position 1
              </span>
            </div>

            {/* Seating Area + Position 2 & 3 */}
            <div className="my-3 flex items-center justify-between gap-2">
              <span className="rounded-full border-2 border-indigo-600 bg-white px-2.5 py-1 text-xs font-bold text-indigo-800 shadow-xs">
                📷 Position 2
              </span>
              <div className="flex-1 rounded-lg border border-dashed border-slate-300 bg-slate-100 py-5 text-xs font-medium text-slate-500">
                Khu vực ghế ngồi khán giả
              </div>
              <span className="rounded-full border-2 border-indigo-600 bg-white px-2.5 py-1 text-xs font-bold text-indigo-800 shadow-xs">
                📷 Position 3
              </span>
            </div>

            {/* Position 4 */}
            <div className="mt-4 flex justify-center">
              <span className="rounded-full border-2 border-indigo-600 bg-white px-3 py-1 text-xs font-bold text-indigo-800 shadow-xs">
                📷 Position 4
              </span>
            </div>

            {/* Entrance */}
            <div className="mx-auto mt-5 w-2/3 rounded-md border border-slate-400 bg-slate-200 py-1.5 text-xs font-bold text-slate-700">
              🚪 Auditorium Entrance
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT CHÍNH CỦA ỨNG DỤNG
// ============================================================================
export default function App() {
  // Trạng thái chọn Test và chế độ luyện tập
  const [selectedTestId, setSelectedTestId] = useState("test1");
  const [mode, setMode] = useState("practice"); // 'practice' | 'exam'
  const [currentPassageIdx, setCurrentPassageIdx] = useState(0);

  // Lưu đáp án người dùng: { [questionNumber]: optionIndex }
  const [userAnswers, setUserAnswers] = useState({});
  // Trạng thái nộp bài (dùng cho chế độ Exam)
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Hiển thị Script & Giải thích theo từng cụm: { [passageId]: boolean }
  const [revealedPassages, setRevealedPassages] = useState({});
  // Highlight câu thoại tương ứng với câu hỏi đang hover/chọn: number | null
  const [activeClueQuestion, setActiveClueQuestion] = useState(null);

  // Bộ lọc sidebar
  const [filterWrongOnly, setFilterWrongOnly] = useState(false);

  // Trạng thái Text-to-Speech (Giả lập giọng đọc hội thoại)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const isPlayingRef = useRef(false);

  const currentTest = TOEIC_DATA[selectedTestId];
  const currentPassage = currentTest.passages[currentPassageIdx];

  // Tải danh sách giọng đọc của trình duyệt
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis?.getVoices() || [];
      setVoices(available);
    };
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => stopAudio();
  }, []);

  // Dừng đọc khi chuyển đoạn hội thoại hoặc chuyển đề
  useEffect(() => {
    stopAudio();
    setActiveClueQuestion(null);
  }, [selectedTestId, currentPassageIdx]);

  const stopAudio = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentLineIdx(-1);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Hàm phát giọng đọc phân vai Nam/Nữ
  const playDialogue = (startIndex = 0) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    isPlayingRef.current = true;
    setIsPlaying(true);

    const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
    const femaleVoice =
      englishVoices.find((v) =>
        /female|zira|samantha|victoria|google us english|google uk english female/i.test(
          v.name,
        ),
      ) || englishVoices[0];
    const maleVoice =
      englishVoices.find((v) =>
        /male|david|daniel|alex|google uk english male|fred/i.test(v.name),
      ) ||
      englishVoices[1] ||
      englishVoices[0];

    const speakLine = (idx) => {
      if (!isPlayingRef.current || idx >= currentPassage.script.length) {
        isPlayingRef.current = false;
        setIsPlaying(false);
        setCurrentLineIdx(-1);
        return;
      }

      setCurrentLineIdx(idx);
      const line = currentPassage.script[idx];
      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.lang = "en-US";
      utterance.rate = speechRate;

      const isFemale = line.speaker.startsWith("W");
      if (isFemale && femaleVoice) {
        utterance.voice = femaleVoice;
        utterance.pitch = 1.08;
      } else if (!isFemale && maleVoice) {
        utterance.voice = maleVoice;
        utterance.pitch = 0.92;
      }

      utterance.onend = () => {
        if (isPlayingRef.current) {
          setTimeout(() => speakLine(idx + 1), 350);
        }
      };

      utterance.onerror = () => {
        isPlayingRef.current = false;
        setIsPlaying(false);
        setCurrentLineIdx(-1);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakLine(startIndex);
  };

  // Xử lý chọn đáp án
  const handleSelectOption = (questionNumber, optionIdx) => {
    if (mode === "exam" && examSubmitted) return;

    const question = currentPassage.questions.find(
      (item) => item.number === questionNumber,
    );
    if (question) {
      window.TOEICReviewStore.recordAnswer(
        {
          id: `part3-${currentTest.id}-${currentPassage.id}-${question.number}`,
          part: 3,
          test: currentTest.title,
          number: question.number,
          prompt: question.question,
          options: question.options,
          correctIndex: question.correct,
          explanation: question.explanation,
          context: currentPassage.script
            .map((line) => `${line.speaker}: ${line.text}`)
            .join("\n"),
          source: "part3",
        },
        optionIdx,
      );
    }

    const updatedAnswers = {
      ...userAnswers,
      [questionNumber]: optionIdx,
    };
    setUserAnswers(updatedAnswers);

    // Ở chế độ Luyện tập: tự động mở Script & Giải thích khi trả lời xong cả 3 câu của cụm
    if (mode === "practice") {
      const allAnsweredInPassage = currentPassage.questions.every(
        (q) => updatedAnswers[q.number] !== undefined,
      );
      if (allAnsweredInPassage) {
        setRevealedPassages((prev) => ({
          ...prev,
          [currentPassage.id]: true,
        }));
      }
    }
  };

  // Tính toán thống kê cho Test hiện tại
  const stats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    let wrong = 0;

    currentTest.passages.forEach((p) => {
      p.questions.forEach((q) => {
        const ans = userAnswers[q.number];
        if (ans !== undefined) {
          answered++;
          if (ans === q.correct) correct++;
          else wrong++;
        }
      });
    });

    const total = 39;
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return { answered, correct, wrong, total, accuracy };
  }, [currentTest, userAnswers]);

  // Kiểm tra xem cụm hiện tại có được phép xem đáp án/giải thích chưa
  const isCurrentRevealed =
    mode === "practice" ? !!revealedPassages[currentPassage.id] : examSubmitted;

  const toggleRevealPassage = () => {
    setRevealedPassages((prev) => ({
      ...prev,
      [currentPassage.id]: !prev[currentPassage.id],
    }));
  };

  const resetCurrentTest = () => {
    stopAudio();
    const newAnswers = { ...userAnswers };
    const newRevealed = { ...revealedPassages };
    currentTest.passages.forEach((p) => {
      delete newRevealed[p.id];
      p.questions.forEach((q) => {
        delete newAnswers[q.number];
      });
    });
    setUserAnswers(newAnswers);
    setRevealedPassages(newRevealed);
    setExamSubmitted(false);
    setCurrentPassageIdx(0);
    setActiveClueQuestion(null);
  };

  // Helper hiển thị nhãn vai nói
  const getSpeakerBadge = (speaker) => {
    const map = {
      "W-Br": {
        label: "Nữ (Anh-Anh)",
        style: "bg-rose-100 text-rose-800 border-rose-200",
      },
      "W-Am": {
        label: "Nữ (Anh-Mỹ)",
        style: "bg-pink-100 text-pink-800 border-pink-200",
      },
      "M-Au": {
        label: "Nam (Anh-Úc)",
        style: "bg-sky-100 text-sky-800 border-sky-200",
      },
      "M-Cn": {
        label: "Nam (Anh-Canada)",
        style: "bg-indigo-100 text-indigo-800 border-indigo-200",
      },
    };
    return (
      map[speaker] || {
        label: speaker,
        style: "bg-slate-100 text-slate-800 border-slate-200",
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-200">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                TOEIC Part 3 Master
              </h1>
              <p className="text-xs font-medium text-slate-500">
                3 Bộ Đề • 39 Hội Thoại • 117 Câu Hỏi & Giải Thích Chi Tiết
              </p>
            </div>
          </div>

          {/* Chọn Test 1 / Test 2 / Test 3 */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
            {Object.values(TOEIC_DATA).map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTestId(t.id);
                  setCurrentPassageIdx(0);
                  setExamSubmitted(false);
                }}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-bold transition-all ${
                  selectedTestId === t.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                Test {idx + 1}
              </button>
            ))}
          </div>

          {/* Chế độ Luyện tập / Thi thử */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
              <button
                onClick={() => setMode("practice")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                  mode === "practice"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Luyện từng cụm
              </button>
              <button
                onClick={() => {
                  setMode("exam");
                  setRevealedPassages({});
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                  mode === "exam"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                Thi thử cả đề
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12">
        {/* CỘT TRÁI (8 CỘT): AUDIO PLAYER + GRAPHIC + SCRIPT + CÂU HỎI */}
        <div className="space-y-5 lg:col-span-8">
          {/* Thanh điều hướng cụm câu hỏi & Audio Player */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">
                    Câu {currentPassage.range}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Cụm {currentPassageIdx + 1} / {currentTest.passages.length}
                  </span>
                </div>
                <h2 className="mt-1.5 text-base font-bold text-slate-900 sm:text-lg">
                  Chủ đề: {currentPassage.topic}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPassageIdx((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPassageIdx === 0}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Cụm trước
                </button>
                <button
                  onClick={() =>
                    setCurrentPassageIdx((prev) =>
                      Math.min(currentTest.passages.length - 1, prev + 1),
                    )
                  }
                  disabled={
                    currentPassageIdx === currentTest.passages.length - 1
                  }
                  className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  Cụm sau
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Trình phát giọng đọc giả lập (Text-to-Speech) */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3">
              <div className="flex items-center gap-2.5">
                {!isPlaying ? (
                  <button
                    onClick={() => playDialogue(0)}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Nghe hội thoại
                  </button>
                ) : (
                  <button
                    onClick={stopAudio}
                    className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 active:scale-95"
                  >
                    <Pause className="h-4 w-4 fill-current" />
                    Dừng đọc
                  </button>
                )}

                <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-900">
                  <Volume2 className="h-4 w-4 text-indigo-600" />
                  <span>
                    {isPlaying
                      ? `Đang đọc câu ${currentLineIdx + 1}/${currentPassage.script.length}...`
                      : "Giả lập giọng đọc phân vai Anh - Mỹ"}
                  </span>
                </div>
              </div>

              {/* Tốc độ đọc & Nút Ẩn/Hiện Script */}
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-indigo-200 bg-white p-0.5 text-xs font-bold">
                  {[0.85, 1.0, 1.15].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setSpeechRate(rate)}
                      className={`rounded-md px-2 py-1 transition ${
                        speechRate === rate
                          ? "bg-indigo-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {mode === "practice" && (
                  <button
                    onClick={toggleRevealPassage}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                      isCurrentRevealed
                        ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {isCurrentRevealed ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Ẩn Script & Đáp án
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        Xem Script & Giải thích
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Hiển thị Biểu đồ / Sơ đồ nếu cụm này có Graphic */}
            <GraphicCard graphic={currentPassage.graphic} />

            {/* KHUNG SCRIPT HỘI THOẠI (Ẩn mặc định khi làm bài, hiện khi bật giải thích) */}
            {isCurrentRevealed ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Transcript Hội Thoại & Dẫn Chứng Đáp Án
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    Bấm vào câu thoại để nghe từng câu • Dòng tô vàng chứa manh
                    mối đáp án
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentPassage.script.map((line, idx) => {
                    const badge = getSpeakerBadge(line.speaker);
                    const hasClue = line.clues && line.clues.length > 0;
                    const isFocusedClue =
                      activeClueQuestion &&
                      line.clues?.includes(activeClueQuestion);
                    const isSpeakingLine = currentLineIdx === idx;

                    return (
                      <div
                        key={idx}
                        onClick={() => playDialogue(idx)}
                        className={`cursor-pointer rounded-xl border p-3 transition-all ${
                          isSpeakingLine
                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                            : isFocusedClue
                              ? "border-amber-400 bg-amber-100/90 shadow-xs"
                              : hasClue
                                ? "border-amber-200 bg-amber-50/70 hover:bg-amber-100/60"
                                : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${badge.style}`}
                          >
                            {line.speaker} • {badge.label}
                          </span>
                          {hasClue && (
                            <div className="flex items-center gap-1">
                              {line.clues.map((cNum) => (
                                <span
                                  key={cNum}
                                  className="rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white"
                                >
                                  Dẫn chứng Câu {cNum}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed text-slate-800">
                          {line.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-3 text-xs text-slate-500">
                <span>
                  🎧 Script hội thoại đang được ẩn để bạn rèn kỹ năng nghe & đọc
                  câu hỏi.
                </span>
                {mode === "practice" && (
                  <span className="font-semibold text-indigo-600">
                    Chọn đủ 3 đáp án bên dưới để tự động mở giải thích!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* DANH SÁCH 3 CÂU HỎI TRẮC NGHIỆM */}
          <div className="space-y-4">
            {currentPassage.questions.map((q) => {
              const selectedOpt = userAnswers[q.number];
              const isCorrect = selectedOpt === q.correct;

              return (
                <div
                  key={q.number}
                  onMouseEnter={() =>
                    isCurrentRevealed && setActiveClueQuestion(q.number)
                  }
                  onMouseLeave={() => setActiveClueQuestion(null)}
                  className={`rounded-2xl border bg-white p-4 shadow-xs transition-all sm:p-5 ${
                    isCurrentRevealed
                      ? isCorrect
                        ? "border-emerald-200"
                        : "border-rose-200"
                      : "border-slate-200"
                  }`}
                >
                  {/* Tiêu đề câu hỏi */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-900">
                      <span className="mr-2 inline-block rounded-lg bg-slate-800 px-2.5 py-0.5 text-sm font-extrabold text-white">
                        {q.number}
                      </span>
                      {q.question}
                    </h3>

                    {isCurrentRevealed && (
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Chính xác
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" />{" "}
                            {selectedOpt === undefined
                              ? "Chưa chọn"
                              : "Chưa đúng"}
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* 4 lựa chọn A, B, C, D */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {q.options.map((optText, optIdx) => {
                      const letter = ["A", "B", "C", "D"][optIdx];
                      const isSelected = selectedOpt === optIdx;
                      const isRightAnswer = q.correct === optIdx;

                      let btnStyle =
                        "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40";

                      if (!isCurrentRevealed) {
                        if (isSelected) {
                          btnStyle =
                            "border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-200 font-semibold";
                        }
                      } else {
                        if (isRightAnswer) {
                          btnStyle =
                            "border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200 font-bold";
                        } else if (isSelected && !isRightAnswer) {
                          btnStyle =
                            "border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-200 font-semibold";
                        } else {
                          btnStyle =
                            "border-slate-100 bg-slate-50 text-slate-400";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.number, optIdx)}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all ${btnStyle}`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                              isCurrentRevealed && isRightAnswer
                                ? "bg-emerald-600 text-white"
                                : isCurrentRevealed &&
                                    isSelected &&
                                    !isRightAnswer
                                  ? "bg-rose-600 text-white"
                                  : isSelected
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="flex-1">{optText}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* KHUNG GIẢI THÍCH CHI TIẾT BẰNG TIẾNG VIỆT */}
                  {isCurrentRevealed && (
                    <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 text-sm">
                      <div className="mb-1.5 flex items-center gap-1.5 font-bold text-indigo-900">
                        <HelpCircle className="h-4 w-4 text-indigo-600" />
                        <span>
                          Giải thích đáp án ({["A", "B", "C", "D"][q.correct]}):
                        </span>
                      </div>
                      <p className="leading-relaxed text-slate-700">
                        {q.explanation}
                      </p>
                      <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-950">
                        <span className="font-bold text-amber-700">
                          📌 Dẫn chứng trong bài:{" "}
                        </span>
                        <span className="italic">{q.clueQuote}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI (4 CỘT): BẢNG ĐIỀU HƯỚNG CÂU HỎI & THỐNG KÊ TIẾN ĐỘ */}
        <aside className="space-y-5 lg:col-span-4">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                  Bảng Câu Hỏi ({currentTest.title.split(" ")[0]}{" "}
                  {currentTest.title.split(" ")[1]})
                </h3>
              </div>
              <button
                onClick={resetCurrentTest}
                title="Làm lại bộ đề này"
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Làm lại
              </button>
            </div>

            {/* Thống kê điểm số */}
            <div className="mb-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 p-2.5">
                <div className="text-lg font-extrabold text-slate-900">
                  {stats.answered}/{stats.total}
                </div>
                <div className="text-[11px] font-medium text-slate-500">
                  Đã làm
                </div>
              </div>
              <div className="rounded-xl bg-emerald-50 p-2.5">
                <div className="text-lg font-extrabold text-emerald-700">
                  {stats.correct}
                </div>
                <div className="text-[11px] font-medium text-emerald-600">
                  Câu đúng
                </div>
              </div>
              <div className="rounded-xl bg-indigo-50 p-2.5">
                <div className="text-lg font-extrabold text-indigo-700">
                  {stats.accuracy}%
                </div>
                <div className="text-[11px] font-medium text-indigo-600">
                  Chính xác
                </div>
              </div>
            </div>

            {/* Nút Nộp bài cho chế độ Thi thử cả đề */}
            {mode === "exam" && (
              <div className="mb-4">
                {!examSubmitted ? (
                  <button
                    onClick={() => setExamSubmitted(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:from-indigo-700 hover:to-blue-700"
                  >
                    <Award className="h-4 w-4" />
                    Nộp bài & Chấm điểm cả đề
                  </button>
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                    <p className="text-xs font-bold uppercase text-emerald-800">
                      Kết quả bài thi thử
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-emerald-700">
                      {stats.correct} / {stats.total} câu đúng
                    </p>
                    <p className="mt-0.5 text-xs text-emerald-600">
                      Bấm vào từng cụm bên dưới để xem Script & giải thích chi
                      tiết!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bộ lọc chỉ xem cụm có câu sai */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                Danh sách 13 cụm hội thoại:
              </span>
              <button
                onClick={() => setFilterWrongOnly(!filterWrongOnly)}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${
                  filterWrongOnly
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Filter className="h-3 w-3" />
                {filterWrongOnly ? "Đang lọc câu sai" : "Lọc câu sai"}
              </button>
            </div>

            {/* Lưới điều hướng nhanh 13 cụm (32-70) */}
            <div className="max-h-[440px] space-y-2 overflow-y-auto pr-1">
              {currentTest.passages.map((passage, pIdx) => {
                const isSelectedPassage = pIdx === currentPassageIdx;
                const isPassageRevealed =
                  mode === "practice"
                    ? !!revealedPassages[passage.id]
                    : examSubmitted;

                const hasWrongInPassage = passage.questions.some(
                  (q) =>
                    userAnswers[q.number] !== undefined &&
                    userAnswers[q.number] !== q.correct,
                );

                if (filterWrongOnly && !hasWrongInPassage) return null;

                return (
                  <div
                    key={passage.id}
                    onClick={() => setCurrentPassageIdx(pIdx)}
                    className={`cursor-pointer rounded-xl border p-2.5 transition-all ${
                      isSelectedPassage
                        ? "border-indigo-600 bg-indigo-50/70 shadow-xs"
                        : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-800">
                        Câu {passage.range}
                      </span>
                      <span className="max-w-[140px] truncate text-[11px] font-medium text-slate-500">
                        {passage.topic}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {passage.questions.map((q) => {
                        const ans = userAnswers[q.number];
                        const isAnswered = ans !== undefined;
                        const isRight = ans === q.correct;

                        let pillClass = "bg-slate-100 text-slate-600";
                        if (isAnswered) {
                          if (!isPassageRevealed) {
                            pillClass = "bg-indigo-600 text-white";
                          } else {
                            pillClass = isRight
                              ? "bg-emerald-500 text-white"
                              : "bg-rose-500 text-white";
                          }
                        }

                        return (
                          <div
                            key={q.number}
                            className={`flex items-center justify-center rounded-lg py-1 text-xs font-bold ${pillClass}`}
                          >
                            {q.number}
                            {isAnswered && (
                              <span className="ml-1 text-[10px] opacity-90">
                                ({["A", "B", "C", "D"][ans]})
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
