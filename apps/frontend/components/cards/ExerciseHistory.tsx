
interface IExerciseSet {
    weight?: number
    sets: number
    reps?: number
    duration?: number
}

export interface IExerciseHistoryData {
    date: string,
    sets: IExerciseSet[]
}

function Exercise({ex}: {ex: IExerciseHistoryData}){
    function format(set: IExerciseSet): string {
        return `${set.reps} x ${set.weight} кг  ${set.sets > 1 ? `(x${set.sets})`: ''}`
    }
    return (
        <div className="flex flex-col gap-2 font-medium leading-5.5 text-[14px]"> 
            <span className="text-grey-dark">{ex.date}</span>
            <div className="flex flex-col gap-1">
                {ex.sets.map((set, i) => (
                    <span className="text-txt" key={i}>{format(set)}</span>
                ))}
            </div>
        </div>
    )
}

export function ExerciseHistory({ data, ...props }: { data: IExerciseHistoryData[]}) {
    return (
        <div className="flex flex-col gap-4 p-5 rounded-[20px] bg-white w-87.5">
            <span className=" text-txt text-[16px] leading-5.5 font-medium ">История тренировок</span>
            <div className=" flex flex-col gap-5">
                {data.map((ex,i) => (
                    <Exercise ex={ex} key={i}/>
                ))}
            </div>
        </div>
    )
}