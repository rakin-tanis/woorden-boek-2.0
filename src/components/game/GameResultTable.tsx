import { Example } from "@/types";
import Accordion from "../ui/Accordion";

interface GameResultsTableProps {
  report: { example: Example, result: string }[];
}

export const GameResultsTable: React.FC<GameResultsTableProps> = ({ report }) => (
  <Accordion title="Resultaten">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-800">
          <th className="border p-2 text-left">Level</th>
          <th className="border p-2 text-left">Theme</th>
          <th className="border p-2 text-left">Question</th>
          <th className="border p-2 text-left">Correct?</th>
        </tr>
      </thead>
      <tbody>
        {report.map(({ example, result }) => (
          <tr
            key={example._id}
            className={`hover:bg-gray-50 dark:hover:bg-gray-700 
              ${result === 'success' ? "text-green-600" : "text-red-600"}`}
          >
            <td className="border p-2 text-sm">{example.level}</td>
            <td className="border p-2 text-sm">{example.theme}</td>
            <td className="border p-2 font-semibold">{example.dutch}</td>
            <td className="border p-2">
              {result === 'success'
                ? <span className="text-green-600 font-bold">✓</span>
                : <span className="text-red-600 font-bold">✗</span>
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Accordion>
);