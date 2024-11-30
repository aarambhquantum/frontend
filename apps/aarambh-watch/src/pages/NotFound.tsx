import Typography from "@atoms/typography/Typography"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/')
  }, []);

  return (
    <Typography>Redirecting</Typography>
  )
};

export default NotFound;