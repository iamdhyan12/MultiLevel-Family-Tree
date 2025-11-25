import React, { useState, useCallback, useRef, useEffect, forwardRef } from "react";
import "./FamilyTreeSVG.css";

// ============================================
// TYPES
// ============================================
interface Person {
  id: string;
  name: string;
  lifespan: string;
}

interface ExpandableData {
  spouse: Person;
  children: Person[];
}

// ============================================
// FAMILY TREE DATA
// ============================================
const expandableNodesData: Record<string, ExpandableData> = {
  J: {
    spouse: { id: "S", name: "S", lifespan: "1952–2012" },
    children: [
      { id: "T", name: "T", lifespan: "1975–" },
      { id: "U", name: "U", lifespan: "1978–" },
      { id: "V", name: "V", lifespan: "1980–" },
    ],
  },
  G: {
    spouse: { id: "G-S", name: "G-Sp", lifespan: "1955–2020" },
    children: [
      { id: "G-C1", name: "G1", lifespan: "1980–" },
      { id: "G-C2", name: "G2", lifespan: "1982–" },
    ],
  },
  H: {
    spouse: { id: "H-S", name: "H-Sp", lifespan: "1958–2015" },
    children: [{ id: "H-C1", name: "H1", lifespan: "1985–" }],
  },
  I: {
    spouse: { id: "I-S", name: "I-Sp", lifespan: "1960–" },
    children: [
      { id: "I-C1", name: "I1", lifespan: "1988–" },
      { id: "I-C2", name: "I2", lifespan: "1990–" },
    ],
  },
  K: {
    spouse: { id: "K-S", name: "K-Sp", lifespan: "1965–" },
    children: [{ id: "K-C1", name: "K1", lifespan: "1990–" }],
  },
  L: {
    spouse: { id: "L-S", name: "L-Sp", lifespan: "1967–" },
    children: [
      { id: "L-C1", name: "L1", lifespan: "1992–" },
      { id: "L-C2", name: "L2", lifespan: "1995–" },
    ],
  },
  M: {
    spouse: { id: "M-S", name: "M-Sp", lifespan: "1968–" },
    children: [{ id: "M-C1", name: "M1", lifespan: "1993–" }],
  },
  N: {
    spouse: { id: "N-S", name: "N-Sp", lifespan: "1970–" },
    children: [
      { id: "N-C1", name: "N1", lifespan: "1996–" },
      { id: "N-C2", name: "N2", lifespan: "1998–" },
    ],
  },
  O: {
    spouse: { id: "O-S", name: "O-Sp", lifespan: "1966–" },
    children: [{ id: "O-C1", name: "O1", lifespan: "1991–" }],
  },
  P: {
    spouse: { id: "P-S", name: "P-Sp", lifespan: "1968–" },
    children: [
      { id: "P-C1", name: "P1", lifespan: "1994–" },
      { id: "P-C2", name: "P2", lifespan: "1997–" },
    ],
  },
  Q: {
    spouse: { id: "Q-S", name: "Q-Sp", lifespan: "1970–" },
    children: [{ id: "Q-C1", name: "Q1", lifespan: "1998–" }],
  },
  R: {
    spouse: { id: "R-S", name: "R-Sp", lifespan: "1972–" },
    children: [
      { id: "R-C1", name: "R1", lifespan: "2000–" },
      { id: "R-C2", name: "R2", lifespan: "2002–" },
    ],
  },
};

// ============================================
// PERSON NODE COMPONENT
// ============================================
interface PersonNodeProps {
  person: Person;
  isExpandable?: boolean;
  isExpanded?: boolean;
  isSpouse?: boolean;
  onClick?: () => void;
}

const PersonNode = forwardRef<HTMLDivElement, PersonNodeProps>(
  ({ person, isExpandable = false, isExpanded = false, isSpouse = false, onClick }, ref) => {
    return (
      <div
        ref={ref}
        className={`person-node ${isExpandable ? "expandable" : ""} ${isExpanded ? "expanded" : ""} ${isSpouse ? "spouse-node" : ""}`}
        onClick={isExpandable && !isSpouse ? onClick : undefined}
        data-node-id={person.id}
      >
        <div className="node-circle">
          <div className="circle-placeholder" />
        </div>
        <div className="node-label">
          <span className="node-name">{person.name}</span>
          <span className="node-lifespan">{person.lifespan}</span>
        </div>
        {isExpandable && !isSpouse && (
          <div className="expand-btn">{isExpanded ? "−" : "+"}</div>
        )}
      </div>
    );
  }
);

PersonNode.displayName = "PersonNode";

