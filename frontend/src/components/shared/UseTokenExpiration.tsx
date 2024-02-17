import { useEffect } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';

interface DecodedToken extends JwtPayload {
  exp: number;
}

const UseTokenExpiration = () => {

  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = sessionStorage.getItem('token') || '';
    
      if (token === '') {
        // navigate('/login');
        return;
      }
    
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
    
        if (expirationTime < Date.now()) {
          toast({
            variant: "info",
            title: "Session Expired",
            description: "Logging You out! Please login again"
          });
          sessionStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        sessionStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkTokenExpiration();
  }, [navigate]);

  return null;
};

export default UseTokenExpiration;
