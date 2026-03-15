import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginButton from "./LoginButton";
import UserMenu from "./UserMenu";
import { SET_COUNT } from "../constants";

interface GameRecord {
  seed: string;
  startTime: Date;
  endTime: Date | null;
  foundSetsCount: number;
}

function loadGameRecords(): GameRecord[] {
  const records: GameRecord[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("setgame_")) continue;

    const seed = key.slice("setgame_".length);
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const data = JSON.parse(raw);
      records.push({
        seed,
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
        foundSetsCount: Array.isArray(data.foundSets) ? data.foundSets.length : 0,
      });
    } catch {
      // skip malformed entries
    }
  }

  // Sort descending by seed (YYYY-MM-DD lexicographic = newest first)
  records.sort((a, b) => b.seed.localeCompare(a.seed));
  return records;
}

function formatSolveTime(startTime: Date, endTime: Date | null): string {
  if (!endTime) return "--";
  const secs = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  return `${mins}:${s.toString().padStart(2, "0")}`;
}

function formatDate(seed: string): string {
  // Parse as UTC date from YYYY-MM-DD seed
  const date = new Date(`${seed}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "utc",
  }).format(date);
}

const PastGamesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const records = useMemo(() => loadGameRecords(), []);

  return (
    <div className="p-4 xl:p-8 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Back to game"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Past Games</h1>
        </div>
        <div>
          {isAuthenticated ? <UserMenu /> : <LoginButton />}
        </div>
      </header>

      {records.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No games played yet.</p>
      ) : (
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wide">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Solve Time</th>
              <th className="py-2 pr-4 font-medium">Sets Found</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const isComplete = record.endTime !== null;
              return (
                <tr
                  key={record.seed}
                  onClick={() => navigate(`/?seed=${record.seed}&load=1`)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 pr-4 font-medium text-gray-900">
                    {formatDate(record.seed)}
                  </td>
                  <td className="py-3 pr-4 text-gray-700">
                    {formatSolveTime(record.startTime, record.endTime)}
                  </td>
                  <td className="py-3 pr-4 text-gray-700">
                    {record.foundSetsCount}/{SET_COUNT}
                  </td>
                  <td className="py-3">
                    {isComplete ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        In Progress
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PastGamesPage;
