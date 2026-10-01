import React from 'react';
import { ScaledArtwork } from '../lib/dimensions';
import { variantUrl } from './ArtImage';

/**
 * Shows a work to scale against a wall, with a human figure for reference.
 *
 * The SVG viewBox is measured in inches, so every element is drawn at its real
 * relative size and the scale stays honest no matter how the SVG is displayed.
 */

const WALL_HEIGHT_IN = 108; // 9 ft ceiling
const FLOOR_DEPTH_IN = 16; // visible strip of floor below the wall
const FIGURE_HEIGHT_IN = 66; // 5 ft 6 in reference figure
const HANGING_CENTER_IN = 57; // gallery standard: centre of the work 57 in from the floor
const MIN_ROOM_WIDTH_IN = 132;

interface Props {
  work: ScaledArtwork;
}

export const RoomView: React.FC<Props> = ({ work }) => {
  const { widthIn, heightIn } = work;

  // Widen the wall for larger works so the piece never crowds the figure.
  const roomWidth = Math.max(MIN_ROOM_WIDTH_IN, widthIn * 2.2 + 72);
  const totalHeight = WALL_HEIGHT_IN + FLOOR_DEPTH_IN;

  const artX = (roomWidth - widthIn) / 2;
  const artY = WALL_HEIGHT_IN - HANGING_CENTER_IN - heightIn / 2;

  const figureX = Math.max(10, artX / 2 - 11);
  const figureY = WALL_HEIGHT_IN - FIGURE_HEIGHT_IN;
  const figureScale = FIGURE_HEIGHT_IN / 66;

  return (
    <div className="w-full max-w-3xl">
      <svg
        viewBox={`0 0 ${roomWidth} ${totalHeight}`}
        className="w-full h-auto border border-[#E5E1DA] bg-[#EFECE6]"
        role="img"
        aria-label={`${work.title} shown to scale on a wall, ${widthIn} by ${heightIn} inches, beside a 5 foot 6 inch figure for reference`}
      >
        <defs>
          <clipPath id={`art-clip-${work.id}`}>
            <rect x={artX} y={artY} width={widthIn} height={heightIn} />
          </clipPath>
        </defs>

        {/* Wall and floor */}
        <rect x="0" y="0" width={roomWidth} height={WALL_HEIGHT_IN} fill="#EAE7E1" />
        <rect
          x="0"
          y={WALL_HEIGHT_IN}
          width={roomWidth}
          height={FLOOR_DEPTH_IN}
          fill="#DAD4C8"
        />
        <rect
          x="0"
          y={WALL_HEIGHT_IN - 4}
          width={roomWidth}
          height="4"
          fill="#E2DDD3"
        />
        <line
          x1="0"
          y1={WALL_HEIGHT_IN}
          x2={roomWidth}
          y2={WALL_HEIGHT_IN}
          stroke="#C6BFB1"
          strokeWidth="0.6"
        />

        {/* Reference figure */}
        <g
          transform={`translate(${figureX} ${figureY}) scale(${figureScale})`}
          fill="#C6BFB1"
        >
          <circle cx="11" cy="7.5" r="7" />
          <path d="M4.5 25c0-6 3-9 6.5-9s6.5 3 6.5 9v16h-2l-1 25h-2.5l-0.8-21h-0.4l-0.8 21h-2.5l-1-25h-2z" />
        </g>
        <ellipse
          cx={figureX + 11 * figureScale}
          cy={WALL_HEIGHT_IN + 1.5}
          rx={13 * figureScale}
          ry="2"
          fill="#000000"
          opacity="0.06"
        />

        {/* The work itself */}
        <rect
          x={artX - 0.6}
          y={artY - 0.6}
          width={widthIn + 1.2}
          height={heightIn + 1.2}
          fill="#000000"
          opacity="0.08"
        />
        <image
          href={variantUrl(work.imageUrl, 960)}
          x={artX}
          y={artY}
          width={widthIn}
          height={heightIn}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#art-clip-${work.id})`}
        />
        <rect
          x={artX}
          y={artY}
          width={widthIn}
          height={heightIn}
          fill="none"
          stroke="#2D2926"
          strokeWidth="0.4"
          opacity="0.35"
        />

        {/* Width annotation */}
        <g stroke="#8C7E6D" strokeWidth="0.35" opacity="0.8">
          <line x1={artX} y1={artY - 5} x2={artX + widthIn} y2={artY - 5} />
          <line x1={artX} y1={artY - 7} x2={artX} y2={artY - 3} />
          <line
            x1={artX + widthIn}
            y1={artY - 7}
            x2={artX + widthIn}
            y2={artY - 3}
          />
        </g>
        <text
          x={artX + widthIn / 2}
          y={artY - 7.5}
          textAnchor="middle"
          fill="#8C7E6D"
          fontSize="5"
          fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        >
          {Number(widthIn.toFixed(2))}"
        </text>

        {/* Height annotation */}
        <g stroke="#8C7E6D" strokeWidth="0.35" opacity="0.8">
          <line
            x1={artX + widthIn + 5}
            y1={artY}
            x2={artX + widthIn + 5}
            y2={artY + heightIn}
          />
          <line
            x1={artX + widthIn + 3}
            y1={artY}
            x2={artX + widthIn + 7}
            y2={artY}
          />
          <line
            x1={artX + widthIn + 3}
            y1={artY + heightIn}
            x2={artX + widthIn + 7}
            y2={artY + heightIn}
          />
        </g>
        <text
          x={artX + widthIn + 8}
          y={artY + heightIn / 2}
          dominantBaseline="middle"
          fill="#8C7E6D"
          fontSize="5"
          fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        >
          {Number(heightIn.toFixed(2))}"
        </text>
      </svg>

      <p className="mt-4 text-[10px] uppercase tracking-widest text-[#8C7E6D] leading-relaxed">
        Shown to scale · 9 ft wall · figure 5 ft 6 in · hung at 57 in centre
      </p>
    </div>
  );
};
