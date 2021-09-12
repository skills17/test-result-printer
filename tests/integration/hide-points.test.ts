import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+
    ✔ Foo
  B.+
    ✔ Foo
    ✔ Bar
    ✖ Baz
  C.+ [manual check required]
    ? Foo please check manually for static return values and/or logical errors

Info: The detailed test and error information is visible above the result summary.
`;

describe('hide points', () => {
  it('prints the test run', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));
    run.addGroup(new Group('B.+', 1, Strategy.Add));
    run.addGroup(new Group('C.+', 1, Strategy.Add));

    // normal tests
    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, true);
    run.recordTest('BBaz', 'Baz', false, false);
    run.recordTest('CFoo', 'Foo', false, true); // extra test for this fails and should trigger a warning

    // extra tests
    run.recordTest('AFoo', 'Foo', true, true);
    run.recordTest('BFoo', 'Foo', true, true);
    run.recordTest('BBar', 'Bar', true, true);
    run.recordTest('BBaz', 'Baz', true, false);
    run.recordTest('CFoo', 'Foo', true, false);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log, printPoints: false });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
