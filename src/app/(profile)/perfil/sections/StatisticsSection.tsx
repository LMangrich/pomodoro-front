"use client";
import { Button } from "@/src/components/Button/Button";
import { useState } from "react";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const mockData = [
  { date: "Seg 14", "0-2 horas": 3, "2-4 horas": 0, "4-6 horas": 0, "6-8 horas": 0 },
  { date: "Ter 15", "0-2 horas": 0, "2-4 horas": 2, "4-6 horas": 0, "6-8 horas": 0 },
  { date: "Qua 16", "0-2 horas": 0, "2-4 horas": 0, "4-6 horas": 5, "6-8 horas": 0 },
  { date: "Out 17", "0-2 horas": 0, "2-4 horas": 0, "4-6 horas": 4, "6-8 horas": 2 },
  { date: "Sex 18", "0-2 horas": 0, "2-4 horas": 0, "4-6 horas": 2, "6-8 horas": 6 },
  { date: "Sab 19", "0-2 horas": 0, "2-4 horas": 0, "4-6 horas": 6, "6-8 horas": 0 },
  { date: "Dom 20", "0-2 horas": 0, "2-4 horas": 0, "4-6 horas": 0, "6-8 horas": 8 },
];

export const StatisticsSection = () => {
      const [activeTab, setActiveTab] = useState<"semanal" | "mensal" | "anual">("semanal");

  return (
    <section className="p-10">
        <h2 className="text-off-white text-24 font-bold mb-4">
            Estatísticas
        </h2>

        <div className="border border-button-primary rounded-[20px] p-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-12">
          <Button
            variant={activeTab === "semanal" ? "primary" : "secondary"}
            onClick={() => setActiveTab("semanal")}
            className="px-4 py-1.5 text-12 h-auto"
          >
            Semanal
          </Button>
          <Button
            variant={activeTab === "mensal" ? "primary" : "secondary"}
            onClick={() => setActiveTab("mensal")}
            className="px-4 py-1.5 text-12 h-auto"
          >
            Mensal
          </Button>
          <Button
            variant={activeTab === "anual" ? "primary" : "secondary"}
            onClick={() => setActiveTab("anual")}
            className="px-4 py-1.5 text-12 h-auto"
          >
            Anual
          </Button>
          <div className="ml-auto bg-button-primary text-background rounded-[8px] px-4 py-2 flex items-center gap-2">
            <span className="text-16">📅</span>
            <span className="text-16 font-bold">
              Semana 2 de Março, 2025
            </span>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={mockData} barCategoryGap={1}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3F2E5A" />
            <XAxis 
              dataKey="date" 
              stroke="#E8EBFF"
              tick={{ fill: "#E8EBFF", fontSize: 10 }}
            />
            <YAxis 
              stroke="#E8EBFF"
              tick={{ fill: "#E8EBFF", fontSize: 10 }}
              domain={[0, 8]}
              ticks={[0, 2, 4, 6, 8]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#312447", 
                border: "1px solid #3F2E5A",
                borderRadius: "8px",
                color: "#E8EBFF",
                fontSize: "12px"
              }}
            />
            <Legend 
              wrapperStyle={{ color: "#E8EBFF", fontSize: "12px" }}
              iconType="square"
              iconSize={10}
            />
            <Bar dataKey="0-2 horas" stackId="a" fill="#8DD9F5" />
            <Bar dataKey="2-4 horas" stackId="a" fill="#E8EBFF" />
            <Bar dataKey="4-6 horas" stackId="a" fill="#9B7EDE" />
            <Bar dataKey="6-8 horas" stackId="a" fill="#CCA3FF" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}