import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  type Node,
  useViewport,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './FamilyTreeFlow.css';
import familyData from '../data/family.json';

// ============================================
// TYPES
// ============================================





interface FamilyMember {
  id: string;
  name: string;           // Full name - will be split into firstName and surname
  firstName?: string;     // Optional: if you want to specify separately
  surname?: string;       // Optional: if you want to specify separately
  birthYear?: number;     // e.g., 1907
  deathYear?: number;     // e.g., 1977 (if not present, person is alive)
  place?: string;         // e.g., "Pansar, IN"
  image?: string;         // Cloudinary image URL
  spouse?: {
    id: string;
    name: string;
    firstName?: string;
    surname?: string;
    birthYear?: number;
    deathYear?: number;
    place?: string;
    image?: string;       // Cloudinary image URL for spouse
  };
  children: FamilyMember[];
}

interface LineData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'marriage' | 'parent-child' | 'sibling-bar' | 'child-drop';
}

interface ChildPosition {
  centerX: number;
  marriageLineX: number | null;  // X position of marriage line center (if has spouse)
  marriageLineY: number;         // Y position where child's marriage line is (or circle center)
  hasSpouse: boolean;
}

// ============================================
// LAYOUT CONSTANTS
// ============================================
const LAYOUT = {
  NODE_WIDTH: 140,        // Wider to fit longer names
  NODE_HEIGHT: 160,       // Taller to fit name + years + place
  CIRCLE_SIZE: 75,
  SPOUSE_GAP: 120,        // Gap between husband and wife circles
  SIBLING_GAP: 50,        // Minimum gap between siblings
  VERTICAL_SPACING: 200,  // More vertical space between levels
};

// ============================================
// IMAGE PRELOADING UTILITIES
// ============================================
const preloadedImages = new Set<string>();

function preloadImage(url: string | undefined): void {
  if (!url || preloadedImages.has(url)) return;
  preloadedImages.add(url);
  const img = new Image();
  img.src = url;
}

function preloadMemberImages(member: FamilyMember): void {
  // Preload member's own image
  preloadImage(member.image);

  // Preload spouse image
  if (member.spouse?.image) {
    preloadImage(member.spouse.image);
  }

  // Preload all children's images (and their spouses)
  for (const child of member.children) {
    preloadImage(child.image);
    if (child.spouse?.image) {
      preloadImage(child.spouse.image);
    }
  }
}

function findMemberById(root: FamilyMember, id: string): FamilyMember | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findMemberById(child, id);
    if (found) return found;
  }
  return null;
}

// ============================================
// PERSON NODE COMPONENT
// ============================================
interface PersonNodeData {
  label: string;          // Full name (kept for compatibility)
  firstName: string;      // First name
  surname: string;        // Surname/Last name
  birthYear?: number;     // Birth year
  deathYear?: number;     // Death year (undefined = still alive)
  place?: string;         // Place of living
  image?: string;         // Cloudinary image URL
  isExpandable: boolean;
  isExpanded: boolean;
  isSpouse: boolean;
  level: number;
}

// Helper function to split full name into first name and surname
function splitName(fullName: string): { firstName: string; surname: string } {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return { firstName: parts[0], surname: '' };
  }
  // Last word is surname, everything else is first name
  const surname = parts[parts.length - 1];
  const firstName = parts.slice(0, -1).join(' ');
  return { firstName, surname };
}

// Helper function to format years display
function formatYears(birthYear?: number, deathYear?: number): string | null {
  if (!birthYear) return null;
  if (deathYear) {
    return `${birthYear}-${deathYear}`;
  }
  return `${birthYear}-present`;
}

