import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 1/1 point
    ✔ Foo
  B.+: 2/3 points
    ✔ Foo
    ✔ Bar
    ✖ Baz
  C.+: 2/2 points
    ✔ Foo
    ✔ Bar
  D.+: 1/1 point [manual check required]
    ? Foo please check manually for static return values and/or logical errors
  E.+: 2/2 points [manual check required]
    ? Foo please check manually for static return values and/or logical errors
    ✔ Bar

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
    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, true);
    run.recordTest('BBaz', 'Baz', false, false);
    run.recordTest('CFoo', 'Foo', false, true);
    run.recordTest('CBar', 'Bar', false, true);
    run.recordTest('DFoo', 'Foo', false, true); // extra test for this fails and should trigger a warning
    run.recordTest('EFoo', 'Foo', false, true); // extra test for this fails and should trigger a warning
    run.recordTest('EBar', 'Bar', false, true);

    // extra tests
    run.recordTest('AFoo', 'Foo', true, true);
    run.recordTest('BFoo', 'Foo', true, true);
    run.recordTest('BBar', 'Bar', true, true);
    run.recordTest('BBaz', 'Baz', true, false);
    run.recordTest('CFoo', 'Foo', true, true);
    run.recordTest('CBar', 'Bar', true, true);
    run.recordTest('DFoo', 'Foo', true, false);
    run.recordTest('EFoo', 'Foo', true, false);
    run.recordTest('EBar', 'Bar', true, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
