// ============================================
// TYPES
// ============================================
export interface Person {
  id: string;
  name: string;
  lifespan: string;
}

export interface ExpandableData {
  type: 'son' | 'daughter';
  spouse: Person | null;  // null if no spouse
  children: Person[];
}

export interface Couple {
  id: string;
  primary: Person;
  secondary: Person;
  childrenIds: string[];
}

// ============================================
// LEVEL 1: Root couple (Great Grandparents)
// ============================================
export const level1Data = {
  coupleId: "couple-root",
  primary: { id: "laxmichand", name: "Laxmichand Patel", lifespan: "" },
  secondary: { id: "laxmichand-spouse", name: "(Spouse)", lifespan: "" },
};

// ============================================
// LEVEL 2: Children of Laxmichand Patel
// ============================================
export const level2Data: Couple[] = [
  {
    id: "jeeviben-family",
    primary: { id: "jeeviben", name: "Jeeviben Patel", lifespan: "" },
    secondary: { id: "narayan", name: "Narayan Patel", lifespan: "" },
    childrenIds: [],
  },
  {
    id: "nagardas-family",
    primary: { id: "nagardas", name: "Nagardas Patel", lifespan: "" },
    secondary: { id: "dahiben", name: "Dahiben Patel", lifespan: "" },
    childrenIds: ["gangaben", "ambaben", "radhaben", "rambhai", "govindbhai", "baldevbhai"],
  },
  {
    id: "ujiben-family",
    primary: { id: "ujiben", name: "Ujiben Patel", lifespan: "" },
    secondary: { id: "mangaldas", name: "Mangaldas Patel", lifespan: "" },
    childrenIds: [],
  },
  {
    id: "hargovandas-family",
    primary: { id: "hargovandas", name: "Hargovandas Patel", lifespan: "" },
    secondary: { id: "kankuben", name: "Kankuben Patel", lifespan: "" },
    childrenIds: ["natvarbhai", "subhadraben", "babulal", "jayantibhai", "ramanbhai"],
  },
  {
    id: "heeraben-family",
    primary: { id: "heeraben", name: "Heeraben Patel", lifespan: "" },
    secondary: { id: "khodidas", name: "Khodidas Patel", lifespan: "" },
    childrenIds: [],
  },
  {
    id: "ishvardas-family",
    primary: { id: "ishvardas", name: "Ishvardas Patel", lifespan: "" },
    secondary: { id: "shakariben", name: "Shakariben Patel", lifespan: "" },
    childrenIds: ["madhuben", "kantibhai", "shardaben", "dasrathbhai", "dineshbhai"],
  },
];

// ============================================
// LEVEL 3: Grandchildren
// ============================================
export const level3Data: Record<string, Person> = {
  // Children of Nagardas & Dahiben
  gangaben: { id: "gangaben", name: "Gangaben Patel", lifespan: "" },
  ambaben: { id: "ambaben", name: "Ambaben Patel", lifespan: "" },
  radhaben: { id: "radhaben", name: "Radhaben Patel", lifespan: "" },
  rambhai: { id: "rambhai", name: "Rambhai Patel", lifespan: "" },
  govindbhai: { id: "govindbhai", name: "Govindbhai Patel", lifespan: "" },
  baldevbhai: { id: "baldevbhai", name: "Baldevbhai Patel", lifespan: "" },

  // Children of Hargovandas & Kankuben
  natvarbhai: { id: "natvarbhai", name: "Natvarbhai Patel", lifespan: "" },
  subhadraben: { id: "subhadraben", name: "Subhadraben Patel", lifespan: "" },
  babulal: { id: "babulal", name: "Babulal Patel", lifespan: "" },
  jayantibhai: { id: "jayantibhai", name: "Jayantibhai Patel", lifespan: "" },
  ramanbhai: { id: "ramanbhai", name: "Ramanbhai Patel", lifespan: "" },

  // Children of Ishvardas & Shakariben
  madhuben: { id: "madhuben", name: "Madhuben Patel", lifespan: "" },
  kantibhai: { id: "kantibhai", name: "Kantibhai Patel", lifespan: "" },
  shardaben: { id: "shardaben", name: "Shardaben Patel", lifespan: "" },
  dasrathbhai: { id: "dasrathbhai", name: "Dasrathbhai Patel", lifespan: "" },
  dineshbhai: { id: "dineshbhai", name: "Dineshbhai Patel", lifespan: "" },
};

