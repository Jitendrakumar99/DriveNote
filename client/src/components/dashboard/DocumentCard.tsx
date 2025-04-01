export default function DocumentCard({ title, content }: { title: string, content: string }){
    return(
        <div className="flex flex-col justify-between border border-gray-400 max-w-[140px] w-full px-4 py-6 rounded-2xl cursor-pointer min-h-[160px]">
            <div>
                <p className="text-md font-bold">{title.length > 20 ? title.substring(0, 20) + "..." : title}</p>
                <p className="text-sm break-words">{content.length > 50 ? content.substring(0, 50) + "..." : content}</p>
            </div>
        </div>
    )
}