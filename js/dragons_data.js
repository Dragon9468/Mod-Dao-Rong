/**
 * Dữ Liệu Rồng, Nguyên Tố, Công Thức Lai Giống & Kỹ Năng - Đảo Rồng Zing Me
 */

const ELEMENTS = {
  FIRE: {
    id: 'FIRE',
    name: 'Hỏa',
    icon: '🔥',
    color: '#ef4444',
    bgGradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    advantage: 'LEAF',
    disadvantage: 'WATER',
    desc: 'Thiêu rụi Thảo Mộc nhưng bị Thủy Triều khắc chế.'
  },
  WATER: {
    id: 'WATER',
    name: 'Thủy',
    icon: '💧',
    color: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    advantage: 'FIRE',
    disadvantage: 'THUNDER',
    desc: 'Dập tắt Ngọn Lửa nhưng bị Sấm Sét dẫn điện gây sát thương.'
  },
  LEAF: {
    id: 'LEAF',
    name: 'Mộc',
    icon: '🍃',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #10b981, #059669)',
    advantage: 'EARTH',
    disadvantage: 'FIRE',
    desc: 'Rễ cây hút kiệt Đất Đá nhưng dễ bị Hỏa Thần thiêu cháy.'
  },
  EARTH: {
    id: 'EARTH',
    name: 'Thổ',
    icon: '⛰️',
    color: '#b45309',
    bgGradient: 'linear-gradient(135deg, #d97706, #b45309)',
    advantage: 'THUNDER',
    disadvantage: 'LEAF',
    desc: 'Đất đá cản đứng Sấm Sét nhưng bị Rễ Cây Thảo Mộc xuyên thủng.'
  },
  THUNDER: {
    id: 'THUNDER',
    name: 'Lôi',
    icon: '⚡',
    color: '#eab308',
    bgGradient: 'linear-gradient(135deg, #facc15, #ca8a04)',
    advantage: 'WATER',
    disadvantage: 'EARTH',
    desc: 'Điện kích lan truyền qua Nước nhưng bị Đất Đá triệt tiêu.'
  },
  ICE: {
    id: 'ICE',
    name: 'Băng',
    icon: '❄️',
    color: '#38bdf8',
    bgGradient: 'linear-gradient(135deg, #38bdf8, #0284c7)',
    advantage: 'FIRE',
    disadvantage: 'LEAF',
    desc: 'Hàn khí đóng băng vạn vật.'
  },
  LIGHT: {
    id: 'LIGHT',
    name: 'Quang',
    icon: '☀️',
    color: '#fbbf24',
    bgGradient: 'linear-gradient(135deg, #fde047, #f59e0b)',
    advantage: 'DARK',
    disadvantage: 'DARK',
    desc: 'Ánh hào quang thánh khiết, tương khắc kép cùng Hắc Ám.'
  },
  DARK: {
    id: 'DARK',
    name: 'Ám',
    icon: '🌑',
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #a855f7, #6d28d9)',
    advantage: 'LIGHT',
    disadvantage: 'LIGHT',
    desc: 'Bóng tối vực thẳm nuốt chửng ánh sáng.'
  },
  LEGEND: {
    id: 'LEGEND',
    name: 'Thần Long',
    icon: '👑',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    advantage: 'ALL',
    disadvantage: 'NONE',
    desc: 'Chúa tể muôn loài rồng, sở hữu sức mạnh áp đảo ngũ hành.'
  },
  BONE: {
    id: 'BONE',
    name: 'Cốt Long (Xương)',
    icon: '💀',
    color: '#f1f5f9',
    bgGradient: 'linear-gradient(135deg, #f8fafc, #94a3b8)',
    advantage: 'ALL',
    disadvantage: 'NONE',
    desc: 'Tộc Rồng Xương huyền thoại Zing Me, bất tử và sở hữu lực sát thương cực hạn.'
  },
  STEEL: {
    id: 'STEEL',
    name: 'Thiết Giáp',
    icon: '⚔️',
    color: '#94a3b8',
    bgGradient: 'linear-gradient(135deg, #cbd5e1, #64748b)',
    advantage: 'THUNDER',
    disadvantage: 'FIRE',
    desc: 'Lớp giáp thép kiên cố chống đỡ mọi đòn tấn công.'
  }
};

