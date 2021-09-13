import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 1.9/2 points
    ✔ 1
    ✔ 2
    ✔ 3
    ✔ 4
    ✔ 5
    ✔ 6
    ✔ 7
    ✔ 8
    ✔ 9
    ✔ 10
    ✔ 11
    ✔ 12
    ✔ 13
    ✔ 14
    ✖ 15
    ✔ 16
    ✔ 17
    ✔ 18
    ✔ 19
    ✔ 20

Info: The detailed test and error information is visible above the result summary.
`;

describe('small points', () => {
  it('prints the test run', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 0.1, Strategy.Add));

    run.recordTest('A1', '1', false, true);
    run.recordTest('A2', '2', false, true);
    run.recordTest('A3', '3', false, true);
    run.recordTest('A4', '4', false, true);
    run.recordTest('A5', '5', false, true);
    run.recordTest('A6', '6', false, true);
    run.recordTest('A7', '7', false, true);
    run.recordTest('A8', '8', false, true);
    run.recordTest('A9', '9', false, true);
    run.recordTest('A10', '10', false, true);
    run.recordTest('A11', '11', false, true);
    run.recordTest('A12', '12', false, true);
    run.recordTest('A13', '13', false, true);
    run.recordTest('A14', '14', false, true);
    run.recordTest('A15', '15', false, false);
    run.recordTest('A16', '16', false, true);
    run.recordTest('A17', '17', false, true);
    run.recordTest('A18', '18', false, true);
    run.recordTest('A19', '19', false, true);
    run.recordTest('A20', '20', false, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
