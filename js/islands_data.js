/**
 * Dữ Liệu Các Quần Đảo, Chuồng Nuôi, Nông Trại & Công Trình - Đảo Rồng Zing Me
 */

const ISLANDS_DB = [
  {
    id: 'island_1',
    name: 'Đảo Khởi Nguyên (Rừng Xanh)',
    reqLevel: 1,
    costGold: 0,
    costGems: 0,
    bgTheme: 'meadow',
    maxHabitats: 6,
    maxFarms: 4,
    desc: 'Hòn đảo thiên thanh bồng bềnh giữa biển mây. Đất đai phì nhiêu thích hợp cho mọi Luyện Rồng Sư tập sự.'
  },
  {
    id: 'island_2',
    name: 'Đảo Hỏa Diệm Sơn',
    reqLevel: 4,
    costGold: 2000,
    costGems: 0,
    bgTheme: 'volcano',
    maxHabitats: 8,
    maxFarms: 5,
    desc: 'Bao quanh bởi nham thạch nóng chảy. Nơi lý tưởng để nuôi dưỡng những chú rồng hệ Hỏa và Thổ dũng mãnh.'
  },
  {
    id: 'island_3',
    name: 'Đảo Suối Nguồn Pha Lê',
    reqLevel: 8,
    costGold: 6000,
    costGems: 0,
    bgTheme: 'ocean',
    maxHabitats: 8,
    maxFarms: 6,
    desc: 'Hòn đảo ngập tràn thác nước trong vắt và san hô dạ quang. Giúp các loài rồng Thủy & Mộc bơi lội thỏa thích.'
  },
  {
    id: 'island_4',
    name: 'Đảo Lôi Vân Phong Bạo',
    reqLevel: 12,
    costGold: 15000,
    costGems: 10,
    bgTheme: 'thunder',
    maxHabitats: 10,
    maxFarms: 6,
    desc: 'Nằm trên tầng khí quyển sấm chớp cuồn cuộn. Lôi Long và Bão Tố cảm thấy tràn trề sinh lực tại đây.'
  },
  {
    id: 'island_5',
    name: 'Đảo Băng Cực Bắc',
    reqLevel: 16,
    costGold: 35000,
    costGems: 25,
    bgTheme: 'ice',
    maxHabitats: 10,
    maxFarms: 8,
    desc: 'Băng giá vĩnh cửu bao phủ. Nơi các tinh thể tuyết ngưng tụ thành sức mạnh của Hàn Long.'
  },
  {
    id: 'island_6',
    name: 'Thánh Địa Hoàng Kim',
    reqLevel: 20,
    costGold: 80000,
    costGems: 50,
    bgTheme: 'holy',
    maxHabitats: 12,
    maxFarms: 8,
    desc: 'Hòn đảo cổ kính của các vị Thần Long. Tỏa ánh hào quang bất diệt soi rọi toàn cõi Đảo Rồng.'
  }
];