function PersonNode({ data }: { data: PersonNodeData }) {
  const {
    firstName,
    surname,
    birthYear,
    deathYear,
    place,
    image,
    isExpandable,
    isExpanded,
    isSpouse,
    level
  } = data;

  const yearsDisplay = formatYears(birthYear, deathYear);

  return (
    <div
      className={`person-node ${isExpandable ? 'expandable' : ''} ${isExpanded ? 'expanded' : ''} ${isSpouse ? 'spouse' : ''}`}
      style={{ width: LAYOUT.NODE_WIDTH, height: LAYOUT.NODE_HEIGHT }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      <div className="node-circle" style={{ width: LAYOUT.CIRCLE_SIZE, height: LAYOUT.CIRCLE_SIZE }}>
        {image ? (
          <img
            src={image}
            alt={`${firstName} ${surname}`}
            className="person-image"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div className="circle-inner" />
        )}
        {isExpandable && !isSpouse && (
          <div className={`expand-btn level-${level}-btn`}>
            {isExpanded ? '−' : '+'}
          </div>
        )}
      </div>

      {/* Name Display - First name on line 1, Surname on line 2 */}
      <div className="node-info">
        <div className="node-name">
          <span className="first-name">{firstName}</span>
          {surname && <span className="surname">{surname}</span>}
        </div>

        {/* Years Display - Same font size as name */}
        {yearsDisplay && (
          <div className="node-years">{yearsDisplay}</div>
        )}

        {/* Place Display - Smaller font */}
        {place && (
          <div className="node-place">{place}</div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = {
  person: PersonNode,
};

// ============================================
// CALCULATE SUBTREE WIDTH - FIXED ALGORITHM
// ============================================
function getSubtreeWidth(node: FamilyMember, expanded: Set<string>): number {
  const isExpanded = expanded.has(node.id);

  // Base width for a single person or couple
  const hasSpouse = node.spouse && isExpanded;
  const coupleWidth = hasSpouse
    ? LAYOUT.NODE_WIDTH * 2 + LAYOUT.SPOUSE_GAP - LAYOUT.NODE_WIDTH  // Two people with gap
    : LAYOUT.NODE_WIDTH;

  // If not expanded or no children, return the couple/person width
  if (!isExpanded || node.children.length === 0) {
    return coupleWidth;
  }

  // Calculate total width needed by all children
  let childrenTotalWidth = 0;
  for (let i = 0; i < node.children.length; i++) {
    childrenTotalWidth += getSubtreeWidth(node.children[i], expanded);
    if (i < node.children.length - 1) {
      childrenTotalWidth += LAYOUT.SIBLING_GAP;
    }
  }

  // Return the maximum of couple width and children width
  // This ensures parent stays centered over children
  return Math.max(coupleWidth, childrenTotalWidth);
}

// ============================================
// LINES LAYER COMPONENT
// ============================================
function LinesLayer({ lines }: { lines: LineData[] }) {
  const { x, y, zoom } = useViewport();

  return (
    <svg
      className="lines-layer"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <g transform={`translate(${x}, ${y}) scale(${zoom})`}>
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.type === 'marriage' ? '#666' : (line.type === 'parent-child' || line.type === 'child-drop' ? '#c53030' : '#c53030')}
            strokeWidth={2}
          />
        ))}
      </g>
    </svg>
  );
}

// ============================================
// MAIN FAMILY TREE COMPONENT
// ============================================
function FamilyTreeInner() {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    // Start with root expanded
    return new Set([(familyData as FamilyMember).id]);
  });

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const nodeData = node.data as unknown as PersonNodeData;
    if (nodeData.isExpandable && !nodeData.isSpouse) {
      // Find the member in the family tree
      const member = findMemberById(familyData as FamilyMember, node.id);

      // Preload images BEFORE expanding (if we're about to expand)
      if (member && !expanded.has(node.id)) {
        preloadMemberImages(member);
      }

      setExpanded(prev => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
    }
  }, [expanded]);

  const { nodes, lines } = useMemo(() => {
    const nodes: Node[] = [];
    const lines: LineData[] = [];

    // Process a node and position it
    // Returns information about where this node's "connection point" is for parent lines
    function processNode(
      node: FamilyMember,
      x: number,      // Center X position for this subtree
      y: number,      // Y position for this level
      level: number
    ): ChildPosition {
      const isExpanded = expanded.has(node.id);
      const hasSpouse = node.spouse && isExpanded;
      const hasChildren = node.children.length > 0 && isExpanded;

      // Calculate positions for person and spouse
      let personX: number;
      let spouseX: number | null = null;

      if (hasSpouse) {
        // Position couple centered on x
        const coupleWidth = LAYOUT.SPOUSE_GAP;
        personX = x - coupleWidth / 2;
        spouseX = x + coupleWidth / 2;
      } else {
        personX = x;
      }

      // Split name into firstName and surname
      const { firstName, surname } = node.firstName && node.surname
        ? { firstName: node.firstName, surname: node.surname }
        : splitName(node.name);

      // Add person node
      nodes.push({
        id: node.id,
        type: 'person',
        position: { x: personX - LAYOUT.NODE_WIDTH / 2, y },
        data: {
          label: node.name,
          firstName,
          surname,
          birthYear: node.birthYear,
          deathYear: node.deathYear,
          place: node.place,
          image: node.image,
          isExpandable: node.children.length > 0 || !!node.spouse,
          isExpanded,
          isSpouse: false,
          level,
        },
      });

      // Calculate Y positions
      const circleCenterY = y + LAYOUT.CIRCLE_SIZE / 2;

      // The connection point for lines coming from parent
      // If has spouse, it's the center of the marriage line
      // If no spouse, it's the top of the circle
      let marriageLineX: number | null = null;

      // Add spouse node if expanded
      if (hasSpouse && node.spouse) {
        // Split spouse name into firstName and surname
        const { firstName: spouseFirstName, surname: spouseSurname } =
          node.spouse.firstName && node.spouse.surname
            ? { firstName: node.spouse.firstName, surname: node.spouse.surname }
            : splitName(node.spouse.name);

        nodes.push({
          id: node.spouse.id,
          type: 'person',
          position: { x: spouseX! - LAYOUT.NODE_WIDTH / 2, y },
          data: {
            label: node.spouse.name,
            firstName: spouseFirstName,
            surname: spouseSurname,
            birthYear: node.spouse.birthYear,
            deathYear: node.spouse.deathYear,
            place: node.spouse.place,
            image: node.spouse.image,
            isExpandable: false,
            isExpanded: false,
            isSpouse: true,
            level,
          },
        });

        // Marriage line between spouses (horizontal line at circle center level)
        const marriageLineLeft = personX + LAYOUT.CIRCLE_SIZE / 2 - 10;
        const marriageLineRight = spouseX! - LAYOUT.CIRCLE_SIZE / 2 + 10;
        marriageLineX = (marriageLineLeft + marriageLineRight) / 2; // Center of marriage line

        lines.push({
          x1: marriageLineLeft,
          y1: circleCenterY,
          x2: marriageLineRight,
          y2: circleCenterY,
          type: 'marriage',
        });

      }

      // Process children if expanded
      if (hasChildren) {
        const childY = y + LAYOUT.VERTICAL_SPACING;
        const childCount = node.children.length;

        // Calculate total width needed for all children
        let totalChildrenWidth = 0;
        const childWidths: number[] = [];

        for (let i = 0; i < childCount; i++) {
          const childWidth = getSubtreeWidth(node.children[i], expanded);
          childWidths.push(childWidth);
          totalChildrenWidth += childWidth;
          if (i < childCount - 1) {
            totalChildrenWidth += LAYOUT.SIBLING_GAP;
          }
        }

        // Start position for first child (centered under parent)
        let childStartX = x - totalChildrenWidth / 2;

        // The parent connection point (center of marriage line if has spouse, else center of person)
        const parentConnectionX = hasSpouse ? x : personX;
        const horizontalBarY = childY - 30; // Horizontal bar position

        // Vertical line from parent's marriage line (or circle center) down to horizontal bar
        lines.push({
          x1: parentConnectionX,
          y1: circleCenterY, // Always start from circle center Y (same as marriage line)
          x2: parentConnectionX,
          y2: horizontalBarY,
          type: 'parent-child',
        });

        // Store child positions for drawing lines
        const childPositions: ChildPosition[] = [];

        // Position each child
        for (let i = 0; i < childCount; i++) {
          const childWidth = childWidths[i];
          const childCenterX = childStartX + childWidth / 2;

          // Process child recursively and get its connection info
          const childPos = processNode(node.children[i], childCenterX, childY, level + 1);
          childPositions.push(childPos);

          // Move to next child position
          childStartX += childWidth + LAYOUT.SIBLING_GAP;
        }

        // Horizontal bar connecting all children
        // For children with spouses, we need to use the marriage line X position
        if (childCount > 1) {
          // Get the X positions for the bar endpoints
          const firstChildX = childPositions[0].centerX;
          const lastChildX = childPositions[childPositions.length - 1].centerX;

          lines.push({
            x1: firstChildX,
            y1: horizontalBarY,
            x2: lastChildX,
            y2: horizontalBarY,
            type: 'sibling-bar',
          });
        }

        // Vertical drop lines from horizontal bar to each child
        // Connect to the marriage line if child has spouse, otherwise to top of circle
        for (const childPos of childPositions) {
          // For the horizontal position, always use centerX (center of the child or couple)
          const dropX = childPos.centerX;

          // For the vertical end point:
          // If child has spouse expanded, connect to the marriage line (circleCenterY level)
          // If no spouse, connect to just above the top of their circle
          lines.push({
            x1: dropX,
            y1: horizontalBarY,
            x2: dropX,
            y2: childPos.marriageLineY,
            type: 'child-drop',
          });
        }
      }

      return {
        centerX: hasSpouse ? x : personX,
        marriageLineX: marriageLineX,
        marriageLineY: hasSpouse ? circleCenterY : (y + 1), // Marriage line Y or just above circle top
        hasSpouse: !!hasSpouse,
      };
    }

    // Start processing from root
    processNode(familyData as FamilyMember, 0, 0, 1);

    return { nodes, lines };
  }, [expanded]);

  // Preload images on hover (before click) for even faster loading
  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    const nodeData = node.data as unknown as PersonNodeData;
    if (nodeData.isExpandable && !nodeData.isSpouse && !expanded.has(node.id)) {
      const member = findMemberById(familyData as FamilyMember, node.id);
      if (member) {
        preloadMemberImages(member);
      }
    }
  }, [expanded]);

  const { getViewport, setViewport } = useReactFlow();
  const hasInitialShift = React.useRef(false);

  // After initial fitView, shift the tree up ONCE (only on mobile/tablet screens)
  useEffect(() => {
    // Only do this once on initial load
    if (hasInitialShift.current) return;
    hasInitialShift.current = true;

    // Only apply shift on smaller screens (mobile/tablet)
    // On laptop/desktop (width > 1024), don't shift - let fitView center naturally
    const isMobileOrTablet = window.innerWidth <= 1024;

    if (!isMobileOrTablet) return;

    // Use requestAnimationFrame for smoother, faster application
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const viewport = getViewport();
        const shiftAmount = 150; // <<< CHANGE THIS: pixels to shift tree upward on mobile/tablet
        setViewport({
          x: viewport.x,
          y: viewport.y - shiftAmount,
          zoom: viewport.zoom
        }, { duration: 0 });
      });
    });
  }, [getViewport, setViewport]);

  // Calculate bounds for panning limits based on nodes
  const translateExtent = useMemo((): [[number, number], [number, number]] => {
    if (nodes.length === 0) {
      return [[-Infinity, -Infinity], [Infinity, Infinity]];
    }

    // Find the bounding box of all nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const node of nodes) {
      const x = node.position.x;
      const y = node.position.y;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + LAYOUT.NODE_WIDTH);
      maxY = Math.max(maxY, y + LAYOUT.NODE_HEIGHT);
    }

    // Add padding around the bounds (allows some panning but not too far)
    const paddingX = 500;  // <<< ADJUST: horizontal padding (larger = more pan freedom)
    const paddingY = 400;  // <<< ADJUST: vertical padding (larger = more pan freedom)

    return [
      [minX - paddingX, minY - paddingY],  // Top-left corner limit
      [maxX + paddingX, maxY + paddingY]   // Bottom-right corner limit
    ];
  }, [nodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={[]}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onNodeMouseEnter={onNodeMouseEnter}
      fitView
      fitViewOptions={{
        padding: 0.1,
        duration: 0,
      }}
      translateExtent={translateExtent}
      minZoom={0.2}             // <<< Increased from 0.1 to prevent zooming out too much
      maxZoom={2}
      nodesDraggable={false}
      nodesConnectable={false}
      panOnDrag
      zoomOnScroll
      zoomOnPinch
      panOnScroll
      selectNodesOnDrag={false}
      proOptions={{ hideAttribution: true }}
    >
      <LinesLayer lines={lines} />
    </ReactFlow>
  );
}

// ============================================
// EXPORTED COMPONENT WITH PROVIDER
// ============================================
export default function FamilyTreeFlow() {
  return (
    <div className="tree-container">
      <ReactFlowProvider>
        <FamilyTreeInner />
      </ReactFlowProvider>
    </div>
  );
}
