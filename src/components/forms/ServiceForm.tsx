'use client'
import { useState, useEffect } from 'react'
import InputText from './InputText'
import { ServiceDto } from '@/src/lib/dto/ServiceDto'
import { requiredValidator } from '@/src/lib/validators/RequiredValidator' 

interface ServiceFormProps {
  onChange: (service: ServiceDto) => void
}

export default function ServiceForm({ onChange }: ServiceFormProps) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [command, setCommand] = useState('')
  const [ports, setPorts] = useState<string>('')
  const [volumes, setVolumes] = useState<string>('')
  const [networks, setNetworks] = useState<string>('')
  const [labels, setLabels] = useState<string>('')
  const [showErrors, setShowErrors] = useState(false)

  const handleUpdate = () => {
    const newService: ServiceDto = {
      name,
      image,
      command: command || undefined,
      ports: ports ? ports.split(',').map(p => p.trim()) : undefined,
      volumes: volumes ? volumes.split(',').map(v => v.trim()) : undefined,
      networks: networks ? networks.split(',').map(n => n.trim()) : undefined,
      labels: labels ? labels.split(',').map(l => l.trim()) : undefined,
    }

    onChange(newService)
  }

  useEffect(() => {
    handleUpdate()
  }, [name, image, command, ports, volumes, networks, labels, onChange])

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold mb-2">Servicio</h2>

      <InputText
        label="Nombre del servicio"
        placeholder="Ej: api-service"
        value={name}
        type="text"
        setValue={setName}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />

      <InputText
        label="Imagen Docker"
        placeholder="Ej: nginx:latest"
        value={image}
        type="text"
        setValue={setImage}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />

      <InputText
        label="Comando (opcional)"
        placeholder="Ej: npm start"
        value={command}
        type="text"
        setValue={setCommand}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />

      <InputText
        label="Puertos (opcional, separados por coma)"
        placeholder="Ej: 80, 443"
        value={ports}
        type="text"
        setValue={setPorts}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />

      <InputText
        label="Volúmenes (opcional, separados por coma)"
        placeholder="Ej: /data:/app/data"
        type='text'
        value={volumes}
        setValue={setVolumes}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />

      <InputText
        label="Redes (opcional, separadas por coma)"
        placeholder="Ej: frontend, backend"
        value={networks}
        type="text"
        setValue={setNetworks}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />

      <InputText
        label="Etiquetas (opcional, separadas por coma)"
        placeholder="Ej: env=prod,version=1.0"
        value={labels}
        type="text"
        setValue={setLabels}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />
    </div>
  )
}
