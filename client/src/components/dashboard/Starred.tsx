export default function Starred() {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Starred Documents</h1>
            </div>
            <div className="bg-white rounded-lg border p-6">
                <div className="text-center text-gray-500">
                    <p className="text-lg">No starred documents yet</p>
                    <p className="text-sm mt-2">Star important documents to access them quickly</p>
                </div>
            </div>
        </div>
    );
} 