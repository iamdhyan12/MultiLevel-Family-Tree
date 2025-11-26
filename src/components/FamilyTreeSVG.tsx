import React, { useState, useCallback, useRef, useEffect, forwardRef } from "react";
import "./FamilyTreeSVG.css";

// Import types
import type { Person, ExpandableData } from "../data/familyTreeData";

// Import data
import {
  level1Data,
  level2Data,
  level3Data,
  expandableNodesData,
  allExpandableData,
} from "../data/familyTreeData";

// ============================================
// PERSON NODE COMPONENT
// ============================================
interface PersonNodeProps {
  person: Person;
  isExpandable?: boolean;
  isExpanded?: boolean;
  isSpouse?: boolean;
  nodeType?: 'son' | 'daughter';
  level?: number;
  onClick?: () => void;
}

const PersonNode = forwardRef<HTMLDivElement, PersonNodeProps>(
  ({ person, isExpandable = false, isExpanded = false, isSpouse = false, nodeType, level = 3, onClick }, ref) => {
    return (
      <div
        ref={ref}
        className={`person-node ${isExpandable ? "expandable" : ""} ${isExpanded ? "expanded" : ""} ${isSpouse ? "spouse-node" : ""} ${nodeType || ""} level-${level}-node`}
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
// RECURSIVE EXPANDABLE NODE COMPONENT
// Handles Level 4, 5, 6, 7+ (any depth)
// ============================================
interface ExpandableNodeProps {
  person: Person;
  level: number;
  expandedNodes: Set<string>;
  onToggle: (id: string) => void;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
}

const ExpandableNode: React.FC<ExpandableNodeProps> = ({
  person,
  level,
  expandedNodes,
  onToggle,
  nodeRefs,
}) => {
  const expandData = allExpandableData[person.id];
  const isExpanded = expandedNodes.has(person.id);
  const isExpandable = !!expandData && (expandData.spouse !== null || expandData.children.length > 0);

  const setNodeRef = (id: string) => (el: HTMLDivElement | null) => {
    nodeRefs.current.set(id, el);
  };

  return (
    <div className={`expandable-slot level-${level}-slot`}>
      <div className={`expandable-couple-row ${isExpanded ? "expanded" : ""}`}>
        <PersonNode
          ref={setNodeRef(person.id)}
          person={person}
          isExpandable={isExpandable}
          isExpanded={isExpanded}
          nodeType={expandData?.type}
          level={level}
          onClick={() => onToggle(person.id)}
        />
        {isExpanded && expandData && expandData.spouse && (
          <PersonNode
            ref={setNodeRef(`${person.id}-spouse`)}
            person={expandData.spouse}
            isSpouse={true}
            level={level}
          />
        )}
      </div>

      {/* Recursively render children */}
      {isExpanded && expandData && expandData.children.length > 0 && (
        <div className="expandable-children-row">
          {expandData.children.map((child) => (
            <ExpandableNode
              key={child.id}
              person={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              nodeRefs={nodeRefs}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// SLOT COMPONENT (Level 3)
// ============================================
interface SlotProps {
  person: Person;
  isExpandable: boolean;
  isExpanded: boolean;
  expandData?: ExpandableData;
  onToggle: () => void;
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
  slotRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
  expandedNodes: Set<string>;
  onToggleAny: (id: string) => void;
}

const Slot: React.FC<SlotProps> = ({
  person,
  isExpandable,
  isExpanded,
  expandData,
  onToggle,
  nodeRefs,
  slotRefs,
  expandedNodes,
  onToggleAny,
}) => {
  const setNodeRef = (id: string) => (el: HTMLDivElement | null) => {
    nodeRefs.current.set(id, el);
  };

  const setSlotRef = (el: HTMLDivElement | null) => {
    slotRefs.current.set(person.id, el);
  };

  return (
    <div className="slot" ref={setSlotRef} data-slot-id={person.id}>
      <div className={`slot-couple-row ${isExpanded ? "expanded" : ""}`}>
        <PersonNode
          ref={setNodeRef(person.id)}
          person={person}
          isExpandable={isExpandable}
          isExpanded={isExpanded}
          nodeType={expandData?.type}
          level={3}
          onClick={onToggle}
        />
        {isExpanded && expandData && expandData.spouse && (
          <PersonNode
            ref={setNodeRef(`${person.id}-spouse`)}
            person={expandData.spouse}
            isSpouse={true}
            level={3}
          />
        )}
      </div>

      {/* Children (Level 4+) - recursive */}
      {isExpanded && expandData && expandData.children.length > 0 && (
        <div className="slot-children-row">
          {expandData.children.map((child) => (
            <ExpandableNode
              key={child.id}
              person={child}
              level={4}
              expandedNodes={expandedNodes}
              onToggle={onToggleAny}
              nodeRefs={nodeRefs}
            />
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

  // Color scheme for different levels
  const getLevelColor = (level: number): string => {
    const colors: Record<number, string> = {
      1: "#343a40",
      2: "#343a40",
      3: "#e74c3c", // Red
      4: "#9b59b6", // Purple
      5: "#2980b9", // Blue
      6: "#27ae60", // Green
      7: "#f39c12", // Orange
    };
    return colors[level] || "#343a40";
  };

  // ============================================
  // LINE CALCULATION
  // ============================================
  useEffect(() => {
    const calculateLines = () => {
      if (!treeRef.current) return;

      const treeRect = treeRef.current.getBoundingClientRect();
      const newLines: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];

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

      const getCoupleCenter = (coupleId: string, person1Id: string, person2Id: string) => {
        const el = coupleRefs.current.get(coupleId);
        if (!el) return null;
        const rect = el.getBoundingClientRect();

        const pos1 = getNodePos(person1Id);
        const pos2 = getNodePos(person2Id);
        if (!pos1 || !pos2) return null;

        const marriageLineY = (pos1.centerY + pos2.centerY) / 2;

        return {
          centerX: rect.left + rect.width / 2 - treeRect.left,
          marriageY: marriageLineY,
        };
      };

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

      const drawCoupleToChildren = (coupleId: string, person1Id: string, person2Id: string, childNodeIds: string[], color = "#343a40") => {
        const coupleCenter = getCoupleCenter(coupleId, person1Id, person2Id);
        if (!coupleCenter) return;

        const childPositions = childNodeIds
          .map(id => {
            const nodeTop = getNodeTopCenter(id);
            return nodeTop ? { id, centerX: nodeTop.centerX, top: nodeTop.top } : null;
          })
          .filter(Boolean) as { id: string; centerX: number; top: number }[];

        if (childPositions.length === 0) return;

        const firstChild = childPositions[0];
        const lastChild = childPositions[childPositions.length - 1];

        const horizontalY = coupleCenter.marriageY + (firstChild.top - coupleCenter.marriageY) / 2;

        newLines.push({
          x1: coupleCenter.centerX,
          y1: coupleCenter.marriageY,
          x2: coupleCenter.centerX,
          y2: horizontalY,
          color,
        });

        const leftX = Math.min(firstChild.centerX, lastChild.centerX, coupleCenter.centerX);
        const rightX = Math.max(firstChild.centerX, lastChild.centerX, coupleCenter.centerX);

        newLines.push({
          x1: leftX,
          y1: horizontalY,
          x2: rightX,
          y2: horizontalY,
          color,
        });

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

      // Recursive function to draw expanded family lines at any level
      const drawExpandedFamilyRecursive = (personId: string, level: number) => {
        const data = allExpandableData[personId];
        if (!data) return;

        const personPos = getNodePos(personId);
        const spousePos = getNodePos(`${personId}-spouse`);
        if (!personPos) return;

        const color = getLevelColor(level);

        // Marriage line
        if (spousePos) {
          drawMarriageLine(personId, `${personId}-spouse`, color);
        }

        // Children lines
        if (data.children.length > 0 && spousePos) {
          const childPositions = data.children
            .map(child => {
              const pos = getNodePos(child.id);
              return pos ? { id: child.id, ...pos } : null;
            })
            .filter(Boolean) as (NonNullable<ReturnType<typeof getNodePos>> & { id: string })[];

          if (childPositions.length > 0) {
            const marriageCenterX = (personPos.centerX + spousePos.centerX) / 2;
            const marriageY = personPos.centerY;

            const firstChild = childPositions[0];
            const lastChild = childPositions[childPositions.length - 1];
            const childrenHorizontalY = marriageY + (firstChild.top - marriageY) / 2 + 20;

            // Vertical line from marriage to horizontal bar
            newLines.push({
              x1: marriageCenterX,
              y1: marriageY,
              x2: marriageCenterX,
              y2: childrenHorizontalY,
              color,
            });

            // Horizontal line - always draw it to connect parent to children
            const leftX = Math.min(marriageCenterX, firstChild.centerX, lastChild.centerX);
            const rightX = Math.max(marriageCenterX, firstChild.centerX, lastChild.centerX);

            if (leftX !== rightX) {
              newLines.push({
                x1: leftX,
                y1: childrenHorizontalY,
                x2: rightX,
                y2: childrenHorizontalY,
                color,
              });
            }

            // Vertical lines to each child
            childPositions.forEach((childPos) => {
              newLines.push({
                x1: childPos.centerX,
                y1: childrenHorizontalY,
                x2: childPos.centerX,
                y2: childPos.top,
                color,
              });
            });

            // Recursively draw children's families if expanded
            data.children.forEach((child) => {
              if (expandedNodes.has(child.id)) {
                drawExpandedFamilyRecursive(child.id, level + 1);
              }
            });
          }
        }
      };

      // ========== DRAW ALL LINES ==========

      // Level 1: Root couple marriage
      drawMarriageLine(level1Data.primary.id, level1Data.secondary.id);

      // Level 1 -> Level 2
      const level2ChildIds = level2Data.map(couple => couple.primary.id);
      drawCoupleToChildren(level1Data.coupleId, level1Data.primary.id, level1Data.secondary.id, level2ChildIds);

      // Level 2: Each couple's marriage and their children
      level2Data.forEach((couple) => {
        drawMarriageLine(couple.primary.id, couple.secondary.id);

        if (couple.childrenIds.length > 0) {
          drawCoupleToChildren(`couple-${couple.id}`, couple.primary.id, couple.secondary.id, couple.childrenIds);
        }
      });

      // Level 3+: Expanded families (recursive)
      expandedNodes.forEach((nodeId) => {
        if (expandableNodesData[nodeId]) {
          drawExpandedFamilyRecursive(nodeId, 3);
        }
      });

      setSvgLines(newLines);
    };

    const timer1 = setTimeout(calculateLines, 50);
    const timer2 = setTimeout(calculateLines, 350);
    const timer3 = setTimeout(calculateLines, 600);

    window.addEventListener("resize", calculateLines);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", calculateLines);
    };
  }, [expandedNodes]);

  return (
    <div className="family-tree-wrapper">
      <h1 className="tree-title">Patel Family Tree</h1>
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

          {/* Level 1: Root couple */}
          <div className="tree-level level-1">
            <div className="couple-container" ref={setCoupleRef(level1Data.coupleId)}>
              <PersonNode ref={setNodeRef(level1Data.primary.id)} person={level1Data.primary} level={1} />
              <PersonNode ref={setNodeRef(level1Data.secondary.id)} person={level1Data.secondary} level={1} />
            </div>
          </div>

          {/* Level 2 + Level 3: Family branches */}
          <div className="tree-level level-2-3-combined">
            {level2Data.map((couple) => (
              <div key={couple.id} className="family-branch">
                {/* The couple */}
                <div
                  className="couple-container"
                  ref={setCoupleRef(`couple-${couple.id}`)}
                >
                  <PersonNode ref={setNodeRef(couple.primary.id)} person={couple.primary} level={2} />
                  <PersonNode ref={setNodeRef(couple.secondary.id)} person={couple.secondary} level={2} />
                </div>

                {/* Their children (slots) - only render if they have children */}
                {couple.childrenIds.length > 0 && (
                  <div className="slots-group">
                    {couple.childrenIds.map((childId) => {
                      const person = level3Data[childId];
                      const isExpanded = expandedNodes.has(childId);
                      const expandData = expandableNodesData[childId];

                      return (
                        <Slot
                          key={childId}
                          person={person}
                          isExpandable={!!expandData}
                          isExpanded={isExpanded}
                          expandData={expandData}
                          onToggle={() => handleToggle(childId)}
                          nodeRefs={nodeRefs}
                          slotRefs={slotRefs}
                          expandedNodes={expandedNodes}
                          onToggleAny={handleToggle}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeSVG;
