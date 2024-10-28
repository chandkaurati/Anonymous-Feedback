// components/EmailTemplate.tsx

import React from 'react';

type EmailTemplateProps = {
  username: string;
  otp: string;
};

const EmailTemplate: React.FC<EmailTemplateProps> = ({ username, otp }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-6">
      <div className="bg-white max-w-md w-full shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Hello, {username}!</h1>
        
        <p className="text-gray-600 text-lg mb-6">
          Thank you for using our service. Here is your OTP for verification:
        </p>

        <div className="text-center text-3xl font-semibold text-blue-600 mb-6">
          {otp}
        </div>

        <p className="text-gray-500 text-sm">
          Please use this OTP within the next 10 minutes. If you didn’t request this, please ignore this email.
        </p>
      </div>
    </div>
  );
};

export default EmailTemplate;
