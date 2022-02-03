export interface HttpRequestOptions {
    method?: string;
    url: string;
    referer?: string;
    resolveWithFullResponse?: boolean;
    form?: any;
    body?: any;
}

export interface GraphQLRequestOptions {
    origin?: string;
    referer?: string;
    query: string;
    variables?: object;
}

export interface Credit {
    session?: string;
    csrfToken: string;
}

export interface CodeSnippet {
    lang: string;
    langSlug: string;
    code: string;
}

export enum ProblemStatus {
    "Accept",
    "Not Accept",
    "Not Start",
}

export enum ProblemDifficulty {
    "Easy",
    "Medium",
    "Hard",
}

export enum SubmissionStatus {
    "Accepted",
    "Compile Error",
    "Wrong Answer",
    "Time Limit Exceeded",
}

export enum EndPoint {
    "US",
    "CN",
}

export interface Uris {
    base: string;
    login: string;
    graphql: string;
    problemsAll: string;
    problem: string;
    submit: string;
    submission: string;
}
