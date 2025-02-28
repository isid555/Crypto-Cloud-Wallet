export function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-50">
            <div className="bg-gray-800 px-6 py-4 rounded-lg shadow-lg flex flex-col items-center">
                <div className="text-6xl animate-coinFlip coin">🪙</div>

                <p className="mt-3 text-green-400 text-lg font-semibold animate-pulse">Please Wait...</p>
            </div>
        </div>
    );
}