const HABITATS_DB = {
  habitat_fire: {
    id: 'habitat_fire',
    name: 'Hỏa Cốc',
    element: 'FIRE',
    icon: '🔥',
    costGold: 200,
    costGems: 0,
    reqLevel: 1,
    levels: [
      { level: 1, maxDragons: 2, maxGold: 600, upgradeCost: 500 },
      { level: 2, maxDragons: 3, maxGold: 1800, upgradeCost: 1500 },
      { level: 3, maxDragons: 4, maxGold: 4000, upgradeCost: 0 }
    ],
    desc: 'Chuồng đá nham thạch rực lửa cho rồng hệ Hỏa.'
  },
  habitat_water: {
    id: 'habitat_water',
    name: 'Thủy Đầm',
    element: 'WATER',
    icon: '💧',
    costGold: 250,
    costGems: 0,
    reqLevel: 1,
    levels: [
      { level: 1, maxDragons: 2, maxGold: 600, upgradeCost: 500 },
      { level: 2, maxDragons: 3, maxGold: 1800, upgradeCost: 1500 },
      { level: 3, maxDragons: 4, maxGold: 4000, upgradeCost: 0 }
    ],
    desc: 'Hồ nước trong xanh cho rồng hệ Thủy bơi lội.'
  },
  habitat_leaf: {
    id: 'habitat_leaf',
    name: 'Thảo Viên',
    element: 'LEAF',
    icon: '🍃',
    costGold: 250,
    costGems: 0,
    reqLevel: 1,
    levels: [
      { level: 1, maxDragons: 2, maxGold: 600, upgradeCost: 500 },
      { level: 2, maxDragons: 3, maxGold: 1800, upgradeCost: 1500 },
      { level: 3, maxDragons: 4, maxGold: 4000, upgradeCost: 0 }
    ],
    desc: 'Khu vườn sum suê hoa cỏ cho rồng hệ Mộc.'
  },
  habitat_earth: {
    id: 'habitat_earth',
    name: 'Nham Thạch Đài',
    element: 'EARTH',
    icon: '⛰️',
    costGold: 300,
    costGems: 0,
    reqLevel: 2,
    levels: [
      { level: 1, maxDragons: 2, maxGold: 700, upgradeCost: 600 },
      { level: 2, maxDragons: 3, maxGold: 2000, upgradeCost: 1800 },
      { level: 3, maxDragons: 4, maxGold: 4500, upgradeCost: 0 }
    ],
    desc: 'Mặt đất đá vững chãi cho rồng hệ Thổ cư ngụ.'
  },
  habitat_thunder: {
    id: 'habitat_thunder',
    name: 'Lôi Điện Đàn',
    element: 'THUNDER',
    icon: '⚡',
    costGold: 600,
    costGems: 5,
    reqLevel: 3,
    levels: [
      { level: 1, maxDragons: 2, maxGold: 1000, upgradeCost: 1200 },
      { level: 2, maxDragons: 3, maxGold: 2800, upgradeCost: 3000 },
      { level: 3, maxDragons: 4, maxGold: 6000, upgradeCost: 0 }
    ],
    desc: 'Cột thu lôi tích điện cao vút cho rồng hệ Lôi.'
  },
  habitat_ice: {
    id: 'habitat_ice',
    name: 'Hàn Băng Cung',
    element: 'ICE',
    icon: '❄️',
    costGold: 1500,
    costGems: 10,
    reqLevel: 5,
    levels: [
      { level: 1, maxDragons: 2, maxGold: 1500, upgradeCost: 2000 },
      { level: 2, maxDragons: 3, maxGold: 4000, upgradeCost: 4500 },
      { level: 3, maxDragons: 4, maxGold: 8500, upgradeCost: 0 }
    ],
    desc: 'Băng đăng lạnh buốt cho rồng hệ Băng.'
  },
  habitat_bone: {
    id: 'habitat_bone',
    name: 'Long Cốt Đài',
    element: 'BONE',
    icon: '💀',
    costGold: 4000,
    costGems: 20,
    reqLevel: 5,
    levels: [
      { level: 1, maxDragons: 2, maxGold: 2500, upgradeCost: 3500 },
      { level: 2, maxDragons: 3, maxGold: 6000, upgradeCost: 7000 },
      { level: 3, maxDragons: 4, maxGold: 12000, upgradeCost: 0 }
    ],
    desc: 'Bàn tế xương cổ đại phát ánh dạ quang, nơi ở lý tưởng của Tộc Rồng Xương.'
  },
  habitat_rainbow: {
    id: 'habitat_rainbow',
    name: 'Thiên Cung Ngũ Hành (VIP)',
    element: 'ALL',
    icon: '🌈',
    costGold: 5000,
    costGems: 25,
    reqLevel: 6,
    levels: [
      { level: 1, maxDragons: 3, maxGold: 3000, upgradeCost: 4000 },
      { level: 2, maxDragons: 4, maxGold: 7000, upgradeCost: 8000 },
      { level: 3, maxDragons: 5, maxGold: 15000, upgradeCost: 0 }
    ],
    desc: 'Kỳ quan thần thánh, có thể nuôi bất kỳ loài rồng nào!'
  }
};

