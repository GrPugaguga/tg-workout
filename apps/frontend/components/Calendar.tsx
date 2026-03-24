"use client";

import Image from "next/image";
import { useState, useMemo } from "react";

const MONTH_NAMES = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

interface CalendarDay {
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
}

function generateDays(year: number, month: number): CalendarDay[] {
    const firstDay = new Date(year, month, 1).getDay();
    const offset = (firstDay + 6) % 7; // ПН=0, ВС=6
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    for (let i = offset - 1; i >= 0; i--) {
        days.push({ day: daysInPrev - i, month: prevMonth, year: prevYear, isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
        days.push({ day: d, month, year, isCurrentMonth: true });
    }

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
        days.push({ day: d, month: nextMonth, year: nextYear, isCurrentMonth: false });
    }

    return days;
}

function formatDate(day: number, month: number, year: number): string {
    const dd = String(day).padStart(2, "0");
    const mm = String(month + 1).padStart(2, "0");
    return `${dd}/${mm}/${year}`;
}

function CalendarDate(
    {
        day,
        isOtherMonth,
        isWorkoutDay,
        isToday,
        onClick
    }:{
        day: number
        isOtherMonth:boolean,
        isWorkoutDay:boolean,
        isToday:boolean,
        onClick: () => void
    }
    ){
        return (
            <div className={
                'h-10 text-[18px] leading-10 text-center font-normal  cursor-pointer '
                + (isOtherMonth ? ' text-grey-light ' : '')
                + (isWorkoutDay ? ' rounded-full bg-accent text-white ': '')
                + (isToday ? ' rounded-full bg-grey-therthiary ': '')
            }
            onClick={onClick}>
                {day}
            </div>
        )
}

interface CalendarProps {
    workoutDates: string[];
    onSelectDate: (date: string | null) => void;
    onClose: () => void;
}

export function Calendar({ workoutDates, onSelectDate, onClose }: CalendarProps) {
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const todayStr = formatDate(now.getDate(), now.getMonth(), now.getFullYear());
    const days = useMemo(() => generateDays(viewYear, viewMonth), [viewYear, viewMonth]);
    const workoutSet = useMemo(() => new Set(workoutDates), [workoutDates]);

    function prevMonth() {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
        else setViewMonth(viewMonth - 1);
    }

    function nextMonth() {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
        else setViewMonth(viewMonth + 1);
    }

    return (
        <div className="p-5 gap-5 rounded-[20px] bg-white flex flex-col w-87.5">
            <div className="flex flex-row justify-between text-[14px] leading-5.5 tracking-[-0.4px] font-medium text-txt ">
                <span className="cursor-pointer" onClick={() => onSelectDate(null)}>Сегодня</span>
                <span className="cursor-pointer" onClick={onClose}>Закрыть</span>
            </div>
            <div className="flex flex-row justify-between items-center">
                <Image src="/svg/calendar/left.svg" alt="calendar_left" width={20} height={20} className="cursor-pointer" onClick={prevMonth}/>
                <span className="w-full text-center font-semibold text-[16px] leading-5.5 text-txt">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <Image src="/svg/calendar/right.svg" alt="calendar_right" width={20} height={20} className="cursor-pointer" onClick={nextMonth}/>
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'].map((v,i) => (
                    <div className=" h-10 col-span-1 text-[12px] leading-10 text-center text-grey-light font-normal " key={i}>
                        {v}
                    </div>
                ))}
                {days.map((d, i) => {
                    const dateStr = formatDate(d.day, d.month, d.year);
                    return (
                        <CalendarDate
                            key={i}
                            day={d.day}
                            isOtherMonth={!d.isCurrentMonth}
                            isWorkoutDay={workoutSet.has(dateStr)}
                            isToday={dateStr === todayStr}
                            onClick={() => onSelectDate(dateStr)}
                        />
                    );
                })}
            </div>
        </div>
    )
}
