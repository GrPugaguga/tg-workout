'use client'
import { Chart, IChartPoint } from "@/components/cards/Chart";
import { ExerciseHistory, IExerciseHistoryData } from "@/components/cards/ExerciseHistory";
import { OneRepMax } from "@/components/cards/OneRepMax";
import Image from "next/image";
import { useRouter } from "next/navigation";


const mockChartData: IChartPoint[] = [
  { date: "13/01", value: 93 },
  { date: "52/01", value: 95 },
  { date: "24/01", value: 97 },
  { date: "24/01", value: 100 },
];

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

export default function ExercisesPage({params}: {
    params: Promise<{id: string}>
}) {
    const router = useRouter()


    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
                <Image src="/svg/exercise/back.svg" alt="back" width={22} height={22} className="self-center cursor-pointer" onClick={router.back}/>
                <span className="w-full text-center leading-6 font-semibold text-[18px] tracking-[-0.45px] text-txt">Название упражнения</span>
            </div>

            <Chart title="Вес" data={mockChartData} unit="кг" />
            <OneRepMax value={82} />
            <ExerciseHistory data={mockHistory} />
        </div>
    )
}