const CROPS_DB = [
  {
    id: 'crop_berry',
    name: 'Dâu Tây Vàng',
    growTime: 20, // 20s
    costGold: 25,
    foodYield: 30,
    expYield: 8,
    icon: '🍓',
    desc: 'Trái cây ngọt lịm chín cực nhanh cho rồng con ăn nhẹ.'
  },
  {
    id: 'crop_corn',
    name: 'Ngô Vàng Long Tộc',
    growTime: 60, // 1 min
    costGold: 70,
    foodYield: 100,
    expYield: 20,
    icon: '🌽',
    desc: 'Bắp ngô vàng óng dồi dào dinh dưỡng.'
  },
  {
    id: 'crop_dragonfruit',
    name: 'Quả Gai Đảo Rồng',
    growTime: 180, // 3 mins
    costGold: 180,
    foodYield: 300,
    expYield: 50,
    icon: '🍇',
    desc: 'Đặc sản đảo rồng giúp tăng trưởng kích thước vượt bậc.'
  },
  {
    id: 'crop_apple',
    name: 'Táo Thần Bất Tử',
    growTime: 360, // 6 mins
    costGold: 450,
    foodYield: 850,
    expYield: 120,
    icon: '🍎',
    desc: 'Chứa tinh hoa đất trời, giúp rồng tích tụ ma lực hùng mạnh.'
  },
  {
    id: 'crop_magicbean',
    name: 'Hạt Đậu Thần Bay',
    growTime: 600, // 10 mins
    costGold: 1200,
    foodYield: 2600,
    expYield: 300,
    icon: '🌱',
    desc: 'Bảo vật nông nghiệp hiếm có giúp rồng đột phá cấp độ.'
  }
];

