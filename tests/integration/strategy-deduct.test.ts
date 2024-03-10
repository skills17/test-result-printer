import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy, Override } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 2/3 points
    ✔ Foo
    ✖ Bar
    ✔ Baz
  B.+: 1/2 points
    ✔ Foo
    ✖ Bar
    ✔ Baz
  C.+: 0/2 points
    ✖ Foo
    ✖ Bar
    ✖ Baz
  D.+: 1/1.5 points
    ✔ Foo
    ✖ Bar
    ✔ Baz
  E.+: 0.5/2 points
    ✔ Foo
    ✖ MorePoints
    ✖ Bar
    ✔ Baz
  F.+: 2/2 points
    ✔ Foo
    ✔ Bar

Total: 6.5/12.5 points

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
    groupE.addOverride(new Override('MorePoints', false, 1));
    run.addGroup(groupE);
    run.addGroup(new Group('F.+', 1, Strategy.Deduct));

    // normal tests

    // group A: should result in 2/3 as ABar deducts 1 point
    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('ABar', 'Bar', false, false);
    run.recordTest('ABaz', 'Baz', false, true);

    // group B: should result in 1/2 as BBar deducts 1 point and max is set to 2
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, false);
    run.recordTest('BBaz', 'Baz', false, true);

    // group C: should result in 0/2 as a value below 0 is not possible
    run.recordTest('CFoo', 'Foo', false, false);
    run.recordTest('CBar', 'Bar', false, false);
    run.recordTest('CBaz', 'Baz', false, false);

    // group D: should result in 1/1.5 as default points is 0.5
    run.recordTest('DFoo', 'Foo', false, true);
    run.recordTest('DBar', 'Bar', false, false);
    run.recordTest('DBaz', 'Baz', false, true);

    // group E: should result in 0.5/2 as one test deducts more points
    run.recordTest('EFoo', 'Foo', false, true);
    run.recordTest('EMorePoints', 'MorePoints', false, false);
    run.recordTest('EBar', 'Bar', false, false);
    run.recordTest('EBaz', 'Baz', false, true);

    // group F: should result in 2/2
    run.recordTest('FFoo', 'Foo', false, true);
    run.recordTest('FBar', 'Bar', false, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
