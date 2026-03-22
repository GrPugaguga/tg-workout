
export function OneRepMax({ value }: {value: number }){
    return (
        <div className=" w-87.5 flex justify-between p-5 rounded-[20px] bg-white text-txt ">
            <span className="font-medium text-[16px] leading-5.5 ">Разовый максимум</span>
            <span className="font-semibold text-[18px] leading-5.5  ">{value} кг</span>
        </div>
    )
}