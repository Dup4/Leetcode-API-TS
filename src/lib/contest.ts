import Helper from "@/utils/helper";
import {
    Company,
    ContestInfo,
    SimpleProblemInfoInContest,
} from "@/utils/interfaces";

class Contest {
    static getWeeklyContestSlug(id: number): string {
        return `weekly-contest-${id}`;
    }

    static getBiweeklyContestSlug(id: number): string {
        return `biweekly-contest-${id}`;
    }

    constructor(
        readonly slug: string,
        public contest?: ContestInfo,
        public questions?: Array<SimpleProblemInfoInContest>,
        public user_num?: number,
        public has_chosen_contact?: boolean,
        public company?: Company,
        public registered?: boolean,
        public containsPremium?: boolean
    ) {}

    async detail(): Promise<Contest> {
        let response = await Helper.HttpRequest({
            url: Helper.uris.contestInfo.replace("$slug", this.slug),
        });

        response = JSON.parse(response);
        this.contest = response.contest;
        this.questions = response.questions;
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.user_num = response.user_num;
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.has_chosen_contact = response.has_chosen_contact;
        this.company = response.company;
        this.registered = response.registered;
        this.containsPremium = response.containsPremium;

        return this;
    }
}

export default Contest;