// ============================================
// LEVEL 3 EXPANDABLE DATA
// ============================================
export const expandableNodesData: Record<string, ExpandableData> = {
  // ========== Children of Nagardas & Dahiben ==========
  gangaben: {
    type: 'daughter',
    spouse: { id: "chotalal", name: "Chotalal Patel", lifespan: "" },
    children: [],
  },
  ambaben: {
    type: 'daughter',
    spouse: { id: "virchanddas", name: "Virchanddas Patel", lifespan: "" },
    children: [],
  },
  radhaben: {
    type: 'daughter',
    spouse: { id: "jayantilal", name: "Jayantilal Patel", lifespan: "" },
    children: [],
  },
  rambhai: {
    type: 'son',
    spouse: { id: "rambhai-kantaben", name: "Kantaben Patel", lifespan: "" },
    children: [
      { id: "ushaben", name: "Ushaben Patel", lifespan: "" },
      { id: "umaben", name: "Umaben Patel", lifespan: "" },
      { id: "ilaben", name: "Ilaben Patel", lifespan: "" },
      { id: "ashwinbhai", name: "Ashwinbhai Patel", lifespan: "" },
      { id: "ashokbhai", name: "Ashokbhai Patel", lifespan: "" },
    ],
  },
  govindbhai: {
    type: 'son',
    spouse: { id: "govindbhai-kantaben", name: "Kantaben Patel", lifespan: "" },
    children: [
      { id: "geeraben", name: "Geeraben Shah", lifespan: "" },
      { id: "dhara", name: "Dhara Patel", lifespan: "" },
      { id: "devanshu", name: "Devanshu Patel", lifespan: "" },
    ],
  },
  baldevbhai: {
    type: 'son',
    spouse: { id: "anandiben", name: "Anandiben Patel", lifespan: "" },
    children: [
      { id: "kaushik", name: "Kaushik Patel", lifespan: "" },
      { id: "hirenbhai", name: "Hirenbhai Patel", lifespan: "" },
      { id: "nilesh", name: "Nilesh Patel", lifespan: "" },
    ],
  },

  // ========== Children of Hargovandas & Kankuben ==========
  natvarbhai: {
    type: 'son',
    spouse: { id: "vidhyaben", name: "Vidhyaben Patel", lifespan: "" },
    children: [
      { id: "natvarbhai-sarojben", name: "Sarojben Patel", lifespan: "" },
      { id: "bharatbhai", name: "Bharatbhai Patel", lifespan: "" },
      { id: "veenaben", name: "Veenaben Patel", lifespan: "" },
      { id: "rameshchandra", name: "Rameshchandra Patel", lifespan: "" },
    ],
  },
  subhadraben: {
    type: 'daughter',
    spouse: { id: "gandalal", name: "Gandalal Patel", lifespan: "" },
    children: [],
  },
  babulal: {
    type: 'son',
    spouse: { id: "babulal-madhuben", name: "Madhuben Patel", lifespan: "" },
    children: [
      { id: "rajeshkumar", name: "Dr. Rajeshkumar Patel", lifespan: "" },
      { id: "seemaben", name: "Seemaben Patel", lifespan: "" },
      { id: "tejal", name: "Tejal Patel", lifespan: "" },
    ],
  },
  jayantibhai: {
    type: 'son',
    spouse: { id: "vasantiben", name: "Vasantiben Patel", lifespan: "" },
    children: [
      { id: "sonalben", name: "Sonalben Patel", lifespan: "" },
      { id: "jagrutiben", name: "Jagrutiben Patel", lifespan: "" },
      { id: "rekhaben", name: "Rekhaben Patel", lifespan: "" },
      { id: "vishal", name: "Vishal Patel", lifespan: "" },
    ],
  },
  ramanbhai: {
    type: 'son',
    spouse: { id: "leelben", name: "Leelben Patel", lifespan: "" },
    children: [
      { id: "nitinbhai", name: "Nitinbhai Patel", lifespan: "" },
      { id: "trupti", name: "Trupti Patel", lifespan: "" },
      { id: "hitesh", name: "Hitesh Patel", lifespan: "" },
    ],
  },

  // ========== Children of Ishvardas & Shakariben ==========
  madhuben: {
    type: 'daughter',
    spouse: { id: "ramdas", name: "Ramdas Patel", lifespan: "" },
    children: [],
  },
  kantibhai: {
    type: 'son',
    spouse: { id: "sarojben", name: "Sarojben Patel", lifespan: "" },
    children: [
      { id: "bhaveshbhai", name: "Bhaveshbhai Patel", lifespan: "" },
      { id: "miteshbhai", name: "Miteshbhai Patel", lifespan: "" },
      { id: "ketalben", name: "Ketalben Patel", lifespan: "" },
    ],
  },
  shardaben: {
    type: 'daughter',
    spouse: { id: "chimanlal", name: "Chimanlal Patel", lifespan: "" },
    children: [],
  },
  dasrathbhai: {
    type: 'son',
    spouse: { id: "kapilaben", name: "Kapilaben Patel", lifespan: "" },
    children: [
      { id: "viral", name: "Viral Patel", lifespan: "" },
      { id: "dhiral", name: "Dhiral Patel", lifespan: "" },
    ],
  },
  dineshbhai: {
    type: 'son',
    spouse: { id: "jyotsnaben", name: "Jyotsnaben Patel", lifespan: "" },
    children: [
      { id: "hetalben", name: "Hetalben Patel", lifespan: "" },
      { id: "payal", name: "Payal Patel", lifespan: "" },
      { id: "kapil", name: "Kapil Patel", lifespan: "" },
    ],
  },
};

