type MessageLanguage = {
  title: string;
  service_required: string;
  add_splitter: string;
  name_address_required: string;
  cancel_transaction: string;
};

export const messages: {
  english: MessageLanguage;
  israeli?: MessageLanguage;
} = {
  english: {
    title: "Splitter Pay",
    service_required: "Product/service and Amount are required.",
    add_splitter: "Please add at least one splitter.",
    name_address_required: "Name or email address is required.",
    cancel_transaction: "Are you sure you want to cancel this transaction?",
  },
};


export const labels: {
    english: MessageLanguage;
    israeli?: MessageLanguage;
  } = {
    english: {
      title: "Splitter Pay",
      service_required: "Product/service and Amount are required.",
      add_splitter: "Please add at least one splitter.",
      name_address_required: "Name or email address is required.",
      cancel_transaction: "Are you sure you want to cancel this transaction?",
    },
  };