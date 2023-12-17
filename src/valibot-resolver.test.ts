// @ts-ignore no types for jsdom
import { JSDOM } from 'jsdom'
const { window } = new JSDOM()
globalThis.window = window
globalThis.document = window.document
globalThis.navigator = window.navigator

import { deepEqual } from 'node:assert/strict'
import { it } from 'node:test'
import { useForm } from '@mantine/form'
import { act, renderHook } from '@testing-library/react'
import {
	array,
	email,
	minLength,
	minValue,
	number,
	object,
	string,
} from 'valibot'
import { valibotResolver } from './valibot-resolver'

const schema = object({
	name: string([minLength(2, 'Name should have at least 2 letters')]),
	email: string([email('Invalid email')]),
	age: number([minValue(18, 'You must be at least 18 to create an account')]),
})

it('validates basic fields with given valibot schema', () => {
	const hook = renderHook(() =>
		useForm({
			initialValues: {
				name: '',
				email: '',
				age: 16,
			},
			validate: valibotResolver(schema),
		}),
	)

	deepEqual(hook.result.current.errors, {})
	act(() => hook.result.current.validate())

	deepEqual(hook.result.current.errors, {
		name: 'Name should have at least 2 letters',
		email: 'Invalid email',
		age: 'You must be at least 18 to create an account',
	})

	act(() =>
		hook.result.current.setValues({
			name: 'John',
			email: 'john@email.com',
			age: 16,
		}),
	)
	act(() => hook.result.current.validate())

	deepEqual(hook.result.current.errors, {
		age: 'You must be at least 18 to create an account',
	})
})

const nestedSchema = object({
	nested: object({
		field: string([minLength(2, 'Field should have at least 2 letters')]),
	}),
})

it('validates nested fields with given valibot schema', () => {
	const hook = renderHook(() =>
		useForm({
			initialValues: {
				nested: {
					field: '',
				},
			},
			validate: valibotResolver(nestedSchema),
		}),
	)

	deepEqual(hook.result.current.errors, {})
	act(() => hook.result.current.validate())

	deepEqual(hook.result.current.errors, {
		'nested.field': 'Field should have at least 2 letters',
	})

	act(() => hook.result.current.setValues({ nested: { field: 'John' } }))
	act(() => hook.result.current.validate())

	deepEqual(hook.result.current.errors, {})
})

const listSchema = object({
	list: array(
		object({
			name: string([minLength(2, 'Name should have at least 2 letters')]),
		}),
	),
})

it('validates list fields with given valibot schema', () => {
	const hook = renderHook(() =>
		useForm({
			initialValues: {
				list: [{ name: '' }],
			},
			validate: valibotResolver(listSchema),
		}),
	)

	deepEqual(hook.result.current.errors, {})
	act(() => hook.result.current.validate())

	deepEqual(hook.result.current.errors, {
		'list.0.name': 'Name should have at least 2 letters',
	})

	act(() => hook.result.current.setValues({ list: [{ name: 'John' }] }))
	act(() => hook.result.current.validate())

	deepEqual(hook.result.current.errors, {})
})
