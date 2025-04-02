import * as React from 'react';

interface Props {
  code: string;
}

export const VerificationUser: React.FC<Props> = ({code}) => (
  <div>
    <p>Код подтверждения: <h2>{code}</h2></p>
    <p><a href={`https://pizza-hub-five.vercel.app/api/auth/verify?code=${code}`}>Подтвердить регистрацию</a></p>
  </div>
);