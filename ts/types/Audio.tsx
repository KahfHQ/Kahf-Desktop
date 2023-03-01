// Copyright 2021 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import type LRU from 'lru-cache';

export type WaveformCache = LRU<
  string,
  {
    duration: number;
    peaks: ReadonlyArray<number>;
  }
>;
