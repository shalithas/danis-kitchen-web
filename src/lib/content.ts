import contentJson from '../content/content.json';

export interface MenuItem {
  name: string;
  desc: string;
  price: string;
  tag: string | null;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface ScheduleItem {
  day: string;
  time: string;
  location: string;
  address: string;
  closed?: boolean;
}

export interface Feature {
  label: string;
  desc: string;
}

export interface FormLabels {
  name: string;
  email: string;
  phone: string;
  date: string;
  privateEvent: string;
  details: string;
}

export interface FormPlaceholders {
  name: string;
  email: string;
  phone: string;
  details: string;
}

export interface Content {
  settings: {
    showPricing: boolean;
    showLocation: boolean;
  };
  brand: {
    name: string;
    tagline: string;
    description: string;
  };
  navigation: {
    links: string[];
    buttons: {
      orderNow: string;
      order: string;
    };
  };
  hero: {
    scrollLabel: string;
  };
  ourStory: {
    title: string;
    paragraphs: string[];
  };
  location: {
    title: string;
    todayLabel: string;
    schedule: ScheduleItem[];
    mapUrl: string;
  };
  menu: {
    subtitle: string;
    title: string;
    tagline: string;
    categories: MenuCategory[];
    footerText: string;
    buttonText: string;
  };
  catering: {
    title: string;
    description: string;
    features: Feature[];
    form: {
      labels: FormLabels;
      placeholders: FormPlaceholders;
      buttonText: string;
    };
  };
  footer: {
    repeatingText: string;
    quickLinks: string[];
    contact: {
      phone: string;
      email: string;
    };
    social: {
      label: string;
      hashtag: string;
    };
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      buttonText: string;
    };
    copyright: string;
  };
}

const content = contentJson as Content;

export default content;