// ============================================
// LEVEL 4 EXPANDABLE DATA (Great-great-grandchildren with spouses)
// ============================================
export const level4ExpandableData: Record<string, ExpandableData> = {
  // ========== Children of Rambhai ==========
  ushaben: {
    type: 'daughter',
    spouse: { id: "manulal", name: "Manulal Patel", lifespan: "" },
    children: [],
  },
  umaben: {
    type: 'daughter',
    spouse: { id: "narendrakumar", name: "Narendrakumar Patel", lifespan: "" },
    children: [],
  },
  ilaben: {
    type: 'daughter',
    spouse: { id: "narendakumar2", name: "Narendakumar Patel", lifespan: "" },
    children: [],
  },
  ashwinbhai: {
    type: 'son',
    spouse: { id: "premilaben", name: "Premilaben Patel", lifespan: "" },
    children: [
      { id: "ritul", name: "Ritul Patel", lifespan: "" },
      { id: "komal", name: "Komal Patel", lifespan: "" },
    ],
  },
  ashokbhai: {
    type: 'son',
    spouse: { id: "ashokbhai-jyotsnaben", name: "Jyotsnaben Patel", lifespan: "" },
    children: [
      { id: "keval", name: "Dr. Keval Patel", lifespan: "" },
      { id: "mittal", name: "Mittal Patel", lifespan: "" },
    ],
  },

  // ========== Children of Govindbhai ==========
  geeraben: {
    type: 'daughter',
    spouse: { id: "chetankumar", name: "Chetankumar Shah", lifespan: "" },
    children: [],
  },
  dhara: {
    type: 'daughter',
    spouse: { id: "maulik", name: "Maulik Patel", lifespan: "" },
    children: [],
  },
  devanshu: {
    type: 'son',
    spouse: { id: "amisha", name: "Amisha Patel", lifespan: "" },
    children: [
      { id: "anshal", name: "Anshal Patel", lifespan: "" },
      { id: "siya", name: "Siya Patel", lifespan: "" },
    ],
  },

  // ========== Children of Baldevbhai ==========
  kaushik: {
    type: 'son',
    spouse: { id: "parul", name: "Parul Patel", lifespan: "" },
    children: [
      { id: "kush", name: "Kush Patel", lifespan: "" },
      { id: "shiv", name: "Shiv Patel", lifespan: "" },
    ],
  },
  hirenbhai: {
    type: 'son',
    spouse: { id: "nimishaben", name: "Nimishaben Patel", lifespan: "" },
    children: [
      { id: "meet", name: "Meet Patel", lifespan: "" },
    ],
  },
  nilesh: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Natvarbhai ==========
  "natvarbhai-sarojben": {
    type: 'daughter',
    spouse: { id: "rajendra", name: "Rajendra Patel", lifespan: "" },
    children: [],
  },
  bharatbhai: {
    type: 'son',
    spouse: { id: "pravinaben", name: "Pravinaben Patel", lifespan: "" },
    children: [
      { id: "keyur", name: "Dr. Keyur Patel", lifespan: "" },
    ],
  },
  veenaben: {
    type: 'daughter',
    spouse: { id: "sureshbhai", name: "Sureshbhai", lifespan: "" },
    children: [],
  },
  rameshchandra: {
    type: 'son',
    spouse: { id: "surekhaben", name: "Surekhaben Patel", lifespan: "" },
    children: [
      { id: "deep", name: "Deep Patel", lifespan: "" },
    ],
  },

  // ========== Children of Babulal ==========
  rajeshkumar: {
    type: 'son',
    spouse: { id: "heenaben", name: "Heenaben Patel", lifespan: "" },
    children: [
      { id: "alisha", name: "Alisha Patel", lifespan: "" },
      { id: "dhyan", name: "Dhyan Patel", lifespan: "" },
    ],
  },
  seemaben: {
    type: 'daughter',
    spouse: { id: "vinodkumar", name: "Vinodkumar Patel", lifespan: "" },
    children: [],
  },
  tejal: {
    type: 'daughter',
    spouse: { id: "jigar", name: "Jigar Patel", lifespan: "" },
    children: [],
  },

  // ========== Children of Jayantibhai ==========
  sonalben: {
    type: 'daughter',
    spouse: { id: "sonalben-dilipkumar", name: "Dilipkumar Patel", lifespan: "" },
    children: [],
  },
  jagrutiben: {
    type: 'daughter',
    spouse: { id: "jagrutiben-dilipkumar", name: "Dilipkumar Patel", lifespan: "" },
    children: [],
  },
  rekhaben: {
    type: 'daughter',
    spouse: { id: "hirenkumar", name: "Hirenkumar Patel", lifespan: "" },
    children: [],
  },
  vishal: {
    type: 'son',
    spouse: { id: "bindi", name: "Bindi Patel", lifespan: "" },
    children: [
      { id: "riyaan", name: "Riyaan Patel", lifespan: "" },
    ],
  },

  // ========== Children of Ramanbhai ==========
  nitinbhai: {
    type: 'son',
    spouse: { id: "amitaben", name: "Amitaben Patel", lifespan: "" },
    children: [
      { id: "jenish", name: "Jenish Patel", lifespan: "" },
      { id: "hensi", name: "Hensi Patel", lifespan: "" },
    ],
  },
  hitesh: {
    type: 'son',
    spouse: { id: "hemali", name: "Hemali Patel", lifespan: "" },
    children: [
      { id: "om", name: "Om Patel", lifespan: "" },
    ],
  },
  trupti: {
    type: 'daughter',
    spouse: { id: "mehulkumar", name: "Mehulkumar Patel", lifespan: "" },
    children: [],
  },

  // ========== Children of Kantibhai ==========
  bhaveshbhai: {
    type: 'son',
    spouse: { id: "neelaben", name: "Neelaben Patel", lifespan: "" },
    children: [
      { id: "meghan", name: "Dr. Meghan Patel", lifespan: "" },
      { id: "vedan", name: "Vedan Patel", lifespan: "" },
    ],
  },
  miteshbhai: {
    type: 'son',
    spouse: { id: "riya", name: "Riya Patel", lifespan: "" },
    children: [
      { id: "sanvi", name: "Sanvi Patel", lifespan: "" },
      { id: "hitvam", name: "Hitvam Patel", lifespan: "" },
    ],
  },
  ketalben: {
    type: 'daughter',
    spouse: null,
    children: [],
  },

  // ========== Children of Dasrathbhai ==========
  viral: {
    type: 'son',
    spouse: { id: "reema", name: "Reema Patel", lifespan: "" },
    children: [
      { id: "jaimin", name: "Jaimin Patel", lifespan: "" },
    ],
  },
  dhiral: {
    type: 'son',
    spouse: { id: "hiral", name: "Hiral Patel", lifespan: "" },
    children: [
      { id: "hit", name: "Hit Patel", lifespan: "" },
    ],
  },

  // ========== Children of Dineshbhai ==========
  hetalben: {
    type: 'daughter',
    spouse: { id: "jignesh", name: "Jignesh Patel", lifespan: "" },
    children: [],
  },
  payal: {
    type: 'daughter',
    spouse: { id: "ronak", name: "Ronak Patel", lifespan: "" },
    children: [],
  },
  kapil: {
    type: 'son',
    spouse: { id: "priyanka", name: "Priyanka Patel", lifespan: "" },
    children: [
      { id: "shiyan", name: "Shiyan Patel", lifespan: "" },
      { id: "anaya", name: "Anaya Patel", lifespan: "" },
    ],
  },
};

