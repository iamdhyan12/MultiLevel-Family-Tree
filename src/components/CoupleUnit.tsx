import React, { useRef, useEffect, useState } from "react";
import type { CoupleNode } from "../data/familyTreeData";
import { expandableNodesData } from "../data/familyTreeData";
import PersonNode from "./PersonNode";
import ExpandableSubtree from "./ExpandableSubtree";

interface CoupleUnitProps {
  couple: CoupleNode;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  isLeafLevel?: boolean;
}

const CoupleUnit: React.FC<CoupleUnitProps> = ({
  couple,
  expandedNodes,
  onToggleExpand,
  isLeafLevel = false,
}) => {
  const { primary, secondary, children } = couple;
  const isExpandable = primary.isExpandable || false;
  const isExpanded = expandedNodes.has(primary.id);
  const expandData = expandableNodesData[primary.id];
  const childrenContainerRef = useRef<HTMLDivElement>(null);
  const [lineWidth, setLineWidth] = useState(0);

  // Calculate horizontal line width based on children positions
  useEffect(() => {
    if (childrenContainerRef.current && children && children.length > 1) {
      const container = childrenContainerRef.current;
      const childElements = container.querySelectorAll('.child-branch');
      if (childElements.length > 1) {
        const first = childElements[0] as HTMLElement;
        const last = childElements[childElements.length - 1] as HTMLElement;
        const width = last.offsetLeft - first.offsetLeft;
        setLineWidth(width);
      }
    }
  }, [children, expandedNodes]);

  return (
    <div className={`couple-unit ${isLeafLevel ? "leaf-level" : ""}`}>
      <div className="couple-container">
        {/* Primary person */}
        <div className={`person-wrapper ${isExpanded ? "expanded" : ""}`}>
          <PersonNode
            person={primary}
            isExpandable={isExpandable}
            isExpanded={isExpanded}
            onClick={() => isExpandable && onToggleExpand(primary.id)}
          />
          
          {/* Expandable content (spouse + children) */}
          {isExpandable && expandData && (
            <ExpandableSubtree
              spouse={expandData.spouse}
              children={expandData.children}
              isExpanded={isExpanded}
            />
          )}
        </div>

        {/* Secondary person (spouse shown by default in tree) */}
        {secondary && (
          <>
            <div className="couple-connector" />
            <PersonNode person={secondary} />
          </>
        )}
      </div>

      {/* Children */}
      {children && children.length > 0 && (
        <div className="children-container" ref={childrenContainerRef}>
          {/* SVG for connector lines */}
          <svg className="connector-svg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '60px', pointerEvents: 'none', overflow: 'visible' }}>
            {/* Vertical line from couple to horizontal line */}
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="35"
              stroke="#343a40"
              strokeWidth="2"
            />
            {/* Horizontal line spanning children */}
            {children.length > 1 && lineWidth > 0 && (
              <line
                x1={`calc(50% - ${lineWidth / 2}px)`}
                y1="35"
                x2={`calc(50% + ${lineWidth / 2}px)`}
                y2="35"
                stroke="#343a40"
                strokeWidth="2"
              />
            )}
          </svg>
          
          <div className="vertical-line-to-children" />
          <div 
            className="horizontal-line-above-children"
            style={{ width: lineWidth > 0 ? lineWidth : 0 }}
          />
          <div className="children-nodes">
            {children.map((child) => (
              <div key={child.id} className="child-branch">
                <div className="vertical-line-to-child" />
                <CoupleUnit
                  couple={child}
                  expandedNodes={expandedNodes}
                  onToggleExpand={onToggleExpand}
                  isLeafLevel={!child.children || child.children.length === 0}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoupleUnit;
