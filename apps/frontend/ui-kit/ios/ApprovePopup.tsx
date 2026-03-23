
export function ApprovePopup({onCancel, onApprove}: {onCancel: () => void , onApprove: () => void}) {
    return (
        <div className="flex flex-col rounded-[13px] bg-[#FFFFFFB2] backdrop-blur-[50px] w-67.5">
            <div className="p-5 gap-2 flex flex-col text-center">
                <span className="font-semibold text-[17px] leading-5.5 tracking-[-0.43px] text-black">Удалить тренировку</span>
                <span className="font-normal text-[15px] leading-5 text-txt tracking-[-0.43px]">{'Вы уверены, что хотите удалить'}<br/>{'тренировку? Это действие'}<br/>{'нельзя будет отменить.'}</span>
            </div>
            <div className="grid grid-cols-2 gap-0 text-[17px] leading-5.5 tracking-[-0.43px] text-center h-11">
                <button onClick={onCancel} className="cursor-pointer text-ios-accent border-t-[0.5px] border-r-[0.5px] border-[#C7C7CC]">Отменить</button>
                <button onClick={onApprove} className="cursor-pointer text-ios-delete border-t-[0.5px] border-[#C7C7CC]">Удалить</button>
            </div>
        </div>
    )
}