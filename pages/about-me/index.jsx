import React from 'react';
import SeoHeader from 'components/seoHeader';
import { Mail, Github, MapPin } from 'lucide-react';

import { email, githubLink } from 'constants/basicInfo';

const AboutMe = () => (
  (
    <div>
      <SeoHeader
        title="About me"
        description="All about Jeserlin"
      />
      <div className="xs:block md:flex">
        <div className="mr-8 mb-4">
          <div className="avatar placeholder">
            <div className="w-24 bg-primary-content text-white rounded-md">
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
                <Github size={16} className="text-white" />
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
  )
);

export default AboutMe;
