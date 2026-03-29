import { BookMarked, X } from "lucide-react";

const DictionaryModal = ({ isOpen, onClose, vocabularies }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookMarked size={24} className="text-yellow-300" />
            <span>Dictionary</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {vocabularies && vocabularies.length > 0 ? (
            <div className="space-y-4">
              {vocabularies.map((vocab) => (
                <div
                  key={vocab.id}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition"
                >
                  {/* Keyword */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-yellow-400 font-bold text-lg">
                      {vocab.keyword}
                    </span>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      {vocab.type}
                    </span>
                  </div>

                  {/* Pronunciation */}
                  <p className="text-gray-400 text-sm mb-2">
                    {vocab.pronunciation}
                  </p>

                  {/* Meaning */}
                  <div className="mb-2">
                    <span className="text-gray-400 text-xs">Nghĩa: </span>
                    <span className="text-white text-sm">{vocab.meaning}</span>
                  </div>

                  {/* Example */}
                  <div>
                    <span className="text-gray-400 text-xs">Ví dụ: </span>
                    <span className="text-gray-300 text-sm italic">
                      {vocab.example}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Không có từ vựng nào
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-6 text-right">
          <button
            onClick={onClose}
            className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-lg px-6 py-2 font-semibold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DictionaryModal;
