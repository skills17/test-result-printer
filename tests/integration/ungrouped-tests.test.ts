import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 1/1 point
    ✔ AFoo: ok

Info: The detailed test and error information is visible above the result summary.

WARNING: The following tests do not belong to a group and were ignored:
  - BFoo
  - BBar
`;

describe('ungrouped tests', () => {
  it('prints the test run', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));

    run.recordTest('AFoo', false, true);
    run.recordTest('BFoo', false, true);
    run.recordTest('BBar', false, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
