import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 1/1 point
    ✔ AFoo: ok
  B.+: 2/3 points
    ✔ BFoo: ok
    ✔ BBar: ok
    ✖ BBaz: failed
  C.+: 1/1 point
    ✔ CFoo: ok
  D.+: 0/1 point
    ✖ DFoo: failed
  E.+: 1/2 points
    ✔ EFoo: ok
    ✖ EBar: failed

Info: The detailed test and error information is visible above the result summary.

WARNING: The following extra tests do not belong to a main test and were ignored:
  - C.+ > CBar
  - F.+ > FFoo
  - F.+ > FBar
`;

describe('main tests missing', () => {
  it('prints the test run', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));
    run.addGroup(new Group('B.+', 1, Strategy.Add));
    run.addGroup(new Group('C.+', 1, Strategy.Add));
    run.addGroup(new Group('D.+', 1, Strategy.Add));
    run.addGroup(new Group('E.+', 1, Strategy.Add));
    run.addGroup(new Group('F.+', 1, Strategy.Add));

    // normal tests
    run.recordTest('AFoo', false, true);
    run.recordTest('BFoo', false, true);
    run.recordTest('BBar', false, true);
    run.recordTest('BBaz', false, false);
    run.recordTest('CFoo', false, true);
    run.recordTest('DFoo', false, false);
    run.recordTest('EFoo', false, true);
    run.recordTest('EBar', false, false);

    // extra tests
    run.recordTest('AFoo', true, true);
    run.recordTest('BFoo', true, true);
    run.recordTest('BBar', true, true);
    run.recordTest('BBaz', true, false);
    run.recordTest('CFoo', true, true);
    run.recordTest('CBar', true, true); // this has no normal test and should trigger a warning
    run.recordTest('DFoo', true, true);
    run.recordTest('EFoo', true, true);
    run.recordTest('EBar', true, true);
    run.recordTest('FFoo', true, true); // this has no normal test and should trigger a warning
    run.recordTest('FBar', true, false); // this has no normal test and should trigger a warning

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
