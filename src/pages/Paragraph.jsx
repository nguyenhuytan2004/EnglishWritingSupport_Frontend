import { useState, useEffect } from "react";
import DictionaryModal from "../components/DictionaryModal";
import paragraphService from "../services/paragraphService";

const Paragraph = () => {
  const [translation, setTranslation] = useState("");
  const [paragraphData, setParagraphData] = useState(null);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParagraph = async () => {
      try {
        setLoading(true);
        const data = await paragraphService.getParagraph(247);
        setParagraphData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching paragraph:", err);
        setError("Failed to load paragraph");
      } finally {
        setLoading(false);
      }
    };

    fetchParagraph();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <p className="text-xl">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  const formattedParagraph = paragraphData?.paragraph
    ?.split("\n\n")
    .map((para) => para.trim())
    .filter((para) => para);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white w-3/4 flex flex-col justify-center mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-bold text-yellow-400">
          {paragraphData?.title || "Just Checking In!"}
        </h1>
        <div className="flex items-center gap-12 text-base">
          <span className="text-gray-400">
            Progress: 0/{paragraphData?.segments?.length || 14} sentences
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Left Column - Paragraph (8 cols) */}
        <div className="col-span-8 space-y-6">
          {/* Paragraph Card */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
            <div className="mb-4">
              <h2 className="text-base font-semibold">
                <span className="text-red-500">Xin chào!</span>
                <span className="text-gray-400 ml-1">
                  Tôi hy vọng bạn khỏe.
                </span>
              </h2>
            </div>
            <div className="text-gray-300 text-sm leading-relaxed space-y-4">
              {formattedParagraph?.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Translation Input */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
            <textarea
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Enter your English translation here... (Only highlighted sentence)"
              className="w-full bg-slate-700/50 text-white placeholder-gray-400 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none h-24 text-sm"
            />
          </div>
        </div>

        {/* Right Column - Sidebar (4 cols) */}
        <div className="col-span-4 space-y-6">
          <div className="flex space-x-2">
            {/* Dictionary */}
            <button
              onClick={() => setIsDictionaryOpen(true)}
              className="bg-slate-800/60 rounded-xl p-6 border border-slate-700 flex-1 flex items-center justify-center hover:border-slate-600 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📖</span>
                <h3 className="font-semibold">Dictionary</h3>
              </div>
            </button>

            {/* Accuracy */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700 flex-1 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-4 border-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500/20 border-2 border-green-500"></div>
                </div>
                <h3 className="font-semibold">Accuracy</h3>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
            <h3 className="font-semibold mb-3">Feedback</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Click{" "}
              <span className="text-yellow-400 font-semibold">Submit</span> to
              get feedback from{" "}
              <span className="text-yellow-400 font-semibold">AI</span>. The
              system will review your translation and point out its strengths
              and areas for improvement.
            </p>
          </div>

          {/* Today's Achievements */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
            <h3 className="font-semibold mb-4">Today's Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-4xl mb-2">🔥</div>
                <p className="text-xs">1 Day Streak</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-4xl mb-2">💡</div>
                <p className="text-xs">Bright Mind</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-700">
        <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 rounded-lg px-6 py-3 font-semibold text-sm transition duration-200">
          <span>←</span>
          <span>Quit</span>
        </button>

        <button className="flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-lg px-8 py-3 font-bold text-sm transition duration-200">
          <span>Submit</span>
        </button>
      </div>

      {/* Dictionary Modal */}
      <DictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        vocabularies={paragraphData?.vocabularies}
      />
    </div>
  );
};

export default Paragraph;