const CAMPAIGN_CHAPTERS = [
  {
    chapter: 1,
    title: 'Ải 1: Thảo Nguyên Khởi Nguyên',
    desc: 'Rèn luyện móng vuốt cùng quái thú thảo nguyên.',
    stages: [
      { id: 101, name: 'Bụi Cỏ Thần Bí', enemies: ['dragon_leaf'], level: 1, rewardGold: 80, rewardFood: 50, rewardExp: 30 },
      { id: 102, name: 'Ven Rừng Cổ Thụ', enemies: ['dragon_leaf', 'dragon_water'], level: 2, rewardGold: 120, rewardFood: 80, rewardExp: 45 },
      { id: 103, name: 'Đầm Lầy Gai Nhọn', enemies: ['dragon_mud', 'dragon_leaf'], level: 3, rewardGold: 180, rewardFood: 120, rewardExp: 60 },
      { id: 104, name: 'Đồi Gió Hú', enemies: ['dragon_leaf', 'dragon_thunder'], level: 4, rewardGold: 240, rewardFood: 160, rewardExp: 80 },
      { id: 105, name: 'Trùm Thảo Long Vương (Boss)', enemies: ['dragon_leaf', 'dragon_coral', 'dragon_leaf'], level: 5, rewardGold: 450, rewardFood: 300, rewardExp: 150, rewardGems: 5 }
    ]
  },
  {
    chapter: 2,
    title: 'Ải 2: Vực Thẳm Núi Lửa',
    desc: 'Bão lửa ngút trời thử thách lòng quả cảm.',
    stages: [
      { id: 201, name: 'Vành Đai Tro Bụi', enemies: ['dragon_fire'], level: 4, rewardGold: 220, rewardFood: 150, rewardExp: 70 },
      { id: 202, name: 'Khe Nứt Nham Thạch', enemies: ['dragon_fire', 'dragon_earth'], level: 5, rewardGold: 300, rewardFood: 200, rewardExp: 90 },
      { id: 203, name: 'Sông Dung Nham Đỏ', enemies: ['dragon_lava', 'dragon_fire'], level: 6, rewardGold: 400, rewardFood: 280, rewardExp: 120 },
      { id: 204, name: 'Lò Lửa Rực Cháy', enemies: ['dragon_lava', 'dragon_steam'], level: 7, rewardGold: 520, rewardFood: 360, rewardExp: 150 },
      { id: 205, name: 'Bá Chủ Hỏa Long (Boss)', enemies: ['dragon_lava', 'dragon_fire', 'dragon_laser'], level: 8, rewardGold: 800, rewardFood: 600, rewardExp: 250, rewardGems: 10 }
    ]
  },
  {
    chapter: 3,
    title: 'Ải 3: Đại Dương Bão Tố',
    desc: 'Sóng thần thét gào và những tia chớp xé toạc bầu trời.',
    stages: [
      { id: 301, name: 'Bờ Biển Sóng Vỗ', enemies: ['dragon_water'], level: 7, rewardGold: 450, rewardFood: 300, rewardExp: 140 },
      { id: 302, name: 'Rạn San Hô Sâu', enemies: ['dragon_coral', 'dragon_water'], level: 8, rewardGold: 550, rewardFood: 380, rewardExp: 170 },
      { id: 303, name: 'Vùng Biển Sấm Giật', enemies: ['dragon_storm', 'dragon_water'], level: 9, rewardGold: 700, rewardFood: 480, rewardExp: 210 },
      { id: 304, name: 'Vòng Xoáy Tử Thần', enemies: ['dragon_storm', 'dragon_steam'], level: 10, rewardGold: 850, rewardFood: 600, rewardExp: 260 },
      { id: 305, name: 'Thủy Thần Bão Tố (Boss)', enemies: ['dragon_storm', 'dragon_coral', 'dragon_storm'], level: 12, rewardGold: 1400, rewardFood: 1000, rewardExp: 400, rewardGems: 15 }
    ]
  },
  {
    chapter: 4,
    title: 'Ải 4: Đỉnh Cao Hàn Băng',
    desc: 'Hàn khí buốt giá phong tỏa mọi sinh mệnh.',
    stages: [
      { id: 401, name: 'Sườn Núi Băng Giá', enemies: ['dragon_ice'], level: 11, rewardGold: 800, rewardFood: 550, rewardExp: 250 },
      { id: 402, name: 'Động Pha Lê Băng', enemies: ['dragon_ice', 'dragon_mud'], level: 12, rewardGold: 1000, rewardFood: 700, rewardExp: 300 },
      { id: 403, name: 'Cơn Bão Tuyết Trắng', enemies: ['dragon_frostfire', 'dragon_ice'], level: 13, rewardGold: 1250, rewardFood: 900, rewardExp: 380 },
      { id: 404, name: 'Bức Tường Băng Vĩnh Cửu', enemies: ['dragon_frostfire', 'dragon_storm'], level: 14, rewardGold: 1500, rewardFood: 1100, rewardExp: 450 },
      { id: 405, name: 'Vua Băng Tuyết Cực Bắc (Boss)', enemies: ['dragon_frostfire', 'dragon_ice', 'dragon_frostfire'], level: 16, rewardGold: 2500, rewardFood: 1800, rewardExp: 650, rewardGems: 25 }
    ]
  },
  {
    chapter: 5,
    title: 'Ải 5: Điện Ngục Thần Thoại (Đỉnh Cao)',
    desc: 'Đối đầu cùng những thực thể cổ xưa hùng mạnh nhất vũ trụ.',
    stages: [
      { id: 501, name: 'Cổng Thánh Điện', enemies: ['dragon_light'], level: 15, rewardGold: 1600, rewardFood: 1200, rewardExp: 500 },
      { id: 502, name: 'Hành Lang Hắc Ám', enemies: ['dragon_dark'], level: 16, rewardGold: 2000, rewardFood: 1500, rewardExp: 600 },
      { id: 503, name: 'Âm Dương Xung Đột', enemies: ['dragon_light', 'dragon_dark'], level: 17, rewardGold: 2600, rewardFood: 2000, rewardExp: 750 },
      { id: 504, name: 'Đấu Trường Long Vương', enemies: ['dragon_frostfire', 'dragon_laser', 'dragon_dark'], level: 18, rewardGold: 3500, rewardFood: 2700, rewardExp: 900 },
      { id: 505, name: 'Thần Long Hoàng Kim (Trùm Cuối)', enemies: ['dragon_light', 'dragon_golden', 'dragon_dark'], level: 20, rewardGold: 6000, rewardFood: 5000, rewardExp: 1500, rewardGems: 50 }
    ]
  }
];

window.ISLANDS_DB = ISLANDS_DB;
window.HABITATS_DB = HABITATS_DB;
window.CROPS_DB = CROPS_DB;
window.CAMPAIGN_CHAPTERS = CAMPAIGN_CHAPTERS;
