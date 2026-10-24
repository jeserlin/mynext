import { Mail, MapPin } from 'lucide-react';

import SeoHeader from 'components/seoHeader';
import { email, githubLink } from 'constants/basicInfo';

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const AboutMe = () => (
  <div>
    <SeoHeader
      title="About me"
      description="All about Jeserlin"
    />
    <div className="xs:block md:flex">
      <div className="mr-8 mb-4">
        <div className="avatar placeholder">
          <div className="flex h-24 w-24 items-center justify-center rounded-md bg-primary-content text-white">
            <span className="text-2xl">J</span>
          </div>
        </div>
      </div>
      <div className="xs:w-full md:w-5/12 md:ml-8">
        <div className="text-lg text-gray-darkest ">
          Jeserlin Chiu
        </div>
        <div className="text-md text-primary-content">
          Front-end developer
        </div>
        <div className="divider my-2" />
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-darker  flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-content">
              <MapPin size={16} className="text-white" />
            </div>
            <span className="ml-2">Taiwan,taipei</span>
          </div>
          <div className="text-sm text-gray-darker  flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-content">
              <Mail size={16} className="text-white" />
            </div>
            <a
              href={`mailto:${email}`}
              className="ml-2 no-underline"
            >
              {email}
            </a>
          </div>
          <div className="text-sm text-gray-darker  flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-content">
              <GitHubIcon />
            </div>
            <a
              href={githubLink}
              target="_blank"
              className="ml-2 no-underline"
              rel="noreferrer"
            >
              {githubLink}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutMe;
