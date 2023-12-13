import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
	entry: ['./src/index.ts'],
	outDir: 'dist',
	clean: true,
	sourcemap: true,
	treeshake: true,
	format: ['cjs', 'esm'],
	platform: 'node',
	dts: options.dts,
	target: 'node18',
}))
