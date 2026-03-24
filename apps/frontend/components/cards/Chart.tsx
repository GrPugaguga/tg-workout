"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export interface IChartPoint {
  date: string;
  value: number;
}

interface ChartProps {
  title: string;
  data: IChartPoint[];
  unit: string;
}

const CHART_HEIGHT = 160;
const MARGIN_BOTTOM = 28;
const CHART_BOTTOM = CHART_HEIGHT - MARGIN_BOTTOM;
const GRADIENT_ID = "chart-area-gradient";
const SHADOW_ID = "chart-date-shadow";

function getYConfig(data: IChartPoint[]) {
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const adjustedMin = min * 0.75;
  const range = max - adjustedMin;
  const rough = range * 0.25;
  if (rough <= 0) {
    const fallbackMax = max * 2 || 10;
    return { domain: [0, fallbackMax] as [number, number], ticks: [] as number[] };
  }

  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const step =
    norm <= 1.5 ? mag : norm <= 3 ? 2 * mag : norm <= 7 ? 5 * mag : 10 * mag;

  const yMin = Math.floor(adjustedMin / step) * step;
  const yMax = (Math.ceil(max / step) + 1) * step;

  // Explicit ticks for nice labels
  const ticks: number[] = [];
  for (let i = yMin; i <= yMax; i += step) {
    ticks.push(i);
  }

  // Domain extends beyond ticks so grid lines are INSIDE, not at edges
  const domain: [number, number] = [yMin - step * 0.5, yMax + step * 0.5];

  return { domain, ticks };
}

function renderLastDot(
  props: any,
  dataLength: number,
  unit: string,
) {
  const { cx, cy, index, payload } = props;
  if (index !== dataLength - 1) return <g key={`dot-${index}`} />;

  const valueText = `${payload.value} ${unit}`;
  const valueBadgeW = valueText.length * 8.5 + 20;

  const dateText = payload.date;
  const dateBadgeW = dateText.length * 6 + 16;

  return (
    <g key={`dot-${index}`}>
      <defs>
        <filter
          id={SHADOW_ID}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="5"
            floodColor="rgba(0,0,0,0.1)"
          />
        </filter>
      </defs>

      {/* Dashed vertical line */}
      <line
        x1={cx}
        y1={cy + 3}
        x2={cx}
        y2={CHART_BOTTOM}
        stroke="var(--accent)"
        strokeWidth={1}
        strokeDasharray="4 4"
      />

      {/* Dot */}
      <circle cx={cx} cy={cy} r={3} fill="var(--accent)" />

      {/* Value badge */}
      <rect
        x={cx - valueBadgeW / 2}
        y={cy - 38}
        width={valueBadgeW}
        height={26}
        rx={13}
        fill="var(--accent)"
      />
      <text
        x={cx}
        y={cy - 21}
        textAnchor="middle"
        fill="white"
        fontSize={14}
        fontWeight={510}
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
      >
        {valueText}
      </text>

      {/* Date badge */}
      <rect
        x={cx - dateBadgeW / 2}
        y={CHART_BOTTOM + 4}
        width={dateBadgeW}
        height={22}
        rx={11}
        fill="white"
        filter={`url(#${SHADOW_ID})`}
      />
      <text
        x={cx}
        y={CHART_BOTTOM + 18}
        textAnchor="middle"
        fill="var(--txt)"
        fontSize={10}
        fontWeight={510}
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
      >
        {dateText}
      </text>
    </g>
  );
}

export function Chart({ title, data, unit }: ChartProps) {
  const { domain: yDomain, ticks: yTicks } = useMemo(() => getYConfig(data), [data]);

  const chartData = useMemo(
    () => data.map((d, i) => ({ ...d, idx: i })),
    [data],
  );

  const lastPoint = data[data.length - 1];
  const valueBadgeW = lastPoint
    ? `${lastPoint.value} ${unit}`.length * 8.5 + 20
    : 0;
  const xPaddingRight = Math.max(valueBadgeW / 2 - 4, 0);

  if (!data.length) return null;

  return (
    <div className="w-87.5 p-5 rounded-[20px] bg-white flex flex-col gap-4">
      <span className="font-medium text-[16px] leading-[22px] tracking-[-0.4px] text-grey-dark">
        {title}
      </span>
      <div className="overflow-visible pointer-events-none [&_.recharts-wrapper]:overflow-visible! [&_svg]:overflow-visible!">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: MARGIN_BOTTOM }}
          >
            <defs>
              <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="rgb(101,25,173)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="98.14%"
                  stopColor="rgb(101,25,173)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal
              vertical
              stroke="var(--grey-therthiary)"
              strokeWidth={1}
              horizontalCoordinatesGenerator={({ offset }: any) => {
                const chartTop = offset?.top ?? 0;
                const chartH = offset?.height ?? 0;
                if (!chartH) return [];
                const [dMin, dMax] = yDomain;
                return yTicks.filter((_: number, i: number) => i % 2 === 0).map((t: number) =>
                  chartTop + chartH * (1 - (t - dMin) / (dMax - dMin)),
                );
              }}
              verticalCoordinatesGenerator={({ offset }: any) => {
                const n = Math.min(Math.max(data.length, 6), 15);
                const chartW = offset.width;
                const lines: number[] = [];
                for (let i = 1; i <= n; i++) {
                  lines.push(offset.left + (chartW * i) / (n + 1));
                }
                return lines;
              }}
            />
            <XAxis
              dataKey="idx"
              type="number"
              domain={[0, data.length - 1]}
              padding={{ left: 0, right: xPaddingRight }}
              hide
            />
            <YAxis
              ticks={yTicks}
              domain={yDomain}
              interval={0}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fontWeight: 510,
                fill: "var(--grey-dark)",
              }}
              width={Math.max(...yTicks).toString().length * 8 + 4}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--accent)"
              strokeWidth={1}
              fill={`url(#${GRADIENT_ID})`}
              dot={(props: any) => renderLastDot(props, data.length, unit)}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
