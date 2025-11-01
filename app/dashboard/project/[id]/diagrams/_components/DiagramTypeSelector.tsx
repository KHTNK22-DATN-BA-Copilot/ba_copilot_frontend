import { DIAGRAM_TYPES } from '../_lib/constants';

export function DiagramTypeSelector() {
    return (
        <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Select Diagram Type</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Choose the type of diagram you want to create</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {DIAGRAM_TYPES.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.id}
                                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group"
                                >
                                    <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-center text-gray-900 dark:text-gray-100">{type.name}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
