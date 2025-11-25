import React from "react";
import type { Person } from "../data/familyTreeData";
import PersonNode from "./PersonNode";

interface ExpandableSubtreeProps {
  spouse: Person;
  children: Person[];
  isExpanded: boolean;
}

const ExpandableSubtree: React.FC<ExpandableSubtreeProps> = ({
  spouse,
  children,
  isExpanded,
}) => {
  return (
    <div className={`expandable-subtree ${isExpanded ? "visible" : ""}`}>
      {/* Spouse appears to the right */}
      <div className="spouse-container">
        <div className="spouse-connector" />
        <PersonNode person={spouse} isSpouse={true} />
      </div>

      {/* Children appear below */}
      {children.length > 0 && (
        <div className="expanded-children">
          <div className="children-connector-vertical" />
          <div className="children-row">
            {children.map((child, index) => (
              <div key={child.id} className="child-node-wrapper">
                <div className="child-connector" />
                <PersonNode person={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableSubtree;
