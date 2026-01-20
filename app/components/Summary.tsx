import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-green-600'
        : score > 49
            ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="flex flex-row items-center justify-between bg-gray-50 p-4 border border-gray-100/50 hover:bg-white transition-colors">
            <div className="flex flex-row gap-3 items-center">
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{title}</p>
                <ScoreBadge score={score} />
            </div>
            <p className="text-xl font-black">
                <span className={textColor}>{score}</span><span className="text-gray-300 mx-1">/</span>100
            </p>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-8">
                    <ScoreGauge score={feedback.overallScore} />
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black tracking-tighter uppercase italic">Overall Impact</h2>
                        <p className="text-xs font-medium text-blue-100 uppercase tracking-[0.2em] opacity-80">
                            Calculated via proprietary ATS weighting
                        </p>
                    </div>
                </div>
                {feedback.persona && (
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Detected Persona</span>
                        <span className="text-lg font-bold bg-white/10 px-4 py-1 rounded-full border border-white/20">{feedback.persona.type}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-gray-100">
                <Category title="Tone" score={feedback.toneAndStyle.score} />
                <Category title="Content" score={feedback.content.score} />
                <Category title="Structure" score={feedback.structure.score} />
                <Category title="Skills" score={feedback.skills.score} />
            </div>
        </div>
    )
}
export default Summary