// ============================================
// LEVEL 5 EXPANDABLE DATA
// ============================================
export const level5ExpandableData: Record<string, ExpandableData> = {
  // ========== Children of Ashwinbhai ==========
  ritul: {
    type: 'son',
    spouse: { id: "palak", name: "Palak Patel", lifespan: "" },
    children: [
      { id: "harvi", name: "Harvi Patel", lifespan: "" },
      { id: "mihan", name: "Mihan Patel", lifespan: "" },
    ],
  },
  komal: {
    type: 'daughter',
    spouse: { id: "vicky", name: "Vicky Patel", lifespan: "" },
    children: [],
  },

  // ========== Children of Ashokbhai ==========
  keval: {
    type: 'son',
    spouse: null,
    children: [],
  },
  mittal: {
    type: 'daughter',
    spouse: null,
    children: [],
  },

  // ========== Children of Devanshu ==========
  anshal: {
    type: 'son',
    spouse: null,
    children: [],
  },
  siya: {
    type: 'daughter',
    spouse: null,
    children: [],
  },

  // ========== Children of Kaushik ==========
  kush: {
    type: 'son',
    spouse: null,
    children: [],
  },
  shiv: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Hirenbhai ==========
  meet: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Bharatbhai ==========
  keyur: {
    type: 'son',
    spouse: { id: "kinjal", name: "Dr. Kinjal Patel", lifespan: "" },
    children: [
      { id: "jiyaan", name: "Jiyaan Patel", lifespan: "" },
    ],
  },

  // ========== Children of Rameshchandra ==========
  deep: {
    type: 'son',
    spouse: { id: "helly", name: "Helly Patel", lifespan: "" },
    children: [],
  },

  // ========== Children of Dr. Rajeshkumar ==========
  alisha: {
    type: 'daughter',
    spouse: { id: "neel", name: "Neel Shah", lifespan: "" },
    children: [],
  },
  dhyan: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Vishal ==========
  riyaan: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Nitinbhai ==========
  jenish: {
    type: 'daughter',
    spouse: null,
    children: [],
  },
  hensi: {
    type: 'daughter',
    spouse: null,
    children: [],
  },

  // ========== Children of Hitesh ==========
  om: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Bhaveshbhai ==========
  meghan: {
    type: 'son',
    spouse: { id: "prachi", name: "Prachi Patel", lifespan: "" },
    children: [],
  },
  vedan: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Miteshbhai ==========
  sanvi: {
    type: 'daughter',
    spouse: null,
    children: [],
  },
  hitvam: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Viral ==========
  jaimin: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Dhiral ==========
  hit: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Kapil ==========
  shiyan: {
    type: 'son',
    spouse: null,
    children: [],
  },
  anaya: {
    type: 'daughter',
    spouse: null,
    children: [],
  },
};

// ============================================
// LEVEL 6 EXPANDABLE DATA
// ============================================
export const level6ExpandableData: Record<string, ExpandableData> = {
  // ========== Children of Ritul ==========
  harvi: {
    type: 'daughter',
    spouse: null,
    children: [],
  },
  mihan: {
    type: 'son',
    spouse: null,
    children: [],
  },

  // ========== Children of Dr. Keyur ==========
  jiyaan: {
    type: 'son',
    spouse: null,
    children: [],
  },
};

// ============================================
// COMBINED EXPANDABLE DATA (all levels for easy lookup)
// ============================================
export const allExpandableData: Record<string, ExpandableData> = {
  ...expandableNodesData,
  ...level4ExpandableData,
  ...level5ExpandableData,
  ...level6ExpandableData,
};