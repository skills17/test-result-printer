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
  D.+: 1/1 point [manual check required]
    ? DFoo: WARNING: please check manually for static return values and/or logical errors
  E.+: 2/2 points [manual check required]
    ? EFoo: WARNING: please check manually for static return values and/or logical errors
    ✔ EBar: ok

Info: The detailed test and error information is visible above the result summary.
`;

describe('extra tests fail', () => {
  it('prints the test run', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));
    run.addGroup(new Group('B.+', 1, Strategy.Add));
    run.addGroup(new Group('C.+', 1, Strategy.Add));
    run.addGroup(new Group('D.+', 1, Strategy.Add));
    run.addGroup(new Group('E.+', 1, Strategy.Add));

    // normal tests
    run.recordTest('AFoo', false, true);
    run.recordTest('BFoo', false, true);
    run.recordTest('BBar', false, true);
    run.recordTest('BBaz', false, false);
    run.recordTest('CFoo', false, true);
    run.recordTest('CBar', false, true);
    run.recordTest('DFoo', false, true); // extra test for this fails and should trigger a warning
    run.recordTest('EFoo', false, true); // extra test for this fails and should trigger a warning
    run.recordTest('EBar', false, true);

    // extra tests
    run.recordTest('AFoo', true, true);
    run.recordTest('BFoo', true, true);
    run.recordTest('BBar', true, true);
    run.recordTest('BBaz', true, false);
    run.recordTest('CFoo', true, true);
    run.recordTest('CBar', true, true);
    run.recordTest('DFoo', true, false);
    run.recordTest('EFoo', true, false);
    run.recordTest('EBar', true, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
