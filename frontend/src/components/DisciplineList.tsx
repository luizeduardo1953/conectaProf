'use client'
import { useState } from "react";
import { BookOpen } from "lucide-react";

interface Discipline {
  id: string;
  name: string;
}

interface DisciplineListProps {
  disciplines: Discipline[];
}

export default function DisciplineList({ disciplines }: DisciplineListProps) {
    const [list, setList] = useState(disciplines);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {disciplines.map((discipline) => (
                <div key={discipline.id} className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-200 transition cursor-pointer flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-rose-500 group-hover:bg-rose-50 transition">
                        <BookOpen size={20} />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{discipline.name}</span>
                </div>
            ))}
        </div>
    )
}