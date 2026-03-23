"use client";

import { Workout } from "@/components/cards/Workout";
import type { IWorkout } from "@/components/cards/Workout";
import { ExerciseItem } from "@/components/cards/ExerciseItem";
import { OneRepMax } from "@/components/cards/OneRepMax";
import { ExerciseHistory } from "@/components/cards/ExerciseHistory";
import type { IExerciseHistoryData } from "@/components/cards/ExerciseHistory";

const mockWorkout: IWorkout = {
  id: "1",
  date: "15/03/2025",
  exercises: [
    {
      title: "Жим штанги лёжа",
      sets: [
        { sets: 3, reps: 8, weight: 70 },
        { sets: 2, reps: 6, weight: 80 },
      ],
    },
    {
      title: "Присед со штангой",
      sets: [
        { sets: 4, reps: 10, weight: 90 },
      ],
    },
    {
      title: "Тяга верхнего блока",
      sets: [
        { sets: 3, reps: 12, weight: 55 },
        { sets: 1, reps: 10, weight: 60 },
      ],
    },
  ],
};

const mockHistory: IExerciseHistoryData[] = [
  {
    date: "15/03/2025",
    sets: [
      { sets: 3, reps: 8, weight: 70 },
      { sets: 2, reps: 6, weight: 80 },
    ],
  },
  {
    date: "08/03/2025",
    sets: [
      { sets: 4, reps: 8, weight: 65 },
      { sets: 1, reps: 5, weight: 75 },
    ],
  },
  {
    date: "01/03/2025",
    sets: [
      { sets: 3, reps: 10, weight: 60 },
      { sets: 2, reps: 8, weight: 70 },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <ExerciseItem title="Жим штанги лёжа" maxVal={82} onClick={() => {}} />
      <OneRepMax value={82} />
      <Workout data={mockWorkout} onDelete={() => console.log('delete')} />
      <ExerciseHistory data={mockHistory} />
    </div>
  );
}
