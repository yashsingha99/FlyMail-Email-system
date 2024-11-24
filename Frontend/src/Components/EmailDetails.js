import React from "react";

const EmailDetails = ({ email }) => {
  if (!email) return <p>Select an email to view details.</p>;

  return (
    <div>
      <h2>{email.subject}</h2>
      <p><strong>From:</strong> {email.sender}</p>
      <p><strong>To:</strong> {email.receiver}</p>
      <p>{email.message}</p>
      {email.media && <p><a href={email.media} target="_blank" rel="noopener noreferrer">View Attachment</a></p>}
    </div>
  );
};

export default EmailDetails;
