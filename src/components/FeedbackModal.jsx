import {
  CheckCircle2,
  CircleX,
  Lightbulb,
  PenLine,
  Sparkles,
  Target,
  X,
} from "lucide-react";

const FeedbackModal = ({ feedback, isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  if (!isOpen || !feedback) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Feedback</h2>
          <button
            onClick={handleClose}
            onKeyDown={handleKeyDown}
            className="text-gray-400 hover:text-white text-2xl font-bold transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                feedback.correct
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {feedback.correct ? (
                <CheckCircle2 size={18} />
              ) : (
                <CircleX size={18} />
              )}
              <span>{feedback.correct ? "Correct!" : "Needs Improvement"}</span>
            </div>
            {feedback.score !== undefined && (
              <div className="ml-auto text-lg font-bold text-yellow-400">
                Score: {feedback.score}/100
              </div>
            )}
          </div>

          {/* Feedback */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              Feedback
            </h3>
            <p className="text-white leading-relaxed">{feedback.feedback}</p>
          </div>

          {/* Suggestion */}
          {feedback.suggestion && (
            <div>
              <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                <Lightbulb size={16} />
                <span>Suggestion</span>
              </h3>
              <div className="bg-slate-700/50 rounded-lg p-4 text-white italic border-l-4 border-yellow-400">
                {feedback.suggestion}
              </div>
            </div>
          )}

          {/* Explanation */}
          {feedback.explanation && (
            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <PenLine size={16} />
                <span>Explanation</span>
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feedback.explanation}
              </p>
            </div>
          )}

          {/* Strengths/Areas for Improvement */}
          {feedback.strengths && (
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                <Sparkles size={16} />
                <span>Strengths</span>
              </h3>
              <ul className="text-gray-300 space-y-1">
                {feedback.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.improvements && (
            <div>
              <h3 className="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                <Target size={16} />
                <span>Areas for Improvement</span>
              </h3>
              <ul className="text-gray-300 space-y-1">
                {feedback.improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-6 text-right">
          <button
            onClick={handleClose}
            className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-lg px-6 py-2 font-semibold transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
