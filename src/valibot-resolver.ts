import type { FormErrors } from '@mantine/form'
import { type BaseIssue, type BaseSchema, Config, getDotPath, InferIssue, safeParse } from 'valibot'

/**
 * Returns a function that can be used to validate a Maninte form with Valibot.
 *
 * @param schema The Valibot schema.
 *
 * @returns A validation function.
 */
export function valibotResolver<TValues extends Record<string, unknown>>(
	schema: BaseSchema<TValues, TValues, BaseIssue<unknown>>,
	config?: Config<InferIssue<typeof schema>>
) {
	return (values: TValues): FormErrors => {
		const errors: FormErrors = {}
		const result = safeParse(schema, values, config)
		if (result.issues) {
			for (const issue of result.issues) {
				const path = getDotPath(issue)
				if (path) {
					errors[path] = issue.message
				}
			}
		}
		return errors
	}
}
