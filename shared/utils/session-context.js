import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getCurrentSession, logout as doLogout } from '../api';

const SessionContext = React.createContext();

// eslint-disable-next-line react/prop-types
function SessionProvider({ children }) {
  const [state, setState] = useState({ auth: false, ready: false });
  const { data: sessionResult, status: sessionStatus } = useQuery(
    ['auth/session-provider'],
    () => getCurrentSession(),
    { retry: false }
  );

  useEffect(() => {
    if (sessionResult) {
      setState({ auth: true, address: sessionResult.address, ready: true });
    } else if (sessionStatus === 'error') {
      setState({ auth: false, ready: true });
    }
  }, [sessionResult, sessionStatus]);

  const logout = () => {
    doLogout().then(() => setState({ auth: false, ready: true }));
  };

  const setSession = (address) => {
    setState({ auth: true, ready: true, address: address });
  };

  return (
    <SessionContext.Provider value={{ session: state, logout, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

function useSession() {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export { SessionProvider, useSession };
