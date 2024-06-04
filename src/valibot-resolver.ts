import type { FormErrors } from '@mantine/form'
import { type BaseIssue, type BaseSchema, safeParse } from 'valibot'

export function valibotResolver<T extends Record<string, unknown>>(
	schema: BaseSchema<T, T, BaseIssue<unknown>>,
) {
	return (values: T): FormErrors => {
		const result = safeParse(schema, values)
		const formErrors: FormErrors = {}
		if (result.issues) {
			for (const issue of result.issues) {
				if (issue.path) {
					let key = ''
					for (const item of issue.path) {
						if (
							'key' in item &&
							(typeof item.key === 'string' || typeof item.key === 'number')
						) {
							if (key) {
								key += `.${item.key}`
							} else {
								key += item.key
							}
						} else {
							break
						}
					}
					if (key) {
						formErrors[key] = issue.message
					}
				}
			}
		}
		return formErrors
	}
}