const DRAGONS_DB = {
  // --- 1. RỒNG CƠ BẢN (1 SAO) ---
  dragon_fire: {
    id: 'dragon_fire',
    name: 'Rồng Lửa (Hỏa Long)',
    title: 'Ngọn Lửa Bất Diệt',
    elements: ['FIRE'],
    rarity: 1,
    rarityLabel: 'Cơ Bản ⭐',
    hatchTime: 15, // 15 seconds
    shopPriceGold: 100,
    shopPriceGems: 0,
    baseStats: { hp: 120, atk: 28, def: 12, spd: 14 },
    baseGoldRate: 6, // 6 gold/min
    skills: {
      normal: { name: 'Cào Lửa', power: 30, desc: 'Tấn công móng vuốt bốc lửa.' },
      elemental: { name: 'Hỏa Cầu', power: 55, element: 'FIRE', desc: 'Phun cầu lửa rực cháy thiêu đối thủ.' },
      ultimate: { name: 'Hỏa Ngục Bùng Nổ', power: 110, element: 'FIRE', desc: 'Triệu hồi biển lửa địa ngục.' }
    },
    appearance: {
      primaryColor: '#ef4444',
      secondaryColor: '#f97316',
      eyeColor: '#fef08a',
      hornColor: '#7f1d1d',
      bellyColor: '#fed7aa',
      glow: 'rgba(239, 68, 68, 0.6)'
    },
    desc: 'Loài rồng dũng mãnh sinh ra từ miệng núi lửa nóng rực. Tính cách bộc trực, thích thức ăn cay nóng.'
  },

  dragon_water: {
    id: 'dragon_water',
    name: 'Rồng Nước (Thủy Long)',
    title: 'Hơi Thở Biển Khơi',
    elements: ['WATER'],
    rarity: 1,
    rarityLabel: 'Cơ Bản ⭐',
    hatchTime: 20,
    shopPriceGold: 150,
    shopPriceGems: 0,
    baseStats: { hp: 140, atk: 22, def: 18, spd: 12 },
    baseGoldRate: 6,
    skills: {
      normal: { name: 'Tạt Nước', power: 25, desc: 'Quẫy đuôi tạt dòng nước xiết.' },
      elemental: { name: 'Thủy Triều', power: 50, element: 'WATER', desc: 'Cuộn trào sóng nước đè bẹp kẻ thù.' },
      ultimate: { name: 'Đại Hồng Thủy', power: 100, element: 'WATER', desc: 'Sóng thần dâng cao cuốn phăng sàn đấu.' }
    },
    appearance: {
      primaryColor: '#06b6d4',
      secondaryColor: '#38bdf8',
      eyeColor: '#a5f3fc',
      hornColor: '#164e63',
      bellyColor: '#cffafe',
      glow: 'rgba(6, 182, 212, 0.6)'
    },
    desc: 'Loài rồng uyển chuyển bơi lội dưới đáy hồ sâu. Da dẻ mát lạnh và mang tính cách hiền hòa.'
  },

  dragon_leaf: {
    id: 'dragon_leaf',
    name: 'Rồng Lá (Thảo Long)',
    title: 'Vệ Thần Rừng Xanh',
    elements: ['LEAF'],
    rarity: 1,
    rarityLabel: 'Cơ Bản ⭐',
    hatchTime: 20,
    shopPriceGold: 150,
    shopPriceGems: 0,
    baseStats: { hp: 130, atk: 24, def: 16, spd: 13 },
    baseGoldRate: 6,
    skills: {
      normal: { name: 'Roi Gai', power: 28, desc: 'Dùng dây leo quất mạnh.' },
      elemental: { name: 'Phi Diệp Trảm', power: 52, element: 'LEAF', desc: 'Bắn loạt lá sắc bén như ngàn phi tiêu.' },
      ultimate: { name: 'Cơn Bão Cây Rừng', power: 105, element: 'LEAF', desc: 'Gọi rễ cây cổ thụ khổng lồ trói nghiền địch.' }
    },
    appearance: {
      primaryColor: '#10b981',
      secondaryColor: '#34d399',
      eyeColor: '#fef08a',
      hornColor: '#064e3b',
      bellyColor: '#d1fae5',
      glow: 'rgba(16, 185, 129, 0.6)'
    },
    desc: 'Được sinh ra từ nụ hoa ngàn năm trên đỉnh núi cao. Thích tắm nắng và bảo vệ các sinh linh nhỏ.'
  },

  dragon_earth: {
    id: 'dragon_earth',
    name: 'Rồng Đất (Nham Long)',
    title: 'Khiên Chắn Bất Hoại',
    elements: ['EARTH'],
    rarity: 1,
    rarityLabel: 'Cơ Bản ⭐',
    hatchTime: 25,
    shopPriceGold: 200,
    shopPriceGems: 0,
    baseStats: { hp: 160, atk: 20, def: 24, spd: 9 },
    baseGoldRate: 7,
    skills: {
      normal: { name: 'Đấm Đá', power: 26, desc: 'Vung nắm đấm bằng đá hoa cương.' },
      elemental: { name: 'Thạch Chấn', power: 48, element: 'EARTH', desc: 'Dộng đất làm rung chuyển mặt trận.' },
      ultimate: { name: 'Mưa Thiên Thạch', power: 105, element: 'EARTH', desc: 'Gọi khối đá khổng lồ giáng xuống từ tầng mây.' }
    },
    appearance: {
      primaryColor: '#d97706',
      secondaryColor: '#b45309',
      eyeColor: '#fed7aa',
      hornColor: '#451a03',
      bellyColor: '#fde68a',
      glow: 'rgba(217, 119, 6, 0.6)'
    },
    desc: 'Lưng bọc lớp giáp đá siêu dày không vũ khí nào xuyên qua được. Bước đi nặng nề nhưng vô cùng vững vàng.'
  },

  dragon_thunder: {
    id: 'dragon_thunder',
    name: 'Rồng Sấm (Lôi Long)',
    title: 'Tốc Độ Ánh Sáng',
    elements: ['THUNDER'],
    rarity: 2,
    rarityLabel: 'Hiếm ⭐⭐',
    hatchTime: 40,
    shopPriceGold: 500,
    shopPriceGems: 10,
    baseStats: { hp: 125, atk: 35, def: 11, spd: 22 },
    baseGoldRate: 10,
    skills: {
      normal: { name: 'Cú Chích Điện', power: 32, desc: 'Tia tĩnh điện châm chích.' },
      elemental: { name: 'Sấm Sét Rền Vang', power: 65, element: 'THUNDER', desc: 'Giáng sấm chớp giật tê liệt toàn thân.' },
      ultimate: { name: 'Vạn Lôi Oanh Tạc', power: 125, element: 'THUNDER', desc: 'Phóng hàng vạn vôn điện quét sạch chiến trường.' }
    },
    appearance: {
      primaryColor: '#eab308',
      secondaryColor: '#fde047',
      eyeColor: '#ffffff',
      hornColor: '#713f12',
      bellyColor: '#fef9c3',
      glow: 'rgba(234, 179, 8, 0.7)'
    },
    desc: 'Di chuyển chớp nhoáng giữa những đám mây giông. Bộ lông tích điện luôn kêu răng rắc.'
  },

  // --- 2. RỒNG LAI NGUYÊN TỐ (2 SAO & 3 SAO) ---
  dragon_lava: {
    id: 'dragon_lava',
    name: 'Rồng Dung Nham',
    title: 'Hỏa Diệm Nham Thạch',
    elements: ['FIRE', 'EARTH'],
    rarity: 2,
    rarityLabel: 'Lai Hiếm ⭐⭐',
    hatchTime: 60,
    shopPriceGold: 800,
    shopPriceGems: 15,
    baseStats: { hp: 170, atk: 32, def: 22, spd: 11 },
    baseGoldRate: 12,
    skills: {
      normal: { name: 'Quăng Đá Nóng', power: 34, desc: 'Ném đá bốc khói hừng hực.' },
      elemental: { name: 'Dòng Nham Thạch', power: 68, element: 'FIRE', desc: 'Phun dung nham làm tan chảy phòng ngự.' },
      ultimate: { name: 'Núi Lửa Phun Trào', power: 130, element: 'FIRE', desc: 'Cột dung nham bùng nổ hủy diệt.' }
    },
    appearance: {
      primaryColor: '#c2410c',
      secondaryColor: '#f97316',
      eyeColor: '#fef08a',
      hornColor: '#1c1917',
      bellyColor: '#ea580c',
      glow: 'rgba(234, 88, 12, 0.7)'
    },
    desc: 'Kết quả lai giống giữa Lửa và Đất. Máu rồng chảy đỏ rực như dung nham nóng ngàn độ.'
  },

  dragon_mud: {
    id: 'dragon_mud',
    name: 'Rồng Bùn Lầy',
    title: 'Đầm Lầy U Ám',
    elements: ['WATER', 'EARTH'],
    rarity: 2,
    rarityLabel: 'Lai Hiếm ⭐⭐',
    hatchTime: 50,
    shopPriceGold: 700,
    shopPriceGems: 12,
    baseStats: { hp: 185, atk: 25, def: 26, spd: 9 },
    baseGoldRate: 11,
    skills: {
      normal: { name: 'Ném Bùn', power: 28, desc: 'Ném bùn dơ làm mù mắt.' },
      elemental: { name: 'Vũng Lầy Lún', power: 60, element: 'EARTH', desc: 'Bẫy đối thủ chìm vào bùn sâu.' },
      ultimate: { name: 'Cơn Bão Bùn', power: 120, element: 'WATER', desc: 'Đè bẹp tất cả trong thác bùn khổng lồ.' }
    },
    appearance: {
      primaryColor: '#78350f',
      secondaryColor: '#0284c7',
      eyeColor: '#fef08a',
      hornColor: '#451a03',
      bellyColor: '#92400e',
      glow: 'rgba(120, 53, 15, 0.6)'
    },
    desc: 'Lai giữa Thủy Long và Nham Long. Cơ thể dính nhớp có khả năng hấp thụ chấn động cực tốt.'
  },

  dragon_steam: {
    id: 'dragon_steam',
    name: 'Rồng Hơi Nước',
    title: 'Sương Mù Nhiệt Độ',
    elements: ['FIRE', 'WATER'],
    rarity: 2,
    rarityLabel: 'Lai Hiếm ⭐⭐',
    hatchTime: 65,
    shopPriceGold: 850,
    shopPriceGems: 18,
    baseStats: { hp: 145, atk: 33, def: 17, spd: 16 },
    baseGoldRate: 13,
    skills: {
      normal: { name: 'Phun Hơi Nóng', power: 30, desc: 'Hơi nước sôi bỏng rát.' },
      elemental: { name: 'Màn Sương Ảo Ảnh', power: 62, element: 'WATER', desc: 'Hơi nước mịt mù gây sát thương diện rộng.' },
      ultimate: { name: 'Vụ Nổ Áp Suất Nồi Hơi', power: 135, element: 'FIRE', desc: 'Áp suất nhiệt cực đại phát nổ vang trời.' }
    },
    appearance: {
      primaryColor: '#f43f5e',
      secondaryColor: '#38bdf8',
      eyeColor: '#ffffff',
      hornColor: '#9f1239',
      bellyColor: '#fda4af',
      glow: 'rgba(244, 63, 94, 0.7)'
    },
    desc: 'Sự kết hợp thần kỳ giữa Lửa và Nước. Toàn thân luôn bốc lên những làn khói trắng ma mị.'
  },

  dragon_coral: {
    id: 'dragon_coral',
    name: 'Rồng San Hô',
    title: 'Thủy Thảo Rực Rỡ',
    elements: ['WATER', 'LEAF'],
    rarity: 2,
    rarityLabel: 'Lai Hiếm ⭐⭐',
    hatchTime: 55,
    shopPriceGold: 750,
    shopPriceGems: 14,
    baseStats: { hp: 160, atk: 28, def: 20, spd: 14 },
    baseGoldRate: 12,
    skills: {
      normal: { name: 'Gai San Hô', power: 30, desc: 'Đâm gai san hô sắc bén.' },
      elemental: { name: 'Thủy Thảo Trận', power: 64, element: 'LEAF', desc: 'Rong biển san hô quấn siết kẻ thù.' },
      ultimate: { name: 'Rạn San Hô Thần Thoại', power: 125, element: 'WATER', desc: 'Triệu hồi sức mạnh đại dương hồi phục và phản đòn.' }
    },
    appearance: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#10b981',
      eyeColor: '#fef08a',
      hornColor: '#ec4899',
      bellyColor: '#bae6fd',
      glow: 'rgba(14, 165, 233, 0.7)'
    },
    desc: 'Lưng mọc những nhánh san hô hồng phát sáng tuyệt đẹp. Được xưng tụng là loài rồng lộng lẫy của đại dương.'
  },

  dragon_storm: {
    id: 'dragon_storm',
    name: 'Rồng Bão Tố',
    title: 'Chúa Tể Cuồng Phong',
    elements: ['THUNDER', 'WATER'],
    rarity: 3,
    rarityLabel: 'Quý Tộc ⭐⭐⭐',
    hatchTime: 90,
    shopPriceGold: 1500,
    shopPriceGems: 25,
    baseStats: { hp: 155, atk: 42, def: 18, spd: 20 },
    baseGoldRate: 18,
    skills: {
      normal: { name: 'Sóng Điện', power: 36, desc: 'Luồng sóng mang dòng điện cực mạnh.' },
      elemental: { name: 'Bão Điện Giật', power: 78, element: 'THUNDER', desc: 'Bão tố cuồn cuộn kèm sấm sét giáng liên tiếp.' },
      ultimate: { name: 'Cơn Bão Cấp 15', power: 155, element: 'WATER', desc: 'Vòi rồng khổng lồ nuốt chửng toàn bộ sàn đấu.' }
    },
    appearance: {
      primaryColor: '#3b82f6',
      secondaryColor: '#eab308',
      eyeColor: '#ffffff',
      hornColor: '#1e3a8a',
      bellyColor: '#93c5fd',
      glow: 'rgba(59, 130, 246, 0.8)'
    },
    desc: 'Mỗi khi vỗ cánh là tạo ra những cơn giông bão sấm chớp rền vang. Rất được các Luyện Rồng Sư săn đón.'
  },

  dragon_laser: {
    id: 'dragon_laser',
    name: 'Rồng Lôi Hỏa Laser',
    title: 'Tia Hủy Diệt',
    elements: ['THUNDER', 'FIRE'],
    rarity: 3,
    rarityLabel: 'Quý Tộc ⭐⭐⭐',
    hatchTime: 100,
    shopPriceGold: 1800,
    shopPriceGems: 30,
    baseStats: { hp: 140, atk: 48, def: 15, spd: 24 },
    baseGoldRate: 20,
    skills: {
      normal: { name: 'Bắn Hạt Năng Lượng', power: 38, desc: 'Bắn chùm photon nóng rực.' },
      elemental: { name: 'Chùm Tia Laser', power: 85, element: 'FIRE', desc: 'Chiếu tia laser xuyên phá mọi giáp trụ.' },
      ultimate: { name: 'Pháo Plasma Hạt Nhân', power: 170, element: 'THUNDER', desc: 'Tập trung toàn bộ năng lượng bắn chùm sáng hủy diệt.' }
    },
    appearance: {
      primaryColor: '#ef4444',
      secondaryColor: '#eab308',
      eyeColor: '#38bdf8',
      hornColor: '#7f1d1d',
      bellyColor: '#fef08a',
      glow: 'rgba(234, 179, 8, 0.9)'
    },
    desc: 'Hội tụ sức mạnh bùng nổ của Lửa và vận tốc kinh hoàng của Sét. Mắt phát ra tia laser đỏ rực đáng sợ.'
  },

  // --- 3. RỒNG ĐẶC BIỆT & SỬ THI (4 SAO) ---
  dragon_ice: {
    id: 'dragon_ice',
    name: 'Rồng Băng Tinh',
    title: 'Hàn Băng Vĩnh Cửu',
    elements: ['ICE'],
    rarity: 3,
    rarityLabel: 'Quý Tộc ⭐⭐⭐',
    hatchTime: 90,
    shopPriceGold: 2000,
    shopPriceGems: 35,
    baseStats: { hp: 165, atk: 38, def: 24, spd: 15 },
    baseGoldRate: 19,
    skills: {
      normal: { name: 'Mũi Cực Hàn', power: 35, desc: 'Đâm mũi băng buốt giá.' },
      elemental: { name: 'Bão Tuyết Cực Địa', power: 76, element: 'ICE', desc: 'Thổi bão tuyết làm chậm và đông cứng đối phương.' },
      ultimate: { name: 'Băng Trụ Ngàn Năm', power: 150, element: 'ICE', desc: 'Dựng rừng băng nhọn đâm xuyên sàn đấu.' }
    },
    appearance: {
      primaryColor: '#67e8f9',
      secondaryColor: '#e0f2fe',
      eyeColor: '#0284c7',
      hornColor: '#0891b2',
      bellyColor: '#cffafe',
      glow: 'rgba(103, 232, 249, 0.8)'
    },
    desc: 'Cư ngụ tại đỉnh núi tuyết quanh năm không tan. Hơi thở phả ra khiến không khí lập tức kết tinh thành tuyết trắng.'
  },

  dragon_frostfire: {
    id: 'dragon_frostfire',
    name: 'Rồng Băng Hỏa (Hàn Diệm)',
    title: 'Nghịch Lý Băng Lửa',
    elements: ['ICE', 'FIRE'],
    rarity: 4,
    rarityLabel: 'Sử Thi ⭐⭐⭐⭐',
    hatchTime: 150,
    shopPriceGold: 3500,
    shopPriceGems: 60,
    baseStats: { hp: 180, atk: 52, def: 26, spd: 18 },
    baseGoldRate: 28,
    skills: {
      normal: { name: 'Hàn Hỏa Tiễn', power: 42, desc: 'Bắn mũi tên lửa xanh băng giá.' },
      elemental: { name: 'Xung Kích Băng Lửa', power: 95, element: 'FIRE', desc: 'Băng lửa xung đột tạo chấn động kinh hoàng.' },
      ultimate: { name: 'Hàn Ngục Hỏa Diệm', power: 190, element: 'ICE', desc: 'Phong tỏa đối thủ trong lồng băng rồi thiêu cháy từ bên trong.' }
    },
    appearance: {
      primaryColor: '#06b6d4',
      secondaryColor: '#f43f5e',
      eyeColor: '#fef08a',
      hornColor: '#164e63',
      bellyColor: '#ffe4e6',
      glow: 'rgba(6, 182, 212, 0.9)'
    },
    desc: 'Sở hữu hai thuộc tính đối lập cùng tồn tại: Nửa thân trái lạnh cóng, nửa thân phải rực lửa. Cực kỳ hiếm thấy!'
  },

  dragon_light: {
    id: 'dragon_light',
    name: 'Rồng Ánh Sáng (Bạch Long)',
    title: 'Hào Quang Cứu Rỗi',
    elements: ['LIGHT'],
    rarity: 4,
    rarityLabel: 'Sử Thi ⭐⭐⭐⭐',
    hatchTime: 180,
    shopPriceGold: 4500,
    shopPriceGems: 80,
    baseStats: { hp: 195, atk: 55, def: 28, spd: 22 },
    baseGoldRate: 32,
    skills: {
      normal: { name: 'Tia Sáng Thánh', power: 45, desc: 'Tia sáng ban phước gây sát thương kẻ địch.' },
      elemental: { name: 'Thần Phạt', power: 100, element: 'LIGHT', desc: 'Cột ánh sáng giáng xuống trừng phạt bóng tối.' },
      ultimate: { name: 'Thái Dương Bừng Nở', power: 200, element: 'LIGHT', desc: 'Tỏa hào quang chói lòa làm mù và tiêu diệt tà ác.' }
    },
    appearance: {
      primaryColor: '#fef08a',
      secondaryColor: '#ffffff',
      eyeColor: '#38bdf8',
      hornColor: '#ca8a04',
      bellyColor: '#fef9c3',
      glow: 'rgba(254, 240, 138, 0.95)'
    },
    desc: 'Được sinh ra từ ánh rạng đông đầu tiên của thế giới Đảo Rồng. Toàn thân tỏa bạch kim tinh khôi.'
  },

  dragon_dark: {
    id: 'dragon_dark',
    name: 'Rồng Hắc Ám (Dạ Xoa Long)',
    title: 'Bóng Tối Vực Thẳm',
    elements: ['DARK'],
    rarity: 4,
    rarityLabel: 'Sử Thi ⭐⭐⭐⭐',
    hatchTime: 180,
    shopPriceGold: 4500,
    shopPriceGems: 80,
    baseStats: { hp: 190, atk: 58, def: 25, spd: 23 },
    baseGoldRate: 32,
    skills: {
      normal: { name: 'Móng Vuốt Đêm', power: 46, desc: 'Cào xé bằng vuốt hắc ám.' },
      elemental: { name: 'Hố Đen Hút Hồn', power: 105, element: 'DARK', desc: 'Tạo hố đen bóng đêm nuốt chửng sinh lực.' },
      ultimate: { name: 'Khải Huyền Vực Thẳm', power: 205, element: 'DARK', desc: 'Bóng tối bao trùm nuốt trọn ánh sáng đối thủ.' }
    },
    appearance: {
      primaryColor: '#3b0764',
      secondaryColor: '#8b5cf6',
      eyeColor: '#ef4444',
      hornColor: '#1e1b4b',
      bellyColor: '#581c87',
      glow: 'rgba(139, 92, 246, 0.9)'
    },
    desc: 'Thống trị cõi bóng tối u tịch. Đôi cánh đen tuyền chứa đựng bí mật của ngàn năm viễn cổ.'
  },

  // --- 4. RỒNG THẦN THOẠI (5 SAO) ---
  dragon_golden: {
    id: 'dragon_golden',
    name: 'Thần Long Hoàng Kim',
    title: 'Vương Giả Đảo Rồng',
    elements: ['LEGEND'],
    rarity: 5,
    rarityLabel: 'Thần Thoại 👑⭐⭐⭐⭐⭐',
    hatchTime: 300,
    shopPriceGold: 10000,
    shopPriceGems: 200,
    baseStats: { hp: 260, atk: 75, def: 40, spd: 28 },
    baseGoldRate: 60,
    skills: {
      normal: { name: 'Vuốt Hoàng Kim', power: 55, desc: 'Đòn đánh dát vàng uy lực tối thượng.' },
      elemental: { name: 'Thần Long Hộ Thể', power: 125, element: 'LEGEND', desc: 'Rồng vàng gầm thét tăng công và giáng đòn hủy diệt.' },
      ultimate: { name: 'Long Ngâm Thiên Địa', power: 260, element: 'LEGEND', desc: 'Chiêu thức huyền thoại của Chúa Tể Đảo Rồng.' }
    },
    appearance: {
      primaryColor: '#f59e0b',
      secondaryColor: '#fbbf24',
      eyeColor: '#ec4899',
      hornColor: '#78350f',
      bellyColor: '#fef3c7',
      glow: 'rgba(245, 158, 11, 1)'
    },
    desc: 'Linh vật tối cao của Đảo Rồng Zing Me. Ai sở hữu được Thần Long Hoàng Kim sẽ được vinh danh là Đệ Nhất Luyện Rồng Sư!'
  },

  // --- 5. TỘC RỒNG XƯƠNG & HUYỀN THOẠI VIP ZING ME ---
  dragon_golden_bone: {
    id: 'dragon_golden_bone',
    name: 'Rồng Xương Vàng (Hoàng Kim Cốt Long)',
    title: 'Đế Vương Long Cốt VIP',
    elements: ['BONE', 'LEGEND', 'LIGHT'],
    rarity: 5,
    rarityLabel: 'VIP Thần Thoại 👑⭐⭐⭐⭐⭐',
    hatchTime: 360,
    shopPriceGold: 25000,
    shopPriceGems: 300,
    baseStats: { hp: 320, atk: 95, def: 52, spd: 32 },
    baseGoldRate: 90,
    skills: {
      normal: { name: 'Cốt Trảo Hoàng Kim', power: 65, desc: 'Móng vuốt xương vàng đâm xuyên phòng ngự.' },
      elemental: { name: 'Long Cốt Kim Quang', power: 145, element: 'BONE', desc: 'Phóng hàng ngàn mũi gai xương vàng xuyên thấu 40% giáp đối thủ.' },
      ultimate: { name: 'Hoàng Kim Cốt Ngục Diệt Thế 🔥', power: 310, element: 'BONE', desc: 'Dựng nhà tù xương vàng khổng lồ thiêu rụi và xóa sổ kẻ thù.' }
    },
    appearance: {
      isBone: true,
      boneType: 'GOLD',
      primaryColor: '#fbbf24',
      secondaryColor: '#f59e0b',
      eyeColor: '#ef4444',
      hornColor: '#b45309',
      bellyColor: '#fef08a',
      glow: 'rgba(251, 191, 36, 1)'
    },
    desc: 'Tượng đài bất hủ của Đảo Rồng Zing Me thời hoàng kim! Từng là chú rồng nạp VIP đắt giá bậc nhất với khung xương dát vàng 24K rực lửa, cánh xương sải rộng tỏa hào quang chói lòa và chiêu thức Hoàng Kim Cốt Ngục hủy diệt vạn vật.'
  },

  dragon_silver_bone: {
    id: 'dragon_silver_bone',
    name: 'Rồng Xương Bạc (Ngân Cốt Long)',
    title: 'Hàn Ngân Bất Diệt VIP',
    elements: ['BONE', 'ICE', 'WATER'],
    rarity: 5,
    rarityLabel: 'VIP Thần Thoại 👑⭐⭐⭐⭐⭐',
    hatchTime: 300,
    shopPriceGold: 18000,
    shopPriceGems: 220,
    baseStats: { hp: 300, atk: 86, def: 58, spd: 30 },
    baseGoldRate: 80,
    skills: {
      normal: { name: 'Cốt Trảo Ngân Băng', power: 58, desc: 'Móng vuốt bạc lạnh giá buốt xương.' },
      elemental: { name: 'Cốt Vũ Ngân Phong', power: 135, element: 'BONE', desc: 'Bão xương bạc sắc lẹm tạo khiên giảm 35% sát thương nhận vào.' },
      ultimate: { name: 'Hàn Ngân Cốt Trận ❄️', power: 275, element: 'BONE', desc: 'Rừng chông xương bạc đâm vỡ vụn sàn đấu và đóng băng đối thủ.' }
    },
    appearance: {
      isBone: true,
      boneType: 'SILVER',
      primaryColor: '#e2e8f0',
      secondaryColor: '#38bdf8',
      eyeColor: '#06b6d4',
      hornColor: '#64748b',
      bellyColor: '#ffffff',
      glow: 'rgba(226, 232, 240, 1)'
    },
    desc: 'Chiến binh rồng xương bạc tinh xảo từng làm say đắm biết bao Luyện Rồng Sư Zing Me. Bộ giáp xương trắng bạc ánh kim sắc lẹm, đôi cánh ma trần vung bão tuyết và khả năng phòng thủ bất khả xâm phạm.'
  },

  dragon_ancient_bone: {
    id: 'dragon_ancient_bone',
    name: 'Rồng Hắc Cốt (Cốt Long Cổ Đại)',
    title: 'Linh Hồn Viễn Cổ',
    elements: ['BONE', 'DARK'],
    rarity: 4,
    rarityLabel: 'Sử Thi ⭐⭐⭐⭐',
    hatchTime: 200,
    shopPriceGold: 6000,
    shopPriceGems: 100,
    baseStats: { hp: 230, atk: 68, def: 38, spd: 26 },
    baseGoldRate: 45,
    skills: {
      normal: { name: 'Mũi Gai Xương', power: 48, desc: 'Phóng phi tiêu gai xương hắc ám.' },
      elemental: { name: 'Hắc Cốt Trảo', power: 110, element: 'BONE', desc: 'Móng vuốt tử thần nguyền rủa kẻ địch.' },
      ultimate: { name: 'Tử Khí Long Cốt 🌑', power: 220, element: 'BONE', desc: 'Triệu hồi linh hồn các bộ xương viễn cổ cắn xé đối thủ.' }
    },
    appearance: {
      isBone: true,
      boneType: 'DARK',
      primaryColor: '#475569',
      secondaryColor: '#9333ea',
      eyeColor: '#f43f5e',
      hornColor: '#1e293b',
      bellyColor: '#64748b',
      glow: 'rgba(147, 51, 234, 0.9)'
    },
    desc: 'Bộ xương rồng viễn cổ thức tỉnh từ cõi hư vô. Các đốt sống đen tuyền được gắn kết bằng ma thuật bóng đêm ngàn năm.'
  },

  dragon_phoenix: {
    id: 'dragon_phoenix',
    name: 'Rồng Phượng Hoàng (Chu Tước)',
    title: 'Tái Sinh Từ Tro Tàn',
    elements: ['FIRE', 'LIGHT'],
    rarity: 5,
    rarityLabel: 'Thần Thoại 👑⭐⭐⭐⭐⭐',
    hatchTime: 320,
    shopPriceGold: 15000,
    shopPriceGems: 200,
    baseStats: { hp: 275, atk: 88, def: 42, spd: 31 },
    baseGoldRate: 75,
    skills: {
      normal: { name: 'Hỏa Trảo Phượng Hoàng', power: 56, desc: 'Móng vuốt lửa thiêng rực sáng.' },
      elemental: { name: 'Lửa Chu Tước Tái Sinh', power: 130, element: 'FIRE', desc: 'Ngọn lửa thần hồi phục sinh lực và thiêu đốt đối thủ.' },
      ultimate: { name: 'Phượng Hoàng Niết Bàn 🔥', power: 280, element: 'LIGHT', desc: 'Hóa thân thành phượng hoàng lửa khổng lồ giáng thế tiêu diệt tất cả.' }
    },
    appearance: {
      isPhoenix: true,
      primaryColor: '#f97316',
      secondaryColor: '#e11d48',
      eyeColor: '#fef08a',
      hornColor: '#fbbf24',
      bellyColor: '#fde047',
      glow: 'rgba(249, 115, 22, 1)'
    },
    desc: 'Thần thú tối cao với đôi cánh phượng hoàng rực lửa chói lọi. Tương truyền mỗi lần gục ngã là một lần hồi sinh mạnh mẽ hơn.'
  },

  dragon_hydra: {
    id: 'dragon_hydra',
    name: 'Rồng Ba Đầu (Hắc Long Hydra)',
    title: 'Hung Thần Tam Đầu',
    elements: ['DARK', 'FIRE', 'THUNDER'],
    rarity: 4,
    rarityLabel: 'Sử Thi ⭐⭐⭐⭐',
    hatchTime: 220,
    shopPriceGold: 7500,
    shopPriceGems: 120,
    baseStats: { hp: 260, atk: 78, def: 36, spd: 25 },
    baseGoldRate: 50,
    skills: {
      normal: { name: 'Tam Đầu Cắn Xé', power: 52, desc: 'Ba cái đầu thay phiên cắn xé hung tợn.' },
      elemental: { name: 'Hỏa Lôi Tam Trọng Tấu', power: 118, element: 'FIRE', desc: 'Ba cái đầu cùng lúc phun lửa, phóng sét và thở ra khói độc.' },
      ultimate: { name: 'Cơn Thịnh Nộ Hydra 🐉', power: 240, element: 'DARK', desc: 'Ba tiếng gầm xé rách không gian gây chấn động hủy diệt.' }
    },
    appearance: {
      isHydra: true,
      primaryColor: '#1e1b4b',
      secondaryColor: '#ef4444',
      eyeColor: '#facc15',
      hornColor: '#0f172a',
      bellyColor: '#312e81',
      glow: 'rgba(239, 68, 68, 0.8)'
    },
    desc: 'Hắc Long ba đầu hung dữ khét tiếng trong truyền thuyết Đảo Rồng. Ba chiếc đầu có tính cách riêng biệt nhưng phối hợp ra đòn vô cùng ăn ý.'
  },

  dragon_armored: {
    id: 'dragon_armored',
    name: 'Rồng Thiết Giáp Hoàng Gia',
    title: 'Pháo Đài Kim Loại',
    elements: ['STEEL', 'EARTH'],
    rarity: 4,
    rarityLabel: 'Sử Thi ⭐⭐⭐⭐',
    hatchTime: 210,
    shopPriceGold: 6800,
    shopPriceGems: 110,
    baseStats: { hp: 290, atk: 62, def: 65, spd: 16 },
    baseGoldRate: 48,
    skills: {
      normal: { name: 'Đấm Giáp Thép', power: 46, desc: 'Vung nắm đấm bọc thép nghiền nát đối thủ.' },
      elemental: { name: 'Khiên Thép Phản Đòn', power: 105, element: 'STEEL', desc: 'Dựng tường thép giảm nửa sát thương và phản pháo.' },
      ultimate: { name: 'Thiên Thạch Kim Loại ⚔️', power: 230, element: 'STEEL', desc: 'Triệu hồi bão thiên thạch quặng thép rơi xuống như mưa.' }
    },
    appearance: {
      isArmored: true,
      primaryColor: '#94a3b8',
      secondaryColor: '#f59e0b',
      eyeColor: '#38bdf8',
      hornColor: '#334155',
      bellyColor: '#cbd5e1',
      glow: 'rgba(148, 163, 184, 0.8)'
    },
    desc: 'Được trang bị bộ giáp thép dày cộp rèn bằng lửa núi lửa. Không một mũi tên hay nanh vuốt nào có thể để lại vết xước trên thân mình nó.'
  },

  // --- 6. CÁC BIẾN THỂ RỒNG XƯƠNG & HUYỀN THOẠI CỰC PHẨM KHÁC ---
  dragon_blood_bone: {
    id: 'dragon_blood_bone',
    name: 'Rồng Huyết Xương (Huyết Cốt Long)',
    title: 'Huyết Cốt Ma Thần VIP',
    elements: ['BONE', 'FIRE', 'DARK'],
    rarity: 5,
    rarityLabel: 'VIP Thần Thoại 👑⭐⭐⭐⭐⭐',
    hatchTime: 360,
    shopPriceGold: 22000,
    shopPriceGems: 280,
    baseStats: { hp: 310, atk: 92, def: 50, spd: 31 },
    baseGoldRate: 85,
    skills: {
      normal: { name: 'Huyết Trảo Khát Máu', power: 62, desc: 'Cào xé bằng nanh vuốt xương đẫm máu.' },
      elemental: { name: 'Huyết Lôi Ma Trận', power: 140, element: 'BONE', desc: 'Triệu hồi sấm sét máu đỏ thiêu đốt và hút 20% sinh lực địch.' },
      ultimate: { name: 'Huyết Tẩy Thiên Địa Diệt Thế 🩸', power: 300, element: 'FIRE', desc: 'Biển máu xương rồng sôi sục hủy diệt hoàn toàn chiến trường.' }
    },
    appearance: {
      isBone: true,
      boneType: 'BLOOD',
      primaryColor: '#dc2626',
      secondaryColor: '#b91c1c',
      eyeColor: '#fde047',
      hornColor: '#7f1d1d',
      bellyColor: '#991b1b',
      glow: 'rgba(239, 68, 68, 1)'
    },
    desc: 'Chiến tướng rồng xương đẫm máu lẫy lừng sự kiện VIP Zing Me. Bộ khung xương đỏ rực như hồng ngọc huyết ma, chứa sức mạnh hút cạn sinh lực kẻ thù.'
  },

  dragon_emerald_bone: {
    id: 'dragon_emerald_bone',
    name: 'Rồng Bích Xương (Ngọc Cốt Long)',
    title: 'Bích Cốt Trường Sinh VIP',
    elements: ['BONE', 'LEAF', 'LIGHT'],
    rarity: 5,
    rarityLabel: 'VIP Thần Thoại 👑⭐⭐⭐⭐⭐',
    hatchTime: 330,
    shopPriceGold: 19000,
    shopPriceGems: 240,
    baseStats: { hp: 315, atk: 84, def: 55, spd: 29 },
    baseGoldRate: 82,
    skills: {
      normal: { name: 'Bích Cốt Xuyên Tâm', power: 60, desc: 'Mũi ngọc xương lục sắc đâm thủng giáp.' },
      elemental: { name: 'Lục Quang Phản Chiếu', power: 135, element: 'BONE', desc: 'Tia sáng ngọc bích hồi phục 25% máu đồng thời gây sát thương lớn.' },
      ultimate: { name: 'Vạn Cổ Bích Cốt Trận 💎', power: 285, element: 'LEAF', desc: 'Rừng chông ngọc bích mọc lên từ lòng đất thanh tẩy mọi tà khí.' }
    },
    appearance: {
      isBone: true,
      boneType: 'EMERALD',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      eyeColor: '#a7f3d0',
      hornColor: '#064e3b',
      bellyColor: '#34d399',
      glow: 'rgba(16, 185, 129, 1)'
    },
    desc: 'Hóa thạch ngọc bích triệu năm ngưng tụ thành khung xương rồng thanh khiết. Mang năng lượng trường sinh vĩnh cửu.'
  },

  dragon_frost_bone: {
    id: 'dragon_frost_bone',
    name: 'Rồng Băng Xương (Tuyết Cốt Long)',
    title: 'Cực Hàn Tuyết Cốt',
    elements: ['BONE', 'ICE'],
    rarity: 4,
    rarityLabel: 'Sử Thi ⭐⭐⭐⭐',
    hatchTime: 240,
    shopPriceGold: 8500,
    shopPriceGems: 130,
    baseStats: { hp: 270, atk: 76, def: 52, spd: 27 },
    baseGoldRate: 55,
    skills: {
      normal: { name: 'Hàn Cốt Trảo', power: 52, desc: 'Móng vuốt xương băng buốt giá.' },
      elemental: { name: 'Băng Phong Cốt Ngục', power: 125, element: 'ICE', desc: 'Tường băng xương giam cầm và giảm 40% tốc độ đối thủ.' },
      ultimate: { name: 'Tuyết Cốt Táng Thiên ❄️', power: 260, element: 'BONE', desc: 'Bão tuyết xương rồng đóng băng tuyệt đối toàn bộ kẻ địch.' }
    },
    appearance: {
      isBone: true,
      boneType: 'FROST',
      primaryColor: '#38bdf8',
      secondaryColor: '#0284c7',
      eyeColor: '#ffffff',
      hornColor: '#0369a1',
      bellyColor: '#bae6fd',
      glow: 'rgba(56, 189, 248, 1)'
    },
    desc: 'Sinh ra từ sông băng bắc cực ngàn năm. Khung xương pha lê trong suốt tỏa ra hàn khí cắt da xé thịt.'
  },

  dragon_cosmic: {
    id: 'dragon_cosmic',
    name: 'Rồng Tinh Tú (Tinh Hà Thần Long)',
    title: 'Bá Chủ Dải Ngân Hà',
    elements: ['LEGEND', 'LIGHT', 'DARK'],
    rarity: 5,
    rarityLabel: 'Thần Thoại 👑⭐⭐⭐⭐⭐',
    hatchTime: 400,
    shopPriceGold: 30000,
    shopPriceGems: 350,
    baseStats: { hp: 340, atk: 100, def: 48, spd: 34 },
    baseGoldRate: 100,
    skills: {
      normal: { name: 'Tinh Hà Trảo', power: 68, desc: 'Vuốt rồng phủ bụi sao vũ trụ.' },
      elemental: { name: 'Hố Đen Tinh Vân', power: 155, element: 'LEGEND', desc: 'Mở hố đen bẻ cong không thời gian nuốt trọn năng lượng đối thủ.' },
      ultimate: { name: 'Vũ Trụ Siêu Tân Tinh 🌌', power: 330, element: 'LEGEND', desc: 'Vụ nổ Big Bang thu nhỏ san phẳng mọi vật cản.' }
    },
    appearance: {
      isCosmic: true,
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      eyeColor: '#38bdf8',
      hornColor: '#ec4899',
      bellyColor: '#c084fc',
      glow: 'rgba(168, 85, 247, 1)'
    },
    desc: 'Lĩnh hội sức mạnh của cả vũ trụ bao la. Thân thể là bầu trời đêm muôn ánh sao lấp lánh và sừng pha lê thiên hà chói lọi.'
  },

  dragon_demon: {
    id: 'dragon_demon',
    name: 'Rồng Bách Quỷ (Hắc Ma Long Vương)',
    title: 'Chúa Tể Địa Ngục',
    elements: ['DARK', 'FIRE'],
    rarity: 5,
    rarityLabel: 'Thần Thoại 👑⭐⭐⭐⭐⭐',
    hatchTime: 340,
    shopPriceGold: 20000,
    shopPriceGems: 250,
    baseStats: { hp: 305, atk: 94, def: 44, spd: 30 },
    baseGoldRate: 85,
    skills: {
      normal: { name: 'Ma Vuốt Địa Ngục', power: 64, desc: 'Vuốt quỷ cào xé thiêu đốt linh hồn.' },
      elemental: { name: 'Hắc Diễm Thiêu Hồn', power: 142, element: 'DARK', desc: 'Ngọn lửa đen địa ngục thiêu rụi phòng thủ.' },
      ultimate: { name: 'Vạn Quỷ Dạ Hành 👿', power: 305, element: 'FIRE', desc: 'Triệu hồi ngàn âm binh quỷ giới cắn xé đối thủ.' }
    },
    appearance: {
      isDemon: true,
      primaryColor: '#18181b',
      secondaryColor: '#dc2626',
      eyeColor: '#facc15',
      hornColor: '#450a0a',
      bellyColor: '#27272a',
      glow: 'rgba(220, 38, 38, 1)'
    },
    desc: 'Chúa tể thống trị cõi u minh. Đôi sừng quỷ uốn cong khổng lồ và đôi cánh dơi gai nhọn mang bóng đêm vĩnh hằng.'
  },

  dragon_leviathan: {
    id: 'dragon_leviathan',
    name: 'Rồng Biển Sâu (Cổ Hải Thần Long)',
    title: 'Thần Thú Biển Khơi',
    elements: ['WATER', 'LEGEND'],
    rarity: 5,
    rarityLabel: 'Thần Thoại 👑⭐⭐⭐⭐⭐',
    hatchTime: 330,
    shopPriceGold: 17000,
    shopPriceGems: 210,
    baseStats: { hp: 330, atk: 82, def: 56, spd: 28 },
    baseGoldRate: 80,
    skills: {
      normal: { name: 'Kình Lực Ba Đào', power: 58, desc: 'Vung đuôi cá voi tạo sóng đập mạnh.' },
      elemental: { name: 'Hải Triều Thần Thoại', power: 138, element: 'WATER', desc: 'Lốc xoáy nước đại dương cuốn phăng hàng phòng ngự.' },
      ultimate: { name: 'Thủy Thần Phẫn Nộ 🌊', power: 290, element: 'WATER', desc: 'Đại hồng thủy đại dương dâng cao nuốt chửng toàn bộ sàn đấu.' }
    },
    appearance: {
      isLeviathan: true,
      primaryColor: '#0284c7',
      secondaryColor: '#06b6d4',
      eyeColor: '#34d399',
      hornColor: '#0c4a6e',
      bellyColor: '#7dd3fc',
      glow: 'rgba(6, 182, 212, 1)'
    },
    desc: 'Thần thú biển sâu thức giấc sau giấc ngủ nghìn năm dưới đáy rãnh Mariana. Vảy cá phát quang và sừng san hô đại dương huyền bí.'
  },

  dragon_cyber: {
    id: 'dragon_cyber',
    name: 'Rồng Cơ Khí (Thiết Long Laser)',
    title: 'Pháo Đài Công Nghệ Cổ',
    elements: ['STEEL', 'THUNDER'],
    rarity: 4,
    rarityLabel: 'Sử Thi ⭐⭐⭐⭐',
    hatchTime: 230,
    shopPriceGold: 8000,
    shopPriceGems: 120,
    baseStats: { hp: 280, atk: 75, def: 60, spd: 24 },
    baseGoldRate: 52,
    skills: {
      normal: { name: 'Pháo Năng Lượng', power: 54, desc: 'Bắn loạt đạn pháo năng lượng cao.' },
      elemental: { name: 'Laser Tầm Nhiệt', power: 124, element: 'THUNDER', desc: 'Chùm tia laser xanh dương thiêu rụi mục tiêu chỉ định.' },
      ultimate: { name: 'Xung Điện Ion Siêu Cấp ⚡', power: 255, element: 'STEEL', desc: 'Lò phản ứng bộc phát xung điện EMP vô hiệu hóa đối thủ.' }
    },
    appearance: {
      isCyber: true,
      primaryColor: '#475569',
      secondaryColor: '#38bdf8',
      eyeColor: '#22c55e',
      hornColor: '#1e293b',
      bellyColor: '#94a3b8',
      glow: 'rgba(56, 189, 248, 0.9)'
    },
    desc: 'Cổ vật cơ khí từ nền văn minh cổ đại thất truyền. Lớp giáp hợp kim titan siêu cứng và lò phản ứng hồ quang trước ngực.'
  }
};

