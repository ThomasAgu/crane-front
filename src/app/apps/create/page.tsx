import NavBar from '../../../components/layout/NavBar';
import styles from '../../home/home.module.css'
import CreateAppForm from '@/src/components/forms/CreateAppForm';

export default function HomePage() {
    return (
        <NavBar>
            <main className={styles.mainContent}>
                <CreateAppForm />
            </main>
        </NavBar>
    );
}
