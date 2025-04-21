// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import "./main.js";
import "../../Images/Images.js";
import "../../core/platform/platform.js";
import "../../core/dom_extension/dom_extension.js";

import "../../panels/console/console-meta.js";
import "../../panels/settings/settings-meta.js";
import "../../panels/protocol_monitor/protocol_monitor-meta.js";
import "../../models/persistence/persistence-meta.js";
import "../../models/logs/logs-meta.js";
import "../main/main-meta.js";
import "../../ui/legacy/components/perf_ui/perf_ui-meta.js";
import "../../ui/legacy/components/quick_open/quick_open-meta.js";
import "../../core/sdk/sdk-meta.js";
import "../../ui/legacy/components/source_frame/source_frame-meta.js";
import "../../panels/console_counters/console_counters-meta.js";
import "../../ui/legacy/components/object_ui/object_ui-meta.js";
import "../main/main.js";

import "../../panels/browser_debugger/browser_debugger-meta.js";
import "../../panels/network/network-meta.js";
import "../../panels/emulation/emulation-meta.js";
import "../../panels/sensors/sensors-meta.js";
import "../../panels/accessibility/accessibility-meta.js";
import "../../panels/developer_resources/developer_resources-meta.js";
import "../inspector_main/inspector_main-meta.js";
import "../../panels/issues/issues-meta.js";
import "../../panels/mobile_throttling/mobile_throttling-meta.js";
import "../../panels/layer_viewer/layer_viewer-meta.js";

import * as Root from "../../core/root/root.js";
import * as Main from "../main/main.js";

// @ts-ignore Exposed for legacy layout tests
self.runtime = Root.Runtime.Runtime.instance({ forceNew: true });
new Main.MainImpl.MainImpl();
