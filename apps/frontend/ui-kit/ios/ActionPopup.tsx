export function ActionPopup({onClick} : {onClick: () => void}){
    return (
        <button className="cursor-pointer px-4 py-2.75 flex flex-row gap-2.5 rounded-[14px] bg-[#FFFFFFE5] shadow-[0px_2px_16px_0px_#00000033] w-62.5 justify-between items-center"
        onClick={onClick}
        >
            <span className="font-normal leading-5.5 text-[17px] tracking-[-0.43px] text-ios-delete">Удалить тренировку</span>
            <img src="/svg/delete.svg" alt="delete" width={22} height={22} />
        </button>
    )
}