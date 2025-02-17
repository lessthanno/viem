import type { Assign, Prettify } from '../../types/utils.js'

export function defineFormatter<TParameters, TReturnType>(
  format: (_: TParameters) => TReturnType,
) {
  return <
    TOverrideParameters,
    TOverrideReturnType,
    TExclude extends (keyof TParameters)[] = [],
  >({
    exclude,
    format: overrides,
  }: {
    exclude?: TExclude
    format: (_: TOverrideParameters) => TOverrideReturnType
  }) => {
    return (args: TParameters & TOverrideParameters) => {
      const formatted = format(args)
      if (exclude) {
        for (const key of exclude) {
          delete (formatted as any)[key]
        }
      }
      return {
        ...formatted,
        ...overrides(args),
      } as Prettify<Assign<TReturnType, TOverrideReturnType>> & {
        [K in TExclude[number]]: never
      }
    }
  }
}
