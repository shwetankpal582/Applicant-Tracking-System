import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        score > 69
          ? "bg-badge-green"
          : score > 39
            ? "bg-badge-yellow"
            : "bg-badge-red"
      )}
    >
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className="size-4"
      />
      <p
        className={cn(
          "text-sm font-medium",
          score > 69
            ? "text-badge-green-text"
            : score > 39
              ? "text-badge-yellow-text"
              : "text-badge-red-text"
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-row gap-4 items-center py-3 px-2">
      <p className="text-xl font-semibold">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-gray-50 w-full rounded-lg px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-3 items-center" key={index}>
            <img
              src={
                tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
              }
              alt="score"
              className="size-5 flex-shrink-0"
            />
            <p className="text-lg text-gray-700 font-medium">{tip.tip}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              "flex flex-col gap-3 rounded-2xl p-5",
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex flex-row gap-3 items-center">
              <img
                src={
                  tip.type === "good"
                    ? "/icons/check.svg"
                    : "/icons/warning.svg"
                }
                alt="score"
                className="size-5 flex-shrink-0"
              />
              <p className="text-lg font-semibold">{tip.tip}</p>
            </div>
            <p className="text-sm leading-relaxed">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  const timelineItems = [
    { title: "Tone & Style", score: feedback.toneAndStyle.score, tips: feedback.toneAndStyle.tips, icon: "🎭" },
    { title: "Content", score: feedback.content.score, tips: feedback.content.tips, icon: "📄" },
    { title: "Structure", score: feedback.structure.score, tips: feedback.structure.tips, icon: "🏗️" },
    { title: "Skills", score: feedback.skills.score, tips: feedback.skills.tips, icon: "🛠️" },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl w-full p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter text-blue-900 leading-none">Scanning Timeline.</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">Reading Order Logic v1.2</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-blue-600">Audit Status</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      <div className="relative space-y-12">
        {/* Continuous Timeline Line */}
        <div className="absolute left-8 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-600 via-indigo-400 to-transparent opacity-20 hidden md:block"></div>

        {timelineItems.map((item, idx) => (
          <div key={idx} className="relative pl-0 md:pl-20 group">
            {/* Timeline Node */}
            <div className="absolute left-6 top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-600 z-10 hidden md:block group-hover:scale-125 transition-transform"></div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 flex justify-between items-center">
                  <h3 className="text-xl font-black tracking-tight text-gray-800 uppercase">{item.title}</h3>
                  <ScoreBadge score={item.score} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {item.tips.map((tip, tIdx) => (
                  <div
                    key={tIdx}
                    className={cn(
                      "group/tip flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg",
                      tip.type === 'good'
                        ? "bg-emerald-50/30 border-emerald-100/50 hover:border-emerald-200"
                        : "bg-amber-50/30 border-amber-100/50 hover:border-amber-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-1 rounded-lg",
                        tip.type === 'good' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                      )}>
                        <img
                          src={tip.type === 'good' ? "/icons/check.svg" : "/icons/warning.svg"}
                          className="size-4"
                          alt="status"
                        />
                      </div>
                      <span className="font-bold text-sm tracking-tight text-gray-700">{tip.tip}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium pl-9 opacity-80 group-hover/tip:opacity-100 transition-opacity">
                      {tip.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">End of Sequential Scan</p>
      </div>
    </div>
  );
};

export default Details;
