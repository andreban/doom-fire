import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import {terser} from 'rollup-plugin-terser';
import workbox from 'rollup-plugin-workbox-inject';
import replace from '@rollup/plugin-replace';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default [{
	input: 'src/main.js',
	output: {
		file: 'public/bundle.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},
	plugins: [
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		production && terser() // minify, but only in production
	]
}, {
	input: 'src/doom-fire-worker.js',
	output: {
		file: 'public/doom-fire-worker.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},	
	plugins: [
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules,
		production && terser() // minify, but only in production
	]
}, {
	input: 'src/sw.js',
	output: {
		file: 'public/sw.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true,
	},
	plugins: [
		resolve(),
		// @rollup/plugin-replace is used to replace process.env.NODE_ENV
    // statements in the Workbox libraries to match your current environment.
    // This changes whether logging is enabled ('development') or disabled ('production').
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
		workbox({
			globDirectory: 'public',
			globPatterns: [
				'**/*.js',
				'**/*.html'
      ],
		}),
	],
}];
