import { FC } from "react";
import Card from "./Card";

interface FoundSetsProps {
  sets: string[][];
  setCount: string;
}

export const FoundSets: FC<FoundSetsProps> = ({ sets, setCount }) => {
  const [setOne, setTwo, setThree, setFour, setFive, setSix] = sets;

  return (
    <div className="flex flex-col gap-y-6.5">
      <h3 className="text-lg font-bold">Found Sets {setCount}</h3>

      <table>
        <tr className="h-16">
          <td className="w-24">
            {setOne && <Card card={setOne[0]} readOnly />}
          </td>
          <td className="w-24">
            {setOne && <Card card={setOne[1]} readOnly />}
          </td>
          <td className="w-24">
            {setOne && <Card card={setOne[2]} readOnly />}
          </td>
        </tr>
        <tr className="h-16">
          <td>{setTwo && <Card card={setTwo[0]} readOnly />}</td>
          <td>{setTwo && <Card card={setTwo[1]} readOnly />}</td>
          <td>{setTwo && <Card card={setTwo[2]} readOnly />}</td>
        </tr>
        <tr className="h-16">
          <td>{setThree && <Card card={setThree[0]} readOnly />}</td>
          <td>{setThree && <Card card={setThree[1]} readOnly />}</td>
          <td>{setThree && <Card card={setThree[2]} readOnly />}</td>
        </tr>
        <tr className="h-16">
          <td>{setFour && <Card card={setFour[0]} readOnly />}</td>
          <td>{setFour && <Card card={setFour[1]} readOnly />}</td>
          <td>{setFour && <Card card={setFour[2]} readOnly />}</td>
        </tr>
        <tr className="h-16">
          <td>{setFive && <Card card={setFive[0]} readOnly />}</td>
          <td>{setFive && <Card card={setFive[1]} readOnly />}</td>
          <td>{setFive && <Card card={setFive[2]} readOnly />}</td>
        </tr>
        <tr className="h-16">
          <td>{setSix && <Card card={setSix[0]} readOnly />}</td>
          <td>{setSix && <Card card={setSix[1]} readOnly />}</td>
          <td>{setSix && <Card card={setSix[2]} readOnly />}</td>
        </tr>
      </table>
    </div>
  );
};
