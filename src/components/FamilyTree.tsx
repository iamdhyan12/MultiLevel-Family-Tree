import React, { useState } from "react";
import { familyTreeData } from "../data/familyTreeData";
import CoupleUnit from "./CoupleUnit";
import "./FamilyTree.css";

const FamilyTree: React.FC = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  return (
    <div className="family-tree-wrapper">
      <h1 className="tree-title">Family Tree</h1>
      <p className="tree-subtitle">Click on any node with a + to expand and see spouse &amp; children</p>
      <div className="family-tree-container">
        <div className="family-tree">
          <CoupleUnit
            couple={familyTreeData}
            expandedNodes={expandedNodes}
            onToggleExpand={handleToggleExpand}
          />
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;
