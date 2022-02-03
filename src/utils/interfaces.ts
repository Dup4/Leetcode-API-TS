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

export interface ContestInfo {
    id: number;
    title: string;
    title_slug: string;
    description: string;
    duration: number;
    start_time: number;
    is_virtual: boolean;
    origin_start_time: number;
    is_private: boolean;
    related_contest_title: string | null;
}

export interface SimpleProblemInfoInContest {
    id: number;
    question_id: number;
    credit: number;
    title: string;
    english_title: string;
    title_slug: string;
    category_slug: string;
}

export interface Company {
    name: string;
    description: string;
    logo: string;
    slug: string;
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
    contestInfo: string;
    submit: string;
    submission: string;
}