// ============================================
// SLOT COMPONENT - The key concept
// A slot is a container that:
// 1. Has a fixed center point relative to siblings
// 2. Expands symmetrically when person is clicked
// 3. Contains: person (+ spouse when expanded) and children below
// ============================================
interface SlotProps {
  person: Person;
  isExpandable: boolean;
  isExpanded: boolean;
  expandData?: ExpandableData;
  onToggle: () => void;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
  slotRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
}

const Slot: React.FC<SlotProps> = ({
  person,
  isExpandable,
  isExpanded,
  expandData,
  onToggle,
  nodeRefs,
  slotRefs,
}) => {
  const setNodeRef = (id: string) => (el: HTMLDivElement | null) => {
    nodeRefs.current.set(id, el);
  };

  const setSlotRef = (el: HTMLDivElement | null) => {
    slotRefs.current.set(person.id, el);
  };

  return (
    <div className="slot" ref={setSlotRef} data-slot-id={person.id}>
      {/* Couple row: person + spouse when expanded */}
      <div className={`slot-couple-row ${isExpanded ? "expanded" : ""}`}>
        <PersonNode
          ref={setNodeRef(person.id)}
          person={person}
          isExpandable={isExpandable}
          isExpanded={isExpanded}
          onClick={onToggle}
        />
        {isExpanded && expandData && (
          <PersonNode
            ref={setNodeRef(`${person.id}-spouse`)}
            person={expandData.spouse}
            isSpouse={true}
          />
        )}
      </div>

      {/* Children row: appears below couple when expanded */}
      {isExpanded && expandData && expandData.children.length > 0 && (
        <div className="slot-children-row">
          {expandData.children.map((child, idx) => (
            <div key={child.id} className="slot-child">
              <PersonNode
                ref={setNodeRef(`${person.id}-child-${idx}`)}
                person={child}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN FAMILY TREE COMPONENT
// ============================================
const FamilyTreeSVG: React.FC = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const treeRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const slotRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const coupleRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const [svgLines, setSvgLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string }[]>([]);

  const handleToggle = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const setCoupleRef = (id: string) => (el: HTMLDivElement | null) => {
    coupleRefs.current.set(id, el);
  };

  const setNodeRef = (id: string) => (el: HTMLDivElement | null) => {
    nodeRefs.current.set(id, el);
  };

  // ============================================
  // LINE CALCULATION - Recalculates everything on expand/collapse
  // ============================================
  useEffect(() => {
    const calculateLines = () => {
      if (!treeRef.current) return;

      const treeRect = treeRef.current.getBoundingClientRect();
      const newLines: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];

      // Helper: Get node position (circle boundaries)
      const getNodePos = (id: string) => {
        const el = nodeRefs.current.get(id);
        if (!el) return null;
        const circle = el.querySelector('.node-circle');
        if (!circle) return null;
        const rect = circle.getBoundingClientRect();
        return {
          centerX: rect.left + rect.width / 2 - treeRect.left,
          centerY: rect.top + rect.height / 2 - treeRect.top,
          top: rect.top - treeRect.top,
          bottom: rect.bottom - treeRect.top,
          left: rect.left - treeRect.left,
          right: rect.right - treeRect.left,
        };
      };

      // Helper: Get node top center (where parent line should connect)
      const getNodeTopCenter = (id: string) => {
        const el = nodeRefs.current.get(id);
        if (!el) return null;
        const circle = el.querySelector('.node-circle');
        if (!circle) return null;
        const rect = circle.getBoundingClientRect();
        return {
          centerX: rect.left + rect.width / 2 - treeRect.left,
          top: rect.top - treeRect.top,
        };
      };

      // Helper: Get couple center for drawing lines to children
      // Returns the center X of the couple AND the Y position of the marriage line
      const getCoupleCenter = (coupleId: string, person1Id: string, person2Id: string) => {
        const el = coupleRefs.current.get(coupleId);
        if (!el) return null;
        const rect = el.getBoundingClientRect();

        // Get the actual circle positions to find the marriage line Y
        const pos1 = getNodePos(person1Id);
        const pos2 = getNodePos(person2Id);
        if (!pos1 || !pos2) return null;

        // Marriage line Y is at the center of the circles
        const marriageLineY = (pos1.centerY + pos2.centerY) / 2;

        return {
          centerX: rect.left + rect.width / 2 - treeRect.left,
          marriageY: marriageLineY, // This is where the vertical line should start
        };
      };

      // Helper: Draw marriage line between two people (touches circle edges)
      const drawMarriageLine = (id1: string, id2: string, color = "#343a40") => {
        const pos1 = getNodePos(id1);
        const pos2 = getNodePos(id2);
        if (pos1 && pos2) {
          newLines.push({
            x1: pos1.right,
            y1: pos1.centerY,
            x2: pos2.left,
            y2: pos2.centerY,
            color,
          });
        }
      };

      // Helper: Draw line from couple to their children nodes
      // IMPORTANT: Always connect to the actual person's circle, not slot center
      const drawCoupleToChildren = (coupleId: string, person1Id: string, person2Id: string, childNodeIds: string[], color = "#343a40") => {
        const coupleCenter = getCoupleCenter(coupleId, person1Id, person2Id);
        if (!coupleCenter) return;

        // Get the TOP CENTER of each child's circle (where parent line connects)
        const childPositions = childNodeIds
          .map(id => {
            const nodeTop = getNodeTopCenter(id);
            return nodeTop ? { id, centerX: nodeTop.centerX, top: nodeTop.top } : null;
          })
          .filter(Boolean) as { id: string; centerX: number; top: number }[];

        if (childPositions.length === 0) return;

        const firstChild = childPositions[0];
        const lastChild = childPositions[childPositions.length - 1];

        // Horizontal line Y position (midway between marriage line and children top)
        const horizontalY = coupleCenter.marriageY + (firstChild.top - coupleCenter.marriageY) / 2;

        // Vertical line from marriage line center down to horizontal line
        newLines.push({
          x1: coupleCenter.centerX,
          y1: coupleCenter.marriageY,
          x2: coupleCenter.centerX,
          y2: horizontalY,
          color,
        });

        // Horizontal line - must span from leftmost point to rightmost point
        // Include couple center, first child, and last child to ensure connection
        const leftX = Math.min(firstChild.centerX, lastChild.centerX, coupleCenter.centerX);
        const rightX = Math.max(firstChild.centerX, lastChild.centerX, coupleCenter.centerX);

        newLines.push({
          x1: leftX,
          y1: horizontalY,
          x2: rightX,
          y2: horizontalY,
          color,
        });

        // Vertical lines from horizontal line down to each child's circle top
        childPositions.forEach((child) => {
          newLines.push({
            x1: child.centerX,
            y1: horizontalY,
            x2: child.centerX,
            y2: child.top,
            color,
          });
        });
      };

      // Helper: Draw expanded family lines (marriage + children)
      const drawExpandedFamily = (personId: string) => {
        const data = expandableNodesData[personId];
        if (!data) return;

        const personPos = getNodePos(personId);
        const spousePos = getNodePos(`${personId}-spouse`);
        if (!personPos || !spousePos) return;

        // Marriage line (red, touches circles)
        drawMarriageLine(personId, `${personId}-spouse`, "#e74c3c");

        // Children lines
        if (data.children.length > 0) {
          const childIds = data.children.map((_, idx) => `${personId}-child-${idx}`);
          const childPositions = childIds
            .map(id => getNodePos(id))
            .filter(Boolean) as NonNullable<ReturnType<typeof getNodePos>>[];

          if (childPositions.length === 0) return;

          // Marriage line center
          const marriageCenterX = (personPos.centerX + spousePos.centerX) / 2;
          const marriageY = personPos.centerY;

          // Horizontal line Y for children
          const firstChild = childPositions[0];
          const lastChild = childPositions[childPositions.length - 1];
          const childrenHorizontalY = marriageY + (firstChild.top - marriageY) / 2 + 20;

          // Vertical from marriage center down
          newLines.push({
            x1: marriageCenterX,
            y1: marriageY,
            x2: marriageCenterX,
            y2: childrenHorizontalY,
            color: "#e74c3c",
          });

          // Horizontal line above children
          if (childPositions.length > 1) {
            newLines.push({
              x1: firstChild.centerX,
              y1: childrenHorizontalY,
              x2: lastChild.centerX,
              y2: childrenHorizontalY,
              color: "#e74c3c",
            });
          }

          // Vertical to each child
          childPositions.forEach((childPos) => {
            newLines.push({
              x1: childPos.centerX,
              y1: childrenHorizontalY,
              x2: childPos.centerX,
              y2: childPos.top,
              color: "#e74c3c",
            });
          });
        }
      };

      // ========== DRAW ALL LINES ==========

      // Level 1: A-E marriage
      drawMarriageLine("A", "E");

      // Level 1 -> Level 2: A-E to B, C, D
      drawCoupleToChildren("couple-AE", "A", "E", ["B", "C", "D"]);

      // Level 2: Marriages
      drawMarriageLine("B", "F");
      drawMarriageLine("C", "C1");
      drawMarriageLine("D", "D1");

      // Level 2 -> Level 3: Each couple to their children slots
      drawCoupleToChildren("couple-BF", "B", "F", ["J", "G", "H", "I"]);
      drawCoupleToChildren("couple-CC1", "C", "C1", ["K", "L", "M", "N"]);
      drawCoupleToChildren("couple-DD1", "D", "D1", ["O", "P", "Q", "R"]);

      // Level 3: Expanded families
      expandedNodes.forEach((nodeId) => {
        drawExpandedFamily(nodeId);
      });

      setSvgLines(newLines);
    };

    // Recalculate after DOM updates - need multiple frames to ensure layout is complete
    // First calculation after short delay
    const timer1 = setTimeout(calculateLines, 50);
    // Second calculation after animations complete
    const timer2 = setTimeout(calculateLines, 350);

    // Also recalculate on resize
    window.addEventListener("resize", calculateLines);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", calculateLines);
    };
  }, [expandedNodes]);

  // ============================================
  // TREE DATA
  // ============================================
  const level1 = {
    primary: { id: "A", name: "A", lifespan: "1900–1970" },
    secondary: { id: "E", name: "E", lifespan: "1905–1975" },
  };

  const level2 = [
    {
      id: "BF",
      primary: { id: "B", name: "B", lifespan: "1925–1990" },
      secondary: { id: "F", name: "F", lifespan: "1928–1995" },
      children: ["J", "G", "H", "I"],
    },
    {
      id: "CC1",
      primary: { id: "C", name: "C", lifespan: "1928–1995" },
      secondary: { id: "C1", name: "C1", lifespan: "1930–1998" },
      children: ["K", "L", "M", "N"],
    },
    {
      id: "DD1",
      primary: { id: "D", name: "D", lifespan: "1930–2000" },
      secondary: { id: "D1", name: "D1", lifespan: "1932–2005" },
      children: ["O", "P", "Q", "R"],
    },
  ];

  const level3Data: Record<string, Person> = {
    J: { id: "J", name: "J", lifespan: "1950–2010" },
    G: { id: "G", name: "G", lifespan: "1952–2015" },
    H: { id: "H", name: "H", lifespan: "1955–2018" },
    I: { id: "I", name: "I", lifespan: "1958–" },
    K: { id: "K", name: "K", lifespan: "1955–" },
    L: { id: "L", name: "L", lifespan: "1958–" },
    M: { id: "M", name: "M", lifespan: "1960–" },
    N: { id: "N", name: "N", lifespan: "1962–" },
    O: { id: "O", name: "O", lifespan: "1958–" },
    P: { id: "P", name: "P", lifespan: "1960–" },
    Q: { id: "Q", name: "Q", lifespan: "1962–" },
    R: { id: "R", name: "R", lifespan: "1965–" },
  };

  return (
    <div className="family-tree-wrapper">
      <h1 className="tree-title">Family Tree</h1>
      <p className="tree-subtitle">
        Click on nodes with <span className="plus-icon">+</span> to expand and see spouse &amp; children
      </p>

      <div className="tree-scroll-container">
        <div className="family-tree-container" ref={treeRef}>
          {/* SVG Layer for all lines */}
          <svg className="tree-lines-svg">
            {svgLines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.color}
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* Level 1: A-E */}
          <div className="tree-level level-1">
            <div className="couple-container" ref={setCoupleRef("couple-AE")}>
              <PersonNode ref={setNodeRef("A")} person={level1.primary} />
              <PersonNode ref={setNodeRef("E")} person={level1.secondary} />
            </div>
          </div>

          {/* Level 2 + Level 3: Family branches (couple + their children together) */}
          <div className="tree-level level-2-3-combined">
            {level2.map((couple) => (
              <div key={couple.id} className="family-branch">
                {/* The couple */}
                <div
                  className="couple-container"
                  ref={setCoupleRef(`couple-${couple.id}`)}
                >
                  <PersonNode ref={setNodeRef(couple.primary.id)} person={couple.primary} />
                  <PersonNode ref={setNodeRef(couple.secondary.id)} person={couple.secondary} />
                </div>

                {/* Their children (slots) */}
                <div className="slots-group">
                  {couple.children.map((childId) => {
                    const person = level3Data[childId];
                    const isExpanded = expandedNodes.has(childId);
                    const expandData = expandableNodesData[childId];

                    return (
                      <Slot
                        key={childId}
                        person={person}
                        isExpandable={true}
                        isExpanded={isExpanded}
                        expandData={expandData}
                        onToggle={() => handleToggle(childId)}
                        nodeRefs={nodeRefs}
                        slotRefs={slotRefs}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeSVG;
