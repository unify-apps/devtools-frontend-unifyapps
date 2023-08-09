// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as PerfUI from '../../../../../../../front_end/ui/legacy/components/perf_ui/perf_ui.js';
import type * as TraceEngine from '../../../../../../../front_end/models/trace/trace.js';
import {describeWithLocale} from '../../../../helpers/EnvironmentHelpers.js';

const {assert} = chai;

describeWithLocale('TimelineOverviewCalculator', () => {
  it('can calculate pixels for a given time', async () => {
    const calculator = new PerfUI.TimelineOverviewPane.TimelineOverviewCalculator();
    calculator.setDisplayWidth(200);
    calculator.setBounds(0, 100);

    assert.strictEqual(calculator.computePosition(50), 100);
  });

  it('can calculate the time position for a pixel value', async () => {
    const calculator = new PerfUI.TimelineOverviewPane.TimelineOverviewCalculator();
    calculator.setDisplayWidth(200);
    calculator.setBounds(0, 100);

    assert.strictEqual(calculator.positionToTime(100), 50);
  });

  it('formats time values', async () => {
    const calculator = new PerfUI.TimelineOverviewPane.TimelineOverviewCalculator();
    calculator.setDisplayWidth(200);
    calculator.setBounds(0, 100);
    const result = calculator.formatValue(55.234);
    assert.deepEqual(result, '55\u00A0ms');
  });

  it('formats time values with custom precision', async () => {
    const calculator = new PerfUI.TimelineOverviewPane.TimelineOverviewCalculator();
    calculator.setDisplayWidth(200);
    calculator.setBounds(0, 100);
    const result = calculator.formatValue(55.234, 2);
    assert.deepEqual(result, '55.23\u00A0ms');
  });

  it('adjusts times based on navigaton start times', async () => {
    const calculator = new PerfUI.TimelineOverviewPane.TimelineOverviewCalculator();
    calculator.setDisplayWidth(200);
    calculator.setBounds(0, 100);
    const fakeNavStart = {
      startTime: 100,
    } as unknown as TraceEngine.Legacy.Event;
    const navStartTimes = new Map([
      ['fake-navigation-id', fakeNavStart],
    ]);
    calculator.setNavStartTimes(navStartTimes);
    // There is a navigation at 100ms, so this time gets changed to 5ms
    const result = calculator.formatValue(105);
    assert.deepEqual(result, '5\u00A0ms');
  });

  it('returns the correct range', async () => {
    const calculator = new PerfUI.TimelineOverviewPane.TimelineOverviewCalculator();
    calculator.setDisplayWidth(200);
    calculator.setBounds(0, 100);
    assert.strictEqual(calculator.boundarySpan(), 100);
  });
});
