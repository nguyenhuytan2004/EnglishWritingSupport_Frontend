import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, BookOpen, Brain } from "lucide-react";
import DictionaryModal from "../components/DictionaryModal";
import paragraphService from "../services/paragraphService";

const Paragraph = () => {
  const [translation, setTranslation] = useState("");
  const [paragraphData, setParagraphData] = useState(null);
  const [focusedSegment, setFocusedSegment] = useState(0);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

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

  const segmentList = useMemo(() => {
    // Ưu tiên sử dụng segments từ API
    if (paragraphData?.segments && Array.isArray(paragraphData.segments)) {
      const segments = paragraphData.segments.map((seg, idx) => ({
        isNewBlock: seg.isNewBlock !== undefined ? seg.isNewBlock : false,
        segment: seg.content.trim(),
        index: idx,
      }));

      // Nếu segments từ API không có isNewBlock, tính dựa trên paragraph text
      if (segments.every((s) => !s.isNewBlock)) {
        const fullText = paragraphData?.paragraph || "";

        return segments.map((seg, idx) => {
          // Tìm vị trí segment trong paragraph text
          const segmentIndex = fullText.indexOf(seg.segment);

          let isNewBlock = false;

          if (segmentIndex > 0) {
            // Kiểm tra: nếu trước segment này có "\n" hoặc "\n\n", đó là block mới
            const charBefore = fullText[segmentIndex - 1];
            const charBefore2 = fullText[segmentIndex - 2];

            // Có "\n\n" hoặc "\n" (sau whitespace) trước segment = block mới
            if (
              charBefore === "\n" ||
              (charBefore === " " && charBefore2 === "\n")
            ) {
              isNewBlock = true;
            }
          } else if (idx === 0) {
            // Segment đầu tiên luôn là block mới
            isNewBlock = idx === 0;
          }

          return { ...seg, isNewBlock };
        });
      }

      return segments;
    }

    // Fallback: tính toán từ paragraph text
    const blocks = paragraphData?.paragraph.split("\n\n") || [];

    const segments = blocks.flatMap((block, blockIndex) => {
      const sentences = block.split(/(?<=[.!?])\s+/).filter((s) => s.trim());

      return sentences.map((sentence, sentIndex) => ({
        isNewBlock: sentIndex === 0 && blockIndex > 0,
        segment: sentence.trim(),
      }));
    });

    return segments;
  }, [paragraphData]);

  const groupedSegments = useMemo(() => {
    const groups = [];
    let currentGroup = [];

    segmentList.forEach((seg) => {
      if (seg.isNewBlock && currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [seg];
      } else {
        currentGroup.push(seg);
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [segmentList]);

  console.log(segmentList);

  const handleSubmit = async () => {
    if (!translation.trim()) {
      setFeedback({
        correct: false,
        feedback: "Please enter a translation first",
        score: 0,
      });
      return;
    }

    try {
      setIsChecking(true);

      // Get current segment
      const currentSegment = segmentList[focusedSegment];

      // Call API to check translation
      const response = await paragraphService.checkTranslation(
        paragraphData.id,
        currentSegment.segment,
        translation,
        paragraphData.paragraph,
      );
      setFeedback(response);

      if (response?.score === 100) {
        setFocusedSegment((prev) => prev + 1);
        setTranslation("");
      }
    } catch (err) {
      console.error("Error submitting translation:", err);
      setFeedback({
        correct: false,
        feedback: "Error checking translation. Please try again.",
        score: 0,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Shift+Enter = xuống dòng bình thường
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <p className="text-xl">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white w-2/3 flex flex-col justify-center mx-auto">
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
            <div className="text-gray-300 text-lg leading-relaxed space-y-4">
              {groupedSegments.map((group, groupIndex) => (
                <p key={groupIndex}>
                  {group.map((seg, segIndex) => (
                    <span
                      key={segIndex}
                      className={`${seg.index === focusedSegment ? "text-pink-500" : ""}`}
                    >
                      {seg.segment}
                      {segIndex < group.length - 1 ? " " : ""}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>

          {/* Translation Input */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
            <textarea
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your English translation here... (Only highlighted sentence)"
              className="w-full bg-slate-700/50 text-white placeholder-gray-400 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none h-24 text-base"
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
                <BookOpen size={20} className="text-yellow-300" />
                <h3 className="font-semibold">Dictionary</h3>
              </div>
            </button>

            {/* Accuracy */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700 flex-1 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Brain size={20} className="text-green-400" />
                <h3 className="font-semibold">Accuracy</h3>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700 overflow-y-auto">
            {feedback ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold">
                    {feedback.correct ? "Correct" : "Incorrect"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-gray-400">Score:</span>
                  <span className="text-lg font-bold text-yellow-400">
                    {feedback.score}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-600 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-semibold">
                      Feedback:
                    </p>
                    <p className="text-base text-gray-300 leading-relaxed">
                      {feedback.feedback}
                    </p>
                  </div>
                  {feedback.suggestion && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1 font-semibold">
                        Suggestion:
                      </p>
                      <p className="text-base text-blue-300 leading-relaxed">
                        {feedback.suggestion}
                      </p>
                    </div>
                  )}
                  {feedback.explanation && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1 font-semibold">
                        Explanation:
                      </p>
                      <p className="text-base text-amber-400 leading-relaxed">
                        {feedback.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed">
                Click{" "}
                <span className="text-yellow-400 font-semibold">Submit</span> to
                get feedback from{" "}
                <span className="text-yellow-400 font-semibold">AI</span>. The
                system will review your translation and point out its strengths
                and areas for improvement.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-700">
        <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 rounded-lg px-6 py-3 font-semibold text-sm transition duration-200">
          <ArrowLeft size={16} />
          <span>Quit</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={isChecking || !translation}
          className="flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-lg px-8 py-3 font-bold text-sm transition duration-200 cursor-pointer disabled:grayscale disabled:cursor-not-allowed"
        >
          <span>{isChecking ? "Checking..." : "Submit"}</span>
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
