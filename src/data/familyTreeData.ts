// Family Tree Data Structure
export interface Person {
  id: string;
  name: string;
  lifespan: string;
  spouse?: Person;
  children?: Person[];
  isExpandable?: boolean;
}

export interface CoupleNode {
  id: string;
  primary: Person;
  secondary?: Person;
  children?: CoupleNode[];
}

// Expandable nodes data (G-R level) with their spouses and children
export const expandableNodesData: Record<string, { spouse: Person; children: Person[] }> = {
  G: {
    spouse: { id: "G-S", name: "G-Spouse", lifespan: "1955–2020" },
    children: [
      { id: "G-C1", name: "G-Child1", lifespan: "1980–" },
      { id: "G-C2", name: "G-Child2", lifespan: "1982–" },
    ],
  },
  H: {
    spouse: { id: "H-S", name: "H-Spouse", lifespan: "1958–2015" },
    children: [
      { id: "H-C1", name: "H-Child1", lifespan: "1985–" },
    ],
  },
  I: {
    spouse: { id: "I-S", name: "I-Spouse", lifespan: "1960–" },
    children: [
      { id: "I-C1", name: "I-Child1", lifespan: "1988–" },
      { id: "I-C2", name: "I-Child2", lifespan: "1990–" },
    ],
  },
  J: {
    spouse: { id: "S", name: "S", lifespan: "1952–2012" },
    children: [
      { id: "T", name: "T", lifespan: "1975–" },
      { id: "U", name: "U", lifespan: "1978–" },
      { id: "V", name: "V", lifespan: "1980–" },
    ],
  },
  K: {
    spouse: { id: "K-S", name: "K-Spouse", lifespan: "1965–" },
    children: [
      { id: "K-C1", name: "K-Child1", lifespan: "1990–" },
    ],
  },
  L: {
    spouse: { id: "L-S", name: "L-Spouse", lifespan: "1967–" },
    children: [
      { id: "L-C1", name: "L-Child1", lifespan: "1992–" },
      { id: "L-C2", name: "L-Child2", lifespan: "1995–" },
    ],
  },
  M: {
    spouse: { id: "M-S", name: "M-Spouse", lifespan: "1968–" },
    children: [
      { id: "M-C1", name: "M-Child1", lifespan: "1993–" },
    ],
  },
  N: {
    spouse: { id: "N-S", name: "N-Spouse", lifespan: "1970–" },
    children: [
      { id: "N-C1", name: "N-Child1", lifespan: "1996–" },
      { id: "N-C2", name: "N-Child2", lifespan: "1998–" },
    ],
  },
  O: {
    spouse: { id: "O-S", name: "O-Spouse", lifespan: "1966–" },
    children: [
      { id: "O-C1", name: "O-Child1", lifespan: "1991–" },
    ],
  },
  P: {
    spouse: { id: "P-S", name: "P-Spouse", lifespan: "1968–" },
    children: [
      { id: "P-C1", name: "P-Child1", lifespan: "1994–" },
      { id: "P-C2", name: "P-Child2", lifespan: "1997–" },
    ],
  },
  Q: {
    spouse: { id: "Q-S", name: "Q-Spouse", lifespan: "1970–" },
    children: [
      { id: "Q-C1", name: "Q-Child1", lifespan: "1998–" },
    ],
  },
  R: {
    spouse: { id: "R-S", name: "R-Spouse", lifespan: "1972–" },
    children: [
      { id: "R-C1", name: "R-Child1", lifespan: "2000–" },
      { id: "R-C2", name: "R-Child2", lifespan: "2002–" },
    ],
  },
};

// Main family tree structure (visible on load)
export const familyTreeData: CoupleNode = {
  id: "root",
  primary: { id: "A", name: "A", lifespan: "1900–1970" },
  secondary: { id: "E", name: "E", lifespan: "1905–1975" },
  children: [
    {
      id: "branch-B",
      primary: { id: "B", name: "B", lifespan: "1925–1990" },
      secondary: { id: "F", name: "F", lifespan: "1928–1995" },
      children: [
        {
          id: "leaf-J",
          primary: { id: "J", name: "J", lifespan: "1950–2010", isExpandable: true },
        },
        {
          id: "leaf-G",
          primary: { id: "G", name: "G", lifespan: "1952–2015", isExpandable: true },
        },
        {
          id: "leaf-H",
          primary: { id: "H", name: "H", lifespan: "1955–2018", isExpandable: true },
        },
        {
          id: "leaf-I",
          primary: { id: "I", name: "I", lifespan: "1958–", isExpandable: true },
        },
      ],
    },
    {
      id: "branch-C",
      primary: { id: "C", name: "C", lifespan: "1928–1995" },
      secondary: { id: "C1", name: "C1", lifespan: "1930–1998" },
      children: [
        {
          id: "leaf-K",
          primary: { id: "K", name: "K", lifespan: "1955–", isExpandable: true },
        },
        {
          id: "leaf-L",
          primary: { id: "L", name: "L", lifespan: "1958–", isExpandable: true },
        },
        {
          id: "leaf-M",
          primary: { id: "M", name: "M", lifespan: "1960–", isExpandable: true },
        },
        {
          id: "leaf-N",
          primary: { id: "N", name: "N", lifespan: "1962–", isExpandable: true },
        },
      ],
    },
    {
      id: "branch-D",
      primary: { id: "D", name: "D", lifespan: "1930–2000" },
      secondary: { id: "D1", name: "D1", lifespan: "1932–2005" },
      children: [
        {
          id: "leaf-O",
          primary: { id: "O", name: "O", lifespan: "1958–", isExpandable: true },
        },
        {
          id: "leaf-P",
          primary: { id: "P", name: "P", lifespan: "1960–", isExpandable: true },
        },
        {
          id: "leaf-Q",
          primary: { id: "Q", name: "Q", lifespan: "1962–", isExpandable: true },
        },
        {
          id: "leaf-R",
          primary: { id: "R", name: "R", lifespan: "1965–", isExpandable: true },
        },
      ],
    },
  ],
};
