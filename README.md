# mantine-form-valibot-resolver

[![npm version](https://badgen.net/npm/v/mantine-form-valibot-resolver)](https://npm.im/mantine-form-valibot-resolver)

[valibot](https://www.npmjs.com/package/valibot) resolver for [@mantine/form](https://mantine.dev/form/use-form/).

## Installation

With npm:

```sh
npm install valibot mantine-form-valibot-resolver
```

With yarn:

```sh
yarn add valibot mantine-form-valibot-resolver
```

With pnpm:

```sh
pnpm add valibot mantine-form-valibot-resolver
```

## Basic fields validation

```tsx
import { object, string, minLength, email, number, minValue } from "valibot";
import { useForm } from "@mantine/form";
import { valibotResolver } from "mantine-form-valibot-resolver";

const schema = object({
	name: string([minLength(2, "Name should have at least 2 letters")]),
	email: string([email("Invalid email")]),
	age: number([minValue(18, "You must be at least 18 to create an account")]),
});

const form = useForm({
	initialValues: {
		name: "",
		email: "",
		age: 16,
	},
	validate: valibotResolver(schema),
});

form.validate();
form.errors;
// -> {
//  name: 'Name should have at least 2 letters',
//  email: 'Invalid email',
//  age: 'You must be at least 18 to create an account'
// }
```

## Nested fields validation

```tsx
import { object, string, minLength } from "valibot";
import { useForm } from "@mantine/form";
import { valibotResolver } from "mantine-form-valibot-resolver";

const nestedSchema = object({
	nested: object({
		field: string([minLength(2, "Field should have at least 2 letters")]),
	}),
});

const form = useForm({
	initialValues: {
		nested: {
			field: "",
		},
	},
	validate: valibotResolver(nestedSchema),
});

form.validate();
form.errors;
// -> {
//  'nested.field': 'Field should have at least 2 letters',
// }
```

## List fields validation

```tsx
import { object, array, string, minLength } from "valibot";
import { useForm } from "@mantine/form";
import { valibotResolver } from "mantine-form-valibot-resolver";

const listSchema = object({
	list: array(
		object({
			name: string([minLength(2, "Name should have at least 2 letters")]),
		})
	),
});

const form = useForm({
	initialValues: {
		list: [{ name: "" }],
	},
	validate: valibotResolver(listSchema),
});

form.validate();
form.errors;
// -> {
//  'list.0.name': 'Name should have at least 2 letters',
// }
```

## With TypeScript

You can use the `Input` type from the `valibot` library to get the type of the form data.

```tsx
import { email, object, string, type Input } from "valibot";
import { useForm } from "@mantine/form";
import { valibotResolver } from "mantine-form-valibot-resolver";

export const userSchema = object({
	email: string([email()]),
});

type FormData = Input<typeof userSchema>;

const form = useForm<FormData>({
	initialValues: {
		email: "",
	},
	validate: valibotResolver(userSchema),
});
```

## License

MIT
