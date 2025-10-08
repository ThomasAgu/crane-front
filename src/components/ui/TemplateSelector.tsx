import styles from './TemplateSelector.module.css'
import TemplateItem from './TemplateItem';
import { Database, Boxes, Layers, Square } from "lucide-react";

interface TemplateSelectorProps {
    setPopUp: Function
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({setPopUp}) => {

    const handleTemplateSelect = (templateToLoad: string) => {
        // Aquí puedes agregar lógica como:
        // 1. Cargar la plantilla en el estado global/contexto del FlowChart.
        // 2. Enviar un evento de analíticas.
        console.log(`Plantilla seleccionada: ${templateToLoad}`);
        
        // Cierra el popUp inmediatamente
        setPopUp(false); 
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.content}>
                    <h2 className='text-black text-3xl'> Seleccione una plantilla </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <TemplateItem
                            title="Aplicación en blanco"
                            description="Un modelo que te desafía a arrancar desde cero"
                            services={0}
                            rules={0}
                            icon={<Square size={80} />}
                            onClick={() => handleTemplateSelect('blank')} 
                        />
                        <TemplateItem
                            title="Microservicios"
                            description="API REST y Base de datos SQL"
                            services={2}
                            rules={4}
                            icon={<Layers size={80} />}
                            onClick={() => handleTemplateSelect('microservices')} 
                        />
                        <TemplateItem
                            title="Base de datos"
                            description="Arranca con un servicio de base de datos preseleccionado"
                            services={1}
                            rules={0}
                            icon={<Database size={80} />}
                            onClick={() => handleTemplateSelect('database')} 
                        />
                        <TemplateItem
                            title="API REST simple"
                            description="Node.js y Express para guardar datos"
                            services={2}
                            rules={4}
                            icon={<Boxes size={80} />}
                            onClick={() => handleTemplateSelect('api')} 
                        />
                        </div>
                </div>
                
            </div>
        </div>
    )
}

export default TemplateSelector;