/**
 * Công thức Lai Tạo Giống Rồng (Breeding Matrix)
 * Xác định trứng rồng con sinh ra dựa trên cặp bố mẹ
 */
const BREEDING_RECIPES = [
  // Fire + Earth -> Lava
  { parents: ['FIRE', 'EARTH'], result: 'dragon_lava', chance: 0.65 },
  // Water + Earth -> Mud
  { parents: ['WATER', 'EARTH'], result: 'dragon_mud', chance: 0.65 },
  // Fire + Water -> Steam
  { parents: ['FIRE', 'WATER'], result: 'dragon_steam', chance: 0.60 },
  // Water + Leaf -> Coral
  { parents: ['WATER', 'LEAF'], result: 'dragon_coral', chance: 0.65 },
  // Thunder + Water -> Storm
  { parents: ['THUNDER', 'WATER'], result: 'dragon_storm', chance: 0.50 },
  // Thunder + Fire -> Laser
  { parents: ['THUNDER', 'FIRE'], result: 'dragon_laser', chance: 0.50 },
  // Ice + Fire -> Frostfire
  { parents: ['ICE', 'FIRE'], result: 'dragon_frostfire', chance: 0.40 },
  // Light + Dark -> Golden (Tỉ lệ hiếm 15%)
  { parents: ['LIGHT', 'DARK'], result: 'dragon_golden', chance: 0.15 },
  // Bất kỳ 2 rồng 3-4 sao lai với nhau có tỉ lệ ra Rồng Ánh Sáng / Bóng Tối
  { parents: ['THUNDER', 'ICE'], result: 'dragon_light', chance: 0.25 },
  { parents: ['FIRE', 'ICE'], result: 'dragon_dark', chance: 0.25 },
  // Công thức Rồng Xương & Huyền Thoại Cực Phẩm
  { parents: ['DARK', 'EARTH'], result: 'dragon_ancient_bone', chance: 0.35 },
  { parents: ['BONE', 'ICE'], result: 'dragon_silver_bone', chance: 0.25 },
  { parents: ['BONE', 'LIGHT'], result: 'dragon_golden_bone', chance: 0.15 },
  { parents: ['BONE', 'FIRE'], result: 'dragon_blood_bone', chance: 0.22 },
  { parents: ['BONE', 'LEAF'], result: 'dragon_emerald_bone', chance: 0.25 },
  { parents: ['ICE', 'BONE'], result: 'dragon_frost_bone', chance: 0.30 },
  { parents: ['LIGHT', 'LEGEND'], result: 'dragon_cosmic', chance: 0.15 },
  { parents: ['DARK', 'FIRE'], result: 'dragon_demon', chance: 0.25 },
  { parents: ['WATER', 'LEGEND'], result: 'dragon_leviathan', chance: 0.25 },
  { parents: ['STEEL', 'THUNDER'], result: 'dragon_cyber', chance: 0.35 },
  { parents: ['FIRE', 'LIGHT'], result: 'dragon_phoenix', chance: 0.25 },
  { parents: ['DARK', 'THUNDER'], result: 'dragon_hydra', chance: 0.30 },
  { parents: ['EARTH', 'STEEL'], result: 'dragon_armored', chance: 0.35 }
];

