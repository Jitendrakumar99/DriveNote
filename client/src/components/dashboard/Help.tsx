export default function Help() {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Help & Support</h1>
            </div>
            <div className="bg-white rounded-lg border divide-y">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-base font-medium text-gray-900">How do I create a new document?</h3>
                            <p className="mt-1 text-sm text-gray-500">Click the "New Document" button in the sidebar or use the keyboard shortcut Ctrl+N.</p>
                        </div>
                        <div>
                            <h3 className="text-base font-medium text-gray-900">How do I save my documents?</h3>
                            <p className="mt-1 text-sm text-gray-500">Documents are automatically saved to your Google Drive. You can also manually save using Ctrl+S.</p>
                        </div>
                        <div>
                            <h3 className="text-base font-medium text-gray-900">How do I share a document?</h3>
                            <p className="mt-1 text-sm text-gray-500">Click the share button in the document toolbar to share with others via Google Drive.</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Support</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="support@drivenote.com"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                rows={4}
                                placeholder="How can we help you?"
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 