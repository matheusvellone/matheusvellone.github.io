# Using branded types to extreme type guard

Lets pretend you have an entity  `User`  with an  `id`  property which is a  `string`  prefixed by  `u_`  then followed by 5 random characters, 7 in total. The simplest way would be to type it like this. Now lets create a function that have a User ID as a input

```ts
type User = {
	id: string
}
```

And now we declare our function that will receive a User ID and do something with it

```ts
const loginUser = (userId: User['id']) => {
	// do login things then return a token
	return 'my_super_secret_login_token'
}
```

The problem here is that our ID definition is too wide and accepts anything like  `random string`  or  `u_123`  as a input as seem in  [this TS Playground](https://www.typescriptlang.org/play?#code/C4TwDgpgBAqgzhATlAvFA3gWAFBSgSwBMAuKOYRfAOwHMcBfHHAYwHsryoAbVm6+JKigAKAK4JEASRKwJAbQDkRBQF0AlKgB8GHHgD0eqIVbde1KMAAW1GnAuWIVKIgjBRiJwEMLrANaPdZ1d3JwUAWxAAfThRSERoiGYXYEiePipI4D9HBQYmbDT+CWEFUUiARgAmAGYAFgBWBQ0DKABhVkQXZmAoZk8uLhxCqgFEEsRPKmMwsgobJqgWgGVLVlEuQigkRA6hsxHi0oqa2oXl1fXN7d2C-dGSsqq6+oA2M8MVtY2tzo6gA).

I wonder if there is a way to narrow the type so it only accepts strings prefixed with  `u_`  with 7 characters total 🤔

> We could set the id type to something like  ``_type User = { id: `u_${string}` }_``  which would lock the prefix for us, but there’s no way to check the length of a string with typescript.  **If you only need to check the prefix**, this is the simplest way to do it.

This is where branded types comes in handy. We can extend the base  `string`, or  `number`, type by adding a custom property which locks the type to the Entity itself. We make this “lock” by using branded types with  `Type &  **{ [_brand]: Entity }**`

```ts
declare const _brand: unique symbol

type ID<Type extends string | number, Entity> = Type & { [_brand]: Entity }

type User = {
	id: ID<string, User>
}
```
Now we have a specific type to describe an User ID.

But now, calling the previous  `loginUser`  method is broken, because we cannot do  `loginUser('u_12345')`  anymore, because  `Argument of type ‘string' is not assignable to parameter of type ‘ID<string, User>’`, which makes sense because  `u_12345`  is not guaranteed to be a valid user by our rules (prefix and length).

We could do  `loginUser('u_12345' as ID<string, User>)`  but we would be vulnerable to wrong formatted IDs again. Instead of using  `as`  to cast our type, we can create a function to validate the prefix and the length to be sure that the argument is a valid ID while also inferring the type of the ID. Like  `loginUser(validateUserId('u_12345'))`

> We could also add a validation step at the first line of  `loginUser`  function, but we would be paying a  **runtime cost**  of ALWAYS running the validation, even if the ID is already validated previously.

First we need to declare our rules and link them into our Entity type. We accomplish this by using branded types again  `Options &  **{ [_brand]: Entity }**`.

```ts
declare const _brand: unique symbol

type ID<Type extends string | number, Entity> = Type & { [_brand]: Entity }

type User = {
	id: ID<string, User>
}

type IDOptions<Entity> = {
	type: 'string'
	prefix: string
	totalLength: number
} & { [_brand]: Entity }

const UserIdOptions = {
	type: 'string',
	prefix: 'u_',
	totalLength: 7,
} as IDOptions<User>
```

With the options configured, we now need a way to validate a input based on the  `UserIdOptions`  and if valid, return the correct type for it based on the Entity type inferred from  `UserIdOptions`.

There is a lot of ways to accomplish this, but I’ll share the way I use it: with  [zod](https://zod.dev/), a TypeScript-first schema validation with static type inference. I created a generic helper function to get a zod schema based on the  `IDOptions`  received.

```ts
import z, { ZodType } from 'zod'

// Entity is inferred from the options parameter type
const idRule = <Entity extends { id: string | number }>(options: IDOptions<Entity>) => {
	const schema = z.string()
		.startsWith(options.prefix) // To validate the prefix
		.length(options.totalLength) // To validate the length

	return schema as ZodType<Entity['id']> // With Entity inferred, we now 		cast the type to the type of the 'id' property of Entity
}
```

> You can extend the  `idRule`  function to validate more rules you might have in your ID

With all of this, we can now see our full example:

```ts
import z, { ZodType } from 'zod'

declare const _brand: unique symbol

type ID<Type extends string | number, Entity> = Type & { [_brand]: Entity }

type User = {
	id: ID<string, User>
}

const loginUser = (userId: User['id']) => {
	// do login things then return a token
	return 'my_super_secret_login_token'
}

type IDOptions<Entity> = {
	type: 'string'
	prefix: string
	totalLength: number
} & { [_brand]: Entity }

const UserIdOptions = {
	type: 'string',
	prefix: 'u_',
	totalLength: 7,
} as IDOptions<User>

// Correct call (with string), but cannot trust it because there might be:
// - lack of prefix
// - more/less characters than the expected
loginUser('u_12345')
loginUser('random string') // Should error
loginUser('u_1234') // Should error
loginUser('u_123456') // Should error

const idRule = <Model extends { id: string | number }>(options: IDOptions<Model>) => {
	const schema = z.string().startsWith(options.prefix).length(options.totalLength)
	return schema as ZodType<Model['id']>
}

// A zod schema that will validate against our IDOptions and when safely parsed will return a
// valid ID type for the Entity linked to our UserIdOptions type, which is the User
const userIdSchema = idRule(UserIdOptions)

// This will be ID<string, User> when valid, and will throw an Error when invalid
const id = userIdSchema.parse('u_12345')

loginUser(id)
```
[Also available in CodeSandbox](https://codesandbox.io/s/typescript-playground-export-forked-9pmgd8?file=%2Findex.ts), with type hints.

I’ve added a  `index2.ts`  in the  [CodeSandbox example](https://codesandbox.io/s/typescript-playground-export-forked-9pmgd8?file=%2Findex2.ts)  with more practical use cases I have in my project which might be useful for you too.

---

And with all of this, we can now rest assured that we won’t see any error from:
-   Missing prefix IDs
-   Lack of characters or extra ones
-   Any other rule you might want to implement: suffix, fixed parts, algorithmic validations and so on…

Hope this helps you. Peace ✌️