// Helper tính toán rồng con từ 2 rồng bố mẹ
function calculateBreedingResult(dragonA, dragonB) {
  const elementsA = dragonA.elements;
  const elementsB = dragonB.elements;
  const combined = [...new Set([...elementsA, ...elementsB])];

  // Kiểm tra công thức đặc biệt
  for (const recipe of BREEDING_RECIPES) {
    const hasP1 = combined.includes(recipe.parents[0]);
    const hasP2 = combined.includes(recipe.parents[1]);
    if (hasP1 && hasP2) {
      if (Math.random() <= recipe.chance) {
        return recipe.result;
      }
    }
  }

  // Nếu trượt công thức lai đặc biệt, ngẫu nhiên ra 1 trong 2 giống bố mẹ hoặc rồng cơ bản thuộc hệ
  const fallbackPool = [dragonA.id, dragonB.id];
  if (combined.includes('FIRE')) fallbackPool.push('dragon_fire');
  if (combined.includes('WATER')) fallbackPool.push('dragon_water');
  if (combined.includes('LEAF')) fallbackPool.push('dragon_leaf');
  if (combined.includes('EARTH')) fallbackPool.push('dragon_earth');
  if (combined.includes('THUNDER')) fallbackPool.push('dragon_thunder');

  const randomIdx = Math.floor(Math.random() * fallbackPool.length);
  return fallbackPool[randomIdx];
}

