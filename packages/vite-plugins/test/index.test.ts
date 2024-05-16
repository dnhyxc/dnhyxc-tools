import { describe, expect, it } from 'vitest';
import { ViteElectronBuildPlugin, ViteElectronRuntimePlugin } from '../index';

describe('core ViteElectronBuildPlugin', () => {
  it('should test ViteElectronBuildPlugin', () => {
    expect(ViteElectronBuildPlugin);
  });
});

describe('core ViteElectronRuntimePlugin', () => {
  it('should test ViteElectronRuntimePlugin', () => {
    expect(ViteElectronRuntimePlugin);
  });
});
