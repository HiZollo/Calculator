import { Calculator } from "./calculator";
import { CalcError, ErrorCodes } from "./errors";

const calculator = new Calculator();

test({
  "basic arithmetic": [
    { input: "2109682310 + 845476480", output: 2955158790 },
    { input: "1927377456 + -289144539", output: 1638232917 },
    { input: "-124496833 + 76467068", output: -48029765 },
    { input: "-1524775090 + -1035094282", output: -2559869372 },

    { input: "60037769 - 1999402650", output: -1939364881 },
    { input: "1035336235 - -894656174", output: 1929992409 },
    { input: "-811353743 - 2041915896", output: -2853269639 },
    { input: "-1299510282 - -1073755733", output: -225754549 },

    { input: "1995126616 * 597128371", output: 1191346706150822700 },
    { input: "694729956 * -2142020412", output: -1488125746579861800 },
    { input: "-1863011778 * 1262397307", output: -2351861051456482000 },
    { input: "-691546919 * -1936994834", output: 1339522809571616500 },

    { input: "196410203 / 1143072785", output: 0.17182650621849946 },
    { input: "1909277199 / -769760300", output: -2.4803529085612754 },
    { input: "-1388122852 / 867522969", output: -1.6000992499369777 },
    { input: "-97463863 / -531359917", output: 0.1834234383923242 },
  ]
});

function test(entries: { [key: string]: TestEntry[] }) {
  console.log("========= [TEST START] =========");

  for (const unit in entries) {
    console.log(`========= [${unit.toUpperCase()} STARTED] =========`);

    const result = unitTest(entries[unit]);
    if (result) {
      console.log(`========= [${unit.toUpperCase()} FAILED] =========`);
      console.log(`Input: ${result.input}`);
      console.log(`Expected: ${result.expected}`);
      console.log(`Received: ${result.received}`);
      console.log("========= [TEST TERMINATED] =========");
      return;
    }

    console.log(`========= [${unit.toUpperCase()} PASSED] =========`);
  }

  console.log("========= [TEST SUCCESS] =========");
}

function unitTest(entries: TestEntry[]): TestEntryReturn | null {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    try {
      const received = calculator.calculate(entry.input);

      if (!('output' in entry)) {
        return { input: entry.input, received, expected: entry.errorCode };
      }
      if (entry.output !== received) {
        return { input: entry.input, received, expected: entry.output };
      }
    } catch (e) {
      const { code: received } = e as CalcError<ErrorCodes>;

      if (!('errorCode' in entry)) {
        return { input: entry.input, received, expected: entry.output };
      }
      if (received !== entry.errorCode) {
        return { input: entry.errorCode, received, expected: entry.errorCode };
      }
    }
  }
  return null;
}


type TestEntry = {
  input: string;
  output: number;
} | {
  input: string;
  errorCode: string;
}

interface TestEntryReturn {
  input: string;
  expected: number | string;
  received: number | string;
}