// Tính lượng thức ăn cần để lên cấp tiếp theo
function getFoodToNextLevel(level) {
  return Math.round(15 * Math.pow(level, 1.6));
}

// Tính chỉ số rồng theo cấp độ
function calculateDragonStats(baseStats, level) {
  const multiplier = 1 + (level - 1) * 0.22;
  return {
    hp: Math.round(baseStats.hp * multiplier),
    maxHp: Math.round(baseStats.hp * multiplier),
    atk: Math.round(baseStats.atk * multiplier),
    def: Math.round(baseStats.def * multiplier),
    spd: Math.round(baseStats.spd * (1 + (level - 1) * 0.08))
  };
}

// Xác định hình thái rồng theo cấp độ (Baby, Young, Adult, Elder)
function getEvolutionStage(level) {
  if (level < 4) return { stage: 1, name: 'Rồng Con (Baby)', scale: 0.75 };
  if (level < 7) return { stage: 2, name: 'Niên Thiếu (Young)', scale: 0.95 };
  if (level < 10) return { stage: 3, name: 'Trưởng Thành (Adult)', scale: 1.15 };
  return { stage: 4, name: 'Siêu Cấp (Titan)', scale: 1.35 };
}

window.ELEMENTS = ELEMENTS;
window.DRAGONS_DB = DRAGONS_DB;
window.BREEDING_RECIPES = BREEDING_RECIPES;
window.calculateBreedingResult = calculateBreedingResult;
window.getFoodToNextLevel = getFoodToNextLevel;
window.calculateDragonStats = calculateDragonStats;
window.getEvolutionStage = getEvolutionStage;
