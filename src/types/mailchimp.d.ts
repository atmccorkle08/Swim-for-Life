declare module "@mailchimp/mailchimp_marketing" {
  interface Config {
    apiKey?: string;
    server?: string;
  }

  interface ListMemberBody {
    email_address: string;
    status: "subscribed" | "unsubscribed" | "cleaned" | "pending" | "transactional";
  }

  interface Lists {
    addListMember(listId: string, body: ListMemberBody): Promise<Record<string, unknown>>;
  }

  const mailchimp: {
    setConfig(config: Config): void;
    lists: Lists;
  };

  export default mailchimp;
}
