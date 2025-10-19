'use client'
import { useState } from 'react'
import InputText from './InputText'
import ServiceForm from './ServiceForm'
import { AppDto, CreateAppDto } from '@/src/lib/dto/AppDto'
import { ServiceDto } from '@/src/lib/dto/ServiceDto'
import { createApp } from '@/src/lib/api/AppService'
import { requiredValidator } from '@/src/lib/validators/RequiredValidator' 

export default function AppForm() {
  const [name, setName] = useState('')
  const [hosts, setHosts] = useState('')
  const [minScale, setMinScale] = useState<number>(1)
  const [currentScale, setCurrentScale] = useState<number>(1)
  const [maxScale, setMaxScale] = useState<number>(2)
  const [forceStop, setForceStop] = useState<boolean>(false)
  const [services, setServices] = useState<ServiceDto[]>([])
  const [showErrors, setShowErrors] = useState(false)
  const [loading, setLoading] = useState(false)

  const addService = () => setServices([...services, { name: '', image: '' }])
  const removeService = (index: number) => setServices(services.filter((_, i) => i !== index))

  const updateService = (index: number, service: ServiceDto) => {
    const updated = [...services]
    updated[index] = service
    setServices(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowErrors(true)

    const appData: CreateAppDto = {
      name,
      services,
      hosts: hosts.trim().split(','),
      min_scale: minScale,
      current_scale: currentScale,
      max_scale: maxScale,
    }
    
    debugger
    try {
      setLoading(true)
      await createApp(appData)
      alert('Aplicación creada con éxito ✅')
    } catch (err) {
      console.error(err)
      alert('Error al crear la aplicación ❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold mb-4">Crear nueva aplicación</h1>

      <InputText
        label="Nombre de la aplicación"
        type="text"
        placeholder="Ej: Mi App"
        value={name}
        setValue={setName}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />

      <InputText
        label="Hosts (separados por coma)"
        type="text"
        placeholder="Ej: host1, host2"
        value={hosts}
        setValue={setHosts}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />

      <div className="grid grid-cols-3 gap-4">
        <InputText
          label="Escala mínima"
          type="number"
          value={String(minScale)}
          setValue={v => setMinScale(Number(v))}
          showErrors={showErrors}
          setShowError={setShowErrors}
        />
        <InputText
          label="Escala actual"
          type="number"
          value={String(currentScale)}
          setValue={v => setCurrentScale(Number(v))}
          showErrors={showErrors}
          setShowError={setShowErrors}
        />
        <InputText
          label="Escala máxima"
          type="number"
          value={String(maxScale)}
          setValue={v => setMaxScale(Number(v))}
          showErrors={showErrors}
          setShowError={setShowErrors}
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="font-medium text-gray-700">Forzar detención</label>
        <input
          type="checkbox"
          checked={forceStop}
          onChange={e => setForceStop(e.target.checked)}
          className="w-5 h-5"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Servicios</h2>
        {services.map((service, index) => (
          <div key={index} className="border p-4 rounded-lg bg-gray-50 relative">
            <button
              type="button"
              onClick={() => removeService(index)}
              className="absolute top-2 right-2 text-red-500 font-bold text-sm"
            >
              ✕
            </button>
            <ServiceForm onChange={(svc) => updateService(index, svc)} />
          </div>
        ))}

        <button
          type="button"
          onClick={addService}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Agregar servicio
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear aplicación'}
      </button>
    </form>
  )
}
