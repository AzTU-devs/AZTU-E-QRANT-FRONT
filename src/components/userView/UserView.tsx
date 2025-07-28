import { useSelector } from 'react-redux';
import UserDetails from '../userDetails/UserDetails'
import { useParams } from 'react-router';
import { RootState } from '../../redux/store';

export default function UserView() {
    const { fin_kod } = useParams<{ fin_kod: string }>();
    const localFinKod = useSelector((state: RootState) => state.auth.fin_kod);
    
    return (
        <>
            <UserDetails fin_kod={fin_kod ? fin_kod : localFinKod} />
        </>
    )
}
