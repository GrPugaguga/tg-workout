/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AddExerciseInput = {
  equipmentId?: InputMaybe<Scalars['String']['input']>;
  exerciseId: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  sets: Array<CreateWorkoutSetInput>;
};

export type AiResponseType = {
  __typename?: 'AiResponseType';
  data?: Maybe<Scalars['JSON']['output']>;
  intent: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type CreateExerciseInput = {
  aliases?: InputMaybe<Array<Scalars['String']['input']>>;
  description: Scalars['String']['input'];
  equipmentIds: Array<Scalars['String']['input']>;
  muscleGroupIds: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Telegram ID */
  telegramId: Scalars['Int']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
};

export type CreateWorkoutExerciseInput = {
  equipmentId?: InputMaybe<Scalars['String']['input']>;
  exerciseId: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  sets: Array<CreateWorkoutSetInput>;
};

export type CreateWorkoutInput = {
  date: Scalars['DateTime']['input'];
  exercises: Array<CreateWorkoutExerciseInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type CreateWorkoutSetInput = {
  duration?: InputMaybe<Scalars['Int']['input']>;
  reps?: InputMaybe<Scalars['Int']['input']>;
  sets?: Scalars['Int']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type DateInput = {
  date: Scalars['DateTime']['input'];
};

export type Equipment = {
  __typename?: 'Equipment';
  aliases: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Exercise = {
  __typename?: 'Exercise';
  aliases?: Maybe<Array<Scalars['String']['output']>>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  equipment: Array<Equipment>;
  id: Scalars['ID']['output'];
  muscleGroups: Array<MuscleGroup>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type JwtResponseDto = {
  __typename?: 'JwtResponseDto';
  accessToken: Scalars['String']['output'];
  expiredAt: Scalars['Float']['output'];
};

export type LoginByTelegramDto = {
  botSecret: Scalars['String']['input'];
  telegramId: Scalars['Int']['input'];
};

export type MuscleGroup = {
  __typename?: 'MuscleGroup';
  aliases: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addExercise: Workout;
  createExercise: Exercise;
  createJwt: JwtResponseDto;
  createUser: User;
  createWorkout: Workout;
  deleteExercise: Scalars['ID']['output'];
  deleteWorkout: Scalars['Boolean']['output'];
  loginByTelegram: JwtResponseDto;
  parseWorkout: ParsedWorkoutResultType;
  removeExercise: Workout;
  removeUser: User;
  sendMessage: AiResponseType;
  updateExercise: Exercise;
};


export type MutationAddExerciseArgs = {
  input: AddExerciseInput;
  workoutId: Scalars['ID']['input'];
};


export type MutationCreateExerciseArgs = {
  input: CreateExerciseInput;
};


export type MutationCreateJwtArgs = {
  initData: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationCreateWorkoutArgs = {
  input: CreateWorkoutInput;
};


export type MutationDeleteExerciseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWorkoutArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginByTelegramArgs = {
  loginByTelegramDto: LoginByTelegramDto;
};


export type MutationParseWorkoutArgs = {
  text: Scalars['String']['input'];
};


export type MutationRemoveExerciseArgs = {
  exerciseId: Scalars['Int']['input'];
  workoutId: Scalars['ID']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationUpdateExerciseArgs = {
  input: UpdateExerciseInput;
};

export type PaginationInput = {
  skip?: Scalars['Int']['input'];
  sort?: SortEnum;
  take?: Scalars['Int']['input'];
};

export type ParsedExerciseType = {
  __typename?: 'ParsedExerciseType';
  equipmentId?: Maybe<Scalars['String']['output']>;
  equipmentName?: Maybe<Scalars['String']['output']>;
  exerciseId: Scalars['String']['output'];
  exerciseName: Scalars['String']['output'];
  sets: Array<ParsedSetType>;
};

export type ParsedSetType = {
  __typename?: 'ParsedSetType';
  duration?: Maybe<Scalars['Int']['output']>;
  reps?: Maybe<Scalars['Int']['output']>;
  sets: Scalars['Int']['output'];
  weight?: Maybe<Scalars['Float']['output']>;
};

export type ParsedWorkoutResultType = {
  __typename?: 'ParsedWorkoutResultType';
  exercises: Array<ParsedExerciseType>;
};

export type Query = {
  __typename?: 'Query';
  equipment: Array<Equipment>;
  exercise: Exercise;
  exercises: Array<Exercise>;
  me: User;
  muscleGroups: Array<MuscleGroup>;
  myExerciseHistory: WorkoutExerciseHistoryType;
  myExercisesList: Array<WorkoutExerciseType>;
  myWorkoutDates: WorkoutDates;
  myWorkouts: WorkoutType;
  myWorkoutsByDate: WorkoutType;
  searchExercises: Array<Exercise>;
  userByTelegramId: User;
  workout: Workout;
};


export type QueryExerciseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyExerciseHistoryArgs = {
  exercise: Scalars['String']['input'];
};


export type QueryMyExercisesListArgs = {
  sort?: InputMaybe<SortEnum>;
};


export type QueryMyWorkoutsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryMyWorkoutsByDateArgs = {
  input: DateInput;
};


export type QuerySearchExercisesArgs = {
  query: Scalars['String']['input'];
};


export type QueryUserByTelegramIdArgs = {
  telegramId: Scalars['Float']['input'];
};


export type QueryWorkoutArgs = {
  id: Scalars['ID']['input'];
};

export type SendMessageInput = {
  text: Scalars['String']['input'];
};

export enum SortEnum {
  Asc = 'asc',
  Desc = 'desc'
}

export type UpdateExerciseInput = {
  aliases?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  equipmentIds?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  muscleGroupIds?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  /** Created at */
  createdAt: Scalars['Int']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  telegramId: Scalars['Int']['output'];
  /** Updated at */
  updatedAt: Scalars['Int']['output'];
  username?: Maybe<Scalars['String']['output']>;
  workouts: Array<Workout>;
};

export type Workout = {
  __typename?: 'Workout';
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['String']['output'];
  exercises: Array<WorkoutExercise>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type WorkoutDates = {
  __typename?: 'WorkoutDates';
  dates: Array<Scalars['String']['output']>;
};

export type WorkoutExercise = {
  __typename?: 'WorkoutExercise';
  equipment?: Maybe<Equipment>;
  exercise: Exercise;
  id: Scalars['ID']['output'];
  maxWeight?: Maybe<Scalars['Float']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  orderIndex: Scalars['Int']['output'];
  sets: Array<WorkoutSet>;
};

export type WorkoutExerciseHistoryType = {
  __typename?: 'WorkoutExerciseHistoryType';
  history: Array<WorkoutHistoryItem>;
  id: Scalars['String']['output'];
  maxWeight?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
};

export type WorkoutExerciseType = {
  __typename?: 'WorkoutExerciseType';
  id: Scalars['String']['output'];
  maxWeight?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
};

export type WorkoutHistoryItem = {
  __typename?: 'WorkoutHistoryItem';
  date: Scalars['String']['output'];
  maxWeight?: Maybe<Scalars['Float']['output']>;
  sets: Array<WorkoutSetType>;
};

export type WorkoutSet = {
  __typename?: 'WorkoutSet';
  duration?: Maybe<Scalars['Int']['output']>;
  reps?: Maybe<Scalars['Int']['output']>;
  setNumber: Scalars['Int']['output'];
  sets: Scalars['Int']['output'];
  weight?: Maybe<Scalars['Float']['output']>;
};

export type WorkoutSetType = {
  __typename?: 'WorkoutSetType';
  reps?: Maybe<Scalars['Int']['output']>;
  setNumber: Scalars['Int']['output'];
  sets?: Maybe<Scalars['Int']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type WorkoutType = {
  __typename?: 'WorkoutType';
  hasMore: Scalars['Boolean']['output'];
  items: Array<Workout>;
  total: Scalars['Int']['output'];
};

export type CreateJwtMutationVariables = Exact<{
  initData: Scalars['String']['input'];
}>;


export type CreateJwtMutation = { __typename?: 'Mutation', createJwt: { __typename?: 'JwtResponseDto', accessToken: string, expiredAt: number } };

export type MyExercisesListQueryVariables = Exact<{
  sort?: InputMaybe<SortEnum>;
}>;


export type MyExercisesListQuery = { __typename?: 'Query', myExercisesList: Array<{ __typename?: 'WorkoutExerciseType', id: string, name: string, maxWeight?: number | null }> };

export type MyExerciseHistoryQueryVariables = Exact<{
  exercise: Scalars['String']['input'];
}>;


export type MyExerciseHistoryQuery = { __typename?: 'Query', myExerciseHistory: { __typename?: 'WorkoutExerciseHistoryType', id: string, name: string, maxWeight?: number | null, history: Array<{ __typename?: 'WorkoutHistoryItem', date: string, maxWeight?: number | null, sets: Array<{ __typename?: 'WorkoutSetType', setNumber: number, weight?: number | null, reps?: number | null, sets?: number | null }> }> } };

export type MyWorkoutsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type MyWorkoutsQuery = { __typename?: 'Query', myWorkouts: { __typename?: 'WorkoutType', total: number, hasMore: boolean, items: Array<{ __typename?: 'Workout', id: string, date: string, notes?: string | null, exercises: Array<{ __typename?: 'WorkoutExercise', id: string, maxWeight?: number | null, orderIndex: number, exercise: { __typename?: 'Exercise', id: string, name: string }, equipment?: { __typename?: 'Equipment', id: string, name: string } | null, sets: Array<{ __typename?: 'WorkoutSet', setNumber: number, weight?: number | null, reps?: number | null, sets: number }> }> }> } };

export type MyWorkoutsByDateQueryVariables = Exact<{
  input: DateInput;
}>;


export type MyWorkoutsByDateQuery = { __typename?: 'Query', myWorkoutsByDate: { __typename?: 'WorkoutType', total: number, hasMore: boolean, items: Array<{ __typename?: 'Workout', id: string, date: string, notes?: string | null, exercises: Array<{ __typename?: 'WorkoutExercise', id: string, maxWeight?: number | null, orderIndex: number, exercise: { __typename?: 'Exercise', id: string, name: string }, equipment?: { __typename?: 'Equipment', id: string, name: string } | null, sets: Array<{ __typename?: 'WorkoutSet', setNumber: number, weight?: number | null, reps?: number | null, sets: number }> }> }> } };

export type MyWorkoutDatesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyWorkoutDatesQuery = { __typename?: 'Query', myWorkoutDates: { __typename?: 'WorkoutDates', dates: Array<string> } };

export type CreateWorkoutMutationVariables = Exact<{
  input: CreateWorkoutInput;
}>;


export type CreateWorkoutMutation = { __typename?: 'Mutation', createWorkout: { __typename?: 'Workout', id: string, date: string, notes?: string | null } };

export type DeleteWorkoutMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteWorkoutMutation = { __typename?: 'Mutation', deleteWorkout: boolean };


export const CreateJwtDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateJwt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"initData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createJwt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"initData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"initData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}}]}}]}}]} as unknown as DocumentNode<CreateJwtMutation, CreateJwtMutationVariables>;
export const MyExercisesListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyExercisesList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortEnum"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myExercisesList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxWeight"}}]}}]}}]} as unknown as DocumentNode<MyExercisesListQuery, MyExercisesListQueryVariables>;
export const MyExerciseHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyExerciseHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"exercise"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myExerciseHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"exercise"},"value":{"kind":"Variable","name":{"kind":"Name","value":"exercise"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"maxWeight"}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"maxWeight"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setNumber"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"reps"}},{"kind":"Field","name":{"kind":"Name","value":"sets"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyExerciseHistoryQuery, MyExerciseHistoryQueryVariables>;
export const MyWorkoutsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyWorkouts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myWorkouts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"equipment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maxWeight"}},{"kind":"Field","name":{"kind":"Name","value":"orderIndex"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setNumber"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"reps"}},{"kind":"Field","name":{"kind":"Name","value":"sets"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]}}]} as unknown as DocumentNode<MyWorkoutsQuery, MyWorkoutsQueryVariables>;
export const MyWorkoutsByDateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyWorkoutsByDate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myWorkoutsByDate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"exercises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exercise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"equipment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maxWeight"}},{"kind":"Field","name":{"kind":"Name","value":"orderIndex"}},{"kind":"Field","name":{"kind":"Name","value":"sets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setNumber"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"reps"}},{"kind":"Field","name":{"kind":"Name","value":"sets"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]}}]} as unknown as DocumentNode<MyWorkoutsByDateQuery, MyWorkoutsByDateQueryVariables>;
export const MyWorkoutDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyWorkoutDates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myWorkoutDates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dates"}}]}}]}}]} as unknown as DocumentNode<MyWorkoutDatesQuery, MyWorkoutDatesQueryVariables>;
export const CreateWorkoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWorkoutInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<CreateWorkoutMutation, CreateWorkoutMutationVariables>;
export const DeleteWorkoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteWorkout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteWorkout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteWorkoutMutation, DeleteWorkoutMutationVariables>;