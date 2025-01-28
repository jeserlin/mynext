import React from 'react';
import SeoHeader from 'components/seoHeader';
import { EmailOutlined, GitHub, RoomOutlined } from '@mui/icons-material';

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
          <div className="text-lg text-base-300">
            Jeserlin Chiu
          </div>
          <div className="text-md text-primary-content">
            Front-end developer
          </div>
          <div className="divider my-2" />
          <div className="text-sm text-base-200">
            <RoomOutlined />
            <span className="ml-2">Taiwan,taipei</span>
          </div>
          <div className="text-sm text-base-200">
            <EmailOutlined />
            <a
              href={`mailto:${email}`}
              className="ml-2 no-underline"
            >
              {email}
            </a>
          </div>
          <div className="text-sm text-base-200">
            <GitHub />
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
  )
);

export default AboutMe;
