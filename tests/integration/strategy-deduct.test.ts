import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy, Override } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 2/3 points
    ✔ AFoo: ok
    ✖ ABar: failed
    ✔ ABaz: ok
  B.+: 1/2 points
    ✔ BFoo: ok
    ✖ BBar: failed
    ✔ BBaz: ok
  C.+: 0/2 points
    ✖ CFoo: failed
    ✖ CBar: failed
    ✖ CBaz: failed
  D.+: 1/1.5 points
    ✔ DFoo: ok
    ✖ DBar: failed
    ✔ DBaz: ok
  E.+: 0.5/2 points
    ✔ EFoo: ok
    ✖ EMorePoints: failed
    ✖ EBar: failed
    ✔ EBaz: ok
  F.+: 2/2 points
    ✔ FFoo: ok
    ✔ FBar: ok

Info: The detailed test and error information is visible above the result summary.
`;

describe('strategy deduct', () => {
  it('prints the test run', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Deduct));
    run.addGroup(new Group('B.+', 1, Strategy.Deduct, undefined, 2));
    run.addGroup(new Group('C.+', 1, Strategy.Deduct, undefined, 2));
    run.addGroup(new Group('D.+', 0.5, Strategy.Deduct));
    const groupE = new Group('E.+', 0.5, Strategy.Deduct, undefined, 2);
    groupE.addOverride(new Override('EMorePoints', false, 1));
    run.addGroup(groupE);
    run.addGroup(new Group('F.+', 1, Strategy.Deduct));

    // normal tests

    // group A: should result in 2/3 as ABar deducts 1 point
    run.recordTest('AFoo', false, true);
    run.recordTest('ABar', false, false);
    run.recordTest('ABaz', false, true);

    // group B: should result in 1/2 as BBar deducts 1 point and max is set to 2
    run.recordTest('BFoo', false, true);
    run.recordTest('BBar', false, false);
    run.recordTest('BBaz', false, true);

    // group C: should result in 0/2 as a value below 0 is not possible
    run.recordTest('CFoo', false, false);
    run.recordTest('CBar', false, false);
    run.recordTest('CBaz', false, false);

    // group D: should result in 1/1.5 as default points is 0.5
    run.recordTest('DFoo', false, true);
    run.recordTest('DBar', false, false);
    run.recordTest('DBaz', false, true);

    // group E: should result in 0.5/2 as one test deducts more points
    run.recordTest('EFoo', false, true);
    run.recordTest('EMorePoints', false, false);
    run.recordTest('EBar', false, false);
    run.recordTest('EBaz', false, true);

    // group F: should result in 2/2
    run.recordTest('FFoo', false, true);
    run.recordTest('FBar', false, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
