/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation CreateJwt($initData: String!) {\n  createJwt(initData: $initData) {\n    accessToken\n    expiredAt\n  }\n}": typeof types.CreateJwtDocument,
    "query MyExercisesList($sort: SortEnum) {\n  myExercisesList(sort: $sort) {\n    id\n    name\n    maxWeight\n  }\n}\n\nquery MyExerciseHistory($exercise: String!) {\n  myExerciseHistory(exercise: $exercise) {\n    id\n    name\n    maxWeight\n    history {\n      date\n      maxWeight\n      sets {\n        setNumber\n        weight\n        reps\n        sets\n      }\n    }\n  }\n}": typeof types.MyExercisesListDocument,
    "query MyWorkouts($pagination: PaginationInput) {\n  myWorkouts(pagination: $pagination) {\n    items {\n      id\n      date\n      notes\n      exercises {\n        id\n        exercise {\n          id\n          name\n        }\n        equipment {\n          id\n          name\n        }\n        maxWeight\n        orderIndex\n        sets {\n          setNumber\n          weight\n          reps\n          sets\n        }\n      }\n    }\n    total\n    hasMore\n  }\n}\n\nquery MyWorkoutsByDate($input: DateInput!) {\n  myWorkoutsByDate(input: $input) {\n    items {\n      id\n      date\n      notes\n      exercises {\n        id\n        exercise {\n          id\n          name\n        }\n        equipment {\n          id\n          name\n        }\n        maxWeight\n        orderIndex\n        sets {\n          setNumber\n          weight\n          reps\n          sets\n        }\n      }\n    }\n    total\n    hasMore\n  }\n}\n\nquery MyWorkoutDates {\n  myWorkoutDates {\n    dates\n  }\n}\n\nmutation CreateWorkout($input: CreateWorkoutInput!) {\n  createWorkout(input: $input) {\n    id\n    date\n    notes\n  }\n}\n\nmutation DeleteWorkout($id: ID!) {\n  deleteWorkout(id: $id)\n}": typeof types.MyWorkoutsDocument,
};
const documents: Documents = {
    "mutation CreateJwt($initData: String!) {\n  createJwt(initData: $initData) {\n    accessToken\n    expiredAt\n  }\n}": types.CreateJwtDocument,
    "query MyExercisesList($sort: SortEnum) {\n  myExercisesList(sort: $sort) {\n    id\n    name\n    maxWeight\n  }\n}\n\nquery MyExerciseHistory($exercise: String!) {\n  myExerciseHistory(exercise: $exercise) {\n    id\n    name\n    maxWeight\n    history {\n      date\n      maxWeight\n      sets {\n        setNumber\n        weight\n        reps\n        sets\n      }\n    }\n  }\n}": types.MyExercisesListDocument,
    "query MyWorkouts($pagination: PaginationInput) {\n  myWorkouts(pagination: $pagination) {\n    items {\n      id\n      date\n      notes\n      exercises {\n        id\n        exercise {\n          id\n          name\n        }\n        equipment {\n          id\n          name\n        }\n        maxWeight\n        orderIndex\n        sets {\n          setNumber\n          weight\n          reps\n          sets\n        }\n      }\n    }\n    total\n    hasMore\n  }\n}\n\nquery MyWorkoutsByDate($input: DateInput!) {\n  myWorkoutsByDate(input: $input) {\n    items {\n      id\n      date\n      notes\n      exercises {\n        id\n        exercise {\n          id\n          name\n        }\n        equipment {\n          id\n          name\n        }\n        maxWeight\n        orderIndex\n        sets {\n          setNumber\n          weight\n          reps\n          sets\n        }\n      }\n    }\n    total\n    hasMore\n  }\n}\n\nquery MyWorkoutDates {\n  myWorkoutDates {\n    dates\n  }\n}\n\nmutation CreateWorkout($input: CreateWorkoutInput!) {\n  createWorkout(input: $input) {\n    id\n    date\n    notes\n  }\n}\n\nmutation DeleteWorkout($id: ID!) {\n  deleteWorkout(id: $id)\n}": types.MyWorkoutsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateJwt($initData: String!) {\n  createJwt(initData: $initData) {\n    accessToken\n    expiredAt\n  }\n}"): (typeof documents)["mutation CreateJwt($initData: String!) {\n  createJwt(initData: $initData) {\n    accessToken\n    expiredAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyExercisesList($sort: SortEnum) {\n  myExercisesList(sort: $sort) {\n    id\n    name\n    maxWeight\n  }\n}\n\nquery MyExerciseHistory($exercise: String!) {\n  myExerciseHistory(exercise: $exercise) {\n    id\n    name\n    maxWeight\n    history {\n      date\n      maxWeight\n      sets {\n        setNumber\n        weight\n        reps\n        sets\n      }\n    }\n  }\n}"): (typeof documents)["query MyExercisesList($sort: SortEnum) {\n  myExercisesList(sort: $sort) {\n    id\n    name\n    maxWeight\n  }\n}\n\nquery MyExerciseHistory($exercise: String!) {\n  myExerciseHistory(exercise: $exercise) {\n    id\n    name\n    maxWeight\n    history {\n      date\n      maxWeight\n      sets {\n        setNumber\n        weight\n        reps\n        sets\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyWorkouts($pagination: PaginationInput) {\n  myWorkouts(pagination: $pagination) {\n    items {\n      id\n      date\n      notes\n      exercises {\n        id\n        exercise {\n          id\n          name\n        }\n        equipment {\n          id\n          name\n        }\n        maxWeight\n        orderIndex\n        sets {\n          setNumber\n          weight\n          reps\n          sets\n        }\n      }\n    }\n    total\n    hasMore\n  }\n}\n\nquery MyWorkoutsByDate($input: DateInput!) {\n  myWorkoutsByDate(input: $input) {\n    items {\n      id\n      date\n      notes\n      exercises {\n        id\n        exercise {\n          id\n          name\n        }\n        equipment {\n          id\n          name\n        }\n        maxWeight\n        orderIndex\n        sets {\n          setNumber\n          weight\n          reps\n          sets\n        }\n      }\n    }\n    total\n    hasMore\n  }\n}\n\nquery MyWorkoutDates {\n  myWorkoutDates {\n    dates\n  }\n}\n\nmutation CreateWorkout($input: CreateWorkoutInput!) {\n  createWorkout(input: $input) {\n    id\n    date\n    notes\n  }\n}\n\nmutation DeleteWorkout($id: ID!) {\n  deleteWorkout(id: $id)\n}"): (typeof documents)["query MyWorkouts($pagination: PaginationInput) {\n  myWorkouts(pagination: $pagination) {\n    items {\n      id\n      date\n      notes\n      exercises {\n        id\n        exercise {\n          id\n          name\n        }\n        equipment {\n          id\n          name\n        }\n        maxWeight\n        orderIndex\n        sets {\n          setNumber\n          weight\n          reps\n          sets\n        }\n      }\n    }\n    total\n    hasMore\n  }\n}\n\nquery MyWorkoutsByDate($input: DateInput!) {\n  myWorkoutsByDate(input: $input) {\n    items {\n      id\n      date\n      notes\n      exercises {\n        id\n        exercise {\n          id\n          name\n        }\n        equipment {\n          id\n          name\n        }\n        maxWeight\n        orderIndex\n        sets {\n          setNumber\n          weight\n          reps\n          sets\n        }\n      }\n    }\n    total\n    hasMore\n  }\n}\n\nquery MyWorkoutDates {\n  myWorkoutDates {\n    dates\n  }\n}\n\nmutation CreateWorkout($input: CreateWorkoutInput!) {\n  createWorkout(input: $input) {\n    id\n    date\n    notes\n  }\n}\n\nmutation DeleteWorkout($id: ID!) {\n  deleteWorkout(id: $id)\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;