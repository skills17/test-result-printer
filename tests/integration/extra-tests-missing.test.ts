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
  C.+: 2/2 points
    ✔ CFoo: ok
    ✔ CBar: ok
  D.+: 0/1 point
    ✖ DFoo: failed
  E.+: 1/2 points
    ✔ EFoo: ok
    ✖ EBar: failed
  F.+: 1/2 points
    ✔ FFoo: ok
    ✖ FBar: failed

Info: The detailed test and error information is visible above the result summary.

WARNING: The following tests do NOT have extra tests and so can NOT be checked for possible cheating:
  - E.+ > EFoo
  - F.+ > FFoo
  - F.+ > FBar
`;

describe('extra tests missing', () => {
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
    run.recordTest('CBar', false, true);
    run.recordTest('DFoo', false, false);
    run.recordTest('EFoo', false, true); // this does not have an extra test and should trigger a warning
    run.recordTest('EBar', false, false);
    run.recordTest('FFoo', false, true); // this does not have an extra test and should trigger a warning
    run.recordTest('FBar', false, false); // this does not have an extra test and should trigger a warning

    // extra tests
    run.recordTest('AFoo', true, true);
    run.recordTest('BFoo', true, true);
    run.recordTest('BBar', true, true);
    run.recordTest('BBaz', true, false);
    run.recordTest('CFoo', true, true);
    run.recordTest('CBar', true, true);
    run.recordTest('DFoo', true, true);
    run.recordTest('EBar', true, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});