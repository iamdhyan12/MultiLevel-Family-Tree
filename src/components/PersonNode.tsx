import React from "react";
import type { Person } from "../data/familyTreeData";

interface PersonNodeProps {
  person: Person;
  isExpanded?: boolean;
  isExpandable?: boolean;
  isSpouse?: boolean;
  onClick?: () => void;
}

const PersonNode: React.FC<PersonNodeProps> = ({
  person,
  isExpanded = false,
  isExpandable = false,
  isSpouse = false,
  onClick,
}) => {
  const handleClick = () => {
    if (!isSpouse && isExpandable && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`person-node ${isExpandable && !isSpouse ? "expandable" : ""} ${
        isExpanded ? "expanded" : ""
      } ${isSpouse ? "spouse" : ""}`}
      onClick={handleClick}
    >
      <div className="node-circle">
        <div className="circle-inner" />
      </div>
      <div className="node-info">
        <span className="node-name">{person.name}</span>
        <span className="node-lifespan">{person.lifespan}</span>
      </div>
      {isExpandable && !isSpouse && (
        <div className="expand-indicator">{isExpanded ? "−" : "+"}</div>
      )}
    </div>
  );
};

export default PersonNode;
