import { FC } from "react";
import Immutable from "immutable";
import Card from "./Card";

interface FoundSetsProps {
  sets: string[][];
}

export const FoundSets: FC<FoundSetsProps> = ({ sets }) => {
  const [setOne, setTwo, setThree, setFour, setFive, setSix] = sets;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold">Found Sets</h3>

      <table className="bg-white border border-gray-300">
        <tr className="border-b border-gray-300 h-16">
          <td className="border-r border-gray-300 w-20">
            {setOne && <Card card={setOne[0]} readOnly />}
          </td>
          <td className="border-r border-gray-300 w-20">
            {setOne && <Card card={setOne[1]} readOnly />}
          </td>
          <td className="w-20">
            {setOne && <Card card={setOne[2]} readOnly />}
          </td>
        </tr>
        <tr className="border-b border-gray-300 h-16">
          <td className="border-r border-gray-300">
            {setTwo && <Card card={setTwo[0]} readOnly />}
          </td>
          <td className="border-r border-gray-300">
            {setTwo && <Card card={setTwo[1]} readOnly />}
          </td>
          <td>{setTwo && <Card card={setTwo[2]} readOnly />}</td>
        </tr>
        <tr className="border-b border-gray-300 h-16">
          <td className="border-r border-gray-300">
            {setThree && <Card card={setThree[0]} readOnly />}
          </td>
          <td className="border-r border-gray-300">
            {setThree && <Card card={setThree[1]} readOnly />}
          </td>
          <td>{setThree && <Card card={setThree[2]} readOnly />}</td>
        </tr>
        <tr className="border-b border-gray-300 h-16">
          <td className="border-r border-gray-300">
            {setFour && <Card card={setFour[0]} readOnly />}
          </td>
          <td className="border-r border-gray-300">
            {setFour && <Card card={setFour[1]} readOnly />}
          </td>
          <td>{setFour && <Card card={setFour[2]} readOnly />}</td>
        </tr>
        <tr className="border-b border-gray-300 h-16">
          <td className="border-r border-gray-300">
            {setFive && <Card card={setFive[0]} readOnly />}
          </td>
          <td className="border-r border-gray-300">
            {setFive && <Card card={setFive[1]} readOnly />}
          </td>
          <td>{setFive && <Card card={setFive[2]} readOnly />}</td>
        </tr>
        <tr className="border-b border-gray-300 h-16">
          <td className="border-r border-gray-300">
            {setSix && <Card card={setSix[0]} readOnly />}
          </td>
          <td className="border-r border-gray-300">
            {setSix && <Card card={setSix[1]} readOnly />}
          </td>
          <td>{setSix && <Card card={setSix[2]} readOnly />}</td>
        </tr>
      </table>
    </div>
  );
};
